import { useState } from "react";
import { UserPlus } from "lucide-react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { showSuccessToast } from "../../utils/toast";

const AddDepartmentForm = () => {
  const [formData, setFormData] = useState({
    name: ""
  });
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const response = axios.post("https://office-dashboard-backend.zeabur.app/addDepartment", formData);
    response
      .then((res) => {
        setFormData({
          name: "",
        });
        showSuccessToast("Department Added Successfully")
        navigate("/department");
      })
      .catch((error) => {
        console.error("Error adding Department:", error);
      });

  };

  return (
    <div className="w-full max-w-full mx-auto p-8 mt-4 bg-white rounded-2xl shadow-md">
      <div className="flex items-center gap-3 mb-6">
        <UserPlus className="text-slateblue w-6 h-6" />
        <h2 className="text-2xl font-bold text-gray-800">Add New Department</h2>
      </div>

      <form onSubmit={handleSubmit} className="grid grid-cols-1  gap-6">
        {/* Name */}
        <FormInput
          label="Full Name"
          name="name"
          type="text"
          value={formData.name}
          onChange={handleChange}
          required
        />

        {/* Submit Button */}
        <div className="md:col-span-2 text-right mt-2">
          <button
            type="submit"
            className="bg-slateblue hover:bg-hoverslateblue text-white px-6 py-2 rounded-lg font-medium transition duration-300"
          >
            Add Department
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

export default AddDepartmentForm;