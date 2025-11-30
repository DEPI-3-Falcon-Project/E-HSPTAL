import React, { useState, useEffect } from 'react';
import { 
  Users, 
  UserCheck, 
  UserX, 
  Clock, 
  Eye, 
  Check, 
  X, 
  Search,
  Filter,
  ChevronDown,
  Building2,
  GraduationCap,
  Phone,
  Mail,
  Calendar,
  FileText,
  AlertCircle,
  Stethoscope,
  Trash2,
  UserCircle,
  Shield,
  UserCog,
  MessageCircle,
  MapPin,
  AlertTriangle,
  Send
} from 'lucide-react';

interface DoctorRequest {
  _id: string;
  user: {
    name: string;
    email: string;
    phone: string;
  };
  fullName: string;
  specialization: string;
  licenseNumber: string;
  yearsOfExperience: number;
  hospital: string;
  qualifications: string;
  status: 'pending' | 'approved' | 'rejected';
  createdAt: string;
  reviewNotes?: string;
}

interface User {
  _id: string;
  name: string;
  email: string;
  phone?: string;
  role: 'user' | 'doctor' | 'admin';
  createdAt: string;
}

const AdminDashboard: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'requests' | 'users' | 'reports' | 'contacts'>('requests');
  
  // Doctor Requests State
  const [requests, setRequests] = useState<DoctorRequest[]>([]);
  const [stats, setStats] = useState({ total: 0, pending: 0, approved: 0, rejected: 0 });
  const [loading, setLoading] = useState(true);
  const [selectedRequest, setSelectedRequest] = useState<DoctorRequest | null>(null);
  const [reviewNotes, setReviewNotes] = useState('');
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [showFilters, setShowFilters] = useState(false);
  const [showRejectModal, setShowRejectModal] = useState(false);
  const [rejectReason, setRejectReason] = useState('');

  // Users State
  const [users, setUsers] = useState<User[]>([]);
  const [userStats, setUserStats] = useState({ total: 0, users: 0, doctors: 0, admins: 0 });
  const [usersLoading, setUsersLoading] = useState(false);
  const [userFilterRole, setUserFilterRole] = useState<string>('all');
  const [userSearchTerm, setUserSearchTerm] = useState('');
  const [deletingUserId, setDeletingUserId] = useState<string | null>(null);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);

  // Reports State
  const [reports, setReports] = useState<any[]>([]);
  const [reportStats, setReportStats] = useState({ total: 0, pending: 0, inProgress: 0, resolved: 0 });
  const [reportsLoading, setReportsLoading] = useState(false);
  const [reportFilterStatus, setReportFilterStatus] = useState<string>('all');
  const [reportSearchTerm, setReportSearchTerm] = useState('');
  const [selectedReport, setSelectedReport] = useState<any | null>(null);
  const [deletingReportId, setDeletingReportId] = useState<string | null>(null);

  // Contacts State
  const [contacts, setContacts] = useState<any[]>([]);
  const [contactStats, setContactStats] = useState({ total: 0, new: 0, read: 0, replied: 0 });
  const [contactsLoading, setContactsLoading] = useState(false);
  const [contactFilterStatus, setContactFilterStatus] = useState<string>('all');
  const [contactSearchTerm, setContactSearchTerm] = useState('');
  const [selectedContact, setSelectedContact] = useState<any | null>(null);
  const [deletingContactId, setDeletingContactId] = useState<string | null>(null);
  const [replyMessage, setReplyMessage] = useState('');
  const [sendingReply, setSendingReply] = useState(false);

  // Add CSS animations
  React.useEffect(() => {
    const style = document.createElement('style');
    style.textContent = `
      @keyframes fadeIn {
        from { opacity: 0; }
        to { opacity: 1; }
      }
      @keyframes scaleIn {
        from { transform: scale(0.95); opacity: 0; }
        to { transform: scale(1); opacity: 1; }
      }
      .animate-fadeIn {
        animation: fadeIn 0.2s ease-out;
      }
      .animate-scaleIn {
        animation: scaleIn 0.3s ease-out;
      }
    `;
    document.head.appendChild(style);
    return () => document.head.removeChild(style);
  }, []);

  const fetchRequests = async () => {
    const token = localStorage.getItem('token');
    setLoading(true);

    try {
      const statusQuery = filterStatus !== 'all' ? `?status=${filterStatus}` : '';
      const response = await fetch(`http://localhost:5000/api/doctor-requests${statusQuery}`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });

      const data = await response.json();
      if (data.success) {
        setRequests(data.data.requests);
        
        const pending = data.data.requests.filter((r: DoctorRequest) => r.status === 'pending').length;
        const approved = data.data.requests.filter((r: DoctorRequest) => r.status === 'approved').length;
        const rejected = data.data.requests.filter((r: DoctorRequest) => r.status === 'rejected').length;
        
        setStats({
          total: data.data.pagination.total,
          pending,
          approved,
          rejected
        });
      }
    } catch (error) {
      console.error('Error fetching requests:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (activeTab === 'requests') {
    fetchRequests();
    }
  }, [filterStatus, activeTab]);

  useEffect(() => {
    if (activeTab === 'users') {
      fetchUsers();
    }
  }, [activeTab, userFilterRole]);

  // Fetch Reports
  const fetchReports = async () => {
    const token = localStorage.getItem('token');
    setReportsLoading(true);
    try {
      const statusQuery = reportFilterStatus !== 'all' ? `status=${reportFilterStatus}` : '';
      const searchQuery = reportSearchTerm ? `search=${reportSearchTerm}` : '';
      const queryString = [statusQuery, searchQuery].filter(Boolean).join('&');
      const url = `http://localhost:5000/api/reports${queryString ? `?${queryString}` : ''}`;

      const response = await fetch(url, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const data = await response.json();
      if (data.success) {
        const reportsData = data.data?.reports || [];
        setReports(reportsData);
        setReportStats({
          total: data.data?.pagination?.total || reportsData.length,
          pending: reportsData.filter((r: any) => r.status === 'pending').length,
          inProgress: reportsData.filter((r: any) => r.status === 'in-progress').length,
          resolved: reportsData.filter((r: any) => r.status === 'resolved').length,
        });
      } else {
        throw new Error(data.message || 'حدث خطأ في جلب الشكاوى');
      }
    } catch (error: any) {
      console.error('Error fetching reports:', error);
      alert(error.message || 'حدث خطأ في جلب الشكاوى');
      setReports([]);
    } finally {
      setReportsLoading(false);
    }
  };

  useEffect(() => {
    if (activeTab === 'reports') {
      fetchReports();
    }
  }, [reportFilterStatus, reportSearchTerm, activeTab]);

  // Fetch Contacts
  const fetchContacts = async () => {
    const token = localStorage.getItem('token');
    setContactsLoading(true);
    try {
      const statusQuery = contactFilterStatus !== 'all' ? `status=${contactFilterStatus}` : '';
      const searchQuery = contactSearchTerm ? `search=${contactSearchTerm}` : '';
      const queryString = [statusQuery, searchQuery].filter(Boolean).join('&');
      const url = `http://localhost:5000/api/contact${queryString ? `?${queryString}` : ''}`;

      const response = await fetch(url, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const data = await response.json();
      if (data.success) {
        const contactsData = data.data?.contacts || [];
        setContacts(contactsData);
        setContactStats({
          total: data.data?.pagination?.total || contactsData.length,
          new: contactsData.filter((c: any) => c.status === 'new').length,
          read: contactsData.filter((c: any) => c.status === 'read').length,
          replied: contactsData.filter((c: any) => c.status === 'replied').length,
        });
      } else {
        throw new Error(data.message || 'حدث خطأ في جلب رسائل التواصل');
      }
    } catch (error: any) {
      console.error('Error fetching contacts:', error);
      alert(error.message || 'حدث خطأ في جلب رسائل التواصل');
      setContacts([]);
    } finally {
      setContactsLoading(false);
    }
  };

  useEffect(() => {
    if (activeTab === 'contacts') {
      fetchContacts();
    }
  }, [contactFilterStatus, contactSearchTerm, activeTab]);

  // Delete Report
  const handleDeleteReport = async (reportId: string) => {
    if (!confirm('هل أنت متأكد من حذف هذه الشكوى؟')) return;

    const token = localStorage.getItem('token');
    setDeletingReportId(reportId);
    try {
      const response = await fetch(`http://localhost:5000/api/reports/${reportId}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const data = await response.json();
      if (data.success) {
        alert('تم حذف الشكوى بنجاح');
        fetchReports();
        setSelectedReport(null);
      } else {
        throw new Error(data.message);
      }
    } catch (error: any) {
      alert(`خطأ: ${error.message}`);
    } finally {
      setDeletingReportId(null);
    }
  };

  // Delete Contact
  const handleDeleteContact = async (contactId: string) => {
    if (!confirm('هل أنت متأكد من حذف هذه الرسالة؟')) return;

    const token = localStorage.getItem('token');
    setDeletingContactId(contactId);
    try {
      const response = await fetch(`http://localhost:5000/api/contact/${contactId}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const data = await response.json();
      if (data.success) {
        alert('تم حذف الرسالة بنجاح');
        fetchContacts();
        setSelectedContact(null);
      } else {
        throw new Error(data.message);
      }
    } catch (error: any) {
      alert(`خطأ: ${error.message}`);
    } finally {
      setDeletingContactId(null);
    }
  };

  // Send Reply
  const handleSendReply = async (contactId: string) => {
    if (!replyMessage.trim()) {
      alert('يرجى إدخال رسالة الرد');
      return;
    }

    const token = localStorage.getItem('token');
    setSendingReply(true);
    try {
      const response = await fetch('http://localhost:5000/api/admin-messages', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          contactId,
          message: replyMessage
        })
      });

      const data = await response.json();
      if (data.success) {
        alert('تم إرسال الرد بنجاح');
        setReplyMessage('');
        fetchContacts();
        setSelectedContact(null);
      } else {
        throw new Error(data.message);
      }
    } catch (error: any) {
      alert(`خطأ: ${error.message}`);
    } finally {
      setSendingReply(false);
    }
  };

  // Debounced search for users
  useEffect(() => {
    if (activeTab === 'users') {
      const timer = setTimeout(() => {
        fetchUsers();
      }, 500);
      return () => clearTimeout(timer);
    }
  }, [userSearchTerm]);

  const fetchUsers = async () => {
    const token = localStorage.getItem('token');
    setUsersLoading(true);

    try {
      const params = new URLSearchParams();
      if (userFilterRole !== 'all') params.append('role', userFilterRole);
      if (userSearchTerm) params.append('search', userSearchTerm);

      const response = await fetch(`http://localhost:5000/api/users?${params.toString()}`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });

      const data = await response.json();
      if (data.success) {
        setUsers(data.data.users);
        setUserStats(data.data.stats);
      }
    } catch (error) {
      console.error('Error fetching users:', error);
    } finally {
      setUsersLoading(false);
    }
  };

  const handleDeleteUser = async (id: string, name: string) => {
    if (!confirm(`هل أنت متأكد من حذف المستخدم "${name}"؟\n\nهذا الإجراء لا يمكن التراجع عنه.`)) {
      return;
    }

    const token = localStorage.getItem('token');
    setDeletingUserId(id);

    try {
      const response = await fetch(`http://localhost:5000/api/users/${id}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` }
      });

      const data = await response.json();
      if (data.success) {
        alert('تم حذف المستخدم بنجاح');
        fetchUsers();
      } else {
        throw new Error(data.message);
      }
    } catch (error: any) {
      alert(`خطأ: ${error.message}`);
    } finally {
      setDeletingUserId(null);
    }
  };

  const handleApprove = async (id: string) => {
    if (!confirm('هل أنت متأكد من الموافقة على هذا الطلب؟')) return;

    const token = localStorage.getItem('token');
    try {
      const response = await fetch(`http://localhost:5000/api/doctor-requests/${id}/approve`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ notes: reviewNotes })
      });

      const data = await response.json();
      if (data.success) {
        setSelectedRequest(null);
        setReviewNotes('');
        fetchRequests();
      } else {
        throw new Error(data.message);
      }
    } catch (error: any) {
      alert(`خطأ: ${error.message}`);
    }
  };

  const handleReject = async (id: string) => {
    if (!rejectReason.trim()) {
      alert('يرجى إدخال سبب الرفض');
      return;
    }

    const token = localStorage.getItem('token');
    try {
      const response = await fetch(`http://localhost:5000/api/doctor-requests/${id}/reject`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ notes: rejectReason })
      });

      const data = await response.json();
      if (data.success) {
        alert('تم رفض الطلب بنجاح');
        setSelectedRequest(null);
        setReviewNotes('');
        setRejectReason('');
        setShowRejectModal(false);
        fetchRequests();
      } else {
        throw new Error(data.message);
      }
    } catch (error: any) {
      alert(`خطأ: ${error.message}`);
    }
  };

  const filteredRequests = requests.filter(request => 
    request.fullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    request.specialization.toLowerCase().includes(searchTerm.toLowerCase()) ||
    request.licenseNumber.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const StatCard = ({ icon: Icon, label, value, color, bgColor }: any) => (
    <div className={`${bgColor} rounded-2xl p-5 transition-all duration-300 hover:scale-105 hover:shadow-lg`}>
      <div className="flex items-center gap-4">
        <div className={`w-12 h-12 ${color} rounded-xl flex items-center justify-center`}>
          <Icon className="w-6 h-6 text-white" />
        </div>
        <div className="text-right flex-1">
          <p className="text-3xl font-bold text-gray-800">{value}</p>
          <p className="text-sm text-gray-600 mt-1">{label}</p>
        </div>
      </div>
    </div>
  );

  const StatusBadge = ({ status }: { status: string }) => {
    const config = {
      pending: { bg: 'bg-amber-100', text: 'text-amber-700', label: 'قيد المراجعة', icon: Clock },
      approved: { bg: 'bg-emerald-100', text: 'text-emerald-700', label: 'مقبول', icon: Check },
      rejected: { bg: 'bg-rose-100', text: 'text-rose-700', label: 'مرفوض', icon: X }
    };
    const { bg, text, label, icon: StatusIcon } = config[status as keyof typeof config];
    
    return (
      <span className={`${bg} ${text} px-3 py-1.5 rounded-full text-xs font-semibold inline-flex items-center gap-1.5`}>
        <StatusIcon className="w-3.5 h-3.5" />
        {label}
      </span>
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-100 pt-20 pb-12" dir="rtl">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 bg-gradient-to-br from-red-500 to-rose-600 rounded-xl flex items-center justify-center">
              <Shield className="w-5 h-5 text-white" />
            </div>
            <h1 className="text-2xl font-bold text-gray-900">لوحة تحكم المسؤول</h1>
          </div>
          <p className="text-gray-500 text-sm">إدارة المنصة والمستخدمين</p>
          </div>

        {/* Tabs */}
        <div className="flex flex-wrap gap-2 mb-6 bg-white rounded-xl p-1.5 shadow-sm border border-gray-100">
          <button
            onClick={() => setActiveTab('requests')}
            className={`flex-1 min-w-[150px] py-3 px-4 rounded-lg font-semibold transition-all flex items-center justify-center gap-2 ${
              activeTab === 'requests'
                ? 'bg-gradient-to-r from-red-500 to-rose-600 text-white shadow-md'
                : 'text-gray-600 hover:bg-gray-100'
            }`}
          >
            <Stethoscope className="w-5 h-5" />
            <span className="hidden sm:inline">طلبات الأطباء</span>
            <span className="sm:hidden">طلبات</span>
          </button>
          <button
            onClick={() => setActiveTab('users')}
            className={`flex-1 min-w-[150px] py-3 px-4 rounded-lg font-semibold transition-all flex items-center justify-center gap-2 ${
              activeTab === 'users'
                ? 'bg-gradient-to-r from-red-500 to-rose-600 text-white shadow-md'
                : 'text-gray-600 hover:bg-gray-100'
            }`}
          >
            <Users className="w-5 h-5" />
            <span className="hidden sm:inline">إدارة المستخدمين</span>
            <span className="sm:hidden">مستخدمين</span>
          </button>
          <button
            onClick={() => setActiveTab('reports')}
            className={`flex-1 min-w-[150px] py-3 px-4 rounded-lg font-semibold transition-all flex items-center justify-center gap-2 ${
              activeTab === 'reports'
                ? 'bg-gradient-to-r from-red-500 to-rose-600 text-white shadow-md'
                : 'text-gray-600 hover:bg-gray-100'
            }`}
          >
            <AlertTriangle className="w-5 h-5" />
            <span className="hidden sm:inline">الشكاوى</span>
            <span className="sm:hidden">شكاوى</span>
          </button>
          <button
            onClick={() => setActiveTab('contacts')}
            className={`flex-1 min-w-[150px] py-3 px-4 rounded-lg font-semibold transition-all flex items-center justify-center gap-2 ${
              activeTab === 'contacts'
                ? 'bg-gradient-to-r from-red-500 to-rose-600 text-white shadow-md'
                : 'text-gray-600 hover:bg-gray-100'
            }`}
          >
            <MessageCircle className="w-5 h-5" />
            <span className="hidden sm:inline">التواصل</span>
            <span className="sm:hidden">تواصل</span>
          </button>
        </div>

        {/* Stats Grid */}
        {activeTab === 'requests' && (
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <StatCard 
            icon={Users} 
            label="إجمالي الطلبات" 
            value={stats.total}
            color="bg-gradient-to-br from-blue-500 to-blue-600"
            bgColor="bg-blue-50"
          />
          <StatCard 
            icon={Clock} 
            label="قيد المراجعة" 
            value={stats.pending}
            color="bg-gradient-to-br from-amber-500 to-orange-500"
            bgColor="bg-amber-50"
          />
          <StatCard 
            icon={UserCheck} 
            label="مقبولة" 
            value={stats.approved}
            color="bg-gradient-to-br from-emerald-500 to-green-600"
            bgColor="bg-emerald-50"
          />
          <StatCard 
            icon={UserX} 
            label="مرفوضة" 
            value={stats.rejected}
            color="bg-gradient-to-br from-rose-500 to-red-600"
            bgColor="bg-rose-50"
          />
          </div>
        )}

        {activeTab === 'users' && (
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
            <StatCard 
              icon={Users} 
              label="إجمالي المستخدمين" 
              value={userStats.total}
              color="bg-gradient-to-br from-blue-500 to-blue-600"
              bgColor="bg-blue-50"
            />
            <StatCard 
              icon={UserCircle} 
              label="مستخدمين عاديين" 
              value={userStats.users}
              color="bg-gradient-to-br from-purple-500 to-purple-600"
              bgColor="bg-purple-50"
            />
            <StatCard 
              icon={Stethoscope} 
              label="أطباء" 
              value={userStats.doctors}
              color="bg-gradient-to-br from-emerald-500 to-green-600"
              bgColor="bg-emerald-50"
            />
            <StatCard 
              icon={Shield} 
              label="مسؤولين" 
              value={userStats.admins}
              color="bg-gradient-to-br from-red-500 to-rose-600"
              bgColor="bg-red-50"
            />
          </div>
        )}

        {/* Main Content */}
        {activeTab === 'requests' && (
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
          
          {/* Toolbar */}
          <div className="p-4 border-b border-gray-100">
            <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
              
              {/* Search */}
              <div className="relative w-full sm:w-80">
                <Search className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input
                  type="text"
                  placeholder="بحث بالاسم، التخصص، أو رقم الترخيص..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pr-10 pl-4 py-2.5 bg-gray-50 border-0 rounded-xl text-sm focus:ring-2 focus:ring-red-500 focus:bg-white transition-all"
                />
        </div>

              {/* Filter Toggle */}
              <button
                onClick={() => setShowFilters(!showFilters)}
                className="flex items-center gap-2 px-4 py-2.5 bg-gray-50 hover:bg-gray-100 rounded-xl text-sm font-medium text-gray-700 transition-colors"
              >
                <Filter className="w-4 h-4" />
                تصفية
                <ChevronDown className={`w-4 h-4 transition-transform ${showFilters ? 'rotate-180' : ''}`} />
              </button>
            </div>

            {/* Filter Options */}
            {showFilters && (
              <div className="flex flex-wrap gap-2 mt-4 pt-4 border-t border-gray-100">
                {[
                  { value: 'all', label: 'الكل', color: 'bg-gray-100 text-gray-700 hover:bg-gray-200' },
                  { value: 'pending', label: 'قيد المراجعة', color: 'bg-amber-100 text-amber-700 hover:bg-amber-200' },
                  { value: 'approved', label: 'مقبولة', color: 'bg-emerald-100 text-emerald-700 hover:bg-emerald-200' },
                  { value: 'rejected', label: 'مرفوضة', color: 'bg-rose-100 text-rose-700 hover:bg-rose-200' }
                ].map(filter => (
                  <button
                    key={filter.value}
                    onClick={() => setFilterStatus(filter.value)}
                    className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                      filterStatus === filter.value 
                        ? `${filter.color} ring-2 ring-offset-1 ring-gray-300` 
                        : 'bg-gray-50 text-gray-600 hover:bg-gray-100'
                    }`}
                  >
                    {filter.label}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Requests List */}
          <div className="divide-y divide-gray-50">
            {loading ? (
              <div className="p-12 text-center">
                <div className="w-10 h-10 border-2 border-red-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
                <p className="text-gray-500">جاري التحميل...</p>
              </div>
            ) : filteredRequests.length === 0 ? (
              <div className="p-12 text-center">
                <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <AlertCircle className="w-8 h-8 text-gray-400" />
                </div>
                <p className="text-gray-500 font-medium">لا توجد طلبات</p>
                <p className="text-gray-400 text-sm mt-1">لم يتم العثور على طلبات تطابق البحث</p>
              </div>
            ) : (
              filteredRequests.map((request) => (
                <div 
                  key={request._id} 
                  className="p-4 hover:bg-gray-50/50 transition-colors cursor-pointer"
                          onClick={() => setSelectedRequest(request)}
                >
                  <div className="flex items-center gap-4">
                    {/* Avatar */}
                    <div className="w-12 h-12 bg-gradient-to-br from-red-500 to-rose-600 rounded-full flex items-center justify-center text-white font-bold text-lg flex-shrink-0">
                      {request.fullName.charAt(0)}
                    </div>
                    
                    {/* Info */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <h3 className="font-semibold text-gray-900 truncate">{request.fullName}</h3>
                        <StatusBadge status={request.status} />
                      </div>
                      <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-sm text-gray-500">
                        <span className="flex items-center gap-1">
                          <GraduationCap className="w-3.5 h-3.5" />
                          {request.specialization}
                        </span>
                        <span className="flex items-center gap-1">
                          <FileText className="w-3.5 h-3.5" />
                          {request.licenseNumber}
                        </span>
                        <span className="flex items-center gap-1">
                          <Calendar className="w-3.5 h-3.5" />
                          {new Date(request.createdAt).toLocaleDateString('ar-EG')}
                        </span>
                      </div>
                    </div>

                    {/* Action */}
                    <button className="w-10 h-10 bg-gray-100 hover:bg-red-100 rounded-xl flex items-center justify-center text-gray-500 hover:text-red-600 transition-colors flex-shrink-0">
                      <Eye className="w-5 h-5" />
                        </button>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
        )}

        {/* Reject Modal */}
        {showRejectModal && selectedRequest && activeTab === 'requests' && (
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-[60] p-4 animate-fadeIn">
            <div className="bg-white rounded-3xl shadow-2xl w-full max-w-md overflow-hidden transform scale-95 animate-scaleIn">
              {/* Header */}
              <div className="bg-gradient-to-r from-rose-500 to-red-600 p-6 text-white">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center">
                      <X className="w-6 h-6" />
                    </div>
                    <div>
                      <h2 className="text-xl font-bold">رفض الطلب</h2>
                      <p className="text-white/80 text-sm">يرجى توضيح سبب الرفض</p>
                    </div>
                  </div>
                  <button
                    onClick={() => {
                      setShowRejectModal(false);
                      setRejectReason('');
                    }}
                    className="w-8 h-8 bg-white/20 hover:bg-white/30 rounded-lg flex items-center justify-center transition-colors"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>
              </div>

              {/* Body */}
              <div className="p-6">
                <div className="mb-4">
                  <div className="bg-red-50 border border-red-200 rounded-xl p-4 mb-4">
                    <div className="flex items-start gap-3">
                      <AlertCircle className="w-5 h-5 text-red-600 mt-0.5 flex-shrink-0" />
                <div>
                        <p className="text-red-800 font-semibold text-sm mb-1">تنبيه مهم</p>
                        <p className="text-red-700 text-sm">
                          سيتم إرسال سبب الرفض للمستخدم في الإشعارات. يرجى كتابة سبب واضح ومفصل.
                        </p>
                      </div>
                    </div>
                  </div>

                  <label className="block text-gray-700 font-semibold mb-2 text-right">
                    سبب الرفض <span className="text-red-500">*</span>
                  </label>
                  <textarea
                    value={rejectReason}
                    onChange={(e) => setRejectReason(e.target.value)}
                    rows={5}
                    className="w-full px-4 py-3 bg-gray-50 border-2 border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-red-500 focus:border-red-500 resize-none transition-all"
                    placeholder="مثال: رقم الترخيص غير صحيح، أو المستندات المرفقة غير واضحة، أو..."
                    dir="rtl"
                  />
                  <p className="text-xs text-gray-500 mt-2 text-right">
                    {rejectReason.length} حرف
                  </p>
                </div>

                <div className="flex gap-3">
                  <button
                    onClick={() => {
                      setShowRejectModal(false);
                      setRejectReason('');
                    }}
                    className="flex-1 bg-gray-100 text-gray-700 py-3 rounded-xl font-semibold hover:bg-gray-200 transition-all"
                  >
                    إلغاء
                  </button>
                  <button
                    onClick={() => {
                      if (!rejectReason.trim()) {
                        alert('يرجى إدخال سبب الرفض');
                        return;
                      }
                      if (confirm('هل أنت متأكد من رفض هذا الطلب؟')) {
                        handleReject(selectedRequest._id);
                      }
                    }}
                    disabled={!rejectReason.trim()}
                    className="flex-1 bg-gradient-to-r from-rose-500 to-red-600 text-white py-3 rounded-xl font-semibold hover:shadow-lg hover:shadow-rose-200 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                  >
                    <X className="w-5 h-5" />
                    تأكيد الرفض
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Detail Modal */}
        {selectedRequest && !showRejectModal && activeTab === 'requests' && (
          <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-fadeIn">
            <div className="bg-white rounded-3xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-hidden transform scale-95 animate-scaleIn">
              
              {/* Modal Header */}
              <div className="bg-gradient-to-r from-red-500 via-red-600 to-rose-600 p-6 text-white relative overflow-hidden">
                {/* Decorative Elements */}
                <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -mr-16 -mt-16"></div>
                <div className="absolute bottom-0 left-0 w-24 h-24 bg-white/10 rounded-full -ml-12 -mb-12"></div>
                
                <div className="flex items-start justify-between relative z-10">
                  <div className="flex items-center gap-4">
                    <div className="w-20 h-20 bg-white/20 backdrop-blur-sm rounded-2xl flex items-center justify-center text-2xl font-bold shadow-lg">
                      {selectedRequest.fullName.charAt(0)}
                    </div>
                <div>
                      <h2 className="text-2xl font-bold mb-1">{selectedRequest.fullName}</h2>
                      <div className="flex items-center gap-2">
                        <Stethoscope className="w-4 h-4 text-white/80" />
                        <p className="text-white/90 text-sm">{selectedRequest.specialization}</p>
                      </div>
                      <StatusBadge status={selectedRequest.status} />
                    </div>
                  </div>
                  <button
                    onClick={() => {
                      setSelectedRequest(null);
                      setReviewNotes('');
                      setRejectReason('');
                    }}
                    className="w-10 h-10 bg-white/20 hover:bg-white/30 rounded-xl flex items-center justify-center transition-all hover:scale-110"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>
              </div>

              {/* Modal Body */}
              <div className="p-6 overflow-y-auto max-h-[calc(90vh-200px)]">
                <div className="space-y-5">
                  
                  {/* Info Cards Grid */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="bg-gradient-to-br from-red-50 to-rose-50 rounded-xl p-4 border border-red-100">
                      <div className="flex items-center gap-2 text-red-600 text-xs mb-2">
                        <Mail className="w-4 h-4" />
                        <span className="font-medium">البريد الإلكتروني</span>
                      </div>
                      <p className="text-gray-900 font-semibold text-sm">{selectedRequest.user.email}</p>
                    </div>
                    <div className="bg-gradient-to-br from-red-50 to-rose-50 rounded-xl p-4 border border-red-100">
                      <div className="flex items-center gap-2 text-red-600 text-xs mb-2">
                        <Phone className="w-4 h-4" />
                        <span className="font-medium">رقم الهاتف</span>
                      </div>
                      <p className="text-gray-900 font-semibold text-sm">{selectedRequest.user.phone || 'غير متوفر'}</p>
                    </div>
                    <div className="bg-gradient-to-br from-red-50 to-rose-50 rounded-xl p-4 border border-red-100">
                      <div className="flex items-center gap-2 text-red-600 text-xs mb-2">
                        <FileText className="w-4 h-4" />
                        <span className="font-medium">رقم الترخيص</span>
                      </div>
                      <p className="text-gray-900 font-semibold text-sm">{selectedRequest.licenseNumber}</p>
                    </div>
                    <div className="bg-gradient-to-br from-red-50 to-rose-50 rounded-xl p-4 border border-red-100">
                      <div className="flex items-center gap-2 text-red-600 text-xs mb-2">
                        <Clock className="w-4 h-4" />
                        <span className="font-medium">سنوات الخبرة</span>
                      </div>
                      <p className="text-gray-900 font-semibold text-sm">{selectedRequest.yearsOfExperience} سنة</p>
                    </div>
                  </div>

                  {selectedRequest.hospital && (
                    <div className="bg-gradient-to-br from-red-50 to-rose-50 rounded-xl p-4 border border-red-100">
                      <div className="flex items-center gap-2 text-red-600 text-xs mb-2">
                        <Building2 className="w-4 h-4" />
                        <span className="font-medium">المستشفى/المركز الطبي</span>
                      </div>
                      <p className="text-gray-900 font-semibold text-sm">{selectedRequest.hospital}</p>
                    </div>
                  )}

                  <div className="bg-gradient-to-br from-gray-50 to-gray-100 rounded-xl p-5 border border-gray-200">
                    <div className="flex items-center gap-2 text-gray-700 text-sm font-semibold mb-3">
                      <GraduationCap className="w-5 h-5 text-red-600" />
                      <span>المؤهلات والشهادات</span>
                    </div>
                    <p className="text-gray-800 text-sm leading-relaxed whitespace-pre-wrap bg-white p-4 rounded-lg border border-gray-200">
                      {selectedRequest.qualifications}
                    </p>
                  </div>

                  {selectedRequest.reviewNotes && (
                    <div className="bg-gradient-to-br from-amber-50 to-yellow-50 rounded-xl p-4 border-2 border-amber-200">
                      <div className="flex items-center gap-2 text-amber-700 text-sm font-semibold mb-2">
                        <AlertCircle className="w-5 h-5" />
                        <span>ملاحظات المراجعة</span>
                      </div>
                      <p className="text-amber-900 text-sm bg-white p-3 rounded-lg border border-amber-200">
                        {selectedRequest.reviewNotes}
                      </p>
                    </div>
                  )}

                  {/* Action Section for Pending */}
                  {selectedRequest.status === 'pending' && (
                    <div className="space-y-4 pt-6 border-t-2 border-gray-100">
                      <div className="bg-gradient-to-r from-red-50 to-rose-50 rounded-xl p-4 border border-red-100">
                        <h3 className="text-gray-800 font-semibold mb-3 flex items-center gap-2">
                          <Stethoscope className="w-5 h-5 text-red-600" />
                          قرار المراجعة
                        </h3>
                      
                      <div className="flex flex-col sm:flex-row gap-3">
                        <button
                          onClick={() => {
                            if (confirm('هل أنت متأكد من الموافقة على هذا الطلب؟')) {
                              handleApprove(selectedRequest._id);
                            }
                          }}
                          className="flex-1 bg-gradient-to-r from-emerald-500 to-green-600 text-white py-3.5 rounded-xl font-semibold hover:shadow-lg hover:shadow-emerald-200 transition-all flex items-center justify-center gap-2 group"
                        >
                          <Check className="w-5 h-5 group-hover:scale-110 transition-transform" />
                          <span>قبول الطلب</span>
                        </button>
                        <button
                          onClick={() => {
                            setShowRejectModal(true);
                            setRejectReason('');
                          }}
                          className="flex-1 bg-gradient-to-r from-rose-500 to-red-600 text-white py-3.5 rounded-xl font-semibold hover:shadow-lg hover:shadow-rose-200 transition-all flex items-center justify-center gap-2 group"
                        >
                          <X className="w-5 h-5 group-hover:scale-110 transition-transform" />
                          <span>رفض الطلب</span>
                        </button>
                      </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Users Management Section */}
        {activeTab === 'users' && (
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
            {/* Toolbar */}
            <div className="p-4 border-b border-gray-100">
              <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
                {/* Search */}
                <div className="relative w-full sm:w-80">
                  <Search className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <input
                    type="text"
                    placeholder="بحث بالاسم، البريد، أو رقم الهاتف..."
                    value={userSearchTerm}
                    onChange={(e) => setUserSearchTerm(e.target.value)}
                    className="w-full pr-10 pl-4 py-2.5 bg-gray-50 border-0 rounded-xl text-sm focus:ring-2 focus:ring-red-500 focus:bg-white transition-all"
                  />
                </div>

                {/* Filter */}
                <div className="flex gap-2">
                  {['all', 'user', 'doctor', 'admin'].map((role) => (
                    <button
                      key={role}
                      onClick={() => setUserFilterRole(role)}
                      className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                        userFilterRole === role
                          ? 'bg-red-600 text-white shadow-md'
                          : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                      }`}
                    >
                      {role === 'all' ? 'الكل' : role === 'user' ? 'مستخدمين' : role === 'doctor' ? 'أطباء' : 'مسؤولين'}
                    </button>
                  ))}
                </div>
              </div>
                </div>

            {/* Users List */}
            <div className="divide-y divide-gray-50">
              {usersLoading ? (
                <div className="p-12 text-center">
                  <div className="w-10 h-10 border-2 border-red-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
                  <p className="text-gray-500">جاري التحميل...</p>
                </div>
              ) : users.length === 0 ? (
                <div className="p-12 text-center">
                  <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Users className="w-8 h-8 text-gray-400" />
                  </div>
                  <p className="text-gray-500 font-medium">لا يوجد مستخدمين</p>
                  <p className="text-gray-400 text-sm mt-1">لم يتم العثور على مستخدمين مطابقين</p>
                </div>
              ) : (
                users.map((user) => (
                  <div key={user._id} className="p-4 hover:bg-gray-50/50 transition-colors">
                    <div className="flex items-center gap-4">
                      {/* Avatar */}
                      <div className={`w-12 h-12 rounded-full flex items-center justify-center text-white font-bold text-lg flex-shrink-0 ${
                        user.role === 'admin' ? 'bg-gradient-to-br from-red-500 to-rose-600' :
                        user.role === 'doctor' ? 'bg-gradient-to-br from-emerald-500 to-green-600' :
                        'bg-gradient-to-br from-blue-500 to-blue-600'
                      }`}>
                        {user.name.charAt(0)}
                      </div>
                      
                      {/* Info */}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1">
                          <h3 className="font-semibold text-gray-900 truncate">{user.name}</h3>
                          <span className={`px-2 py-0.5 rounded-full text-xs font-semibold ${
                            user.role === 'admin' ? 'bg-red-100 text-red-700' :
                            user.role === 'doctor' ? 'bg-emerald-100 text-emerald-700' :
                            'bg-blue-100 text-blue-700'
                          }`}>
                            {user.role === 'admin' ? 'مسؤول' : user.role === 'doctor' ? 'طبيب' : 'مستخدم'}
                          </span>
                        </div>
                        <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-sm text-gray-500">
                          <span className="flex items-center gap-1">
                            <Mail className="w-3.5 h-3.5" />
                            {user.email}
                          </span>
                          {user.phone && (
                            <span className="flex items-center gap-1">
                              <Phone className="w-3.5 h-3.5" />
                              {user.phone}
                            </span>
                          )}
                          <span className="flex items-center gap-1">
                            <Calendar className="w-3.5 h-3.5" />
                            {new Date(user.createdAt).toLocaleDateString('ar-EG')}
                          </span>
                        </div>
                </div>

                      {/* Actions */}
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => setSelectedUser(user)}
                          className="w-10 h-10 bg-blue-50 hover:bg-blue-100 rounded-xl flex items-center justify-center text-blue-600 hover:text-blue-700 transition-colors flex-shrink-0"
                          title="عرض التفاصيل"
                        >
                          <Eye className="w-5 h-5" />
                        </button>
                        {user.role !== 'admin' && (
                          <button
                            onClick={() => handleDeleteUser(user._id, user.name)}
                            disabled={deletingUserId === user._id}
                            className="w-10 h-10 bg-red-50 hover:bg-red-100 rounded-xl flex items-center justify-center text-red-600 hover:text-red-700 transition-colors flex-shrink-0 disabled:opacity-50"
                            title="حذف المستخدم"
                          >
                            {deletingUserId === user._id ? (
                              <div className="w-5 h-5 border-2 border-red-600 border-t-transparent rounded-full animate-spin"></div>
                            ) : (
                              <Trash2 className="w-5 h-5" />
                            )}
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
                  </div>
                )}

        {/* User Details Modal */}
        {selectedUser && activeTab === 'users' && (
          <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-fadeIn">
            <div className="bg-white rounded-3xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-hidden transform scale-95 animate-scaleIn">
              
              {/* Modal Header */}
              <div className={`p-6 text-white relative overflow-hidden ${
                selectedUser.role === 'admin' ? 'bg-gradient-to-r from-red-500 via-red-600 to-rose-600' :
                selectedUser.role === 'doctor' ? 'bg-gradient-to-r from-emerald-500 via-green-600 to-teal-600' :
                'bg-gradient-to-r from-blue-500 via-blue-600 to-indigo-600'
              }`}>
                {/* Decorative Elements */}
                <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -mr-16 -mt-16"></div>
                <div className="absolute bottom-0 left-0 w-24 h-24 bg-white/10 rounded-full -ml-12 -mb-12"></div>
                
                <div className="flex items-start justify-between relative z-10">
                  <div className="flex items-center gap-4">
                    <div className={`w-20 h-20 bg-white/20 backdrop-blur-sm rounded-2xl flex items-center justify-center text-2xl font-bold shadow-lg ${
                      selectedUser.role === 'admin' ? 'text-white' :
                      selectedUser.role === 'doctor' ? 'text-white' :
                      'text-white'
                    }`}>
                      {selectedUser.name.charAt(0)}
                    </div>
                <div>
                      <h2 className="text-2xl font-bold mb-1">{selectedUser.name}</h2>
                      <div className="flex items-center gap-2">
                        {selectedUser.role === 'admin' && <Shield className="w-4 h-4 text-white/80" />}
                        {selectedUser.role === 'doctor' && <Stethoscope className="w-4 h-4 text-white/80" />}
                        {selectedUser.role === 'user' && <UserCircle className="w-4 h-4 text-white/80" />}
                        <p className="text-white/90 text-sm">
                          {selectedUser.role === 'admin' ? 'مسؤول' : selectedUser.role === 'doctor' ? 'طبيب' : 'مستخدم'}
                        </p>
                      </div>
                    </div>
                  </div>
                  <button
                    onClick={() => setSelectedUser(null)}
                    className="w-10 h-10 bg-white/20 hover:bg-white/30 rounded-xl flex items-center justify-center transition-all hover:scale-110"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>
              </div>

              {/* Modal Body */}
              <div className="p-6 overflow-y-auto max-h-[calc(90vh-200px)]">
                <div className="space-y-5">
                  
                  {/* Info Cards Grid */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className={`rounded-xl p-4 border ${
                      selectedUser.role === 'admin' ? 'bg-red-50 border-red-100' :
                      selectedUser.role === 'doctor' ? 'bg-emerald-50 border-emerald-100' :
                      'bg-blue-50 border-blue-100'
                    }`}>
                      <div className={`flex items-center gap-2 text-xs mb-2 ${
                        selectedUser.role === 'admin' ? 'text-red-600' :
                        selectedUser.role === 'doctor' ? 'text-emerald-600' :
                        'text-blue-600'
                      }`}>
                        <Mail className="w-4 h-4" />
                        <span className="font-medium">البريد الإلكتروني</span>
                      </div>
                      <p className="text-gray-900 font-semibold text-sm">{selectedUser.email}</p>
                    </div>

                    {selectedUser.phone && (
                      <div className={`rounded-xl p-4 border ${
                        selectedUser.role === 'admin' ? 'bg-red-50 border-red-100' :
                        selectedUser.role === 'doctor' ? 'bg-emerald-50 border-emerald-100' :
                        'bg-blue-50 border-blue-100'
                      }`}>
                        <div className={`flex items-center gap-2 text-xs mb-2 ${
                          selectedUser.role === 'admin' ? 'text-red-600' :
                          selectedUser.role === 'doctor' ? 'text-emerald-600' :
                          'text-blue-600'
                        }`}>
                          <Phone className="w-4 h-4" />
                          <span className="font-medium">رقم الهاتف</span>
                        </div>
                        <p className="text-gray-900 font-semibold text-sm">{selectedUser.phone}</p>
                      </div>
                    )}

                    <div className={`rounded-xl p-4 border ${
                      selectedUser.role === 'admin' ? 'bg-red-50 border-red-100' :
                      selectedUser.role === 'doctor' ? 'bg-emerald-50 border-emerald-100' :
                      'bg-blue-50 border-blue-100'
                    }`}>
                      <div className={`flex items-center gap-2 text-xs mb-2 ${
                        selectedUser.role === 'admin' ? 'text-red-600' :
                        selectedUser.role === 'doctor' ? 'text-emerald-600' :
                        'text-blue-600'
                      }`}>
                        <Calendar className="w-4 h-4" />
                        <span className="font-medium">تاريخ التسجيل</span>
                      </div>
                      <p className="text-gray-900 font-semibold text-sm">
                        {new Date(selectedUser.createdAt).toLocaleDateString('ar-EG', {
                          year: 'numeric',
                          month: 'long',
                          day: 'numeric'
                        })}
                      </p>
                </div>

                    <div className={`rounded-xl p-4 border ${
                      selectedUser.role === 'admin' ? 'bg-red-50 border-red-100' :
                      selectedUser.role === 'doctor' ? 'bg-emerald-50 border-emerald-100' :
                      'bg-blue-50 border-blue-100'
                    }`}>
                      <div className={`flex items-center gap-2 text-xs mb-2 ${
                        selectedUser.role === 'admin' ? 'text-red-600' :
                        selectedUser.role === 'doctor' ? 'text-emerald-600' :
                        'text-blue-600'
                      }`}>
                        <UserCog className="w-4 h-4" />
                        <span className="font-medium">نوع الحساب</span>
                      </div>
                      <p className="text-gray-900 font-semibold text-sm">
                        {selectedUser.role === 'admin' ? 'مسؤول' : selectedUser.role === 'doctor' ? 'طبيب' : 'مستخدم عادي'}
                      </p>
                    </div>
                </div>

                  {/* Role Badge */}
                  <div className={`rounded-xl p-4 border-2 ${
                    selectedUser.role === 'admin' ? 'bg-red-50 border-red-200' :
                    selectedUser.role === 'doctor' ? 'bg-emerald-50 border-emerald-200' :
                    'bg-blue-50 border-blue-200'
                  }`}>
                    <div className="flex items-center gap-3">
                      {selectedUser.role === 'admin' && (
                        <>
                          <div className="w-12 h-12 bg-red-100 rounded-xl flex items-center justify-center">
                            <Shield className="w-6 h-6 text-red-600" />
                          </div>
                          <div>
                            <h3 className="font-bold text-red-800 mb-1">حساب مسؤول</h3>
                            <p className="text-red-700 text-sm">هذا المستخدم لديه صلاحيات كاملة لإدارة المنصة</p>
                          </div>
                        </>
                      )}

                      {selectedUser.role === 'doctor' && (
                        <>
                          <div className="w-12 h-12 bg-emerald-100 rounded-xl flex items-center justify-center">
                            <Stethoscope className="w-6 h-6 text-emerald-600" />
                          </div>
                          <div>
                            <h3 className="font-bold text-emerald-800 mb-1">حساب طبيب</h3>
                            <p className="text-emerald-700 text-sm">هذا المستخدم طبيب معتمد ويمكنه الرد على الاستشارات الطبية</p>
                          </div>
                        </>
                      )}

                      {selectedUser.role === 'user' && (
                        <>
                          <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center">
                            <UserCircle className="w-6 h-6 text-blue-600" />
                          </div>
                    <div>
                            <h3 className="font-bold text-blue-800 mb-1">مستخدم عادي</h3>
                            <p className="text-blue-700 text-sm">هذا المستخدم يمكنه إرسال استشارات طبية وطلب إنشاء حساب طبيب</p>
                          </div>
                        </>
                      )}
                    </div>
                    </div>

                  {/* Actions */}
                  <div className="flex gap-3 pt-4 border-t border-gray-100">
                      <button
                      onClick={() => setSelectedUser(null)}
                      className="flex-1 bg-gray-100 text-gray-700 py-3 rounded-xl font-semibold hover:bg-gray-200 transition-all"
                      >
                      إغلاق
                      </button>
                    {selectedUser.role !== 'admin' && (
                      <button
                        onClick={() => {
                          setSelectedUser(null);
                          handleDeleteUser(selectedUser._id, selectedUser.name);
                        }}
                        className="flex-1 bg-gradient-to-r from-rose-500 to-red-600 text-white py-3 rounded-xl font-semibold hover:shadow-lg hover:shadow-rose-200 transition-all flex items-center justify-center gap-2"
                      >
                        <Trash2 className="w-5 h-5" />
                        حذف المستخدم
                      </button>
                )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Reports Tab */}
        {activeTab === 'reports' && (
          <div>
            {/* Stats Grid for Reports */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
              <StatCard
                icon={AlertTriangle}
                label="إجمالي الشكاوى"
                value={reportStats.total}
                color="bg-gradient-to-br from-orange-500 to-red-600"
                bgColor="bg-orange-50"
              />
              <StatCard
                icon={Clock}
                label="قيد الانتظار"
                value={reportStats.pending}
                color="bg-gradient-to-br from-yellow-500 to-amber-600"
                bgColor="bg-yellow-50"
              />
              <StatCard
                icon={FileText}
                label="قيد المعالجة"
                value={reportStats.inProgress}
                color="bg-gradient-to-br from-blue-500 to-indigo-600"
                bgColor="bg-blue-50"
              />
              <StatCard
                icon={Check}
                label="تم الحل"
                value={reportStats.resolved}
                color="bg-gradient-to-br from-emerald-500 to-green-600"
                bgColor="bg-emerald-50"
              />
            </div>

            {/* Reports List */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
              {/* Toolbar */}
              <div className="p-4 border-b border-gray-100">
                <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
                  <div className="relative w-full sm:w-80">
                    <Search className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <input
                      type="text"
                      placeholder="بحث بالعنوان أو الوصف..."
                      value={reportSearchTerm}
                      onChange={(e) => setReportSearchTerm(e.target.value)}
                      className="w-full pr-10 pl-4 py-2.5 bg-gray-50 border-0 rounded-xl text-sm focus:ring-2 focus:ring-red-500 focus:bg-white transition-all"
                    />
                  </div>
                  <div className="relative">
                    <select
                      value={reportFilterStatus}
                      onChange={(e) => setReportFilterStatus(e.target.value)}
                      className="appearance-none w-full sm:w-auto px-4 py-2.5 bg-gray-50 border-0 rounded-xl text-sm font-medium text-gray-700 focus:ring-2 focus:ring-red-500 focus:bg-white transition-all pr-10"
                    >
                      <option value="all">جميع الحالات</option>
                      <option value="pending">قيد الانتظار</option>
                      <option value="in-progress">قيد المعالجة</option>
                      <option value="resolved">تم الحل</option>
                      <option value="cancelled">ملغاة</option>
                    </select>
                    <ChevronDown className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
                  </div>
                </div>
              </div>

              {/* Reports List */}
              <div className="divide-y divide-gray-50">
                {reportsLoading ? (
                  <div className="p-12 text-center">
                    <div className="w-10 h-10 border-2 border-red-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
                    <p className="text-gray-500">جاري التحميل...</p>
                  </div>
                ) : reports.length === 0 ? (
                  <div className="p-12 text-center">
                    <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                      <AlertTriangle className="w-8 h-8 text-gray-400" />
                    </div>
                    <p className="text-gray-500 font-medium">لا توجد شكاوى</p>
                    <p className="text-gray-400 text-sm mt-1">لم يتم العثور على شكاوى مطابقة</p>
                  </div>
                ) : (
                  reports.map((report) => (
                    <div key={report._id} className="p-4 hover:bg-gray-50/50 transition-colors">
                      <div className="flex items-center gap-4">
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 mb-1">
                            <h3 className="font-semibold text-gray-900 truncate">{report.title}</h3>
                            <span className={`px-2 py-0.5 rounded-full text-xs font-semibold ${
                              report.status === 'pending' ? 'bg-yellow-100 text-yellow-700' :
                              report.status === 'in-progress' ? 'bg-blue-100 text-blue-700' :
                              report.status === 'resolved' ? 'bg-emerald-100 text-emerald-700' :
                              'bg-gray-100 text-gray-700'
                            }`}>
                              {report.status === 'pending' ? 'قيد الانتظار' :
                               report.status === 'in-progress' ? 'قيد المعالجة' :
                               report.status === 'resolved' ? 'تم الحل' : 'ملغاة'}
                            </span>
                            <span className={`px-2 py-0.5 rounded-full text-xs font-semibold ${
                              report.urgency === 'critical' ? 'bg-red-100 text-red-700' :
                              report.urgency === 'high' ? 'bg-orange-100 text-orange-700' :
                              report.urgency === 'medium' ? 'bg-yellow-100 text-yellow-700' :
                              'bg-gray-100 text-gray-700'
                            }`}>
                              {report.urgency === 'critical' ? 'حرج' :
                               report.urgency === 'high' ? 'عالي' :
                               report.urgency === 'medium' ? 'متوسط' : 'منخفض'}
                            </span>
                          </div>
                          <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-sm text-gray-500">
                            <span className="flex items-center gap-1">
                              <UserCircle className="w-3.5 h-3.5" />
                              {report.reporterName}
                            </span>
                            {report.reporterPhone && (
                              <span className="flex items-center gap-1">
                                <Phone className="w-3.5 h-3.5" />
                                {report.reporterPhone}
                              </span>
                            )}
                            {report.address && (
                              <span className="flex items-center gap-1">
                                <MapPin className="w-3.5 h-3.5" />
                                {report.address.substring(0, 30)}...
                              </span>
                            )}
                            <span className="flex items-center gap-1">
                              <Calendar className="w-3.5 h-3.5" />
                              {new Date(report.createdAt).toLocaleDateString('ar-EG')}
                            </span>
                          </div>
                          <p className="text-gray-600 text-sm mt-2 line-clamp-2">{report.description}</p>
                        </div>
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => setSelectedReport(report)}
                            className="w-10 h-10 bg-blue-50 hover:bg-blue-100 rounded-xl flex items-center justify-center text-blue-600 hover:text-blue-700 transition-colors flex-shrink-0"
                            title="عرض التفاصيل"
                          >
                            <Eye className="w-5 h-5" />
                          </button>
                          <button
                            onClick={() => handleDeleteReport(report._id)}
                            disabled={deletingReportId === report._id}
                            className="w-10 h-10 bg-red-50 hover:bg-red-100 rounded-xl flex items-center justify-center text-red-600 hover:text-red-700 transition-colors flex-shrink-0 disabled:opacity-50"
                            title="حذف الشكوى"
                          >
                            {deletingReportId === report._id ? (
                              <div className="w-5 h-5 border-2 border-red-600 border-t-transparent rounded-full animate-spin"></div>
                            ) : (
                              <Trash2 className="w-5 h-5" />
                            )}
                          </button>
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>
        )}

        {/* Contacts Tab */}
        {activeTab === 'contacts' && (
          <div>
            {/* Stats Grid for Contacts */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
              <StatCard
                icon={MessageCircle}
                label="إجمالي الرسائل"
                value={contactStats.total}
                color="bg-gradient-to-br from-purple-500 to-indigo-600"
                bgColor="bg-purple-50"
              />
              <StatCard
                icon={Clock}
                label="جديدة"
                value={contactStats.new}
                color="bg-gradient-to-br from-blue-500 to-cyan-600"
                bgColor="bg-blue-50"
              />
              <StatCard
                icon={Eye}
                label="مقروءة"
                value={contactStats.read}
                color="bg-gradient-to-br from-gray-500 to-slate-600"
                bgColor="bg-gray-50"
              />
              <StatCard
                icon={Check}
                label="تم الرد"
                value={contactStats.replied}
                color="bg-gradient-to-br from-emerald-500 to-green-600"
                bgColor="bg-emerald-50"
              />
            </div>

            {/* Contacts List */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
              {/* Toolbar */}
              <div className="p-4 border-b border-gray-100">
                <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
                  <div className="relative w-full sm:w-80">
                    <Search className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <input
                      type="text"
                      placeholder="بحث بالاسم أو البريد أو الموضوع..."
                      value={contactSearchTerm}
                      onChange={(e) => setContactSearchTerm(e.target.value)}
                      className="w-full pr-10 pl-4 py-2.5 bg-gray-50 border-0 rounded-xl text-sm focus:ring-2 focus:ring-red-500 focus:bg-white transition-all"
                    />
                  </div>
                  <div className="relative">
                    <select
                      value={contactFilterStatus}
                      onChange={(e) => setContactFilterStatus(e.target.value)}
                      className="appearance-none w-full sm:w-auto px-4 py-2.5 bg-gray-50 border-0 rounded-xl text-sm font-medium text-gray-700 focus:ring-2 focus:ring-red-500 focus:bg-white transition-all pr-10"
                    >
                      <option value="all">جميع الحالات</option>
                      <option value="new">جديدة</option>
                      <option value="read">مقروءة</option>
                      <option value="replied">تم الرد</option>
                      <option value="archived">مؤرشفة</option>
                    </select>
                    <ChevronDown className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
                  </div>
                </div>
              </div>

              {/* Contacts List */}
              <div className="divide-y divide-gray-50">
                {contactsLoading ? (
                  <div className="p-12 text-center">
                    <div className="w-10 h-10 border-2 border-red-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
                    <p className="text-gray-500">جاري التحميل...</p>
                  </div>
                ) : contacts.length === 0 ? (
                  <div className="p-12 text-center">
                    <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                      <MessageCircle className="w-8 h-8 text-gray-400" />
                    </div>
                    <p className="text-gray-500 font-medium">لا توجد رسائل</p>
                    <p className="text-gray-400 text-sm mt-1">لم يتم العثور على رسائل مطابقة</p>
                  </div>
                ) : (
                  contacts.map((contact) => (
                    <div key={contact._id} className="p-4 hover:bg-gray-50/50 transition-colors">
                      <div className="flex items-center gap-4">
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 mb-1">
                            <h3 className="font-semibold text-gray-900 truncate">{contact.subject}</h3>
                            <span className={`px-2 py-0.5 rounded-full text-xs font-semibold ${
                              contact.status === 'new' ? 'bg-blue-100 text-blue-700' :
                              contact.status === 'read' ? 'bg-gray-100 text-gray-700' :
                              contact.status === 'replied' ? 'bg-emerald-100 text-emerald-700' :
                              'bg-yellow-100 text-yellow-700'
                            }`}>
                              {contact.status === 'new' ? 'جديدة' :
                               contact.status === 'read' ? 'مقروءة' :
                               contact.status === 'replied' ? 'تم الرد' : 'مؤرشفة'}
                            </span>
                            {contact.priority && (
                              <span className={`px-2 py-0.5 rounded-full text-xs font-semibold ${
                                contact.priority === 'high' ? 'bg-red-100 text-red-700' :
                                contact.priority === 'medium' ? 'bg-yellow-100 text-yellow-700' :
                                'bg-gray-100 text-gray-700'
                              }`}>
                                {contact.priority === 'high' ? 'عالي' :
                                 contact.priority === 'medium' ? 'متوسط' : 'منخفض'}
                              </span>
                            )}
                          </div>
                          <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-sm text-gray-500">
                            <span className="flex items-center gap-1">
                              <UserCircle className="w-3.5 h-3.5" />
                              {contact.name}
                            </span>
                            <span className="flex items-center gap-1">
                              <Mail className="w-3.5 h-3.5" />
                              {contact.email}
                            </span>
                            {contact.phone && (
                              <span className="flex items-center gap-1">
                                <Phone className="w-3.5 h-3.5" />
                                {contact.phone}
                              </span>
                            )}
                            <span className="flex items-center gap-1">
                              <Calendar className="w-3.5 h-3.5" />
                              {new Date(contact.createdAt).toLocaleDateString('ar-EG')}
                            </span>
                          </div>
                          <p className="text-gray-600 text-sm mt-2 line-clamp-2">{contact.message}</p>
                        </div>
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => setSelectedContact(contact)}
                            className="w-10 h-10 bg-blue-50 hover:bg-blue-100 rounded-xl flex items-center justify-center text-blue-600 hover:text-blue-700 transition-colors flex-shrink-0"
                            title="عرض التفاصيل"
                          >
                            <Eye className="w-5 h-5" />
                          </button>
                          <button
                            onClick={() => handleDeleteContact(contact._id)}
                            disabled={deletingContactId === contact._id}
                            className="w-10 h-10 bg-red-50 hover:bg-red-100 rounded-xl flex items-center justify-center text-red-600 hover:text-red-700 transition-colors flex-shrink-0 disabled:opacity-50"
                            title="حذف الرسالة"
                          >
                            {deletingContactId === contact._id ? (
                              <div className="w-5 h-5 border-2 border-red-600 border-t-transparent rounded-full animate-spin"></div>
                            ) : (
                              <Trash2 className="w-5 h-5" />
                            )}
                          </button>
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>
        )}

        {/* Report Details Modal */}
        {selectedReport && activeTab === 'reports' && (
          <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-fadeIn">
            <div className="bg-white rounded-3xl shadow-2xl w-full max-w-3xl max-h-[90vh] overflow-hidden transform scale-95 animate-scaleIn">
              {/* Modal Header */}
              <div className="bg-gradient-to-r from-orange-500 via-red-600 to-rose-600 p-6 text-white relative overflow-hidden">
                <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -mr-16 -mt-16"></div>
                <div className="absolute bottom-0 left-0 w-24 h-24 bg-white/10 rounded-full -ml-12 -mb-12"></div>
                <div className="flex items-start justify-between relative z-10">
                  <div>
                    <h2 className="text-2xl font-bold mb-2">{selectedReport.title}</h2>
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="px-3 py-1 bg-white/20 rounded-lg text-sm">
                        {selectedReport.type === 'accident' ? 'حادث' :
                         selectedReport.type === 'crime' ? 'جريمة' :
                         selectedReport.type === 'health' ? 'صحة' :
                         selectedReport.type === 'missing' ? 'مفقود' : 'مساعدة'}
                      </span>
                      <span className={`px-3 py-1 rounded-lg text-sm ${
                        selectedReport.status === 'pending' ? 'bg-yellow-500/30' :
                        selectedReport.status === 'in-progress' ? 'bg-blue-500/30' :
                        selectedReport.status === 'resolved' ? 'bg-emerald-500/30' :
                        'bg-gray-500/30'
                      }`}>
                        {selectedReport.status === 'pending' ? 'قيد الانتظار' :
                         selectedReport.status === 'in-progress' ? 'قيد المعالجة' :
                         selectedReport.status === 'resolved' ? 'تم الحل' : 'ملغاة'}
                      </span>
                    </div>
                  </div>
                  <button
                    onClick={() => setSelectedReport(null)}
                    className="w-10 h-10 bg-white/20 hover:bg-white/30 rounded-xl flex items-center justify-center transition-all hover:scale-110"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>
              </div>

              {/* Modal Body */}
              <div className="p-6 overflow-y-auto max-h-[calc(90vh-200px)]">
                <div className="space-y-5">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="bg-gray-50 rounded-xl p-4">
                      <div className="flex items-center gap-2 text-xs text-gray-600 mb-2">
                        <UserCircle className="w-4 h-4" />
                        <span className="font-medium">المبلغ</span>
                      </div>
                      <p className="text-gray-900 font-semibold">{selectedReport.reporterName}</p>
                    </div>
                    {selectedReport.reporterPhone && (
                      <div className="bg-gray-50 rounded-xl p-4">
                        <div className="flex items-center gap-2 text-xs text-gray-600 mb-2">
                          <Phone className="w-4 h-4" />
                          <span className="font-medium">رقم الهاتف</span>
                        </div>
                        <p className="text-gray-900 font-semibold">{selectedReport.reporterPhone}</p>
                      </div>
                    )}
                    {selectedReport.address && (
                      <div className="bg-gray-50 rounded-xl p-4 sm:col-span-2">
                        <div className="flex items-center gap-2 text-xs text-gray-600 mb-2">
                          <MapPin className="w-4 h-4" />
                          <span className="font-medium">العنوان</span>
                        </div>
                        <p className="text-gray-900 font-semibold">{selectedReport.address}</p>
                      </div>
                    )}
                    <div className="bg-gray-50 rounded-xl p-4">
                      <div className="flex items-center gap-2 text-xs text-gray-600 mb-2">
                        <Calendar className="w-4 h-4" />
                        <span className="font-medium">التاريخ</span>
                      </div>
                      <p className="text-gray-900 font-semibold">
                        {new Date(selectedReport.createdAt).toLocaleDateString('ar-EG', {
                          year: 'numeric',
                          month: 'long',
                          day: 'numeric',
                          hour: '2-digit',
                          minute: '2-digit'
                        })}
                      </p>
                    </div>
                  </div>

                  <div className="bg-orange-50 border border-orange-200 rounded-xl p-4">
                    <h3 className="font-bold text-orange-800 mb-2">وصف الشكوى</h3>
                    <p className="text-orange-900 leading-relaxed">{selectedReport.description}</p>
                  </div>

                  <div className="flex gap-3 pt-4 border-t border-gray-100">
                    <button
                      onClick={() => setSelectedReport(null)}
                      className="flex-1 bg-gray-100 text-gray-700 py-3 rounded-xl font-semibold hover:bg-gray-200 transition-all"
                    >
                      إغلاق
                    </button>
                    <button
                      onClick={() => {
                        setSelectedReport(null);
                        handleDeleteReport(selectedReport._id);
                      }}
                      className="flex-1 bg-gradient-to-r from-rose-500 to-red-600 text-white py-3 rounded-xl font-semibold hover:shadow-lg hover:shadow-rose-200 transition-all flex items-center justify-center gap-2"
                    >
                      <Trash2 className="w-5 h-5" />
                      حذف الشكوى
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Contact Details Modal */}
        {selectedContact && activeTab === 'contacts' && (
          <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-fadeIn">
            <div className="bg-white rounded-3xl shadow-2xl w-full max-w-3xl max-h-[90vh] overflow-hidden transform scale-95 animate-scaleIn">
              {/* Modal Header */}
              <div className="bg-gradient-to-r from-purple-500 via-indigo-600 to-blue-600 p-6 text-white relative overflow-hidden">
                <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -mr-16 -mt-16"></div>
                <div className="absolute bottom-0 left-0 w-24 h-24 bg-white/10 rounded-full -ml-12 -mb-12"></div>
                <div className="flex items-start justify-between relative z-10">
                  <div>
                    <h2 className="text-2xl font-bold mb-2">{selectedContact.subject}</h2>
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className={`px-3 py-1 rounded-lg text-sm ${
                        selectedContact.status === 'new' ? 'bg-blue-500/30' :
                        selectedContact.status === 'read' ? 'bg-gray-500/30' :
                        selectedContact.status === 'replied' ? 'bg-emerald-500/30' :
                        'bg-yellow-500/30'
                      }`}>
                        {selectedContact.status === 'new' ? 'جديدة' :
                         selectedContact.status === 'read' ? 'مقروءة' :
                         selectedContact.status === 'replied' ? 'تم الرد' : 'مؤرشفة'}
                      </span>
                    </div>
                  </div>
                  <button
                    onClick={() => setSelectedContact(null)}
                    className="w-10 h-10 bg-white/20 hover:bg-white/30 rounded-xl flex items-center justify-center transition-all hover:scale-110"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>
              </div>

              {/* Modal Body */}
              <div className="p-6 overflow-y-auto max-h-[calc(90vh-200px)]">
                <div className="space-y-5">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="bg-gray-50 rounded-xl p-4">
                      <div className="flex items-center gap-2 text-xs text-gray-600 mb-2">
                        <UserCircle className="w-4 h-4" />
                        <span className="font-medium">الاسم</span>
                      </div>
                      <p className="text-gray-900 font-semibold">{selectedContact.name}</p>
                    </div>
                    <div className="bg-gray-50 rounded-xl p-4">
                      <div className="flex items-center gap-2 text-xs text-gray-600 mb-2">
                        <Mail className="w-4 h-4" />
                        <span className="font-medium">البريد الإلكتروني</span>
                      </div>
                      <p className="text-gray-900 font-semibold">{selectedContact.email}</p>
                    </div>
                    {selectedContact.phone && (
                      <div className="bg-gray-50 rounded-xl p-4">
                        <div className="flex items-center gap-2 text-xs text-gray-600 mb-2">
                          <Phone className="w-4 h-4" />
                          <span className="font-medium">رقم الهاتف</span>
                        </div>
                        <p className="text-gray-900 font-semibold">{selectedContact.phone}</p>
                      </div>
                    )}
                    <div className="bg-gray-50 rounded-xl p-4">
                      <div className="flex items-center gap-2 text-xs text-gray-600 mb-2">
                        <Calendar className="w-4 h-4" />
                        <span className="font-medium">التاريخ</span>
                      </div>
                      <p className="text-gray-900 font-semibold">
                        {new Date(selectedContact.createdAt).toLocaleDateString('ar-EG', {
                          year: 'numeric',
                          month: 'long',
                          day: 'numeric',
                          hour: '2-digit',
                          minute: '2-digit'
                        })}
                      </p>
                    </div>
                  </div>

                  <div className="bg-purple-50 border border-purple-200 rounded-xl p-4">
                    <h3 className="font-bold text-purple-800 mb-2">الرسالة</h3>
                    <p className="text-purple-900 leading-relaxed whitespace-pre-wrap">{selectedContact.message}</p>
                  </div>

                  {/* Reply Section */}
                  {selectedContact.status !== 'replied' && (
                    <div className="bg-blue-50 border border-blue-200 rounded-xl p-4">
                      <h3 className="font-bold text-blue-800 mb-3">الرد على الرسالة</h3>
                      <textarea
                        value={replyMessage}
                        onChange={(e) => setReplyMessage(e.target.value)}
                        rows={4}
                        placeholder="اكتب ردك هنا..."
                        className="w-full px-4 py-3 bg-white border border-blue-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 resize-none mb-3"
                      />
                      <button
                        onClick={() => handleSendReply(selectedContact._id)}
                        disabled={sendingReply || !replyMessage.trim()}
                        className="w-full bg-gradient-to-r from-blue-500 to-indigo-600 text-white py-3 rounded-xl font-semibold hover:shadow-lg hover:shadow-blue-200 transition-all disabled:opacity-50 flex items-center justify-center gap-2"
                      >
                        {sendingReply ? (
                          <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                        ) : (
                          <>
                            <MessageCircle className="w-5 h-5" />
                            إرسال الرد
                          </>
                        )}
                      </button>
                    </div>
                  )}

                  <div className="flex gap-3 pt-4 border-t border-gray-100">
                    <button
                      onClick={() => {
                        setSelectedContact(null);
                        setReplyMessage('');
                      }}
                      className="flex-1 bg-gray-100 text-gray-700 py-3 rounded-xl font-semibold hover:bg-gray-200 transition-all"
                    >
                      إغلاق
                    </button>
                    <button
                      onClick={() => {
                        setSelectedContact(null);
                        handleDeleteContact(selectedContact._id);
                      }}
                      className="flex-1 bg-gradient-to-r from-rose-500 to-red-600 text-white py-3 rounded-xl font-semibold hover:shadow-lg hover:shadow-rose-200 transition-all flex items-center justify-center gap-2"
                    >
                      <Trash2 className="w-5 h-5" />
                      حذف الرسالة
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminDashboard;
