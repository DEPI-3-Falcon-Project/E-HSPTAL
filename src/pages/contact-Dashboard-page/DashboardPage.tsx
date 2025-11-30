import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  FaQuestionCircle,
  FaClock,
  FaCheckCircle,
  FaSearch,
  FaUser,
  FaTag,
  FaPaperclip,
  FaPaperPlane,
  FaSignInAlt,
  FaUserPlus,
  FaStethoscope,
  FaUserMd,
  FaSpinner,
  FaExclamationTriangle,
} from "react-icons/fa";
import { useAuth } from "../../hooks/useAuth";

interface Consultation {
  _id: string;
  patient: {
    _id: string;
    name: string;
    email: string;
  };
  patientName: string;
  question: string;
  category: string;
  status: 'new' | 'pending' | 'answered' | 'follow-up';
  attachments: { filename: string; url: string }[];
  response: string | null;
  respondedBy?: { name: string };
  respondedAt?: string;
  isUrgent: boolean;
  createdAt: string;
}

interface Stats {
  new: number;
  pending: number;
  answered: number;
}

const DashboardPage: React.FC = () => {
  const navigate = useNavigate();
  const { user, isAuthenticated, isDoctor, token } = useAuth();
  
  const [currentFilter, setCurrentFilter] = useState<string>("all");
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedConsultation, setSelectedConsultation] = useState<Consultation | null>(null);
  const [responseText, setResponseText] = useState("");
  const [responseStatus, setResponseStatus] = useState<string>("answered");
  const [isLoading, setIsLoading] = useState(false);
  const [isFetching, setIsFetching] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [consultations, setConsultations] = useState<Consultation[]>([]);
  const [stats, setStats] = useState<Stats>({ new: 0, pending: 0, answered: 0 });
  const [error, setError] = useState("");

  // Fetch consultations from API
  const fetchConsultations = async () => {
    const authToken = token || localStorage.getItem('token');
    if (!authToken) return;

    setIsFetching(true);
    setError("");

    try {
      const params = new URLSearchParams();
      if (currentFilter !== 'all') params.append('status', currentFilter);
      if (searchTerm) params.append('search', searchTerm);

      const response = await fetch(
        `http://localhost:5000/api/consultations?${params.toString()}`,
        {
          headers: {
            'Authorization': `Bearer ${authToken}`
          }
        }
      );

      const data = await response.json();

      if (data.success) {
        setConsultations(data.data.consultations);
        setStats(data.data.stats);
      } else {
        throw new Error(data.message);
      }
    } catch (err: any) {
      console.error('Error fetching consultations:', err);
      setError(err.message || 'حدث خطأ في جلب الاستشارات');
    } finally {
      setIsFetching(false);
    }
  };

  useEffect(() => {
    if (isAuthenticated && isDoctor) {
      fetchConsultations();
    }
  }, [isAuthenticated, isDoctor, currentFilter]);

  // Debounced search
  useEffect(() => {
    const timer = setTimeout(() => {
      if (isAuthenticated && isDoctor) {
        fetchConsultations();
      }
    }, 500);
    return () => clearTimeout(timer);
  }, [searchTerm]);

  const getStatusText = (status: string): string => {
    const statusMap: { [key: string]: string } = {
      new: "جديد",
      pending: "قيد المعالجة",
      answered: "تم الرد",
      "follow-up": "يحتاج متابعة",
    };
    return statusMap[status] || status;
  };

  const getCategoryText = (category: string): string => {
    const categoryMap: { [key: string]: string } = {
      general: "طب عام",
      pediatrics: "أطفال",
      cardiology: "قلب",
      dermatology: "جلدية",
      orthopedics: "عظام",
      neurology: "مخ وأعصاب",
      gynecology: "نساء وتوليد",
      psychiatry: "نفسية",
      other: "أخرى",
    };
    return categoryMap[category] || category;
  };

  const getTimeAgo = (dateString: string): string => {
    const now = new Date();
    const date = new Date(dateString);
    const diff = now.getTime() - date.getTime();
    const minutes = Math.floor(diff / 60000);
    const hours = Math.floor(diff / 3600000);
    const days = Math.floor(diff / 86400000);

    if (minutes < 60) {
      return `منذ ${minutes} دقيقة`;
    } else if (hours < 24) {
      return `منذ ${hours} ساعة`;
    } else {
      return `منذ ${days} يوم`;
    }
  };

  const openModal = (consultation: Consultation) => {
    setSelectedConsultation(consultation);
    setResponseText(consultation.response || "");
    setResponseStatus(consultation.status === 'new' ? 'pending' : consultation.status);
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setSelectedConsultation(null);
    setResponseText("");
  };

  const submitResponse = async () => {
    if (!selectedConsultation) return;

    if (!responseText && responseStatus === "answered") {
      alert('يجب كتابة رد قبل تغيير الحالة إلى "تم الرد"');
      return;
    }

    const authToken = token || localStorage.getItem('token');
    setIsLoading(true);

    try {
      const response = await fetch(
        `http://localhost:5000/api/consultations/${selectedConsultation._id}/respond`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${authToken}`
          },
          body: JSON.stringify({
            response: responseText,
            status: responseStatus
          })
        }
      );

      const data = await response.json();

      if (data.success) {
        alert('تم إرسال الرد بنجاح');
        closeModal();
        fetchConsultations();
      } else {
        throw new Error(data.message);
      }
    } catch (err: any) {
      alert(`خطأ: ${err.message}`);
    } finally {
      setIsLoading(false);
    }
  };

  // If not authenticated, show login prompt
  if (!isAuthenticated) {
    return (
      <main className="pt-20 min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center" dir="rtl">
        <div className="w-full mx-auto px-5 max-w-md">
          <div className="bg-white rounded-3xl shadow-xl overflow-hidden">
            <div className="bg-gradient-to-r from-red-500 to-rose-600 p-8 text-center">
              <div className="w-20 h-20 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center mx-auto mb-4">
                <FaStethoscope className="text-4xl text-white" />
              </div>
              <h1 className="text-2xl font-bold text-white mb-2">
                بوابة الأطباء
              </h1>
              <p className="text-white/80 text-sm">
                يجب تسجيل الدخول للوصول لهذه الصفحة
              </p>
            </div>

            <div className="p-8 space-y-4">
              <Link
                to="/login"
                className="w-full bg-gradient-to-r from-red-500 to-rose-600 text-white py-3.5 rounded-xl font-semibold hover:shadow-lg transition-all duration-300 flex items-center justify-center gap-2"
              >
                <FaSignInAlt />
                تسجيل الدخول
              </Link>

              <Link
                to="/register"
                className="w-full bg-gray-100 text-gray-700 py-3.5 rounded-xl font-semibold hover:bg-gray-200 transition-all duration-300 flex items-center justify-center gap-2"
              >
                <FaUserPlus />
                إنشاء حساب جديد
              </Link>
            </div>
          </div>
        </div>
      </main>
    );
  }

  // If authenticated but not a doctor, show option to request doctor account
  if (!isDoctor) {
    return (
      <main className="pt-20 min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center" dir="rtl">
        <div className="w-full mx-auto px-5 max-w-md">
          <div className="bg-white rounded-3xl shadow-xl overflow-hidden">
            <div className="bg-gradient-to-r from-red-500 to-rose-600 p-8 text-center">
              <div className="w-20 h-20 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center mx-auto mb-4">
                <FaUserMd className="text-4xl text-white" />
              </div>
              <h1 className="text-2xl font-bold text-white mb-2">
                مرحباً {user?.name}
              </h1>
              <p className="text-white/80 text-sm">
                هذه الصفحة مخصصة للأطباء فقط
              </p>
            </div>

            <div className="p-8">
              <div className="bg-amber-50 rounded-xl p-4 mb-6">
                <p className="text-amber-800 text-sm text-center">
                  حسابك الحالي هو حساب مستخدم عادي. إذا كنت طبيباً، يمكنك تقديم طلب لتحويل حسابك إلى حساب طبيب.
                </p>
              </div>

              <Link
                to="/doctor-request"
                className="w-full bg-gradient-to-r from-red-500 to-rose-600 text-white py-3.5 rounded-xl font-semibold hover:shadow-lg transition-all duration-300 flex items-center justify-center gap-2"
              >
                <FaStethoscope />
                طلب حساب طبيب
              </Link>

              <button
                onClick={() => navigate('/')}
                className="w-full mt-4 bg-gray-100 text-gray-700 py-3.5 rounded-xl font-semibold hover:bg-gray-200 transition-all duration-300"
              >
                العودة للصفحة الرئيسية
              </button>
            </div>
          </div>
        </div>
      </main>
    );
  }

  // Doctor dashboard
  return (
    <main className="pt-20 min-h-screen bg-gradient-to-br from-gray-50 to-gray-100" dir="rtl">
      <div className="max-w-6xl mx-auto px-5 py-8">
        {/* Dashboard Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-8">
            <h1 className="text-3xl font-bold text-gray-800">
              لوحة تحكم الطبيب
            </h1>
            <div className="flex items-center gap-3 bg-white px-4 py-2 rounded-xl shadow-sm">
              <div className="w-10 h-10 bg-red-100 rounded-full flex items-center justify-center">
                <FaUserMd className="text-red-600" />
              </div>
              <div>
                <p className="font-semibold text-gray-800">{user?.name}</p>
                <p className="text-xs text-gray-500">{user?.email}</p>
              </div>
            </div>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <div className="bg-white p-6 rounded-2xl shadow-lg flex items-center gap-4 hover:-translate-y-1 transition-all duration-300">
              <div className="w-16 h-16 bg-gradient-to-r from-red-500 to-rose-600 rounded-full flex items-center justify-center text-white text-2xl">
                <FaQuestionCircle />
              </div>
              <div>
                <h3 className="text-3xl font-bold text-red-600">{stats.new}</h3>
                <p className="text-gray-600 font-medium">استشارات جديدة</p>
              </div>
            </div>

            <div className="bg-white p-6 rounded-2xl shadow-lg flex items-center gap-4 hover:-translate-y-1 transition-all duration-300">
              <div className="w-16 h-16 bg-gradient-to-r from-amber-500 to-orange-600 rounded-full flex items-center justify-center text-white text-2xl">
                <FaClock />
              </div>
              <div>
                <h3 className="text-3xl font-bold text-amber-600">{stats.pending}</h3>
                <p className="text-gray-600 font-medium">قيد المعالجة</p>
              </div>
            </div>

            <div className="bg-white p-6 rounded-2xl shadow-lg flex items-center gap-4 hover:-translate-y-1 transition-all duration-300">
              <div className="w-16 h-16 bg-gradient-to-r from-emerald-500 to-green-600 rounded-full flex items-center justify-center text-white text-2xl">
                <FaCheckCircle />
              </div>
              <div>
                <h3 className="text-3xl font-bold text-emerald-600">{stats.answered}</h3>
                <p className="text-gray-600 font-medium">تم الرد عليها</p>
              </div>
            </div>
          </div>
        </div>

        {/* Filter and Search */}
        <div className="bg-white p-6 rounded-2xl shadow-lg mb-8">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <div className="flex flex-wrap gap-2">
              {["all", "new", "pending", "answered"].map((filter) => (
                <button
                  key={filter}
                  onClick={() => setCurrentFilter(filter)}
                  className={`px-4 py-2 rounded-full font-medium transition-all duration-300 ${
                    currentFilter === filter
                      ? "bg-red-600 text-white"
                      : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                  }`}
                >
                  {filter === "all"
                    ? "جميع الاستشارات"
                    : filter === "new"
                    ? "جديدة"
                    : filter === "pending"
                    ? "قيد المعالجة"
                    : "تم الرد"}
                </button>
              ))}
            </div>

            <div className="relative w-full md:w-80">
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="البحث في الاستشارات..."
                className="w-full px-4 py-3 pr-12 border-2 border-gray-200 rounded-full focus:border-red-500 focus:ring-2 focus:ring-red-100 transition-all duration-300"
              />
              <FaSearch className="absolute right-4 top-4 text-gray-400" />
            </div>
          </div>
        </div>

        {/* Error Message */}
        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-xl mb-6 flex items-center gap-2">
            <FaExclamationTriangle />
            {error}
          </div>
        )}

        {/* Consultations List */}
        <div className="space-y-6">
          {isFetching ? (
            <div className="text-center py-16">
              <FaSpinner className="text-4xl text-red-500 mx-auto mb-4 animate-spin" />
              <p className="text-gray-500">جاري تحميل الاستشارات...</p>
            </div>
          ) : consultations.length === 0 ? (
            <div className="text-center py-16">
              <FaQuestionCircle className="text-6xl text-gray-300 mx-auto mb-4" />
              <h3 className="text-2xl font-bold text-gray-500 mb-2">
                لا توجد استشارات
              </h3>
              <p className="text-gray-400">
                {currentFilter === 'all' 
                  ? 'لم يتم إرسال أي استشارات حتى الآن'
                  : 'لا توجد استشارات تطابق المعايير المحددة'}
              </p>
            </div>
          ) : (
            consultations.map((consultation) => (
              <div
                key={consultation._id}
                onClick={() => openModal(consultation)}
                className={`bg-white p-6 rounded-2xl shadow-lg cursor-pointer hover:shadow-xl transition-all duration-300 hover:-translate-y-1 ${
                  consultation.isUrgent ? 'border-2 border-red-400' : ''
                }`}
              >
                <div className="flex justify-between items-start mb-4">
                  <div className="space-y-2">
                    <div className="flex items-center gap-2 text-gray-800 font-semibold">
                      <FaUser className="text-red-600" />
                      {consultation.patientName}
                      {consultation.isUrgent && (
                        <span className="bg-red-100 text-red-600 text-xs px-2 py-1 rounded-full">
                          عاجل
                        </span>
                      )}
                    </div>
                    <div className="flex items-center gap-2 text-sm text-gray-500">
                      <FaClock />
                      {getTimeAgo(consultation.createdAt)}
                    </div>
                  </div>
                  <span
                    className={`px-3 py-1 rounded-full text-xs font-semibold ${
                      consultation.status === "new"
                        ? "bg-yellow-100 text-yellow-800"
                        : consultation.status === "pending"
                        ? "bg-blue-100 text-blue-800"
                        : consultation.status === "follow-up"
                        ? "bg-purple-100 text-purple-800"
                        : "bg-green-100 text-green-800"
                    }`}
                  >
                    {getStatusText(consultation.status)}
                  </span>
                </div>

                <div className="mb-4">
                  <p className="text-gray-700 leading-relaxed mb-3 line-clamp-2">
                    {consultation.question}
                  </p>
                  <span className="inline-flex items-center gap-1 bg-red-50 text-red-600 px-3 py-1 rounded-full text-sm font-semibold">
                    <FaTag />
                    {getCategoryText(consultation.category)}
                  </span>
                </div>

                {consultation.attachments && consultation.attachments.length > 0 && (
                  <div className="flex items-center gap-2 text-gray-500">
                    <FaPaperclip />
                    <span>{consultation.attachments.length} مرفق</span>
                  </div>
                )}
              </div>
            ))
          )}
        </div>
      </div>

      {/* Consultation Modal */}
      {showModal && selectedConsultation && (
        <div
          className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
          onClick={closeModal}
        >
          <div
            className="bg-white rounded-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="p-6 border-b border-gray-200 flex justify-between items-center">
              <h3 className="text-xl font-bold text-gray-800">تفاصيل الاستشارة</h3>
              <button
                onClick={closeModal}
                className="text-gray-400 hover:text-gray-600 text-2xl font-bold"
              >
                ×
              </button>
            </div>

            <div className="p-6">
              <div className="mb-6 p-4 bg-gray-50 rounded-xl">
                <div className="flex justify-between items-center mb-4">
                  <h4 className="text-lg font-semibold text-gray-800">
                    {selectedConsultation.patientName}
                    {selectedConsultation.patient?.email && (
                      <span className="text-sm text-gray-500 font-normal mr-2">
                        ({selectedConsultation.patient.email})
                      </span>
                    )}
                  </h4>
                  <span
                    className={`px-3 py-1 rounded-full text-sm font-semibold ${
                      selectedConsultation.status === "new"
                        ? "bg-yellow-100 text-yellow-800"
                        : selectedConsultation.status === "pending"
                        ? "bg-blue-100 text-blue-800"
                        : selectedConsultation.status === "follow-up"
                        ? "bg-purple-100 text-purple-800"
                        : "bg-green-100 text-green-800"
                    }`}
                  >
                    {getStatusText(selectedConsultation.status)}
                  </span>
                </div>

                <div className="space-y-3">
                  <div>
                    <p className="font-semibold text-gray-700 mb-1">السؤال:</p>
                    <p className="text-gray-600 bg-white p-3 rounded-lg">{selectedConsultation.question}</p>
                  </div>
                  <p><strong>التصنيف:</strong> {getCategoryText(selectedConsultation.category)}</p>
                  <p><strong>التوقيت:</strong> {getTimeAgo(selectedConsultation.createdAt)}</p>

                  {selectedConsultation.attachments && selectedConsultation.attachments.length > 0 && (
                    <div>
                      <p className="font-semibold mb-2">المرفقات:</p>
                      <div className="space-y-2">
                        {selectedConsultation.attachments.map((att, index) => (
                          <div
                            key={index}
                            className="flex items-center gap-2 p-2 bg-white rounded-lg"
                          >
                            <FaPaperclip className="text-gray-400" />
                            <span>{att.filename}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {selectedConsultation.response && (
                    <div className="mt-4 p-4 bg-green-50 rounded-lg border-r-4 border-green-600">
                      <p className="font-semibold text-green-800 mb-1">الرد السابق:</p>
                      <p className="text-green-700">{selectedConsultation.response}</p>
                      {selectedConsultation.respondedBy && (
                        <p className="text-sm text-green-600 mt-2">
                          بواسطة: د. {selectedConsultation.respondedBy.name}
                        </p>
                      )}
                    </div>
                  )}
                </div>
              </div>

              <div>
                <h4 className="text-lg font-semibold text-gray-800 mb-4">
                  الرد على الاستشارة
                </h4>
                <textarea
                  value={responseText}
                  onChange={(e) => setResponseText(e.target.value)}
                  placeholder="اكتب ردك هنا..."
                  className="w-full h-32 p-4 border-2 border-gray-200 rounded-xl focus:border-red-500 focus:ring-2 focus:ring-red-100 transition-all duration-300 resize-none"
                />

                <div className="flex flex-wrap gap-4 items-center mt-4">
                  <select
                    value={responseStatus}
                    onChange={(e) => setResponseStatus(e.target.value)}
                    className="px-4 py-2 border-2 border-gray-200 rounded-lg focus:border-red-500 focus:ring-2 focus:ring-red-100 transition-all duration-300"
                  >
                    <option value="pending">قيد المعالجة</option>
                    <option value="answered">تم الرد</option>
                    <option value="follow-up">يحتاج متابعة</option>
                  </select>

                  <button
                    onClick={submitResponse}
                    disabled={isLoading}
                    className="flex items-center gap-2 px-6 py-2 bg-red-600 text-white rounded-lg font-semibold hover:bg-red-700 transition-all duration-300 disabled:opacity-60"
                  >
                    {isLoading ? (
                      <FaSpinner className="animate-spin" />
                    ) : (
                      <FaPaperPlane />
                    )}
                    إرسال الرد
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </main>
  );
};

export default DashboardPage;
