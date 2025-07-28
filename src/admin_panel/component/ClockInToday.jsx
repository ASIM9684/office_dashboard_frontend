import { useEffect, useState } from "react";
import { User, Pencil, Trash2, PlusCircle, Clock } from "lucide-react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { jwtDecode } from "jwt-decode";

export default function ClockInToday() {
  const [employees, setEmployees] = useState([]);
  const router = useNavigate();

  useEffect(() => {
    const fetchEmployees = async () => {
      try {
        const response = await axios.get(
          `https://dashboard-backend.zeabur.app/ClockInNow`
        );
        console.log(response.data);
        
        setEmployees(response.data);
      } catch (error) {
        console.error("Error fetching employees:", error);
      }
    };
    fetchEmployees();
  }, []);
  return (
    <div className="max-w-full mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-4 gap-4">
        <div className="flex items-center gap-2">
          <Clock className="text-slateblue w-6 h-6" />
          <h1 className="text-xl sm:text-2xl font-bold text-gray-800">
            Clock In Today
          </h1>
        </div>
      </div>

      {/* Desktop Table */}
      <div className="hidden md:block">
        <table className="w-full text-sm  text-left table-auto rounded-lg shadow bg-white">
          <thead className="bg-slateblue text-white">
            <tr>
              <th className="py-3 px-4">Name</th>
              <th className="py-3 px-4">Clock In</th>
              <th className="py-3 px-4">Clock Out</th>
              <th className="py-3 px-4">Break</th>
              <th className="py-3 px-4">Status</th>
              <th className="py-3 px-4">Device</th>
            </tr>
          </thead>
          <tbody>
            {employees.map((emp) => (
              <tr
                key={emp._id}
                className="border-b hover:bg-gray-50 transition"
              >
                <td className="py-3 px-4">{emp.userId.name}</td>
                <td className="py-3 px-4">
                  {emp.startTime
                    ? new Date(emp.startTime).toLocaleString()
                    : ""}
                </td>
                <td className="py-3 px-4">
                  {emp.endTime
                    ? new Date(emp.endTime).toLocaleString()
                    : "-"}
                </td>
                <td className="py-3 px-4">{emp.calculatedBreakTime}</td>
                <td className="py-3 px-4">{emp.status}</td>
                     <td className="py-3 px-4">{emp.deviceType}</td>
              </tr>
            ))}
            {employees.length === 0 && (
              <tr>
                <td colSpan="7" className="text-center py-6 text-gray-500">
                  No employees found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      <div className="md:hidden space-y-4">
        {employees.length === 0 ? (
          <p className="text-center text-gray-500">No employees found.</p>
        ) : (
          employees.map((emp) => (
            <div
              key={emp._id}
              className="bg-white rounded-lg shadow p-4 border border-gray-200"
            >
              <div className="text-lg font-semibold text-gray-800">
                {emp.userId.name}
              </div>
              <div className="text-sm text-gray-600">
                <strong>Clock In:</strong>{" "}
                {emp.startTime
                  ? new Date(emp.startTime).toLocaleTimeString()
                  : ""}
              </div>
              <div className="text-sm text-gray-600">
                <strong>Clock:</strong>{" "}
                {emp.endTime ? new Date(emp.endTime).toLocaleTimeString() : "-"}
              </div>
              <div className="text-sm text-gray-600">
                <strong>Status:</strong> {emp.status}
              </div>
              <div className="text-sm text-gray-600">
                <strong>Device:</strong> {emp.deviceType}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
