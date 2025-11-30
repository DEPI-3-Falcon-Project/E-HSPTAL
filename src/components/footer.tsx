// React Router DOM for client-side navigation
import { Link } from "react-router-dom";

// React Icons for UI elements
import {
  FaHospitalAlt, // Hospital icon
  FaChartPie, // Dashboard/Analytics icon
  FaFirstAid, // First Aid icon
  FaPhone, // Phone/Contact icon
  FaStickyNote, // Notes icon
  FaFileAlt, // Report/Document icon
  FaHeart, // Safety/Heart icon
  FaHeartbeat, // Logo heartbeat icon
} from "react-icons/fa";

export default function MainFooter() {
  const quickLinks = [
    { href: "/home", icon: FaHospitalAlt, label: "الصفحة الرئيسية" },
    { href: "/dashboard", icon: FaChartPie, label: "لوحة التحكم" },
    { href: "/notes", icon: FaStickyNote, label: "الملاحظات" },
    { href: "/first-aid", icon: FaFirstAid, label: "الإسعافات الأولية" },
    { href: "/report", icon: FaFileAlt, label: "الإبلاغات" },
    { href: "/safety", icon: FaHeart, label: "السلامة" },
    { href: "/contact", icon: FaPhone, label: "اتصل بنا" },
  ];

  return (
    <footer className="bg-linear-to-br from-red-700 via-red-600 to-red-700 text-white">
      <div className="max-w-7xl mx-auto px-6 py-12">
        <div className="grid md:grid-cols-3 gap-10 mb-8">
          {/* --- Column 1: Logo and About --- */}
          <div className="md:col-span-1">
            <Link to="/" className="inline-block group">
              <div className="flex items-center gap-3 mb-5 transition-transform group-hover:scale-105">
                <div className="bg-white/10 p-3 rounded-xl backdrop-blur-sm">
                  <FaHeartbeat className="text-3xl text-white" />
                </div>
                <h2 className="text-3xl font-bold tracking-tight">E-HSPTL</h2>
              </div>
            </Link>
            <p className="text-sm text-red-50 leading-relaxed mb-6">
              منصة رقمية لخدمات المستشفيات والطوارئ في مصر، تساعدك على الوصول
              السريع للمساعدة الطبية، البلاغات، والإسعاف.
            </p>
          </div>

          {/* --- Column 2: Quick Links --- */}
          <div className="md:col-span-1">
            <h3 className="text-xl font-semibold mb-6 border-b border-red-400/30 pb-3">
              روابط سريعة
            </h3>
            <ul className="space-y-3">
              {quickLinks.map((link) => (
                <li key={link.href}>
                  <Link
                    to={link.href}
                    className="flex items-center gap-4 text-red-50 hover:text-white hover:translate-x-2 transition-all duration-200 group"
                  >
                    <div className="bg-white/10 p-2 rounded-lg group-hover:bg-white/20 transition-colors">
                      <link.icon className="text-xl" />
                    </div>
                    <span className="text-sm font-medium">{link.label}</span>
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* --- Column 3: Emergency & Support --- */}
          <div className="md:col-span-1">
            <h3 className="text-xl font-semibold mb-6 border-b border-red-400/30 pb-3">
              خدمات الطوارئ
            </h3>
            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-5 mb-5 border border-white/20">
              <div className="flex items-center gap-3 mb-3">
                <div className="bg-red-500 p-2 rounded-lg animate-pulse">
                  <FaPhone className="text-2xl text-white" />
                </div>
                <div>
                  <p className="text-xs text-red-100">رقم الطوارئ</p>
                  <p className="text-2xl text-white font-bold" dir="ltr">
                    123
                  </p>
                </div>
              </div>
              <p className="text-xs text-red-100 leading-relaxed">
                متاح على مدار الساعة للحالات الطارئة والإسعاف
              </p>
            </div>

            <div className="bg-white/5 rounded-xl p-4 border border-white/10">
              <h4 className="font-semibold mb-3 text-sm">أوقات العمل</h4>
              <div className="space-y-2 text-xs text-red-100">
                <div className="flex justify-between">
                  <span>السبت - الخميس</span>
                  <span dir="ltr">24/7</span>
                </div>
                <div className="flex justify-between">
                  <span>الجمعة</span>
                  <span dir="ltr">24/7</span>
                </div>
                <p className="text-xs mt-3 text-red-200">
                  خدمة الطوارئ متاحة دائماً
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* --- Bottom bar --- */}
      <div className="bg-red-900/50 backdrop-blur-sm text-center py-4 text-sm text-red-100 border-t border-red-500/30">
        <p className="flex items-center justify-center gap-2">
          <span>© {new Date().getFullYear()} جميع الحقوق محفوظة</span>
          <span className="text-red-300">•</span>
          <span className="font-semibold">E-HSPTL</span>
        </p>
      </div>
    </footer>
  );
}
