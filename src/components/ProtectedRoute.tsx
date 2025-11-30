import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { Lock, UserPlus, LogIn, Shield, Heart } from 'lucide-react';

interface ProtectedRouteProps {
  children: React.ReactNode;
  requireAuth?: boolean;
  requireDoctor?: boolean;
  requireAdmin?: boolean;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({
  children,
  requireAuth = true,
  requireDoctor = false,
  requireAdmin = false,
}) => {
  const { isAuthenticated, isDoctor, isAdmin } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  // If authentication is required and user is not logged in
  if (requireAuth && !isAuthenticated) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-red-50 via-white to-rose-50 pt-24 pb-12 flex items-center justify-center" dir="rtl">
        <div className="max-w-md w-full mx-4">
          <div className="bg-white rounded-3xl shadow-2xl overflow-hidden">
            {/* Header */}
            <div className="bg-gradient-to-r from-red-500 to-rose-600 p-8 text-center">
              <div className="w-20 h-20 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center mx-auto mb-4">
                <Lock className="w-10 h-10 text-white" />
              </div>
              <h1 className="text-2xl font-bold text-white mb-2">
                تسجيل الدخول مطلوب
              </h1>
              <p className="text-white/80 text-sm">
                يجب عليك إنشاء حساب أو تسجيل الدخول لاستخدام هذه الخاصية
              </p>
            </div>

            {/* Content */}
            <div className="p-8">
              {/* Features list */}
              <div className="mb-8 space-y-3">
                <div className="flex items-center gap-3 text-gray-600">
                  <div className="w-8 h-8 bg-red-100 rounded-full flex items-center justify-center">
                    <Shield className="w-4 h-4 text-red-600" />
                  </div>
                  <span className="text-sm">حماية بياناتك الشخصية</span>
                </div>
                <div className="flex items-center gap-3 text-gray-600">
                  <div className="w-8 h-8 bg-red-100 rounded-full flex items-center justify-center">
                    <Heart className="w-4 h-4 text-red-600" />
                  </div>
                  <span className="text-sm">تتبع سجلك الطبي والتذكيرات</span>
                </div>
              </div>

              {/* Buttons */}
              <div className="space-y-3">
                <button
                  onClick={() => navigate('/register', { state: { from: location.pathname } })}
                  className="w-full bg-gradient-to-r from-red-500 to-rose-600 text-white py-3.5 rounded-xl font-semibold hover:shadow-lg hover:shadow-red-200 transition-all duration-300 flex items-center justify-center gap-2"
                >
                  <UserPlus className="w-5 h-5" />
                  إنشاء حساب جديد
                </button>
                
                <button
                  onClick={() => navigate('/login', { state: { from: location.pathname } })}
                  className="w-full bg-gray-100 hover:bg-gray-200 text-gray-700 py-3.5 rounded-xl font-semibold transition-all duration-300 flex items-center justify-center gap-2"
                >
                  <LogIn className="w-5 h-5" />
                  تسجيل الدخول
                </button>
              </div>

              {/* Back to home */}
              <div className="mt-6 text-center">
                <button
                  onClick={() => navigate('/')}
                  className="text-gray-500 hover:text-red-600 text-sm transition-colors"
                >
                  العودة للصفحة الرئيسية
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // If doctor role is required
  if (requireDoctor && !isDoctor) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-red-50 via-white to-rose-50 pt-24 pb-12 flex items-center justify-center" dir="rtl">
        <div className="max-w-md w-full mx-4">
          <div className="bg-white rounded-3xl shadow-2xl p-8 text-center">
            <div className="w-20 h-20 bg-amber-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Shield className="w-10 h-10 text-amber-600" />
            </div>
            <h1 className="text-2xl font-bold text-gray-800 mb-2">
              صلاحية غير كافية
            </h1>
            <p className="text-gray-600 mb-6">
              هذه الصفحة متاحة للأطباء فقط
            </p>
            <button
              onClick={() => navigate('/doctor-request')}
              className="w-full bg-gradient-to-r from-red-500 to-rose-600 text-white py-3 rounded-xl font-semibold hover:shadow-lg transition-all"
            >
              تقديم طلب لتصبح طبيب
            </button>
          </div>
        </div>
      </div>
    );
  }

  // If admin role is required
  if (requireAdmin && !isAdmin) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-red-50 via-white to-rose-50 pt-24 pb-12 flex items-center justify-center" dir="rtl">
        <div className="max-w-md w-full mx-4">
          <div className="bg-white rounded-3xl shadow-2xl p-8 text-center">
            <div className="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Lock className="w-10 h-10 text-red-600" />
            </div>
            <h1 className="text-2xl font-bold text-gray-800 mb-2">
              غير مصرح لك بالدخول
            </h1>
            <p className="text-gray-600 mb-6">
              هذه الصفحة متاحة للمسؤولين فقط
            </p>
            <button
              onClick={() => navigate('/')}
              className="w-full bg-gray-100 hover:bg-gray-200 text-gray-700 py-3 rounded-xl font-semibold transition-all"
            >
              العودة للصفحة الرئيسية
            </button>
          </div>
        </div>
      </div>
    );
  }

  return <>{children}</>;
};

export default ProtectedRoute;


