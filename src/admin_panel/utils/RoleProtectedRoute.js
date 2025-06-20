import { useNavigate } from "react-router-dom";
import { useEffect } from "react";
import { jwtDecode } from "jwt-decode";
import { showErrorToast } from "./toast";

const RoleProtectedRoute = ({ allowedRoles, children }) => {
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      navigate("/login", { replace: true });
      return;
    }

    try {
      const decoded = jwtDecode(token);
      const userRole = decoded.role;

      if (!allowedRoles.includes(userRole)) {
        showErrorToast("Access denied. Kindly contact administration.");

        // Delay navigation by 1.5 seconds to allow toast to appear
        setTimeout(() => {
          navigate("/", { replace: true });
        }, 0);
      }
    } catch {
      navigate("/login", { replace: true });
    }
  }, [allowedRoles, navigate]);

  return children;
};

export default RoleProtectedRoute;
