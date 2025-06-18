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

  const handleLogout = () => {
    localStorage.clear();
    navigate("/login");
  };

  const handleNavClick = () => {
    if (window.innerWidth < 1280) {
      setCollapsed(false); // close sidebar on small screens
    }
  };

  return (
    <div
      className={`fixed top-16 left-0 bottom-0 bg-blue-600 text-white shadow-lg z-50 transition-all duration-300 ease-in-out 
        ${collapsed ? "w-64" : "w-0"} 
        overflow-hidden 
        xl:static xl:w-64 xl:block`}
    >
      <nav className="mt-4 flex flex-col gap-1">
        {navItems.map(({ label, path, icon, isLogout }) =>
          isLogout ? (
            <button
              key={label}
              onClick={() => {
                handleLogout();
                handleNavClick(); // Close sidebar on logout
              }}
              className="flex items-center gap-4 px-4 py-3 hover:bg-blue-500 text-left w-full"
            >
              <span>{icon}</span>
              <span className="text-sm">{label}</span>
            </button>
          ) : (
            <NavItem
              key={label}
              label={label}
              icon={icon}
              to={path}
              onNavigate={handleNavClick}
            />
          )
        )}
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
