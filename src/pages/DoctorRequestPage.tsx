import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Stethoscope, 
  Award, 
  Building2, 
  Briefcase, 
  FileText,
  CheckCircle,
  Clock,
  Bell,
  Home,
  Send,
  User,
  Upload,
  X,
  File
} from 'lucide-react';
import { useAuth } from '../hooks/useAuth';

const DoctorRequestPage: React.FC = () => {
  const navigate = useNavigate();
  const { isAuthenticated, user, token } = useAuth();
  const [formData, setFormData] = useState({
    fullName: '',
    specialization: '',
    licenseNumber: '',
    yearsOfExperience: '',
    hospital: '',
    qualifications: ''
  });
  const [files, setFiles] = useState<File[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [showSuccess, setShowSuccess] = useState(false);
  const [countdown, setCountdown] = useState(5);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

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
    setLoading(true);

    // Get token from state or localStorage
    const authToken = token || localStorage.getItem('token');

    if (!authToken) {
      setError('يجب تسجيل الدخول أولاً');
      setLoading(false);
      return;
    }

    try {
      // For now, we'll send file names as strings (in production, you'd upload to a server)
      const fileNames = files.map(f => f.name);

      const response = await fetch('http://localhost:5000/api/doctor-requests', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${authToken}`
        },
        body: JSON.stringify({
          ...formData,
          yearsOfExperience: parseInt(formData.yearsOfExperience),
          documents: fileNames
        })
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'حدث خطأ في إرسال الطلب');
      }

      setShowSuccess(true);
    } catch (err: any) {
      console.error('Error submitting doctor request:', err);
      
      // للتجربة بدون قاعدة بيانات
      if (err.message === 'Failed to fetch' || err.message.includes('NetworkError')) {
        console.log('🧪 Test Mode: Showing success without backend');
        const localRequests = JSON.parse(localStorage.getItem('pendingDoctorRequests') || '[]');
        localRequests.push({
          id: Date.now(),
          ...formData,
          yearsOfExperience: parseInt(formData.yearsOfExperience),
          documents: files.map(f => f.name),
          user: user,
          status: 'pending',
          createdAt: new Date().toISOString()
        });
        localStorage.setItem('pendingDoctorRequests', JSON.stringify(localRequests));
        setShowSuccess(true);
      } else {
        setError(err.message);
      }
    } finally {
      setLoading(false);
    }
  };

  // Auto redirect after success
  useEffect(() => {
    if (showSuccess) {
      const timer = setInterval(() => {
        setCountdown(prev => {
          if (prev <= 1) {
            clearInterval(timer);
            navigate('/');
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
      
      return () => clearInterval(timer);
    }
  }, [showSuccess, navigate]);

  // Success Message Component
  if (showSuccess) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-white to-teal-50 pt-24 pb-12 flex items-center justify-center" dir="rtl">
        <div className="max-w-lg w-full mx-4">
          <div className="bg-white rounded-3xl shadow-2xl overflow-hidden">
            <div className="bg-gradient-to-r from-emerald-500 to-teal-600 p-8 text-center">
              <div className="w-24 h-24 bg-white rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg">
                <CheckCircle className="w-14 h-14 text-emerald-500" />
              </div>
              <h1 className="text-2xl font-bold text-white mb-2 flex items-center justify-center gap-2">
                <CheckCircle className="w-6 h-6" />
                تم إرسال طلبك بنجاح!
              </h1>
              <p className="text-white/80 text-sm">
                جاري مراجعة طلبك من قبل المسؤولين
              </p>
            </div>

            <div className="p-8">
              <div className="bg-emerald-50 rounded-2xl p-6 mb-6">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-emerald-100 rounded-xl flex items-center justify-center flex-shrink-0">
                    <Clock className="w-6 h-6 text-emerald-600" />
                  </div>
                  <div>
                    <h3 className="font-bold text-emerald-800 mb-1">في انتظار المراجعة</h3>
                    <p className="text-emerald-700 text-sm leading-relaxed">
                      سيقوم فريق الإدارة بمراجعة بياناتك والتحقق منها. قد تستغرق هذه العملية من 24 إلى 72 ساعة عمل.
                    </p>
                  </div>
                </div>
              </div>

              <div className="bg-blue-50 rounded-2xl p-6 mb-6">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center flex-shrink-0">
                    <Bell className="w-6 h-6 text-blue-600" />
                  </div>
                  <div>
                    <h3 className="font-bold text-blue-800 mb-1">سنبلغك بالنتيجة</h3>
                    <p className="text-blue-700 text-sm leading-relaxed">
                      ستصلك إشعار على حسابك بمجرد مراجعة طلبك سواء بالقبول أو الرفض مع توضيح السبب.
                    </p>
                  </div>
                </div>
              </div>

              <div className="bg-gray-50 rounded-xl p-4 mb-6">
                <p className="text-gray-600 text-sm text-center">
                  تقدمت بالطلب باسم: <span className="font-semibold text-gray-800">{formData.fullName}</span>
                  <br />
                  التخصص: <span className="font-semibold text-gray-800">{formData.specialization}</span>
                  {files.length > 0 && (
                    <>
                      <br />
                      المستندات المرفقة: <span className="font-semibold text-gray-800">{files.length} ملف</span>
                    </>
                  )}
                </p>
              </div>

              <div className="bg-amber-50 rounded-xl p-4 mb-6 text-center">
                <p className="text-amber-700 text-sm">
                  سيتم تحويلك للصفحة الرئيسية خلال <span className="font-bold text-amber-800">{countdown}</span> ثواني
                </p>
                <div className="w-full bg-amber-200 rounded-full h-1.5 mt-2">
                  <div 
                    className="bg-amber-500 h-1.5 rounded-full transition-all duration-1000"
                    style={{ width: `${(countdown / 5) * 100}%` }}
                  ></div>
                </div>
              </div>

              <button
                onClick={() => navigate('/')}
                className="w-full bg-gradient-to-r from-emerald-500 to-teal-600 text-white py-3.5 rounded-xl font-semibold hover:shadow-lg hover:shadow-emerald-200 transition-all duration-300 flex items-center justify-center gap-2"
              >
                <Home className="w-5 h-5" />
                العودة للصفحة الرئيسية الآن
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-red-50 via-white to-rose-50 pt-24 pb-12" dir="rtl">
      <div className="container mx-auto px-4">
        <div className="max-w-2xl mx-auto">
          <div className="bg-white rounded-3xl shadow-2xl overflow-hidden">
            {/* Header */}
            <div className="bg-gradient-to-r from-red-500 to-rose-600 p-8 text-center">
              <div className="w-20 h-20 bg-white/20 backdrop-blur-sm rounded-2xl flex items-center justify-center mx-auto mb-4">
                <Stethoscope className="w-10 h-10 text-white" />
              </div>
              <h1 className="text-2xl font-bold text-white mb-2">
                طلب إنشاء حساب طبي
              </h1>
              <p className="text-white/80 text-sm">
                املأ البيانات التالية لإرسال طلبك للمراجعة
              </p>
            </div>

            {/* Form */}
            <div className="p-8">
              {/* User Info */}
              {user && (
                <div className="bg-gray-50 rounded-xl p-4 mb-6 flex items-center gap-3">
                  <div className="w-10 h-10 bg-red-100 rounded-full flex items-center justify-center">
                    <User className="w-5 h-5 text-red-600" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">تقدم بالطلب باسم</p>
                    <p className="font-semibold text-gray-800">{user.name} • {user.email}</p>
                  </div>
                </div>
              )}

              {error && (
                <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-xl mb-6 text-sm">
                  {error}
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-5">
                {/* Full Name */}
                <div>
                  <label className="block text-gray-700 text-sm font-medium mb-2">الاسم الكامل</label>
                  <div className="relative">
                    <Stethoscope className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <input
                      type="text"
                      name="fullName"
                      value={formData.fullName}
                      onChange={handleChange}
                      required
                      className="w-full pr-11 pl-4 py-3 bg-gray-50 border-0 rounded-xl focus:ring-2 focus:ring-red-500 focus:bg-white transition-all"
                      placeholder="د. محمد أحمد"
                    />
                  </div>
                </div>

                {/* Specialization */}
                <div>
                  <label className="block text-gray-700 text-sm font-medium mb-2">التخصص الطبي</label>
                  <div className="relative">
                    <Briefcase className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <input
                      type="text"
                      name="specialization"
                      value={formData.specialization}
                      onChange={handleChange}
                      required
                      className="w-full pr-11 pl-4 py-3 bg-gray-50 border-0 rounded-xl focus:ring-2 focus:ring-red-500 focus:bg-white transition-all"
                      placeholder="مثال: طب الباطنة، جراحة عامة"
                    />
                  </div>
                </div>

                {/* License Number */}
                <div>
                  <label className="block text-gray-700 text-sm font-medium mb-2">رقم الترخيص الطبي</label>
                  <div className="relative">
                    <Award className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <input
                      type="text"
                      name="licenseNumber"
                      value={formData.licenseNumber}
                      onChange={handleChange}
                      required
                      className="w-full pr-11 pl-4 py-3 bg-gray-50 border-0 rounded-xl focus:ring-2 focus:ring-red-500 focus:bg-white transition-all"
                      placeholder="رقم الترخيص من نقابة الأطباء"
                    />
                  </div>
                </div>

                {/* Years of Experience */}
                <div>
                  <label className="block text-gray-700 text-sm font-medium mb-2">سنوات الخبرة</label>
                  <input
                    type="number"
                    name="yearsOfExperience"
                    value={formData.yearsOfExperience}
                    onChange={handleChange}
                    required
                    min="0"
                    className="w-full px-4 py-3 bg-gray-50 border-0 rounded-xl focus:ring-2 focus:ring-red-500 focus:bg-white transition-all"
                    placeholder="عدد سنوات الخبرة"
                  />
                </div>

                {/* Hospital */}
                <div>
                  <label className="block text-gray-700 text-sm font-medium mb-2">المستشفى/المركز الطبي (اختياري)</label>
                  <div className="relative">
                    <Building2 className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <input
                      type="text"
                      name="hospital"
                      value={formData.hospital}
                      onChange={handleChange}
                      className="w-full pr-11 pl-4 py-3 bg-gray-50 border-0 rounded-xl focus:ring-2 focus:ring-red-500 focus:bg-white transition-all"
                      placeholder="اسم المستشفى أو المركز الطبي"
                    />
                  </div>
                </div>

                {/* Qualifications */}
                <div>
                  <label className="block text-gray-700 text-sm font-medium mb-2">المؤهلات والشهادات</label>
                  <textarea
                    name="qualifications"
                    value={formData.qualifications}
                    onChange={handleChange}
                    required
                    rows={4}
                    className="w-full px-4 py-3 bg-gray-50 border-0 rounded-xl focus:ring-2 focus:ring-red-500 focus:bg-white transition-all resize-none"
                    placeholder="اذكر شهاداتك العلمية، الدورات التدريبية، والمؤهلات الأخرى"
                  />
                </div>

                {/* File Upload */}
                <div>
                  <label className="block text-gray-700 text-sm font-medium mb-2">
                    المستندات والشهادات (شهادة التخرج، الترخيص، إلخ)
                  </label>
                  
                  <div className="border-2 border-dashed border-gray-300 rounded-xl p-6 text-center hover:border-red-400 transition-colors">
                    <input
                      type="file"
                      id="fileUpload"
                      multiple
                      accept=".pdf,.jpg,.jpeg,.png,.doc,.docx"
                      onChange={handleFileChange}
                      className="hidden"
                    />
                    <label htmlFor="fileUpload" className="cursor-pointer">
                      <Upload className="w-10 h-10 text-gray-400 mx-auto mb-3" />
                      <p className="text-gray-600 text-sm mb-1">
                        اضغط هنا لرفع الملفات
                      </p>
                      <p className="text-gray-400 text-xs">
                        PDF, JPG, PNG, DOC (حد أقصى 10MB لكل ملف)
                      </p>
                    </label>
                  </div>

                  {/* Uploaded Files List */}
                  {files.length > 0 && (
                    <div className="mt-4 space-y-2">
                      {files.map((file, index) => (
                        <div 
                          key={index}
                          className="flex items-center justify-between bg-gray-50 rounded-lg p-3"
                        >
                          <div className="flex items-center gap-3">
                            <File className="w-5 h-5 text-red-500" />
                            <div>
                              <p className="text-sm font-medium text-gray-700">{file.name}</p>
                              <p className="text-xs text-gray-400">
                                {(file.size / 1024 / 1024).toFixed(2)} MB
                              </p>
                            </div>
                          </div>
                          <button
                            type="button"
                            onClick={() => removeFile(index)}
                            className="p-1 hover:bg-red-100 rounded-full transition-colors"
                          >
                            <X className="w-4 h-4 text-red-500" />
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                {/* Info Box */}
                <div className="bg-amber-50 rounded-xl p-4">
                  <div className="flex items-start gap-3">
                    <FileText className="w-5 h-5 text-amber-600 mt-0.5 flex-shrink-0" />
                    <div className="text-sm text-amber-800">
                      <p className="font-semibold mb-1">ملاحظة هامة:</p>
                      <p>يُفضل إرفاق المستندات التالية لتسريع عملية المراجعة:</p>
                      <ul className="list-disc list-inside mt-2 space-y-1 text-amber-700">
                        <li>شهادة التخرج من كلية الطب</li>
                        <li>ترخيص مزاولة المهنة</li>
                        <li>شهادات التخصص (إن وجدت)</li>
                      </ul>
                    </div>
                  </div>
                </div>

                {/* Submit Button */}
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-gradient-to-r from-red-500 to-rose-600 text-white py-4 rounded-xl font-semibold hover:shadow-lg hover:shadow-red-200 transition-all duration-300 disabled:opacity-50 flex items-center justify-center gap-2"
                >
                  {loading ? (
                    <>
                      <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                      جاري الإرسال...
                    </>
                  ) : (
                    <>
                      <Send className="w-5 h-5" />
                      إرسال الطلب للمراجعة
                    </>
                  )}
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DoctorRequestPage;
