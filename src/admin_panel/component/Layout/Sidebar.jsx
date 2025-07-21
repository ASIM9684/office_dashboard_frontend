import { NavLink, useNavigate } from "react-router-dom";
import {
  Home,
  User,
  LogOut,
  UserCog,
  CalendarX,
  Clock,
  CheckCheck,
} from "lucide-react";
import { useEffect, useState } from "react";
import { jwtDecode } from "jwt-decode";
import { showErrorToast } from "../../utils/toast";

const navItems = [
  { label: "Dashboard", path: "/", icon: <Home /> },
  { label: "Clock In Today", path: "/ClockInToday", icon: <Clock /> },
  { label: "Employees", path: "/employees", icon: <User /> },
  { label: "Department", path: "/department", icon: <UserCog /> },
  { label: "Leave", path: "/Leave", icon: <CalendarX /> },
  { label: "Task", path: "/Task", icon: <CheckCheck /> },
  { label: "Logout", path: "/logout", icon: <LogOut />, isLogout: true },
];

const Sidebar = ({ collapsed, setCollapsed }) => {
  const navigate = useNavigate();
  const [role, setRole] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      try {
        const decoded = jwtDecode(token);
        setRole(decoded.role);
      } catch {
        setRole(null);
      }
    }
  }, []);

  const handleLogout = () => {
    localStorage.clear();
    navigate("/login");
  };

  const handleNavClick = () => {
    if (window.innerWidth < 1280) {
      setCollapsed(false);
    }
  };

  const handleBlockedClick = (label) => {
    showErrorToast(`Access denied. Kindly contact administration.`);
  };

  const isRestrictedPath = (path) => {
    return ["/employees", "/department"].includes(path);
  };

  const isAllowedRole = () => {
    return role === "Admin" || role === "HR";
  };

  return (
    <div
      className={`h-screen fixed top-16 left-0 bottom-0 bg-slateblue text-white shadow-lg z-50 transition-all duration-300 ease-in-out 
        ${collapsed ? "w-32" : "w-0"} 
        overflow-hidden 
        md:static md:w-32 md:block`}
    >
      <nav className="mt-4 flex flex-col gap-1">
        {navItems.map(({ label, path, icon, isLogout }) => {



          const restricted = isRestrictedPath(path);
          const canAccess = !restricted || isAllowedRole();

          return canAccess ? (
            <NavItem
              key={label}
              label={label}
              icon={icon}
              to={isLogout ? "/login" : path}
              onNavigate={isLogout ? handleLogout : handleNavClick}
            />
          ) : (
            <button
              key={label}
              onClick={() => {
                handleBlockedClick(label);
                handleNavClick();
              }}

              className=" items-center gap-4 px-4 py-3 transition-colors duration-200 hover:bg-hoverslateblue"
            >
              <span className="flex items-center justify-center text-lg">{icon}</span>
              <span className="text-sm flex items-center justify-center">{label}</span>
            </button>
          );
        })}
      </nav>
    </div>
  );
}

const NavItem = ({ icon, label, to, onNavigate }) => {
  return (
    <NavLink
      to={to}
      onClick={onNavigate}
      className={({ isActive }) =>
        ` items-center gap-4 px-4 py-3 transition-colors duration-200 ${isActive ? "bg-hoverslateblue" : "hover:bg-hoverslateblue"
        }`
      }
    >
      <span className="flex items-center justify-center text-lg">{icon}</span>
      <span className="text-sm flex items-center justify-center">{label}</span>
    </NavLink>
  );
};


export default Sidebar;
