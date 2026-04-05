import {BrowserRouter, Routes, Route, useLocation, Navigate} from 'react-router-dom'
import SideBar from './components/sidebar'
import Model from './pages/Model'
import Home from './pages/Home'
import SchoolManagement from './pages/schoolmanage'
import Profile from './pages/profile'
import AuthPage from './pages/AuthPage'
import FooterComp from './components/footer'
import UserProfile from './pages/userProfile'
import { VantaBg } from './components/Background'
import { UserAuthProvider } from './context/UserAuthContext'
import { AdminAuthProvider } from './context/AdminAuthContext'
import AdminLogin from './pages/adminLogin'
import ProtectedRoute from './components/ProtectedRoute'
import AdminRoute from './components/AdminRoute'
import UserHome from './pages/UserHome'
import SchoolDetail from './pages/SchoolDetails'
import './userStyles.css'

function AppLayout() {
  const location = useLocation();
  const isAuthPage = ['/login', '/register', '/verify', '/adminLgin'].includes(location.pathname);
  const isUserPage = location.pathname === '/' || location.pathname.startsWith('/school/') || location.pathname === '/user_profile';
  const hideLayout = isAuthPage || isUserPage;

  return (
    <>
      {!hideLayout && <VantaBg />}
      <div style={{display: "flex", zIndex: 1, position: "relative"}}>
        {!hideLayout && <SideBar />}
        <main style={{flex: 1, marginLeft: hideLayout ? "0" : "60px"}}>
          <Routes>
            <Route path='/' element={<UserHome />} />
            <Route path='/school/:id' element={<SchoolDetail />} />
            <Route path='/login' element={<AuthPage />} />
            <Route path='/register' element={<AuthPage />} />
            <Route path="/verify" element={<AuthPage />} />
            <Route path='/user_profile' element={<UserProfile />} />
            <Route path='/adminLgin' element={<AdminLogin />} />
            <Route path='/profile_user' element={<ProtectedRoute><Profile /></ProtectedRoute>}/>
            <Route path='/admin/schoolM' element={<AdminRoute><SchoolManagement /></AdminRoute>}/>
            <Route path='/admin/modelTrain' element={<AdminRoute><Model /></AdminRoute>}/>
            <Route path='/admin/dashboard' element={<AdminRoute><Home /></AdminRoute>}/>
            <Route path='/admin/profile' element={<AdminRoute><Profile /></AdminRoute>}/>
          </Routes>
        </main>
      </div>
      {!hideLayout && <FooterComp />}
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