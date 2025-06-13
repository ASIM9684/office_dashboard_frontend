// components/Header.js
import { Bell, Search, Menu } from "lucide-react";

const Header = ({ toggleSidebar }) => {
  return (
    <header className="flex items-center justify-between px-6 py-4 bg-white shadow-md fixed top-0 left-0 right-0 z-10 h-16">
      {/* Left: Menu Toggle & Title */}
      <div className="flex items-center gap-4">
        <button onClick={toggleSidebar}>
          <Menu className="h-6 w-6 text-gray-700" />
        </button>
        <div className="text-xl font-semibold text-blue-600">Dashboard</div>
      </div>

      {/* Center: Search bar */}
      <div className="hidden md:flex items-center bg-gray-100 px-3 py-1 rounded-md w-1/3">
        <Search className="h-4 w-4 text-gray-500" />
        <input
          type="text"
          placeholder="Search..."
          className="bg-transparent focus:outline-none ml-2 w-full text-sm"
        />
      </div>

      {/* Right: Notifications and Profile */}
      <div className="flex items-center gap-4">
        <button className="relative">
          <Bell className="h-5 w-5 text-gray-600" />
          <span className="absolute top-0 right-0 h-2 w-2 bg-red-500 rounded-full" />
        </button>
        <div className="w-9 h-9 rounded-full bg-gray-300 flex items-center justify-center text-sm font-bold text-white">
          JD
        </div>
      </div>
    </header>
  );
};

export default Header;
