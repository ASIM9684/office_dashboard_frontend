import { useState } from "react";
import { UserPlus } from "lucide-react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { jwtDecode } from "jwt-decode";
import { showSuccessToast } from "../../utils/toast";

const Addleave = () => {
  const [formData, setFormData] = useState({
    reason: "",
    leaveDate: "",
  });
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    const token = localStorage.getItem("token");
    const decoded = jwtDecode(token);
    const userId = decoded.userId;
    e.preventDefault();
    const response = axios.post(
      `https://dashboard-backend.zeabur.app/addleave/${userId}`,
      formData
    );
    response
      .then((res) => {
        setFormData({
          leaveDate: "",
          reason: "",
        });
         showSuccessToast("Leave Request Successfully")
        navigate("/leave");
      })
      .catch((error) => {
        console.error("Error adding leave:", error);
      });
  };

  return (
    <div className="w-full max-w-full mx-auto p-8 mt-4 bg-white rounded-2xl shadow-md">
      <div className="flex items-center gap-3 mb-6">
        <UserPlus className="text-slateblue w-6 h-6" />
        <h2 className="text-2xl font-bold text-gray-800">Add New leave</h2>
      </div>

      <form
        onSubmit={handleSubmit}
        className="grid grid-cols-1 md:grid-cols-2 gap-6"
      >
        {/* Name */}
        <FormInput
          label="Reason"
          name="reason"
          type="text"
          value={formData.reason}
          onChange={handleChange}
          required
        />

        <FormInput
          label="Leave Date"
          name="leaveDate"
          type="date"
          value={formData.leaveDate}
          onChange={handleChange}
          required
        />
        <div className="md:col-span-2 text-right mt-2">
          <button
            type="submit"
            className="bg-slateblue hover:bg-hoverslateblue text-white px-6 py-2 rounded-lg font-medium transition duration-300"
          >
            Add leave
          </button>
        </div>
      </form>
    </div>
  );
};

const FormInput = ({ label, ...props }) => (
  <div>
    <label className="block text-sm font-medium text-gray-700 mb-1">
      {label}
    </label>
    <input
      {...props}
      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none transition"
    />
  </div>
);

export default Addleave;
