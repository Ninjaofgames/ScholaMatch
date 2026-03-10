import { useState, useEffect } from "react";
import '@fortawesome/fontawesome-free/css/all.min.css';
import "./SidebarStyle.css";
import { useLocation, useNavigate } from "react-router-dom";
import { useAdminAuth } from "../../context/AdminAuthContext";
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

function ThemeToggle() {
    const [theme, setTheme] = useState(localStorage.getItem('adminTheme') || 'dark');

    useEffect(() => {
        document.body.setAttribute('data-theme', theme);
        localStorage.setItem('adminTheme', theme);
    }, [theme]);

    const toggleTheme = () => {
        setTheme(prev => (prev === 'light' ? 'dark' : 'light'));
    };

    return (
        <div 
            className="sidebar__logout" 
            title={theme === 'light' ? 'Switch to Dark Mode' : 'Switch to Light Mode'} 
            onClick={toggleTheme} 
            style={{cursor: "pointer", marginBottom: "10px", color: theme === 'light' ? '#f59e0b' : '#38bdf8'}}
        >
            <i className={`fa-solid ${theme === 'light' ? 'fa-sun' : 'fa-moon'}`}></i>
        </div>
    );
}

function LogOut() {
    const { logout } = useAdminAuth();
    const navigate = useNavigate();

    const handleLogout = () => {
        logout();
        navigate('/admin');
    };

    return(
        <div className="sidebar__logout" title="Logout" onClick={handleLogout} style={{cursor: "pointer"}}>
            <i className="fa-solid fa-power-off"></i>
        </div>
    );
}

export default function SideBar(){
    const location = useLocation();
    return(
        <div className="sidebar">
            <div className="logo" title="ScholaMatch">
                <div style={{
                    width: '100%', 
                    height: '100%', 
                    background: 'linear-gradient(135deg, var(--accent-blue), var(--accent-purple))',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: '#fff',
                    fontWeight: '900',
                    fontSize: '20px',
                    letterSpacing: '-1px'
                }}>
                    SM
                </div>
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
            <ThemeToggle />
            <LogOut />
        </div>
    )
}