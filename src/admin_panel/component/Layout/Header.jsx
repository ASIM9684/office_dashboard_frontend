import { jwtDecode } from "jwt-decode";
import { Bell, Search, Menu } from "lucide-react";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const Header = ({ toggleSidebar }) => {
  const navigate = useNavigate();
  const [user, setUser] = useState({});
  const [currentTime, setCurrentTime] = useState(new Date());

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      const decodedToken = jwtDecode(token);
      setUser(decodedToken);
    }

    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  // Format date like: "19 Jun 2025"
  const formattedDate = currentTime.toLocaleDateString("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });

  // Format time like: "04:35:22 PM"
  const formattedTime = currentTime.toLocaleTimeString("en-US", {
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    hour12: true,
  });

  return (
    <header className="flex items-center justify-between px-6 py-4 bg-white shadow-md fixed top-0 left-0 right-0 z-10 h-16">
      <div className="flex items-center gap-4">
        <button onClick={toggleSidebar}>
          <Menu className="h-6 w-6 text-gray-700" />
        </button>
        <div className="text-xl font-semibold text-blue-600">Dashboard</div>
      </div>

      <div className="hidden md:flex items-center bg-gray-100 px-3 py-1 rounded-md w-1/3">
        <Search className="h-4 w-4 text-gray-500" />
        <input
          type="text"
          placeholder="Search..."
          className="bg-transparent focus:outline-none ml-2 w-full text-sm"
        />
      </div>

      <div className="flex items-center gap-6">
        {/* Clock */}
      {/* Clock - hidden on md and below */}
<div className="text-sm text-gray-700 text-right leading-tight whitespace-nowrap hidden lg:block">
  <div>{`${formattedDate} – ${formattedTime}`}</div>
</div>



        <div
          onClick={() => navigate("/profile")}
          className="flex items-center gap-2 cursor-pointer"
        >
          {user.profilePicture && (
            <img
              src={user.profilePicture}
              alt="Profile"
              className="w-8 h-8 rounded-full object-cover"
            />
          )}
          <span className="text-sm font-medium text-gray-800">
            {user.name}
          </span>
        </div>
      </div>
    </header>
  );
};

export default Header;
