import { useEffect, useState } from "react";
import { PlusCircle, Check, X, CalendarX } from "lucide-react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { jwtDecode } from "jwt-decode";
import { showSuccessToast } from "../../utils/toast";

export default function LeavePage() {
  const [leaves, setLeaves] = useState([]);
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      const decoded = jwtDecode(token);
      setUser(decoded.userId);
    }
    fetchLeaves();
  }, []);

  const fetchLeaves = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await axios.get("http://192.168.18.15:8000/getLeave", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setLeaves(response.data);
      
    } catch (error) {
      console.error("Error fetching leaves:", error);
    }
  };

  const handleStatusChange = async (id, status) => {
    try {
      await axios.put(`http://192.168.18.15:8000/updateLeave/${id}`, { status });
      fetchLeaves();
      if(status == "Accepted"){
        showSuccessToast("Leave Request Accepted Successfully")
      }
      if(status == "Rejected"){
        showSuccessToast("Leave Request Rejected Successfully")
      }
    } catch (error) {
      console.error(`Error updating leave (${status}):`, error);
    }
  };

  const goToAddLeave = () => navigate("/add-Leave");

  return (
    <div className="max-w-6xl mx-auto mt-6 px-4">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-4 gap-4">
        <div className="flex items-center gap-2">
          <CalendarX className="text-blue-600 w-6 h-6" />
          <h1 className="text-xl sm:text-2xl font-bold text-gray-800">Leaves</h1>
        </div>
        <button
          onClick={goToAddLeave}
          className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition"
        >
          <PlusCircle size={18} />
          <span className="text-sm">Request Leave</span>
        </button>
      </div>

      {/* Desktop Table */}
      <div className="hidden md:block">
        <table className="w-full text-sm md:text-base text-left table-auto rounded-lg shadow bg-white">
          <thead className="bg-blue-600 text-white">
            <tr>
              <th className="py-3 px-4">Employee Name</th>
              <th className="py-3 px-4">Request Date</th>
              <th className="py-3 px-4">Reason</th>
              <th className="py-3 px-4">Status</th>
              <th className="py-3 px-4 text-center">Actions</th>
            </tr>
          </thead>
          <tbody>
            {leaves.length === 0 ? (
              <tr>
                <td colSpan="5" className="text-center py-6 text-gray-500">
                  No leaves found.
                </td>
              </tr>
            ) : (
              leaves.map((leave) => (
                <tr key={leave._id} className="border-b hover:bg-gray-50 transition">
                  <td className="py-3 px-4">{leave.user?.name}</td>
                  <td className="py-3 px-4">
                    {leave.leaveDate ? new Date(leave.leaveDate).toLocaleDateString() : ""}
                  </td>
                  <td className="py-3 px-4">{leave.reason}</td>
                  <td className="py-3 px-4">
                    <span
                      className={`font-semibold ${
                        leave.status === "Accepted"
                          ? "text-green-500"
                          : leave.status === "Rejected"
                          ? "text-red-600"
                          : "text-yellow-600"
                      }`}
                    >
                      {leave.status}
                    </span>
                  </td>
                  <td className="py-3 px-4 text-center">
                    {leave.user._id !== user && leave.status === "Pending" ? (
                      <div className="flex justify-center gap-2">
                        <button
                          onClick={() => handleStatusChange(leave._id, "Accepted")}
                          className="text-blue-600 hover:text-blue-800"
                          title="Accept"
                        >
                          <Check size={18} />
                        </button>
                        <button
                          onClick={() => handleStatusChange(leave._id, "Rejected")}
                          className="text-red-600 hover:text-red-800"
                          title="Reject"
                        >
                          <X size={18} />
                        </button>
                      </div>
                    ) : (
                      <span className="text-gray-400 italic">No actions</span>
                    )}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Mobile Cards */}
      <div className="md:hidden space-y-4">
        {leaves.length === 0 ? (
          <p className="text-center text-gray-500">No leaves found.</p>
        ) : (
          leaves.map((leave) => (
            <div
              key={leave._id}
              className="bg-white rounded-lg shadow p-4 border border-gray-200"
            >
              <div className="text-lg font-semibold text-gray-800">{leave.user?.name}</div>
              <div className="text-sm text-gray-600">
                <strong>Status:</strong>{" "}
                <span
                  className={`font-semibold ${
                    leave.status === "Accepted"
                      ? "text-green-500"
                      : leave.status === "Rejected"
                      ? "text-red-600"
                      : "text-yellow-600"
                  }`}
                >
                  {leave.status}
                </span>
              </div>
              <div className="text-sm text-gray-600 mb-3">
                <strong>Request Date:</strong>{" "}
                {leave.leaveDate ? new Date(leave.leaveDate).toLocaleDateString() : ""}
              </div>
              {leave.user._id !== user && leave.status === "Pending" && (
                <div className="flex gap-4">
                  <button
                    onClick={() => handleStatusChange(leave._id, "Accepted")}
                    className="text-blue-600 hover:text-blue-800"
                    title="Accept"
                  >
                    <Check size={18} />
                  </button>
                  <button
                    onClick={() => handleStatusChange(leave._id, "Rejected")}
                    className="text-red-600 hover:text-red-800"
                    title="Reject"
                  >
                    <X size={18} />
                  </button>
                </div>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
}
