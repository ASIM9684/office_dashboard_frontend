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
  { label: "Employees", path: "/employees", icon: <User /> },
  { label: "Department", path: "/department", icon: <UserCog /> },
  { label: "Leave", path: "/Leave", icon: <CalendarX /> },
  { label: "Clock In Today", path: "/ClockInToday", icon: <Clock /> },
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
      className={`fixed top-16 left-0 bottom-0 bg-blue-600 text-white shadow-lg z-50 transition-all duration-300 ease-in-out 
        ${collapsed ? "w-64" : "w-0"} 
        overflow-hidden 
        xl:static xl:w-64 xl:block`}
    >
      <nav className="mt-4 flex flex-col gap-1">
        {navItems.map(({ label, path, icon, isLogout }) => {
          if (isLogout) {
            return (
              <button
                key={label}
                onClick={() => {
                  handleLogout();
                  handleNavClick();
                }}
                className="flex items-center gap-4 px-4 py-3 hover:bg-blue-500 text-left w-full"
              >
                <span>{icon}</span>
                <span className="text-sm">{label}</span>
              </button>
            );
          }

          const restricted = isRestrictedPath(path);
          const canAccess = !restricted || isAllowedRole();

          return canAccess ? (
            <NavItem
              key={label}
              label={label}
              icon={icon}
              to={path}
              onNavigate={handleNavClick}
            />
          ) : (
            <button
              key={label}
              onClick={() => {
                handleBlockedClick(label);
                handleNavClick();
              }}
              className="flex items-center gap-4 px-4 py-3 text-left w-full cursor-not-allowed hover:bg-blue-400/50"
            >
              <span>{icon}</span>
              <span className="text-sm">{label}</span>
            </button>
          );
        })}
      </nav>
    </div>
  );
};

const NavItem = ({ icon, label, to, onNavigate }) => {
  return (
    <NavLink
      to={to}
      onClick={onNavigate}
      className={({ isActive }) =>
        `flex items-center gap-4 px-4 py-3 transition-colors duration-200 ${
          isActive ? "bg-blue-700" : "hover:bg-blue-500"
        }`
      }
    >
      <span>{icon}</span>
      <span className="text-sm">{label}</span>
    </NavLink>
  );
};

export default Sidebar;
