import React, { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import {
  Home,
  LayoutDashboard,
  StickyNote,
  Heart,
  FileText,
  Phone,
  Shield,
  LogOut,
  LogIn,
  UserPlus,
  Menu,
  X,
  Stethoscope,
  Settings
} from "lucide-react";
import { useAuth } from "../hooks/useAuth";
import NotificationBell from "./NotificationBell";
import MessagesBell from "./MessagesBell";

const Header: React.FC = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { user, isAuthenticated, isAdmin, isDoctor, logout } = useAuth();
  const location = useLocation();

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  const closeMobileMenu = () => {
    setIsMobileMenuOpen(false);
  };

  const handleLogout = async () => {
    try {
      const token = localStorage.getItem('token');
      if (token) {
        await fetch('http://localhost:5000/api/auth/logout', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          }
        });
      }
      
      logout();
      closeMobileMenu();
      window.location.href = '/';
    } catch (error) {
      console.error('خطأ في تسجيل الخروج:', error);
      logout();
      closeMobileMenu();
      window.location.href = '/';
    }
  };

  const navLinks = [
    { path: "/home", label: "الرئيسية", icon: Home },
    { path: "/consultation", label: "استشارة طبية", icon: Heart },
    { path: "/dashboard", label: "بوابة الأطباء", icon: Stethoscope },
    { path: "/notes", label: "الملاحظات", icon: StickyNote },
    { path: "/first-aid", label: "الإسعافات", icon: FileText },
    { path: "/report", label: "الإبلاغات", icon: Shield },
    { path: "/safety", label: "السلامة", icon: Shield },
    { path: "/contact", label: "اتصل بنا", icon: Phone },
  ];

  const isActive = (path: string) => {
    if (path === "/home") return location.pathname === "/" || location.pathname === "/home";
    return location.pathname === path;
  };

  return (
    <header className="bg-gradient-to-r from-red-600 via-red-700 to-red-800 shadow-2xl fixed top-0 w-full z-50">
      <nav className="py-3">
        <div className="mx-auto px-4 lg:px-6 flex justify-between items-center">
          {/* Logo */}
          <Link
            to="/"
            className="flex items-center text-white text-xl lg:text-2xl font-bold hover:scale-105 transition-transform duration-300"
          >
            <div className="bg-white/10 p-2 rounded-xl ml-2 lg:ml-3">
              <Stethoscope className="w-6 h-6 lg:w-7 lg:h-7" />
            </div>
            <span className="tracking-wide">E-HSPTL</span>
          </Link>

          {/* Desktop Navigation */}
          <ul className="hidden xl:flex gap-1 items-center justify-center flex-1">
            {navLinks.map((link) => (
              <li key={link.path}>
                <Link
                  to={link.path}
                  className={`text-white font-medium px-3 py-2 rounded-xl inline-flex items-center transition-all duration-300 hover:bg-white/20 text-sm ${
                    isActive(link.path) ? "bg-white/20 shadow-md" : ""
                  }`}
                >
                  <link.icon className="w-4 h-4 ml-1.5" />
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>

          {/* User Menu */}
          <div className="hidden xl:flex items-center gap-3">
            {isAuthenticated ? (
              <>
                <NotificationBell />
                <MessagesBell />
                
                {/* User Info */}
                <div className="flex items-center gap-2 text-white text-sm bg-white/10 px-3 py-2 rounded-xl">
                  <div className="w-7 h-7 bg-white/20 rounded-full flex items-center justify-center text-xs font-bold">
                    {user?.name?.charAt(0) || 'م'}
                  </div>
                  <span className="max-w-[100px] truncate">{user?.name}</span>
                  {isDoctor && (
                    <span className="bg-emerald-500 text-white text-xs px-2 py-0.5 rounded-full">طبيب</span>
                  )}
                </div>

                {isAdmin && (
                  <Link
                    to="/admin"
                    className={`text-white font-medium px-3 py-2 rounded-xl inline-flex items-center transition-all duration-300 hover:bg-white/20 text-sm ${
                      location.pathname === "/admin" ? "bg-white/20 shadow-md" : ""
                    }`}
                  >
                    <Settings className="w-4 h-4 ml-1.5" />
                    لوحة الإدارة
                  </Link>
                )}

                <button
                  onClick={handleLogout}
                  className="flex items-center gap-2 bg-white/10 text-white border border-white/30 px-4 py-2 rounded-xl font-medium transition-all duration-300 hover:bg-white hover:text-red-600 text-sm"
                >
                  <LogOut className="w-4 h-4" />
                  خروج
                </button>
              </>
            ) : (
              <div className="flex items-center gap-2">
                <Link
                  to="/login"
                  className="text-white font-medium px-4 py-2 rounded-xl border border-white/30 hover:bg-white/10 transition-all duration-300 text-sm flex items-center gap-2"
                >
                  <LogIn className="w-4 h-4" />
                  دخول
                </Link>
                <Link
                  to="/register"
                  className="bg-white text-red-600 font-semibold px-4 py-2 rounded-xl hover:bg-red-50 transition-all duration-300 shadow-lg text-sm flex items-center gap-2"
                >
                  <UserPlus className="w-4 h-4" />
                  حساب جديد
                </Link>
              </div>
            )}
          </div>

          {/* Mobile Menu Button */}
              <div className="xl:hidden flex items-center gap-2">
                {isAuthenticated && (
                  <>
                    <NotificationBell />
                    <MessagesBell />
                  </>
                )}
                <button
              onClick={toggleMobileMenu}
              className="text-white p-2 hover:bg-white/10 rounded-lg transition-colors"
            >
              {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        <div
          className={`xl:hidden transition-all duration-300 overflow-hidden ${
            isMobileMenuOpen ? "max-h-[500px] opacity-100" : "max-h-0 opacity-0"
          }`}
        >
          <div className="bg-red-700/50 backdrop-blur-sm mt-3 mx-4 rounded-2xl p-4">
            <div className="space-y-1">
              {navLinks.map((link) => (
                <Link
                  key={link.path}
                  to={link.path}
                  onClick={closeMobileMenu}
                  className={`flex items-center gap-2 text-white font-medium px-4 py-3 rounded-xl transition-all ${
                    isActive(link.path) ? "bg-white/20" : "hover:bg-white/10"
                  }`}
                >
                  <link.icon className="w-5 h-5" />
                  {link.label}
                </Link>
              ))}

              {isAdmin && (
                <Link
                  to="/admin"
                  onClick={closeMobileMenu}
                  className={`flex items-center gap-2 text-white font-medium px-4 py-3 rounded-xl transition-all ${
                    location.pathname === "/admin" ? "bg-white/20" : "hover:bg-white/10"
                  }`}
                >
                  <Settings className="w-5 h-5" />
                  لوحة الإدارة
                </Link>
              )}
            </div>

            <div className="mt-4 pt-4 border-t border-white/20">
              {isAuthenticated ? (
                <div className="space-y-3">
                  <div className="flex items-center gap-3 text-white px-4 py-2 bg-white/10 rounded-xl">
                    <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center font-bold">
                      {user?.name?.charAt(0) || 'م'}
                    </div>
                    <div>
                      <p className="font-medium">{user?.name}</p>
                      <p className="text-xs text-white/70">{user?.email}</p>
                    </div>
                    {isDoctor && (
                      <span className="bg-emerald-500 text-white text-xs px-2 py-0.5 rounded-full mr-auto">طبيب</span>
                    )}
                  </div>
                  <button
                    onClick={handleLogout}
                    className="w-full flex items-center justify-center gap-2 bg-white text-red-600 font-semibold px-4 py-3 rounded-xl transition-all"
                  >
                    <LogOut className="w-5 h-5" />
                    تسجيل الخروج
                  </button>
                </div>
              ) : (
                <div className="space-y-2">
                  <Link
                    to="/login"
                    onClick={closeMobileMenu}
                    className="w-full flex items-center justify-center gap-2 text-white font-medium px-4 py-3 rounded-xl border border-white/30 hover:bg-white/10 transition-all"
                  >
                    <LogIn className="w-5 h-5" />
                    تسجيل الدخول
                  </Link>
                  <Link
                    to="/register"
                    onClick={closeMobileMenu}
                    className="w-full flex items-center justify-center gap-2 bg-white text-red-600 font-semibold px-4 py-3 rounded-xl transition-all"
                  >
                    <UserPlus className="w-5 h-5" />
                    إنشاء حساب جديد
                  </Link>
                </div>
              )}
            </div>
          </div>
        </div>
      </nav>
    </header>
  );
};

export default Header;
