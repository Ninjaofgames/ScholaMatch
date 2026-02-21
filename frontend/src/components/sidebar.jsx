import { useState } from "react";
import '@fortawesome/fontawesome-free/css/all.min.css';
import"./SidebarStyle.css";
import { useLocation, useNavigate } from "react-router-dom";
const navItems = [
    {
        id: "home",
        path: "/",
        icon:(
            <i class="fa-solid fa-house"></i>
        ),
        label: "Home",
    },
    {
        id: "manage",
        path: "/schoolM",
        icon:(
            <i class="fa-solid fa-graduation-cap"></i>
        ),
        label: "Manage",
    },
    {
        id: "model",
        path: "/modelTrain",
        icon:(
            <i class="fa-solid fa-microchip"></i>
        ),
        label: "Model",
    },
    {
        id: "account",
        path: "/profile",
        icon:(
            <i class="fa-solid fa-user"></i>
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
    return(
        <div className="sidebar__logout" title="Logout">
            <i className="fa-solid fa-power-off"></i>
        </div>
    );
}

export default function SideBar(){
    const location = useLocation();
    return(
        <div className="sidebar">
            <div className="logo">
                <img src="./public/logo.jpeg" />
            </div>
            <nav className="sidebar__nav">
                {navItems.map((item) => (
                    <NavItem
                        key={item.id}
                        item={item}
                        isActive={location.pathname === item.path}
                        onClick={() => setActive(item.path)}
                    />
                ))}
            </nav>
            <LogOut />
        </div>
    )
}