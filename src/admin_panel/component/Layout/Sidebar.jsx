import { Home, User, LogOut, UserCog } from "lucide-react";
import { NavLink, useNavigate } from "react-router-dom";
import { useEffect } from "react";

const navItems = [
  { label: "Dashboard", path: "/", icon: <Home /> },
  { label: "Employees", path: "/employees", icon: <User /> },
  { label: "Department", path: "/department", icon: <UserCog /> },
  { label: "Logout", path: "/logout", icon: <LogOut />, isLogout: true },
];

const Sidebar = ({ collapsed }) => {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.clear(); // ✅ clear all local storage
    navigate("/login");      
  };

  return (
    <div
      className={`fixed top-16 left-0 bottom-0 bg-blue-600 text-white shadow-lg z-50 transition-all duration-300 ease-in-out 
        ${collapsed ? "w-64" : "w-0"} 
        overflow-hidden 
        md:static md:w-64 md:block`}
    >
      <nav className="mt-4 flex flex-col gap-1">
        {navItems.map(({ label, path, icon, isLogout }) =>
          isLogout ? (
            <button
              key={label}
              onClick={handleLogout}
              className="flex items-center gap-4 px-4 py-3 hover:bg-blue-500 text-left w-full"
            >
              <span>{icon}</span>
              <span className="text-sm">{label}</span>
            </button>
          ) : (
            <NavItem key={label} label={label} icon={icon} to={path} />
          )
        )}
      </nav>
    </div>
  );
};

const NavItem = ({ icon, label, to }) => {
  return (
    <NavLink
      to={to}
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
