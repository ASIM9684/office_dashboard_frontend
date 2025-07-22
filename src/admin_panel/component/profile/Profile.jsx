import React, { useEffect, useState } from "react";
import axios from "axios";
import { jwtDecode } from "jwt-decode";
import { showErrorToast, showSuccessToast } from "../../utils/toast";

const Profile = () => {
  const [departments, setDepartments] = useState([]);
  const [roles, setRoles] = useState([]);
  const [user, setUser] = useState({
    name: "",
    email: "",
    phone: "",
    homePhone: "",
    address: "",
    state: "",
    zip: "",
    department: "",
    role: "",
    roleId: "",
    departmentId: "",
    profilePicture: "", // Used consistently
  });

  useEffect(() => {
    const fetchUser = async () => {
      const token = localStorage.getItem("token");
      if (token) {
        const decodedToken = jwtDecode(token);  
        const response = await axios.get(
          `https://office-dashboard-backend.zeabur.app/getUserProfile/${decodedToken.userId}`
        );   
        setUser(response.data);
      }
    };

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
    fetchUser();
  }, []);

  const handleImageUpload = async (file) => {
    const formData = new FormData();
    formData.append("file", file);
    formData.append("upload_preset", "office_dashboard"); // must match Cloudinary config

    try {
      const res = await axios.post(
        "https://api.cloudinary.com/v1_1/dylzc8c7j/image/upload",
        formData
      );
      const imageUrl = res.data.secure_url;
      setUser((prev) => ({ ...prev, profilePicture: imageUrl }));
    } catch (error) {
      console.error("Image upload failed:", error.response?.data || error.message);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setUser((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const token = localStorage.getItem("token");
    const decodedToken = jwtDecode(token);
    const id = decodedToken.userId;

    axios
      .put(`https://office-dashboard-backend.zeabur.app/updateuser/${id}`, user)
      .then((res) => {
       localStorage.setItem("token", res.data.token);
        showSuccessToast("Profile Updated Successfully")
      })
      .catch((error) => {
        showErrorToast("Failed to Updated Profile")
        console.error("Error updating user:", error);
      });
  };

  return (
    <div className="w-full max-w-full mx-auto p-8 mt-4 bg-white rounded-2xl shadow-md">
      <h2 className="text-3xl font-bold text-gray-800 mb-8">Edit Profile</h2>
      <form
        onSubmit={handleSubmit}
        className="grid grid-cols-1 md:grid-cols-2 gap-6"
      >
        <FormField label="Name" name="name" value={user.name} onChange={handleChange} />
        <FormField label="Email" name="email" value={user.email} onChange={handleChange} type="email" />
        <FormField label="Phone" name="phone" value={user.phone} onChange={handleChange} />
        <FormField label="Home Phone" name="homePhone" value={user.homePhone} onChange={handleChange} />
        <FormField label="Address" name="address" value={user.address} onChange={handleChange} />
        <FormField label="State" name="state" value={user.state} onChange={handleChange} />
        <FormField label="ZIP Code" name="zip" value={user.zip} onChange={handleChange} />

        <SelectField
          label="Department"
          name="departmentId"
          value={user.departmentId}
          onChange={handleChange}
          options={departments}
        />

        <SelectField
          label="Role"
          name="roleId"
          value={user.roleId}
          onChange={handleChange}
          options={roles}
        />

        <FormField
          label="Profile Image"
          name="profilePicture"
          type="file"
          onChange={(e) => handleImageUpload(e.target.files[0])}
        />

        {user.profilePicture && (
          <div className="md:col-span-2">
            <img
              src={user.profilePicture}
              alt="Profile Preview"
              className="w-24 h-24 object-cover rounded-full border"
            />
          </div>
        )}

        <div className="md:col-span-2 flex justify-end mt-4">
          <button
            type="submit"
            className="bg-slateblue text-white px-6 py-2 rounded-lg hover:bg-hoverslateblue transition"
          >
            Save Changes
          </button>
        </div>
      </form>
    </div>
  );
};

const FormField = ({ label, name, value, onChange, type = "text" }) => (
  <div className="flex flex-col">
    <label htmlFor={name} className="text-sm text-gray-600 mb-1">
      {label}
    </label>
    {type === "file" ? (
      <input
        id={name}
        name={name}
        type="file"
        accept="image/*"
        onChange={onChange}
        className="border border-gray-300 rounded-lg px-4 py-2 text-gray-800 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
      />
    ) : (
      <input
        id={name}
        name={name}
        type={type}
        value={value}
        onChange={onChange}
        className="border border-gray-300 rounded-lg px-4 py-2 text-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500"
      />
    )}
  </div>
);

const SelectField = ({ label, name, value, onChange, options }) => (
  <div className="flex flex-col">
    <label htmlFor={name} className="text-sm text-gray-600 mb-1">
      {label}
    </label>
    <select
      id={name}
      name={name}
      value={value}
      onChange={onChange}
      className="border border-gray-300 rounded-lg px-4 py-2 text-gray-800 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
    >
      <option value="">Select {label}</option>
      {options.map((opt) => (
        <option key={opt._id} value={opt._id}>
          {opt.name}
        </option>
      ))}
    </select>
  </div>
);

export default Profile;
