import { Outlet } from 'react-router-dom';
import SideBar from './components/sidebar';
import FooterComp from './components/footer';
import { VantaBg } from './components/Background';

export default function AdminLayout() {
  return (
    <>
      <VantaBg />
      <div style={{display: "flex", zIndex: 1, position: "relative", minHeight: "100vh"}}>
        <SideBar />
        <main style={{flex: 1, marginLeft: "60px"}}>
          <Outlet />
        </main>
      </div>
      <FooterComp />
    </>
  );
}
