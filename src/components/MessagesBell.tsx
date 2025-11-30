import React, { useState, useEffect } from 'react';
import { MessageCircle, X, ChevronLeft, Clock, User } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';

interface AdminMessage {
  _id: string;
  subject: string;
  message: string;
  isRead: boolean;
  from: {
    name: string;
    email: string;
  };
  contact: {
    subject: string;
  };
  createdAt: string;
}

const MessagesBell: React.FC = () => {
  const [messages, setMessages] = useState<AdminMessage[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [isOpen, setIsOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [selectedMessage, setSelectedMessage] = useState<AdminMessage | null>(null);
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();

  const fetchMessages = async () => {
    const token = localStorage.getItem('token');
    if (!token || !isAuthenticated) return;

    setLoading(true);
    try {
      const response = await fetch('http://localhost:5000/api/admin-messages/my-messages?limit=5', {
        headers: { 'Authorization': `Bearer ${token}` }
      });

      const data = await response.json();
      if (data.success) {
        setMessages(data.data.messages);
        setUnreadCount(data.data.unreadCount);
      }
    } catch (error) {
      console.error('Error fetching messages:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isAuthenticated) {
      fetchMessages();
      const interval = setInterval(fetchMessages, 15000);
      return () => clearInterval(interval);
    }
  }, [isAuthenticated]);

  const markAsRead = async (id: string) => {
    const token = localStorage.getItem('token');
    try {
      await fetch(`http://localhost:5000/api/admin-messages/${id}/read`, {
        method: 'PATCH',
        headers: { 'Authorization': `Bearer ${token}` }
      });
      fetchMessages();
    } catch (error) {
      console.error('Error marking message as read:', error);
    }
  };

  const handleMessageClick = (message: AdminMessage) => {
    if (!message.isRead) {
      markAsRead(message._id);
    }
    setSelectedMessage(message);
  };

  if (!isAuthenticated) return null;

  return (
    <>
      <div className="relative">
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="relative p-2 text-white hover:bg-white/10 rounded-xl transition-colors"
        >
          <MessageCircle className="w-5 h-5" />
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
              <div className="p-4 bg-gradient-to-r from-blue-500 to-indigo-600">
                <div className="flex items-center justify-between">
                  <h3 className="font-bold text-white flex items-center gap-2">
                    <MessageCircle className="w-4 h-4" />
                    الرسائل
                  </h3>
                  {unreadCount > 0 && (
                    <span className="bg-white/20 text-white text-xs px-2 py-1 rounded-full">
                      {unreadCount} جديد
                    </span>
                  )}
                </div>
              </div>

              {/* Messages List */}
              <div className="max-h-80 overflow-y-auto">
                {loading ? (
                  <div className="p-8 text-center">
                    <div className="w-8 h-8 border-2 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-2"></div>
                    <p className="text-gray-500 text-sm">جاري التحميل...</p>
                  </div>
                ) : messages.length === 0 ? (
                  <div className="p-8 text-center">
                    <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-3">
                      <MessageCircle className="w-6 h-6 text-gray-400" />
                    </div>
                    <p className="text-gray-500 text-sm">لا توجد رسائل</p>
                  </div>
                ) : (
                  messages.map((message) => (
                    <div
                      key={message._id}
                      className={`p-4 border-b border-gray-50 hover:bg-gray-50 cursor-pointer transition-colors ${
                        !message.isRead ? 'bg-blue-50' : 'bg-white'
                      }`}
                      onClick={() => handleMessageClick(message)}
                    >
                      <div className="flex items-start gap-3">
                        <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${
                          message.isRead ? 'bg-gray-100' : 'bg-blue-100'
                        }`}>
                          <User className="w-4 h-4 text-blue-500" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <h4 className={`font-semibold text-sm truncate ${
                            message.isRead ? 'text-gray-600' : 'text-gray-800'
                          }`}>
                            {message.subject}
                          </h4>
                          <p className="text-gray-500 text-xs mt-1 line-clamp-2">
                            {message.message.substring(0, 60)}...
                          </p>
                          <p className="text-gray-400 text-xs mt-2">
                            {new Date(message.createdAt).toLocaleDateString('ar-EG', {
                              hour: '2-digit',
                              minute: '2-digit'
                            })}
                          </p>
                        </div>
                        <ChevronLeft className="w-4 h-4 text-gray-400 flex-shrink-0" />
                      </div>
                    </div>
                  ))
                )}
              </div>

              {/* Footer */}
              {messages.length > 0 && (
                <div className="p-3 bg-gray-50 text-center">
                  <button
                    onClick={() => {
                      setIsOpen(false);
                    }}
                    className="text-sm text-blue-600 hover:text-blue-700 font-medium"
                  >
                    عرض جميع الرسائل
                  </button>
                </div>
              )}
            </div>
          </>
        )}
      </div>

      {/* Message Detail Modal */}
      {selectedMessage && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-[60] p-4 animate-fadeIn">
          <div className="bg-white rounded-3xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-hidden transform scale-95 animate-scaleIn">
            {/* Modal Header */}
            <div className="bg-gradient-to-r from-blue-500 via-indigo-600 to-purple-600 p-6 text-white relative overflow-hidden">
              <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -mr-16 -mt-16"></div>
              <div className="absolute bottom-0 left-0 w-24 h-24 bg-white/10 rounded-full -ml-12 -mb-12"></div>
              <div className="flex items-start justify-between relative z-10">
                <div>
                  <h2 className="text-2xl font-bold mb-2">{selectedMessage.subject}</h2>
                  <div className="flex items-center gap-2 text-sm text-white/90">
                    <User className="w-4 h-4" />
                    <span>من: {selectedMessage.from.name}</span>
                  </div>
                </div>
                <button
                  onClick={() => setSelectedMessage(null)}
                  className="w-10 h-10 bg-white/20 hover:bg-white/30 rounded-xl flex items-center justify-center transition-all hover:scale-110"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Modal Body */}
            <div className="p-6 overflow-y-auto max-h-[calc(90vh-200px)]">
              <div className="space-y-5">
                <div className="bg-gray-50 rounded-xl p-4">
                  <div className="flex items-center gap-2 text-xs text-gray-600 mb-2">
                    <Clock className="w-4 h-4" />
                    <span className="font-medium">التاريخ</span>
                  </div>
                  <p className="text-gray-900 font-semibold">
                    {new Date(selectedMessage.createdAt).toLocaleDateString('ar-EG', {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric',
                      hour: '2-digit',
                      minute: '2-digit'
                    })}
                  </p>
                </div>

                <div className="bg-blue-50 border border-blue-200 rounded-xl p-4">
                  <h3 className="font-bold text-blue-800 mb-2">الرسالة</h3>
                  <p className="text-blue-900 leading-relaxed whitespace-pre-wrap">{selectedMessage.message}</p>
                </div>

                <div className="flex gap-3 pt-4 border-t border-gray-100">
                  <button
                    onClick={() => setSelectedMessage(null)}
                    className="flex-1 bg-gray-100 text-gray-700 py-3 rounded-xl font-semibold hover:bg-gray-200 transition-all"
                  >
                    إغلاق
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default MessagesBell;


