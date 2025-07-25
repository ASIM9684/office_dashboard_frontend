import { useState, useEffect } from "react";
import { UserPlus } from "lucide-react";
import axios from "axios";

import { useLocation, useNavigate } from "react-router-dom";
import { showSuccessToast } from "../../utils/toast";

const EditEmployeeForm = () => {
  const location = useLocation();
  const employeeData = location.state?.employee;

const navigate = useNavigate();
  const [id,setId] = useState(employeeData?._id || "");
  const [formData, setFormData] = useState({
    name: employeeData?.name || "",
    email: employeeData?.email || "",
    department: employeeData?.department?._id || employeeData?.department || "",
    role: employeeData?.role?._id || employeeData?.role || "",
    joiningDate: employeeData?.joinDate?.split("T")[0] || "",
    phone: employeeData?.phone || "",
  });


  const [departments, setDepartments] = useState([]);
  const [roles, setRoles] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [deptRes, roleRes] = await Promise.all([
          axios.get("https://office-dashboard-backend.zeabur.app/getDepartments"),
          axios.get("https://office-dashboard-backend.zeabur.app/getRoles"),
        ]);
        setDepartments(deptRes.data);
        setRoles(roleRes.data);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, []);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
  const response = axios.put(`https://office-dashboard-backend.zeabur.app/updateEmployee/${id}`, formData);
    response
      .then((res) => {
        setFormData({
          name: "",
          email: "",
          department: "",
          role: "",
          joiningDate: "",
          phone: ""
        });
       showSuccessToast("Employee Updated Successfully")
        navigate("/employees");
      })
      .catch((error) => {
        console.error("Error adding employee:", error);
      });

  };

  return (
    <div className="w-full max-w-full mx-auto p-8 mt-4 bg-white rounded-2xl shadow-md">
      <div className="flex items-center gap-3 mb-6">
        <UserPlus className="text-slateblue w-6 h-6" />
        <h2 className="text-2xl font-bold text-gray-800"> Update Employee</h2>
      </div>

      <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Name */}
        <FormInput
          label="Full Name"
          name="name"
          type="text"
          value={formData.name}
          onChange={handleChange}
          required
        />

        {/* Email */}
        <FormInput
          label="Email Address"
          name="email"
          type="email"
          value={formData.email}
          onChange={handleChange}
          required
        />

        {/* Department Dropdown */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Department</label>
          <select
            name="department"
            value={formData.department}
            onChange={handleChange}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none transition"
            required
          >
            <option value="">Select Department</option>
            {departments.map((dept) => (
              <option key={dept._id} value={dept._id}>
                {dept.name}
              </option>
            ))}
          </select>
        </div>

        {/* Role Dropdown */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Role</label>
          <select
            name="role"
            value={formData.role}
            onChange={handleChange}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none transition"
            required
          >
            <option value="">Select Role</option>
            {roles.map((role) => (
              <option key={role._id} value={role._id}>
                {role.name}
              </option>
            ))}
          </select>
        </div>

        {/* Joining Date */}
        <FormInput
          label="Joining Date"
          name="joiningDate"
          type="date"
          value={formData.joiningDate}
          onChange={handleChange}
          required
        />

<FormInput
  label="Phone Number"
  name="phone"
  type="number"
  value={formData.phone}
  onChange={handleChange}
  required
/>

        {/* Submit Button */}
        <div className="md:col-span-2 text-right mt-2">
          <button
            type="submit"
            className="bg-slateblue hover:bg-hoverslateblue text-white px-6 py-2 rounded-lg font-medium transition duration-300"
          >
            Update Employee
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

export default EditEmployeeForm;
