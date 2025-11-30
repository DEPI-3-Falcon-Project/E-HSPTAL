import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./hooks/useAuth";
import Header from "./components/Header";
import ProtectedRoute from "./components/ProtectedRoute";
import HomePage from "./pages/home-page/client/src/pages/HomePage";
import DashboardPage from "./pages/contact-Dashboard-page/DashboardPage";
import ContactPage from "./pages/contact-Dashboard-page/ContactPage";
import FirstAid from "./pages/first-aid-page/FirstAid";
import NotesPage from "./pages/notes-page/notes.jsx";
import ReportPage from "./pages/Report Page/HomePageReports";
import ReportFormPage from "./pages/Report Page/ReportFormPage";
import FloatingEmergencyButton from "./components/FloatingEmergencyButton";
import SafetyPage from "./pages/safty-page/safety.jsx";
import MainFooter from "./components/footer";
import RegisterPage from "./pages/RegisterPage";
import LoginPage from "./pages/LoginPage";
import DoctorRequestPage from "./pages/DoctorRequestPage";
import AdminDashboard from "./pages/AdminDashboard";
import ConsultationPage from "./pages/ConsultationPage";

function App() {
  return (
    <AuthProvider>
      <Router>
        <div className="min-h-screen bg-linear-to-br from-red-50 to-white">
          <Header />
          <Routes>
            {/* Public Routes - لا تحتاج تسجيل دخول */}
            <Route path="/" element={<HomePage />} />
            <Route path="/home" element={<HomePage />} />
            <Route path="/register" element={<RegisterPage />} />
            <Route path="/login" element={<LoginPage />} />
            
            {/* Protected Routes - تحتاج تسجيل دخول */}
            <Route path="/dashboard" element={
              <ProtectedRoute>
                <DashboardPage />
              </ProtectedRoute>
            } />
            <Route path="/notes" element={
              <ProtectedRoute>
                <NotesPage />
              </ProtectedRoute>
            } />
            <Route path="/first-aid" element={
              <ProtectedRoute>
                <FirstAid />
              </ProtectedRoute>
            } />
            <Route
              path="/report"
              element={
                <ProtectedRoute>
                  <ReportPage />
                  <FloatingEmergencyButton />
                </ProtectedRoute>
              }
            />
            <Route path="/report/:type" element={
              <ProtectedRoute>
                <ReportFormPage />
              </ProtectedRoute>
            } />
            {/* صفحة السلامة - متاحة للجميع */}
            <Route path="/safety" element={<SafetyPage />} />
            {/* صفحة اتصل بنا - متاحة للجميع */}
            <Route path="/contact" element={<ContactPage />} />
            {/* صفحة الاستشارات الطبية */}
            <Route path="/consultation" element={
              <ProtectedRoute>
                <ConsultationPage />
              </ProtectedRoute>
            } />
            <Route path="/doctor-request" element={
              <ProtectedRoute>
                <DoctorRequestPage />
              </ProtectedRoute>
            } />
            
            {/* Admin Routes - تحتاج صلاحية أدمن */}
            <Route path="/admin" element={
              <ProtectedRoute requireAdmin>
                <AdminDashboard />
              </ProtectedRoute>
            } />
          </Routes>
          <MainFooter />
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;
