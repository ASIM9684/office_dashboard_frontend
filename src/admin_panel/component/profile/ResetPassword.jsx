import { use, useEffect, useState } from "react";
import axios from "axios";
import { useNavigate, useParams } from "react-router-dom";
import { showSuccessToast } from "../../utils/toast";
import { Eye, EyeOff } from "lucide-react";

const ResetPassword = () => {
    const [formData, setFormData] = useState({ password: "" });
    const [showPassword, setShowPassword] = useState(false);
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();
    const { token } = useParams();

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
        setError("");
    };

    useEffect(() => {
        localStorage.removeItem("token");
    }, []);
    const togglePasswordVisibility = () => {
        setShowPassword(!showPassword);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError("");

        try {
            await axios.post("https://office-dashboard-backend.zeabur.app/resetPassword", {
                token,
                password: formData.password,
            });

            showSuccessToast("Password reset successful! Please log in.");
            navigate("/login");
        } catch (err) {
            setError(err.response?.data?.message || "Password reset failed. Please try again.");
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
                    <div className="text-left relative">
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            New Password
                        </label>
                        <input
                            placeholder="Enter new password"
                            type={showPassword ? "text" : "password"}
                            name="password"
                            value={formData.password}
                            onChange={handleChange}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none pr-10"
                            required
                        />
                        <div
                            className="absolute right-3 top-[38px] cursor-pointer text-gray-500"
                            onClick={togglePasswordVisibility}
                        >
                            {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                        </div>
                    </div>

                    <div className="pt-2">
                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full bg-[#5a86ba] hover:bg-[#206abf] text-white font-semibold py-2 rounded-md transition"
                        >
                            {loading ? "Submitting..." : "Submit"}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default ResetPassword;
