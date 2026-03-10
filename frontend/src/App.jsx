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
import Preferences from './pages/user/Preferences';
import Profile from './pages/user/Profile';
import PublicSchools from './pages/user/PublicSchools';
import Register from './pages/Register';

// Admin Module new imports
import AdminLayout from './admin_module/AdminLayout';
import Home from './admin_module/pages/Home';
import SchoolManagement from './admin_module/pages/schoolmanage';
import Model from './admin_module/pages/Model';
import AdminProfile from './admin_module/pages/profile';

import './styles/auth.css';
import './styles/admin.css';
import './styles/global.css';
import './styles/publicSchools.css';

function App() {
  return (
    <UserAuthProvider>
      <AdminAuthProvider>
        <BrowserRouter>
          <Routes>
            <Route path="/admin" element={<AdminLogin />} />
            <Route path="/admin/forgot-password" element={<AdminForgotPassword />} />
            <Route path="/admin/reset-password" element={<AdminResetPassword />} />
            
            <Route element={<AdminRoute><AdminLayout /></AdminRoute>}>
              <Route path="/admin/dashboard" element={<Home />} />
              <Route path="/admin/schoolM" element={<SchoolManagement />} />
              <Route path="/admin/modelTrain" element={<Model />} />
              <Route path="/admin/profile" element={<AdminProfile />} />
              <Route path="/admin/activity-logs" element={<UserActivityLogs />} />
            </Route>
            <Route path="/login" element={<UserLogin />} />
            <Route path="/register" element={<Register />} />
            <Route path="/verify" element={<VerifyCode />} />
            <Route path="/forgot-password" element={<ForgotPassword />} />
            <Route path="/reset-password" element={<ResetPassword />} />
            <Route path="/dashboard" element={<UserRoute><UserDashboard /></UserRoute>} />
            <Route path="/preferences" element={<UserRoute><Preferences /></UserRoute>} />
            <Route path="/profile" element={<UserRoute><Profile /></UserRoute>} />
            <Route path="/schools" element={<UserRoute><PublicSchools /></UserRoute>} />
            <Route path="/" element={<UserRoute><PublicSchools /></UserRoute>} />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </BrowserRouter>
      </AdminAuthProvider>
    </UserAuthProvider>
  );
}

export default App;
