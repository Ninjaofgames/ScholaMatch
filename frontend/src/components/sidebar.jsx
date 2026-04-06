import { useState } from "react";
import '@fortawesome/fontawesome-free/css/all.min.css';
import"./SidebarStyle.css";
import { useLocation, useNavigate } from "react-router-dom";
const navItems = [
    {
        id: "home",
        path: "/admin/dashboard",
        icon:(
            <i className="fa-solid fa-house"></i>
        ),
        label: "Home",
    },
    {
        id: "manage",
        path: "/admin/schoolM",
        icon:(
            <i className="fa-solid fa-graduation-cap"></i>
        ),
        label: "Schools",
    },
    {
        id: "model",
        path: "/admin/modelTrain",
        icon:(
            <i className="fa-solid fa-microchip"></i>
        ),
        label: "Comments",
    },
    {
        id: "account",
        path: "/admin/profile",
        icon:(
            <i className="fa-solid fa-user"></i>
        ),
        label: "Account",
    },
];

function NavItem({item, isActive, onClick}) {
    const navigate = useNavigate();
    const [hovered, setHovered] = useState(false);
    return(
        <div
            className={`nav-item ${isActive ? "nav-item--active" : ""}`}
            onClick={() => navigate(item.path)}
            onMouseEnter={() => setHovered(true)}
            onMouseLeave={() => setHovered(false)}
        >
            <div className="nav-item__bar" />
            {hovered && <span className="nav-item__tooltip">{item.label}</span>}
            {item.icon}
        </div>
    );
}

function LogOut() {
    const navigate = useNavigate();
    const handleLogout = () => {
        sessionStorage.removeItem('scholamatch_admin_token');
        navigate('/adminLgin');
    };
    return(
        <div className="sidebar__logout" title="Logout" onClick={handleLogout} style={{ cursor: 'pointer' }}>
            <i className="fa-solid fa-power-off"></i>
        </div>
    );
}

export default function SideBar(){
    const location = useLocation();
    return(
        <div className="sidebar">
            <div className="logo">
                <img src="/logo.jpeg" alt="logo" />
            </div>
            <nav className="sidebar__nav">
                {navItems.map((item) => (
                    <NavItem
                        key={item.id}
                        item={item}
                        isActive={location.pathname === item.path}
                    />
                ))}
            </nav>
            <LogOut />
        </div>
    )
}