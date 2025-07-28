import { useState } from "react";
import axios from "axios";
import { showSuccessToast } from "../../utils/toast";

const Email = () => {
  const [formData, setFormData] = useState({ email: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setError("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const res = await axios.post("https://dashboard-backend.zeabur.app/requestPasswordReset", formData);
      showSuccessToast("Email sent successfully! Please check your inbox.");
      setFormData({ email: "" });
    } catch (err) {
      setError(err.response?.data?.message || "Email failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-white px-4">
      <div className="w-full max-w-sm bg-white p-6 text-center">
        {/* Logo */}
        <img
          src="/logoGranule.jpg"
          alt="Granule Logo"
          className="mx-auto mb-2 w-32 h-32 object-contain"
        />

        {/* Title */}
        <h1 className="text-sm font-semibold text-gray-700 mb-6">Granule</h1>

        {/* Error */}
        {error && (
          <div className="bg-red-100 text-red-700 px-4 py-2 mb-4 rounded-md text-sm">
            {error}
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="text-left">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Email
            </label>
            <input
              placeholder="Email"
              type="text"
              name="email"
              value={formData.email}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none "
              required
            />
          </div>

       

          <div className="flex justify-between space-x-2 pt-2">
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-[#5a86ba] hover:bg-[#206abf] text-white font-semibold py-2 rounded-md transition"
              >
              {loading ? "Submiting..." : "Submit"}
            </button>
  
          </div>
        </form>

      
      </div>
    </div>
  );
};

export default Email;
