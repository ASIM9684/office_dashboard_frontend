import { jwtDecode } from "jwt-decode";
import {
  Users,
  Building,
  CalendarCheck,
  FileText,
  ClipboardList,
} from "lucide-react";
import { useEffect, useState } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Legend,
} from "recharts";

const Dashboard = () => {
  const [clockInTime, setClockInTime] = useState(0);
  const [breakTime, setBreakTime] = useState(0);
  const [clockInRunning, setClockInRunning] = useState(false);
  const [breakRunning, setBreakRunning] = useState(false);
  const [attendanceData, setAttendanceData] = useState([]);
  const [chartData, setChartData] = useState([]);
const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth()); // 0 = Jan, ..., 11 = Dec

 useEffect(() => {
    const fetchAttendanceData = async () => {
      try {
        const token = localStorage.getItem("token");
        const decoded = jwtDecode(token);
        const userId = decoded.userId;
        const res = await fetch(`https://6c14ece9-c0bc-4b02-b5b0-b5526dc05b8e-00-bw55jwex1z46.sisko.replit.dev/getAttendenceById/${userId}`);
        const data = await res.json();
        if (res.ok) {
          setAttendanceData(data);
        } else {
          console.error("Failed to fetch attendance data:", data.message);
        }
      } catch (err) {
        console.error("Error fetching attendance data:", err);
      }
    };
    fetchAttendanceData();
  }, []);

useEffect(() => {
  if (attendanceData.length === 0) return;

  const toSeconds = (timeStr) => {
    const [h, m, s] = timeStr.split(":").map(Number);
    return h * 3600 + m * 60 + s;
  };

  const filtered = attendanceData.filter((entry) => {
    const date = new Date(entry.createdAt);
    return date.getMonth() === selectedMonth;
  });

  const formatted = filtered.map((entry) => ({
    day: new Date(entry.createdAt).toLocaleDateString("default", {
      day: "numeric",
      month: "short",
    }),
    clockTime: toSeconds(entry.clockTime),
    breakTime: toSeconds(entry.breakTime),
  }));

  setChartData(formatted);
}, [attendanceData, selectedMonth]);

  const formatSeconds = (seconds) => {
    const h = String(Math.floor(seconds / 3600)).padStart(2, "0");
    const m = String(Math.floor((seconds % 3600) / 60)).padStart(2, "0");
    const s = String(seconds % 60).padStart(2, "0");
    return `${h}:${m}:${s}`;
  };

  const submitAttendance = async () => {
    const clockTimeStr = formatTime(clockInTime);
    const breakTimeStr = formatTime(breakTime);

    try {
      const token = localStorage.getItem('token');
      const decoded = jwtDecode(token);
      const userId = decoded.userId;

      const res = await fetch("https://6c14ece9-c0bc-4b02-b5b0-b5526dc05b8e-00-bw55jwex1z46.sisko.replit.dev/addAttendance", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          clockTime: clockTimeStr,
          breakTime: breakTimeStr,
          userId,
        }),
      });

      const data = await res.json();
      if (res.ok) {
        alert("Attendance submitted!");
        console.log("Saved Attendance:", data);
      } else {
        alert(data.message || "Failed to submit");
      }
    } catch (err) {
      console.error("Error submitting attendance:", err);
      alert("Server error");
    }
  };

  useEffect(() => {
    let clockInInterval;
    if (clockInRunning) {
      clockInInterval = setInterval(() => {
        setClockInTime((prev) => prev + 1);
      }, 1000);
    } else {
      setClockInTime(0);
      setBreakTime(0);
      setBreakRunning(false);
    }
    return () => clearInterval(clockInInterval);
  }, [clockInRunning]);

  useEffect(() => {
    let breakInterval;
    if (breakRunning) {
      breakInterval = setInterval(() => {
        setBreakTime((prev) => prev + 1);
      }, 1000);
    }
    return () => clearInterval(breakInterval);
  }, [breakRunning]);

  const formatTime = (time) => {
    const hrs = String(Math.floor(time / 3600)).padStart(2, "0");
    const mins = String(Math.floor((time % 3600) / 60)).padStart(2, "0");
    const secs = String(time % 60).padStart(2, "0");
    return `${hrs}:${mins}:${secs}`;
  };

  const formatSecondsToHHMMSS = (totalSeconds) => {
    const hrs = String(Math.floor(totalSeconds / 3600)).padStart(2, '0');
    const mins = String(Math.floor((totalSeconds % 3600) / 60)).padStart(2, '0');
    const secs = String(totalSeconds % 60).padStart(2, '0');
    return `${hrs}:${mins}:${secs}`;
  };

  const departmentData = [
    { name: "HR", value: 10 },
    { name: "IT", value: 40 },
    { name: "Finance", value: 20 },
    { name: "Sales", value: 30 },
  ];

  const pieColors = ["#3B82F6", "#10B981", "#F59E0B", "#EF4444"];

  return (
    <div className="p-4">
    
      <h1 className="text-2xl font-bold mb-6 text-gray-800">Admin Dashboard</h1>

      <div className="flex items-center justify-between mb-6">
        <div className="text-left text-sm text-gray-700">
          <div>Clock In Timer: {formatTime(clockInTime)}</div>
          <div>Break Timer: {formatTime(breakTime)}</div>
        </div>

        <div className="flex gap-x-5">
          <button
            onClick={() => {
              if (clockInRunning) {
                submitAttendance();
              }
              setClockInRunning((prev) => !prev);
            }}
            className="bg-green-500 py-3 px-6 font-bold text-white rounded min-w-[140px]"
          >
            {clockInRunning ? "Clock Out" : "Clock In"}
          </button>

          <button
            onClick={() => setBreakRunning((prev) => !prev)}
            className="bg-blue-700 py-3 px-6 font-bold text-white rounded min-w-[140px]"
          >
            {breakRunning ? "Pause Break" : "Start Break"}
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-10">
        <StatCard icon={<Users className="h-6 w-6" />} title="Total Employees" value="120" />
        <StatCard icon={<Building className="h-6 w-6" />} title="Departments" value="8" />
        <StatCard icon={<CalendarCheck className="h-6 w-6" />} title="Pending Leaves" value="5" />
        <StatCard icon={<ClipboardList className="h-6 w-6" />} title="Active Roles" value="15" />
        <StatCard icon={<FileText className="h-6 w-6" />} title="Payroll Reports" value="12" />
        <StatCard icon={<Users className="h-6 w-6" />} title="Today's Attendance" value="103" />
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-10">
        <div className="bg-white rounded-xl p-6 shadow">
            <div className="mb-6">
  <label className="block text-sm font-medium text-gray-700 mb-1">Select Month</label>
  <select
    value={selectedMonth}
    onChange={(e) => setSelectedMonth(Number(e.target.value))}
    className="p-2 border border-gray-300 rounded w-64"
  >
    {Array.from({ length: 12 }, (_, i) => (
      <option key={i} value={i}>
        {new Date(0, i).toLocaleString("default", { month: "long" })}
      </option>
    ))}
  </select>
</div>

          <h2 className="text-lg font-semibold mb-4">Monthly Clock vs Break Time</h2>
         <ResponsiveContainer width="100%" height={300}>
        <BarChart data={chartData}>
          <XAxis dataKey="day" />
          <YAxis tickFormatter={formatSeconds} />
          <Tooltip
            formatter={(value) => formatSeconds(value)}
            labelFormatter={(label) => `Day: ${label}`}
          />
          <Legend />
          <Bar dataKey="clockTime" fill="#3B82F6" name="Clock Time" />
          <Bar dataKey="breakTime" fill="#F59E0B" name="Break Time" />
        </BarChart>
      </ResponsiveContainer>
        </div>

        <div className="bg-white rounded-xl p-6 shadow">
          <h2 className="text-lg font-semibold mb-4">Employees by Department</h2>
          <ResponsiveContainer width="100%" height={250}>
            <PieChart>
              <Pie
                data={departmentData}
                dataKey="value"
                nameKey="name"
                cx="50%"
                cy="50%"
                outerRadius={80}
                fill="#8884d8"
                label
              >
                {departmentData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={pieColors[index % pieColors.length]} />
                ))}
              </Pie>
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Management Sections */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <ManageCard
          title="Manage Employees"
          description="Add, edit, or remove employee records."
        />
        <ManageCard
          title="Manage Departments & Roles"
          description="Organize departments and define role-based permissions."
        />
        <ManageCard
          title="Leave Approvals"
          description="Review and approve/reject leave requests."
        />
        <ManageCard
          title="Attendance & Payroll"
          description="Generate attendance logs and payroll summaries."
        />
      </div>
    </div>
  );
};

const StatCard = ({ icon, title, value }) => (
  <div className="bg-white rounded-xl p-4 shadow flex items-center gap-4">
    <div className="bg-blue-100 text-blue-600 p-3 rounded-full">{icon}</div>
    <div>
      <p className="text-sm text-gray-600">{title}</p>
      <p className="text-xl font-semibold">{value}</p>
    </div>
  </div>
);

const ManageCard = ({ title, description }) => (
  <div className="bg-white shadow rounded-xl p-6 hover:shadow-md transition">
    <h3 className="text-lg font-semibold mb-2 text-gray-800">{title}</h3>
    <p className="text-sm text-gray-600">{description}</p>
    <button className="mt-4 text-sm text-blue-600 font-medium hover:underline">
      Go to {title}
    </button>
  </div>
);

export default Dashboard;
