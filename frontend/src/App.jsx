import {BrowserRouter, Routes, Route, useLocation} from 'react-router-dom'
import SideBar from './components/sidebar'
import Model from './pages/Model'
import Home from './pages/Home'
import SchoolManagement from './pages/schoolmanage'
import Profile from './pages/profile'
import VerifyCode from './pages/VerifyCode';
import AuthPage from './pages/AuthPage'
import FooterComp from './components/footer'
import { VantaBg } from './components/Background'
import { UserAuthProvider } from './context/UserAuthContext'

function AppLayout() {
  const location = useLocation();
  const isAuthPage = location.pathname === '/login' || location.pathname === '/register' || location.pathname === '/verify';

  return (
    <>
      {!isAuthPage && <VantaBg />}
      <div style={{display: "flex", zIndex: 1, position: "relative"}}>
        {!isAuthPage && <SideBar />}
        <main style={{flex: 1, marginLeft: isAuthPage ? "0" : "60px"}}>
          <Routes>
            <Route path='/' element={<Home />}/>
            <Route path='/schoolM' element={<SchoolManagement />}/>
            <Route path='/modelTrain' element={<Model />}/>
            <Route path='/profile' element={<Profile />}/> {/* To add profile id or sth */}
            <Route path='/login' element={<AuthPage />} />
            <Route path='/register' element={<AuthPage />} />
            <Route path="/verify" element={<AuthPage />} />
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
      <UserAuthProvider>
        <AppLayout />
      </UserAuthProvider>
    </BrowserRouter>
  );
}

export default App
