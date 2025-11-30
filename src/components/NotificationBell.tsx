import React, { useState, useEffect } from 'react';
import { Bell, Check, AlertCircle, UserCheck, Clock, ChevronLeft, Stethoscope } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface Notification {
  _id: string;
  title: string;
  message: string;
  type: string;
  isRead: boolean;
  link?: string;
  createdAt: string;
}

const NotificationBell: React.FC = () => {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [isOpen, setIsOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const fetchNotifications = async () => {
    const token = localStorage.getItem('token');
    if (!token) return;

    setLoading(true);
    try {
      const response = await fetch('http://localhost:5000/api/notifications?limit=5', {
        headers: { 'Authorization': `Bearer ${token}` }
      });

      const data = await response.json();
      if (data.success) {
        setNotifications(data.data.notifications);
        setUnreadCount(data.data.unreadCount);
      }
    } catch (error) {
      console.error('Error fetching notifications:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchNotifications();
    const interval = setInterval(fetchNotifications, 15000); // كل 15 ثانية
    return () => clearInterval(interval);
  }, []);

  const markAsRead = async (id: string) => {
    const token = localStorage.getItem('token');
    try {
      await fetch(`http://localhost:5000/api/notifications/${id}/read`, {
        method: 'PATCH',
        headers: { 'Authorization': `Bearer ${token}` }
      });
      fetchNotifications();
    } catch (error) {
      console.error('Error marking notification as read:', error);
    }
  };

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case 'success':
        return <Check className="w-4 h-4 text-emerald-500" />;
      case 'error':
        return <AlertCircle className="w-4 h-4 text-red-500" />;
      case 'admin_alert':
        return <Stethoscope className="w-4 h-4 text-blue-500" />;
      case 'doctor_request':
        return <Clock className="w-4 h-4 text-amber-500" />;
      default:
        return <Bell className="w-4 h-4 text-gray-500" />;
    }
  };

  const getNotificationBgColor = (type: string, isRead: boolean) => {
    if (isRead) return 'bg-white';
    switch (type) {
      case 'success':
        return 'bg-emerald-50';
      case 'error':
        return 'bg-red-50';
      case 'admin_alert':
        return 'bg-blue-50';
      case 'doctor_request':
        return 'bg-amber-50';
      default:
        return 'bg-gray-50';
    }
  };

  const handleNotificationClick = (notification: Notification) => {
    if (!notification.isRead) {
      markAsRead(notification._id);
    }
    if (notification.link) {
      navigate(notification.link);
    }
    setIsOpen(false);
  };

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="relative p-2 text-white hover:bg-white/10 rounded-xl transition-colors"
      >
        <Bell className="w-5 h-5" />
        {unreadCount > 0 && (
          <span className="absolute -top-1 -right-1 bg-white text-red-600 text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center shadow-md animate-pulse">
            {unreadCount > 9 ? '9+' : unreadCount}
          </span>
        )}
      </button>

      {isOpen && (
        <>
          <div
            className="fixed inset-0 z-40"
            onClick={() => setIsOpen(false)}
          />
          <div className="absolute left-0 mt-2 w-80 bg-white rounded-2xl shadow-2xl z-50 border border-gray-100 overflow-hidden" dir="rtl">
            {/* Header */}
            <div className="p-4 bg-gradient-to-r from-red-500 to-rose-600">
              <div className="flex items-center justify-between">
                <h3 className="font-bold text-white flex items-center gap-2">
                  <Bell className="w-4 h-4" />
                  الإشعارات
                </h3>
                {unreadCount > 0 && (
                  <span className="bg-white/20 text-white text-xs px-2 py-1 rounded-full">
                    {unreadCount} جديد
                  </span>
                )}
              </div>
            </div>

            {/* Notifications List */}
            <div className="max-h-80 overflow-y-auto">
              {loading ? (
                <div className="p-8 text-center">
                  <div className="w-8 h-8 border-2 border-red-500 border-t-transparent rounded-full animate-spin mx-auto mb-2"></div>
                  <p className="text-gray-500 text-sm">جاري التحميل...</p>
                </div>
              ) : notifications.length === 0 ? (
                <div className="p-8 text-center">
                  <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-3">
                    <Bell className="w-6 h-6 text-gray-400" />
                  </div>
                  <p className="text-gray-500 text-sm">لا توجد إشعارات</p>
                </div>
              ) : (
                notifications.map((notification) => (
                  <div
                    key={notification._id}
                    className={`p-4 border-b border-gray-50 hover:bg-gray-50 cursor-pointer transition-colors ${
                      getNotificationBgColor(notification.type, notification.isRead)
                    }`}
                    onClick={() => handleNotificationClick(notification)}
                  >
                    <div className="flex items-start gap-3">
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${
                        notification.isRead ? 'bg-gray-100' : 'bg-white shadow-sm'
                      }`}>
                        {getNotificationIcon(notification.type)}
                      </div>
                      <div className="flex-1 min-w-0">
                        <h4 className={`font-semibold text-sm truncate ${
                          notification.isRead ? 'text-gray-600' : 'text-gray-800'
                        }`}>
                          {notification.title}
                        </h4>
                        <p className="text-gray-500 text-xs mt-1 line-clamp-2">
                          {notification.message}
                        </p>
                        <p className="text-gray-400 text-xs mt-2">
                          {new Date(notification.createdAt).toLocaleDateString('ar-EG', {
                            hour: '2-digit',
                            minute: '2-digit'
                          })}
                        </p>
                      </div>
                      {notification.link && (
                        <ChevronLeft className="w-4 h-4 text-gray-400 flex-shrink-0" />
                      )}
                    </div>
                  </div>
                ))
              )}
            </div>

            {/* Footer */}
            {notifications.length > 0 && (
              <div className="p-3 bg-gray-50 text-center">
                <button
                  onClick={() => {
                    setIsOpen(false);
                    // يمكن إضافة صفحة لجميع الإشعارات لاحقاً
                  }}
                  className="text-sm text-red-600 hover:text-red-700 font-medium"
                >
                  عرض جميع الإشعارات
                </button>
              </div>
            )}
          </div>
        </>
      )}
    </div>
  );
};

export default NotificationBell;
