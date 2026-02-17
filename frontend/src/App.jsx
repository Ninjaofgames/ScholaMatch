import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AdminAuthProvider } from './context/AdminAuthContext';
import { UserAuthProvider } from './context/UserAuthContext';
import AdminRoute from './routes/AdminRoute';
import UserRoute from './routes/UserRoute';
import AdminLogin from './pages/admin/AdminLogin';
import AdminForgotPassword from './pages/admin/AdminForgotPassword';
import AdminResetPassword from './pages/admin/AdminResetPassword';
import AdminDashboard from './pages/admin/AdminDashboard';
import UserActivityLogs from './pages/admin/UserActivityLogs';
import UserLogin from './pages/user/UserLogin';
import VerifyCode from './pages/user/VerifyCode';
import ForgotPassword from './pages/user/ForgotPassword';
import ResetPassword from './pages/user/ResetPassword';
import UserDashboard from './pages/user/UserDashboard';
import Profile from './pages/user/Profile';
import Register from './pages/Register';
import './styles/auth.css';
import './styles/admin.css';
import './styles/global.css';

function App() {
  return (
    <UserAuthProvider>
      <AdminAuthProvider>
        <BrowserRouter>
          <Routes>
            <Route path="/admin" element={<AdminLogin />} />
            <Route path="/admin/forgot-password" element={<AdminForgotPassword />} />
            <Route path="/admin/reset-password" element={<AdminResetPassword />} />
            <Route path="/admin/dashboard" element={<AdminRoute><AdminDashboard /></AdminRoute>} />
            <Route path="/admin/activity-logs" element={<AdminRoute><UserActivityLogs /></AdminRoute>} />
            <Route path="/login" element={<UserLogin />} />
            <Route path="/register" element={<Register />} />
            <Route path="/verify" element={<VerifyCode />} />
            <Route path="/forgot-password" element={<ForgotPassword />} />
            <Route path="/reset-password" element={<ResetPassword />} />
            <Route path="/dashboard" element={<UserRoute><UserDashboard /></UserRoute>} />
            <Route path="/profile" element={<UserRoute><Profile /></UserRoute>} />
            <Route path="/" element={<Navigate to="/dashboard" replace />} />
            <Route path="*" element={<Navigate to="/dashboard" replace />} />
          </Routes>
        </BrowserRouter>
      </AdminAuthProvider>
    </UserAuthProvider>
  );
}

export default App;
