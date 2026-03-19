import {BrowserRouter, Routes, Route, useLocation, Navigate} from 'react-router-dom'
import SideBar from './components/sidebar'
import Model from './pages/Model'
import Home from './pages/Home'
import SchoolManagement from './pages/schoolmanage'
import Profile from './pages/profile'
import AuthPage from './pages/AuthPage'
import FooterComp from './components/footer'
import { VantaBg } from './components/Background'
import { UserAuthProvider } from './context/UserAuthContext'
import { AdminAuthProvider } from './context/AdminAuthContext'
import AdminLogin from './pages/adminLogin'
import ProtectedRoute from './components/ProtectedRoute'
import AdminRoute from './components/AdminRoute'

function AppLayout() {
  const location = useLocation();
  const isAuthPage = ['/login', '/register', '/verify', '/adminLgin'].includes(location.pathname);

  return (
    <>
      {!isAuthPage && <VantaBg />}
      <div style={{display: "flex", zIndex: 1, position: "relative"}}>
        {!isAuthPage && <SideBar />}
        <main style={{flex: 1, marginLeft: isAuthPage ? "0" : "60px"}}>
          <Routes>
            <Route path='/login' element={<AuthPage />} />
            <Route path='/register' element={<AuthPage />} />
            <Route path="/verify" element={<AuthPage />} />
            <Route path='/adminLgin' element={<AdminLogin />} />

            {/* Protected user routes */}
            <Route path='/profile_user' element={
              <ProtectedRoute><Profile /></ProtectedRoute>
            }/>
            {/* Admin only routes */}
            <Route path='/admin/schoolM' element={
              <AdminRoute><SchoolManagement /></AdminRoute>
            }/>
            <Route path='/admin/modelTrain' element={
              <AdminRoute><Model /></AdminRoute>
            }/>
            <Route path='/admin/dashboard' element={
              <AdminRoute><Home /></AdminRoute>
            }/>
            <Route path='/admin/profile' element={
              <AdminRoute><Profile /></AdminRoute>
            }/>

            {/* Default route */}
            <Route path='/' element={<Navigate to="/admin/dashboard" />} />
            <Route path='*' element={<Navigate to="/admin/dashboard" />} />
          </Routes>
        </main>
      </div>
      {!isAuthPage && <FooterComp />}
    </>
  );
}

function App() {
  return(
    <BrowserRouter>
      <AdminAuthProvider>
        <UserAuthProvider>
          <AppLayout />
        </UserAuthProvider>
      </AdminAuthProvider>
    </BrowserRouter>
  );
}

export default App