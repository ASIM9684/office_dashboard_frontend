import { useEffect, useState } from "react";
import { User, Pencil, Trash2, PlusCircle, UserCog } from "lucide-react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { showSuccessToast } from "../../utils/toast";

export default function DepartmentPage() {
  const [Department, setDepartment] = useState([]);
  const router = useNavigate();

  useEffect(() => {
    const fetchDepartment = async () => {
      try {
        const response = await axios.get("https://d62ae724-87d9-42ad-8e0f-dc494d585f28-00-2llp35q3d5uj8.pike.replit.dev/getDepartments");
        setDepartment(response.data);
      } catch (error) {
        console.error("Error fetching Department:", error);
      }
    };
    fetchDepartment();
  }, []);

  const handleDelete = (id) => {
    if (window.confirm("Are you sure you want to delete this Deaprtment?")) {
      axios
        .delete(`https://d62ae724-87d9-42ad-8e0f-dc494d585f28-00-2llp35q3d5uj8.pike.replit.dev/deleteDepartment/${id}`)
        .then(() => {
          setDepartment((prev) => prev.filter((emp) => emp._id !== id));
           showSuccessToast("Department Deleted Successfully")
        })
        .catch((error) => {
          console.error("Error deleting Department:", error);
        });
    }
  };

  const handleEdit = (Department) => {
    router("/edit-Department", { state: { Department } });
  };

  const goToAddDepartment = () => {
    router("/add-Department");
  };

  return (
    <div className="max-w-6xl mx-auto mt-6 px-4">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-4 gap-4">
        <div className="flex items-center gap-2">
          <UserCog className="text-blue-600 w-6 h-6" />
          <h1 className="text-xl sm:text-2xl font-bold text-gray-800">Department</h1>
        </div>
        <button
          onClick={goToAddDepartment}
          className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition"
        >
          <PlusCircle size={18} />
          <span className="text-sm">Add Department</span>
        </button>
      </div>

      {/* Desktop Table */}
      <div className="hidden md:block">
        <table className="w-full text-sm md:text-base text-left table-auto rounded-lg shadow bg-white">
          <thead className="bg-blue-600 text-white">
            <tr>
              <th className="py-3 px-4">Name</th>
              <th className="py-3 px-4">Created Date</th>
              <th className="py-3 px-4 text-center">Actions</th>
            </tr>
          </thead>
          <tbody>
            {Department.map((emp) => (
              <tr key={emp._id} className="border-b hover:bg-gray-50 transition">
                <td className="py-3 px-4">{emp.name}</td>
                <td className="py-3 px-4">
                  {emp.createdAt ? new Date(emp.createdAt).toLocaleDateString() : ""}
                </td>
                <td className="py-3 px-4 text-center">
                  <div className="flex justify-center gap-2">
                    <button
                      onClick={() => handleEdit(emp)}
                      className="text-blue-600 hover:text-blue-800 transition"
                      title="Edit"
                    >
                      <Pencil size={18} />
                    </button>
                    <button
                      onClick={() => handleDelete(emp._id)}
                      className="text-red-600 hover:text-red-800 transition"
                      title="Delete"
                    >
                      <Trash2 size={18} />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
            {Department.length === 0 && (
              <tr>
                <td colSpan="6" className="text-center py-6 text-gray-500">
                  No Department found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Mobile Card View */}
      <div className="md:hidden space-y-4">
        {Department.length === 0 ? (
          <p className="text-center text-gray-500">No Department found.</p>
        ) : (
          Department.map((emp) => (
            <div
              key={emp._id}
              className="bg-white rounded-lg shadow p-4 border border-gray-200"
            >
              <div className="text-lg font-semibold text-gray-800">{emp.name}</div>
              <div className="text-sm text-gray-600 mb-3">
                <strong>Join Date:</strong>{" "}
                {emp.createdAt ? new Date(emp.createdAt).toLocaleDateString() : ""}
              </div>
              <div className="flex gap-4">
                <button
                  onClick={() => handleEdit(emp)}
                  className="text-blue-600 hover:text-blue-800 transition"
                  title="Edit"
                >
                  <Pencil size={18} />
                </button>
                <button
                  onClick={() => handleDelete(emp._id)}
                  className="text-red-600 hover:text-red-800 transition"
                  title="Delete"
                >
                  <Trash2 size={18} />
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
