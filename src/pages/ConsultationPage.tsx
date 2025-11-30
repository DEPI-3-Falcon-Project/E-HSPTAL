import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import {
  Stethoscope,
  Send,
  MessageCircle,
  Clock,
  CheckCircle,
  AlertCircle,
  Upload,
  X,
  File,
  User,
  ChevronDown,
  Edit,
  Trash2
} from 'lucide-react';
import { useAuth } from '../hooks/useAuth';

interface Consultation {
  _id: string;
  question: string;
  category: string;
  status: 'new' | 'pending' | 'answered' | 'follow-up';
  response: string | null;
  respondedBy?: { name: string };
  createdAt: string;
}

const categories = [
  { value: 'general', label: 'طب عام' },
  { value: 'pediatrics', label: 'أطفال' },
  { value: 'cardiology', label: 'قلب' },
  { value: 'dermatology', label: 'جلدية' },
  { value: 'orthopedics', label: 'عظام' },
  { value: 'neurology', label: 'مخ وأعصاب' },
  { value: 'gynecology', label: 'نساء وتوليد' },
  { value: 'psychiatry', label: 'نفسية' },
  { value: 'other', label: 'أخرى' },
];

const ConsultationPage: React.FC = () => {
  const navigate = useNavigate();
  const { isAuthenticated, user, token } = useAuth();
  const [activeTab, setActiveTab] = useState<'new' | 'history'>('new');
  const [formData, setFormData] = useState({
    question: '',
    category: 'general',
    isUrgent: false
  });
  const [files, setFiles] = useState<File[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [consultations, setConsultations] = useState<Consultation[]>([]);
  const [loadingHistory, setLoadingHistory] = useState(false);
  const [editingConsultation, setEditingConsultation] = useState<Consultation | null>(null);
  const [editFormData, setEditFormData] = useState({
    question: '',
    category: 'general',
    isUrgent: false
  });

  // Fetch user's consultations
  const fetchMyConsultations = async () => {
    const authToken = token || localStorage.getItem('token');
    if (!authToken) return;

    setLoadingHistory(true);
    try {
      const response = await fetch('http://localhost:5000/api/consultations/my-consultations', {
        headers: { 'Authorization': `Bearer ${authToken}` }
      });
      const data = await response.json();
      if (data.success) {
        setConsultations(data.data);
      }
    } catch (err) {
      console.error('Error fetching consultations:', err);
    } finally {
      setLoadingHistory(false);
    }
  };

  useEffect(() => {
    if (isAuthenticated && activeTab === 'history') {
      fetchMyConsultations();
    }
  }, [isAuthenticated, activeTab]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const newFiles = Array.from(e.target.files);
      setFiles(prev => [...prev, ...newFiles]);
    }
  };

  const removeFile = (index: number) => {
    setFiles(prev => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setLoading(true);

    const authToken = token || localStorage.getItem('token');
    if (!authToken) {
      setError('يجب تسجيل الدخول أولاً');
      setLoading(false);
      return;
    }

    try {
      const response = await fetch('http://localhost:5000/api/consultations', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${authToken}`
        },
        body: JSON.stringify({
          question: formData.question,
          category: formData.category,
          isUrgent: formData.isUrgent,
          attachments: files.map(f => ({ filename: f.name }))
        })
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'حدث خطأ');
      }

      setSuccess('تم إرسال استشارتك بنجاح! سيقوم الطبيب بالرد في أقرب وقت.');
      setFormData({ question: '', category: 'general', isUrgent: false });
      setFiles([]);
      
      // Switch to history tab
      setTimeout(() => {
        setActiveTab('history');
        fetchMyConsultations();
      }, 2000);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (consultation: Consultation) => {
    setEditingConsultation(consultation);
    setEditFormData({
      question: consultation.question,
      category: consultation.category,
      isUrgent: false // يمكن إضافة isUrgent للـ interface إذا لزم
    });
    setActiveTab('new');
    setTimeout(() => {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }, 100);
  };

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingConsultation) return;

    setError('');
    setSuccess('');
    setLoading(true);

    const authToken = token || localStorage.getItem('token');
    if (!authToken) {
      setError('يجب تسجيل الدخول أولاً');
      setLoading(false);
      return;
    }

    try {
      const response = await fetch(`http://localhost:5000/api/consultations/${editingConsultation._id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${authToken}`
        },
        body: JSON.stringify({
          question: editFormData.question,
          category: editFormData.category,
          isUrgent: editFormData.isUrgent
        })
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'حدث خطأ');
      }

      setSuccess('تم تحديث استشارتك بنجاح!');
      setEditingConsultation(null);
      setEditFormData({ question: '', category: 'general', isUrgent: false });
      
      setTimeout(() => {
        setActiveTab('history');
        fetchMyConsultations();
      }, 2000);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('هل أنت متأكد من حذف هذه الاستشارة؟')) return;

    const authToken = token || localStorage.getItem('token');
    if (!authToken) {
      setError('يجب تسجيل الدخول أولاً');
      return;
    }

    try {
      const response = await fetch(`http://localhost:5000/api/consultations/${id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${authToken}`
        }
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'حدث خطأ');
      }

      setSuccess('تم حذف الاستشارة بنجاح');
      fetchMyConsultations();
    } catch (err: any) {
      setError(err.message);
    }
  };

  const cancelEdit = () => {
    setEditingConsultation(null);
    setEditFormData({ question: '', category: 'general', isUrgent: false });
    setFormData({ question: '', category: 'general', isUrgent: false });
  };

  const getStatusBadge = (status: string) => {
    const badges: { [key: string]: { bg: string; text: string; label: string } } = {
      new: { bg: 'bg-yellow-100', text: 'text-yellow-800', label: 'جديد' },
      pending: { bg: 'bg-blue-100', text: 'text-blue-800', label: 'قيد المراجعة' },
      answered: { bg: 'bg-green-100', text: 'text-green-800', label: 'تم الرد' },
      'follow-up': { bg: 'bg-purple-100', text: 'text-purple-800', label: 'يحتاج متابعة' }
    };
    const badge = badges[status] || badges.new;
    return (
      <span className={`${badge.bg} ${badge.text} px-3 py-1 rounded-full text-xs font-semibold`}>
        {badge.label}
      </span>
    );
  };

  const getCategoryLabel = (category: string) => {
    return categories.find(c => c.value === category)?.label || category;
  };

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-red-50 via-white to-rose-50 pt-24 pb-12 flex items-center justify-center" dir="rtl">
        <div className="max-w-md w-full mx-4">
          <div className="bg-white rounded-3xl shadow-2xl overflow-hidden">
            <div className="bg-gradient-to-r from-red-500 to-rose-600 p-8 text-center">
              <Stethoscope className="w-16 h-16 text-white mx-auto mb-4" />
              <h1 className="text-2xl font-bold text-white mb-2">استشارة طبية</h1>
              <p className="text-white/80 text-sm">يجب تسجيل الدخول لإرسال استشارة</p>
            </div>
            <div className="p-8 space-y-4">
              <Link
                to="/login"
                className="w-full bg-gradient-to-r from-red-500 to-rose-600 text-white py-3.5 rounded-xl font-semibold flex items-center justify-center gap-2"
              >
                تسجيل الدخول
              </Link>
              <Link
                to="/register"
                className="w-full bg-gray-100 text-gray-700 py-3.5 rounded-xl font-semibold flex items-center justify-center gap-2"
              >
                إنشاء حساب جديد
              </Link>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-red-50 via-white to-rose-50 pt-24 pb-12" dir="rtl">
      <div className="container mx-auto px-4">
        <div className="max-w-3xl mx-auto">
          {/* Header */}
          <div className="text-center mb-8">
            <div className="w-20 h-20 bg-gradient-to-r from-red-500 to-rose-600 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg">
              <Stethoscope className="w-10 h-10 text-white" />
            </div>
            <h1 className="text-3xl font-bold text-gray-800 mb-2">الاستشارات الطبية</h1>
            <p className="text-gray-600">احصل على استشارة طبية من أطبائنا المتخصصين</p>
          </div>

          {/* Tabs */}
          <div className="flex bg-white rounded-2xl p-1.5 shadow-lg mb-8">
            <button
              onClick={() => setActiveTab('new')}
              className={`flex-1 py-3 rounded-xl font-semibold transition-all ${
                activeTab === 'new'
                  ? 'bg-gradient-to-r from-red-500 to-rose-600 text-white shadow-md'
                  : 'text-gray-600 hover:bg-gray-100'
              }`}
            >
              <MessageCircle className="w-5 h-5 inline-block ml-2" />
              استشارة جديدة
            </button>
            <button
              onClick={() => setActiveTab('history')}
              className={`flex-1 py-3 rounded-xl font-semibold transition-all ${
                activeTab === 'history'
                  ? 'bg-gradient-to-r from-red-500 to-rose-600 text-white shadow-md'
                  : 'text-gray-600 hover:bg-gray-100'
              }`}
            >
              <Clock className="w-5 h-5 inline-block ml-2" />
              استشاراتي السابقة
            </button>
          </div>

          {/* New/Edit Consultation Form */}
          {activeTab === 'new' && (
            <div className="bg-white rounded-3xl shadow-xl p-8">
              {/* User Info */}
              <div className="bg-gray-50 rounded-xl p-4 mb-6 flex items-center gap-3">
                <div className="w-10 h-10 bg-red-100 rounded-full flex items-center justify-center">
                  <User className="w-5 h-5 text-red-600" />
                </div>
                <div>
                  <p className="text-sm text-gray-500">مرسل من</p>
                  <p className="font-semibold text-gray-800">{user?.name}</p>
                </div>
              </div>

              {editingConsultation && (
                <div className="bg-amber-50 border border-amber-200 text-amber-800 px-4 py-3 rounded-xl mb-6 flex items-center gap-2">
                  <Edit className="w-5 h-5" />
                  <span>جاري تعديل الاستشارة</span>
                </div>
              )}

              {error && (
                <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-xl mb-6 flex items-center gap-2">
                  <AlertCircle className="w-5 h-5" />
                  {error}
                </div>
              )}

              {success && (
                <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-xl mb-6 flex items-center gap-2">
                  <CheckCircle className="w-5 h-5" />
                  {success}
                </div>
              )}

              <form onSubmit={editingConsultation ? handleUpdate : handleSubmit} className="space-y-6">
                {/* Category */}
                <div>
                  <label className="block text-gray-700 font-medium mb-2">التخصص المطلوب</label>
                  <div className="relative">
                    <select
                      value={editingConsultation ? editFormData.category : formData.category}
                      onChange={(e) => editingConsultation 
                        ? setEditFormData({ ...editFormData, category: e.target.value })
                        : setFormData({ ...formData, category: e.target.value })
                      }
                      className="w-full px-4 py-3 bg-gray-50 border-0 rounded-xl focus:ring-2 focus:ring-red-500 appearance-none cursor-pointer"
                    >
                      {categories.map(cat => (
                        <option key={cat.value} value={cat.value}>{cat.label}</option>
                      ))}
                    </select>
                    <ChevronDown className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 pointer-events-none" />
                  </div>
                </div>

                {/* Question */}
                <div>
                  <label className="block text-gray-700 font-medium mb-2">سؤالك أو استفسارك</label>
                  <textarea
                    value={editingConsultation ? editFormData.question : formData.question}
                    onChange={(e) => editingConsultation
                      ? setEditFormData({ ...editFormData, question: e.target.value })
                      : setFormData({ ...formData, question: e.target.value })
                    }
                    required
                    rows={5}
                    className="w-full px-4 py-3 bg-gray-50 border-0 rounded-xl focus:ring-2 focus:ring-red-500 resize-none"
                    placeholder="اكتب سؤالك هنا بالتفصيل..."
                  />
                </div>

                {/* Urgent Checkbox */}
                <div className="flex items-center gap-3">
                  <input
                    type="checkbox"
                    id="isUrgent"
                    checked={editingConsultation ? editFormData.isUrgent : formData.isUrgent}
                    onChange={(e) => editingConsultation
                      ? setEditFormData({ ...editFormData, isUrgent: e.target.checked })
                      : setFormData({ ...formData, isUrgent: e.target.checked })
                    }
                    className="w-5 h-5 text-red-600 rounded focus:ring-red-500"
                  />
                  <label htmlFor="isUrgent" className="text-gray-700 cursor-pointer">
                    حالة طارئة (سيتم إعطاء الأولوية)
                  </label>
                </div>

                {/* File Upload */}
                <div>
                  <label className="block text-gray-700 font-medium mb-2">إرفاق ملفات (اختياري)</label>
                  <div className="border-2 border-dashed border-gray-300 rounded-xl p-6 text-center hover:border-red-400 transition-colors">
                    <input
                      type="file"
                      id="fileUpload"
                      multiple
                      accept=".pdf,.jpg,.jpeg,.png"
                      onChange={handleFileChange}
                      className="hidden"
                    />
                    <label htmlFor="fileUpload" className="cursor-pointer">
                      <Upload className="w-10 h-10 text-gray-400 mx-auto mb-3" />
                      <p className="text-gray-600 text-sm mb-1">اضغط لرفع الملفات</p>
                      <p className="text-gray-400 text-xs">صور، تحاليل، أشعة</p>
                    </label>
                  </div>

                  {files.length > 0 && (
                    <div className="mt-4 space-y-2">
                      {files.map((file, index) => (
                        <div key={index} className="flex items-center justify-between bg-gray-50 rounded-lg p-3">
                          <div className="flex items-center gap-3">
                            <File className="w-5 h-5 text-red-500" />
                            <span className="text-sm text-gray-700">{file.name}</span>
                          </div>
                          <button type="button" onClick={() => removeFile(index)} className="p-1 hover:bg-red-100 rounded-full">
                            <X className="w-4 h-4 text-red-500" />
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                {/* Submit */}
                <div className="flex gap-3">
                  {editingConsultation && (
                    <button
                      type="button"
                      onClick={cancelEdit}
                      className="flex-1 bg-gray-100 text-gray-700 py-4 rounded-xl font-semibold hover:bg-gray-200 transition-all flex items-center justify-center gap-2"
                    >
                      <X className="w-5 h-5" />
                      إلغاء
                    </button>
                  )}
                  <button
                    type="submit"
                    disabled={loading || (editingConsultation ? !editFormData.question.trim() : !formData.question.trim())}
                    className={`${editingConsultation ? 'flex-1' : 'w-full'} bg-gradient-to-r from-red-500 to-rose-600 text-white py-4 rounded-xl font-semibold hover:shadow-lg transition-all disabled:opacity-50 flex items-center justify-center gap-2`}
                  >
                    {loading ? (
                      <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    ) : editingConsultation ? (
                      <Edit className="w-5 h-5" />
                    ) : (
                      <Send className="w-5 h-5" />
                    )}
                    {editingConsultation ? 'تحديث الاستشارة' : 'إرسال الاستشارة'}
                  </button>
                </div>
              </form>
            </div>
          )}

          {/* Consultation History */}
          {activeTab === 'history' && (
            <div className="space-y-4">
              {loadingHistory ? (
                <div className="bg-white rounded-2xl p-8 text-center">
                  <div className="w-8 h-8 border-2 border-red-500 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
                  <p className="text-gray-500">جاري التحميل...</p>
                </div>
              ) : consultations.length === 0 ? (
                <div className="bg-white rounded-2xl p-8 text-center">
                  <MessageCircle className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                  <h3 className="text-xl font-bold text-gray-500 mb-2">لا توجد استشارات</h3>
                  <p className="text-gray-400 mb-4">لم تقم بإرسال أي استشارات حتى الآن</p>
                  <button
                    onClick={() => setActiveTab('new')}
                    className="bg-gradient-to-r from-red-500 to-rose-600 text-white px-6 py-2 rounded-xl font-semibold"
                  >
                    أرسل استشارتك الأولى
                  </button>
                </div>
              ) : (
                consultations.map((consultation) => (
                  <div key={consultation._id} className="bg-white rounded-2xl shadow-lg p-6">
                    <div className="flex justify-between items-start mb-4">
                      <div>
                        <span className="text-sm text-gray-500">
                          {new Date(consultation.createdAt).toLocaleDateString('ar-EG')}
                        </span>
                        <span className="mx-2 text-gray-300">•</span>
                        <span className="text-sm text-red-600 font-medium">
                          {getCategoryLabel(consultation.category)}
                        </span>
                      </div>
                      <div className="flex items-center gap-2">
                        {getStatusBadge(consultation.status)}
                        {/* Action Buttons - Only show if not answered */}
                        {!consultation.response && consultation.status !== 'answered' && (
                          <div className="flex items-center gap-2 mr-2">
                            <button
                              onClick={() => handleEdit(consultation)}
                              className="p-2 bg-blue-50 hover:bg-blue-100 text-blue-600 rounded-lg transition-all"
                              title="تعديل"
                            >
                              <Edit className="w-4 h-4" />
                            </button>
                            <button
                              onClick={() => handleDelete(consultation._id)}
                              className="p-2 bg-red-50 hover:bg-red-100 text-red-600 rounded-lg transition-all"
                              title="حذف"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        )}
                      </div>
                    </div>

                    <p className="text-gray-700 mb-4">{consultation.question}</p>

                    {consultation.response && (
                      <div className="bg-green-50 rounded-xl p-4 border-r-4 border-green-500 mb-4">
                        <div className="flex items-center gap-2 mb-2">
                          <CheckCircle className="w-5 h-5 text-green-600" />
                          <span className="font-semibold text-green-800">رد الطبيب</span>
                          {consultation.respondedBy && (
                            <span className="text-sm text-green-600">
                              (د. {consultation.respondedBy.name})
                            </span>
                          )}
                        </div>
                        <p className="text-green-700">{consultation.response}</p>
                      </div>
                    )}

                    {!consultation.response && consultation.status !== 'answered' && (
                      <div className="bg-amber-50 rounded-xl p-4 flex items-center gap-3">
                        <Clock className="w-5 h-5 text-amber-600" />
                        <span className="text-amber-700">في انتظار رد الطبيب...</span>
                      </div>
                    )}
                  </div>
                ))
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ConsultationPage;

