import { useState } from "react";
import { UserPlus } from "lucide-react";
import axios from "axios";
import {useNavigate, useParams } from "react-router-dom";
import { jwtDecode } from "jwt-decode";
import { showSuccessToast } from "../../utils/toast";

const AssignTask = () => {

const navigate = useNavigate();
  const [formData, setFormData] = useState("");
  const {id} = useParams();

  const handleSubmit = (e) => {
    e.preventDefault();
    const token = localStorage.getItem("token");
    const decoded = jwtDecode(token);
    const userId = decoded.userId;
    const status = "Pending";
    const form = {
      task: formData,
      assignedBy : userId,
      assignedTo : id,
      status : status
    }
  const response = axios.post(`https://office-dashboard-backend.zeabur.app/assignTask`,form);
    response
      .then((res) => {
          showSuccessToast("Task Assigned Successfully")
        navigate("/Task");
      })
      .catch((error) => {
        console.error("Error adding employee:", error);
      });

  };

  return (
    <div className="w-full max-w-full mx-auto p-8 mt-4 bg-white rounded-2xl shadow-md">
      <div className="flex items-center gap-3 mb-6">
        <UserPlus className="text-slateblue w-6 h-6" />
        <h2 className="text-2xl font-bold text-gray-800">Assign Task</h2>
      </div>

      <form onSubmit={handleSubmit} className="grid grid-cols-1 gap-6">
        {/* Name */}
        <FormInput
          label="Task"
          type="text"
          value={formData}
          onChange={(e) => setFormData( e.target.value)}
          required
        />
        {/* Submit Button */}
        <div className="md:col-span-2 text-right mt-2">
          <button
            type="submit"
            className="bg-slateblue hover:bg-hoverslateblue text-white px-6 py-2 rounded-lg font-medium transition duration-300"
          >
            Assign Task
          </button>
        </div>
      </form>
    </div>
  );
};

const FormInput = ({ label, ...props }) => (
  <div>
    <label className="block text-sm font-medium text-gray-700 mb-1">{label}</label>
    <input
      {...props}
      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none transition"
    />
  </div>
);

export default AssignTask;
