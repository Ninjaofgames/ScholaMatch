import {BrowserRouter, Routes, Route} from 'react-router-dom'
import SideBar from './components/sidebar'
import Model from './pages/Model'
import Home from './pages/Home'
import SchoolManagement from './pages/schoolmanage'
import Profile from './pages/profile'
import FooterComp from './components/footer'

function App() {
  return(
    <BrowserRouter>
      <div style={{display: "flex"}}>
        <SideBar />
        <main style={{flex: 1, marginLeft: "60px"}}>
          <Routes>
            <Route path='/' element={<Home />}/>
            <Route path='/schoolM' element={<SchoolManagement />}/>
            <Route path='/modelTrain' element={<Model />}/>
            <Route path='/profile' element={<Profile />}/> {/* To add profile id or sth */}
          </Routes>
        </main>
      </div>
    </BrowserRouter>
  );
}

export default App
