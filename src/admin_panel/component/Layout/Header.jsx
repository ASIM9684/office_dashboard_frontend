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
    weekday: "long",     // e.g., Thursday
    day: "2-digit",      // e.g., 18
    month: "long",       // e.g., July
    year: "numeric",     // e.g., 2025
  });

  // Format time like: "04:35:22 PM"
  const formattedTime = currentTime.toLocaleTimeString("en-US", {
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    hour12: true,
  });

  return (
    <header className="flex items-center justify-between px-6 py-4 bg-white shadow-md sticky top-0 left-0 right-0 z-10 h-20">

      <div className="flex items-center gap-4">
        <button onClick={toggleSidebar} className="md:hidden">
          <Menu className="h-6 w-6 text-gray-700" />
        </button>
        <div className="w-28 h-auto">
          <img
            src="/logoGranule.jpg"
            alt="Logo"
            className="h-10 object-contain"
          />

        </div>

        <div className=" text-sm text-gray-700 text-left leading-tight whitespace-nowrap hidden md:block">
          <div>{`${formattedTime}`}</div>
          <div>{`${formattedDate}`}</div>
        </div>

      </div>

      <div className="flex items-center gap-6 ml-auto">

        <div
          onClick={() => navigate("/profile")}
          className="flex items-center gap-2 cursor-pointer"
        >
          <span className="text-sm font-medium text-gray-800">
            {user.name}
          </span>
          {user.profilePicture ? (
            <img
              src={user.profilePicture}
              alt="Profile"
              className="w-8 h-8 rounded-full object-cover"
            />
          ) : (<img
            src={"https://apps.timeclockwizard.com/assets/img/avatars//avatar1/avatar_big.png?07/17/2025%2010:56:31%20PM"}
            alt="Profile"
            className="w-10 h-10 rounded-full object-cover"
          />)}
        </div>
      </div>
    </header>
  );
};

export default Header;
