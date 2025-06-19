import { useEffect, useState } from "react";
import { CheckCheck } from "lucide-react";
import axios from "axios";
import { jwtDecode } from "jwt-decode";
import { showSuccessToast } from "../../utils/toast";

export default function Task() {
  const [employees, setEmployees] = useState([]);
  const [userId,setUserId] = useState(null)

  useEffect(() => {
    const token = localStorage.getItem("token");
    const decoded = jwtDecode(token);
    setUserId(decoded.userId)
    fetchEmployees();
  }, []);

     const fetchEmployees = async () => {
        const token = localStorage.getItem("token");
        const decoded = jwtDecode(token);
        const userId = decoded.userId;
      try {
        const response = await axios.get(`https://d62ae724-87d9-42ad-8e0f-dc494d585f28-00-2llp35q3d5uj8.pike.replit.dev//getTasksByUser/${userId}`);
        setEmployees(response.data);
        
      } catch (error) {
        console.error("Error fetching employees:", error);
      }
    };
 

  const handleStatus = async(id) => {
try {
await axios.put(`https://d62ae724-87d9-42ad-8e0f-dc494d585f28-00-2llp35q3d5uj8.pike.replit.dev//updateTask/${id}`);
fetchEmployees();
  showSuccessToast("Task Submit Successfully")
} catch (error) {
    console.log("Error Submiting", error);
}
  };


  return (
    <div className="max-w-6xl mx-auto mt-6 px-4">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-4 gap-4">
        <div className="flex items-center gap-2">
          <CheckCheck className="text-blue-600 w-6 h-6" />
          <h1 className="text-xl sm:text-2xl font-bold text-gray-800">Task</h1>
        </div>
      </div>

      {/* Desktop Table */}
      <div className="hidden md:block">
        <table className="w-full text-sm md:text-base text-left table-auto rounded-lg shadow bg-white">
          <thead className="bg-blue-600 text-white">
            <tr>
              <th className="py-3 px-4">Assign To</th>
              <th className="py-3 px-4">Task</th>
              <th className="py-3 px-4">Assign By</th>
              <th className="py-3 px-4">Status</th>
              <th className="py-3 px-4">Assign Date</th>
              <th className="py-3 px-4">Action</th>
            </tr>
          </thead>
          <tbody>
            {employees.map((emp) => (
              <tr key={emp._id} className="border-b hover:bg-gray-50 transition">
                <td className="py-3 px-4">{emp.assignedTo.name}</td>
                <td className="py-3 px-4">{emp.task}</td>
                <td className="py-3 px-4">{emp.assignedBy.name}</td>
                <td className="py-3 px-4">{emp.status}</td>
                <td className="py-3 px-4">
                  {emp.createdAt ? new Date(emp.createdAt).toLocaleDateString() : ""}
                </td>
                <td className="py-3 px-4 text-center">
                    {emp.status == "Pending" && emp.assignedTo._id == userId ? (
       <button
                    className="bg-blue-600 text-white px-3 py-1 rounded hover:bg-blue-700 transition"
                    onClick={() => handleStatus(emp._id)}
                  >
                  Submit
                  </button>
                    ) : (
                         <span className="text-gray-400 italic">No actions</span>
                    )}
           
                </td>
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

      {/* Mobile Card View */}
      <div className="md:hidden space-y-4">
        {employees.length === 0 ? (
          <p className="text-center text-gray-500">No employees found.</p>
        ) : (
          employees.map((emp) => (
            <div
              key={emp._id}
              className="bg-white rounded-lg shadow p-4 border border-gray-200"
            >
              <div className="text-lg font-semibold text-gray-800">{emp.assignedTo.name}</div>
              <div className="text-sm text-gray-600">
                <strong>Task:</strong> {emp.task}
              </div>
              <div className="text-sm text-gray-600">
                <strong>Assign By:</strong> {emp.assignedBy.name}
              </div>
              <div className="text-sm text-gray-600">
                <strong>Status:</strong> {emp.status}
              </div>
              <div className="text-sm text-gray-600">
                <strong>Assign Date:</strong>{" "}
              {emp.createdAt ? new Date(emp.createdAt).toLocaleDateString() : ""}
              </div>
              <div className="text-sm text-gray-600 mb-3">
                <strong>Action:</strong>{" "}
                             {emp.status == "Pending" ? (
       <button
                    className="bg-blue-600 text-white px-3 py-1 rounded hover:bg-blue-700 transition"
                    onClick={() => handleStatus(emp._id)}
                  >
                  Submit
                  </button>
                    ) : (
                         <span className="text-gray-400 italic">No actions</span>
                    )}
              </div>
              </div>
          ))
        )}
      </div>
    </div>
  );
}
