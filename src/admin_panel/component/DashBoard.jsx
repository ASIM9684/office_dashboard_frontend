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
import AttendanceOwnCard from "./cards/AttendanceOwnCard";
import axios from "axios";
import { showErrorToast, showSuccessToast } from "../utils/toast";

const Dashboard = () => {
  const [clockInTime, setClockInTime] = useState(0);
  const [breakTime, setBreakTime] = useState(0);
  const [clockInRunning, setClockInRunning] = useState(false);
  const [breakRunning, setBreakRunning] = useState(false);
  const [attendanceData, setAttendanceData] = useState([]);
  const [chartData, setChartData] = useState([]);
  const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth()); // 0 = Jan, ..., 11 = Dec
  const [startTime, setStartTime] = useState(null);
  const [departmentData, setDepartmentData] = useState([]);
  const [counts, setCounts] = useState({
    departmentCount: 0,
    userCount: 0,
    attendanceCount: 0,
  });

  useEffect(() => {
    const fetchCounts = async () => {
      try {
        const res = await axios.get(
          "https://office-dashboard-backend.zeabur.app/getDashboardCounts"
        );
        setCounts(res.data);
      } catch (err) {
        console.error("Failed to fetch dashboard counts", err);
      }
    };
    const fetchdepartmentData = async () => {
      try {
        const res = await axios.get(
          "https://office-dashboard-backend.zeabur.app/getUserCountByDepartment"
        );
        setDepartmentData(res.data);
      } catch (err) {
        console.error("Failed to fetch department data", err);
      }
    };
    fetchdepartmentData();
    fetchCounts();
  }, []);

  useEffect(() => {
    const fetchAttendanceData = async () => {
      try {
        const token = localStorage.getItem("token");
        const decoded = jwtDecode(token);
        const userId = decoded.userId;
        const res = await fetch(
          `https://office-dashboard-backend.zeabur.app/getAttendenceById/${userId}`
        );
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

    const formatted = filtered.map((entry) => {
      const clockTimeStr =
        typeof entry.clockTime === "string" ? entry.clockTime : "00:00:00";
      const breakTimeStr =
        typeof entry.breakTime === "string" ? entry.breakTime : "00:00:00";
      return {
        day: new Date(entry.createdAt).toLocaleDateString("default", {
          day: "numeric",
          month: "short",
        }),
        clockTime: /^\d{2}:\d{2}:\d{2}$/.test(clockTimeStr)
          ? toSeconds(clockTimeStr)
          : 0,
        breakTime: /^\d{2}:\d{2}:\d{2}$/.test(breakTimeStr)
          ? toSeconds(breakTimeStr)
          : 0,
      };
    });

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
    const endTime = new Date().toISOString();

    try {
      const token = localStorage.getItem("token");
      const decoded = jwtDecode(token);
      const userId = decoded.userId;

      const res = await fetch(
        "https://office-dashboard-backend.zeabur.app/addAttendance",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            clockTime: clockTimeStr,
            breakTime: breakTimeStr,
            userId,
            startTime,
            endTime,
          }),
        }
      );

      const data = await res.json();
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

  useEffect(() => {
    const fetchTodayAttendance = async () => {
      try {
        const token = localStorage.getItem("token");
        const decoded = jwtDecode(token);
        const userId = decoded.userId;

        const res = await axios.get(`https://office-dashboard-backend.zeabur.app/getTodayAttendanceByUser/${userId}`);
        const data = res.data;

        if (data?.startTime) {
          const clockInElapsed = Math.floor((Date.now() - new Date(data.startTime)) / 1000);
          setClockInTime(clockInElapsed);
          setStartTime(data.startTime);
          setClockInRunning(true);
        }

        if (data?.breakTime) {
          const [h, m, s] = data.breakTime.split(":").map(Number);
          const breakInSeconds = h * 3600 + m * 60 + s;
          setBreakTime(breakInSeconds);
          if (data?.status === "On Break") {

            setBreakRunning(true);
          }
          else {
            setBreakRunning(false);
          }
        }

      } catch (err) {
        console.error("Failed to fetch today's attendance:", err);
      }
    };

    fetchTodayAttendance();
  }, []);

  const todayAttendance = (status) => {
    const token = localStorage.getItem("token");
    const decoded = jwtDecode(token);
    const userId = decoded.userId;
    const start = new Date().toISOString();
    axios
      .post(
        `https://office-dashboard-backend.zeabur.app/addTodayAttendance`,
        {
          userId,
          startTime: start,
          status,
        }
      )
      .then((res) => {
        if (res.status === 201) {
          localStorage.setItem("attendanceId", res.data.attendance._id);
        } else {
          console.error("Failed to submit attendance:", res.data.message);
        }
      })
      .catch((error) => {
        console.error("Error submitting attendance:", error);
      });
  };

  const updatetodayattendance = async (status, shouldSetEndTime = false) => {
    try {
      const token = localStorage.getItem("token");
      const decoded = jwtDecode(token);
      const userId = decoded.userId;


      const endTime = shouldSetEndTime ? new Date().toISOString() : null;
      const formattedBreakTime = formatTime(breakTime);
      await axios.put(
        `https://office-dashboard-backend.zeabur.app/updatetodayattendance/${userId}`,
        {
          status,
          endTime,
          breakTime: formattedBreakTime
        }
      );
    } catch (error) {
      console.error("Error updating attendance:", error);
    }
  };
  const pieColors = ["#3B82F6", "#10B981", "#F59E0B", "#EF4444"];

  const [pendingTasks, setPendingTasks] = useState([]);
  const [errorAttendance, setErrorAttendance] = useState([]);
  useEffect(() => {
    const fetchTask = async () => {
      try {
        const token = localStorage.getItem("token");
        const decoded = jwtDecode(token);
        const userId = decoded.userId;
        const response = await axios.get(
          `https://office-dashboard-backend.zeabur.app/getPendingTasksByUser/${userId}`
        );
        setPendingTasks(response.data);
      } catch (error) {
        console.log("Error Fetching Pending Task", error);
      }
    };
    const fetchErrorAttendance = async () => {
      try {
        const response = await axios.get(
          `https://office-dashboard-backend.zeabur.app/ErrorAttendance`
        );
        setErrorAttendance(response.data);
      } catch (error) {
        console.log("Error Fetching Attendance", error);
      }
    };
    fetchErrorAttendance();
    fetchTask();
  }, []);

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-6 text-gray-800">Admin Dashboard</h1>

      <div className="flex flex-col md:flex-row md:items-center justify-between mb-6">
        <div className="text-left text-sm text-gray-700  mb-2 md:mb-0 space-y-1">
          <div>Clock In Timer: {formatTime(clockInTime)}</div>
          <div>Break Timer: {formatTime(breakTime)}</div>
        </div>

        <div className="flex gap-x-5">
          <button
            onClick={() => {
              if (clockInRunning) {
                submitAttendance();
                updatetodayattendance("Clock Out", true);
                setClockInRunning(false);
                setBreakRunning(false);
                showSuccessToast("Your Clocked Out");
              } else {
                const start = new Date().toISOString();
                setStartTime(start);
                todayAttendance("Working");
                setClockInRunning(true);
                showSuccessToast("Your Clocked In");
              }
            }}
            className="bg-green-500 py-3 px-6 font-bold text-white rounded min-w-[140px]"
          >
            {clockInRunning ? "Clock Out" : "Clock In"}
          </button>

          <button
            onClick={() => {
              if (!clockInRunning) {
                showErrorToast("First Clock In to Start a Break");
                return;
              }
              setBreakRunning((prev) => {
                const newState = !prev;

                if (newState) {
                  updatetodayattendance("On Break", false);
                  const start = new Date().toISOString();
                  localStorage.setItem("breakStartTime", start);
                  localStorage.setItem("breakRunning", "true");
                  showSuccessToast("Enjoy Your Break");
                } else {
                  updatetodayattendance("Working", false);
                  localStorage.removeItem("breakStartTime");
                  localStorage.setItem("breakRunning", "false");
                  showSuccessToast("Welcome Back");
                }

                return newState;
              });
            }}
            className="bg-blue-700 py-3 px-6 font-bold text-white rounded min-w-[140px]"
          >
            {breakRunning ? "Pause Break" : "Start Break"}
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-10">
        <StatCard
          icon={<Users className="h-6 w-6" />}
          title="Total Employees"
          value={counts.userCount}
        />
        <StatCard
          icon={<Building className="h-6 w-6" />}
          title="Departments"
          value={counts.departmentCount}
        />
        <StatCard
          icon={<CalendarCheck className="h-6 w-6" />}
          title="Today's Attendance"
          value={counts.attendanceCount}
        />
      </div>
      {/* Pending Tasks */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-10">
        <div className="p-6 bg-white shadow-md rounded-xl">
          <h2 className="text-xl font-semibold mb-4 text-gray-800">
            🕐 Pending Tasks
          </h2>
          {pendingTasks.length === 0 ? (
            <p className="text-gray-500">No pending tasks.</p>
          ) : (
            <ul className="space-y-3">
              {pendingTasks.map((task, idx) => (
                <li key={idx} className="p-4 bg-gray-100 rounded-lg">
                  <div className="flex justify-between items-center mb-1">
                    <span className="font-medium text-gray-800">
                      {task.task}
                    </span>
                    <span className="text-sm text-gray-500">
                      {new Date(task.createdAt).toLocaleString("en-GB", {
                        day: "2-digit",
                        month: "short",
                        year: "numeric",
                        hour: "2-digit",
                        minute: "2-digit",
                        hour12: true,
                      })}
                    </span>
                  </div>
                  <div className="text-sm text-gray-600">
                    Assigned by: {task.assignedBy?.name || "Unknown"}
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>
        <div className="bg-white shadow-md rounded-xl p-6">
          <h2 className="text-xl font-semibold mb-4 text-red-600">
            ❌ Error Attendance
          </h2>
          {errorAttendance.length === 0 ? (
            <p className="text-gray-500">No attendance errors.</p>
          ) : (
            <ul className="space-y-2">
              {errorAttendance.map((entry, idx) => {
                const start = new Date(entry.startTime);
                const end =
                  entry.status === "Clocked Out" && entry.endTime
                    ? new Date(entry.endTime)
                    : new Date(); // use current time if not clocked out

                const durationMs = end - start;
                const hours = Math.floor(durationMs / (1000 * 60 * 60));
                const minutes = Math.floor((durationMs / (1000 * 60)) % 60);

                return (
                  <li key={idx} className="p-3 bg-red-100 rounded-lg">
                    <div className="flex justify-between">
                      <span className="font-medium">
                        {entry.userId?.name || "Unknown"}
                      </span>
                      <span className="text-sm text-gray-700">
                        {new Date(entry.startTime).toLocaleString("en-GB", {
                          day: "2-digit",
                          month: "short",
                          year: "numeric",
                          hour: "2-digit",
                          minute: "2-digit",
                          hour12: true,
                        })}
                      </span>
                    </div>
                    <div className="text-sm text-gray-600">
                      Issue: Hasn't Clocked Out
                    </div>
                    <div className="text-sm text-gray-700">
                      Duration: {hours}h {minutes}m
                    </div>
                  </li>
                );
              })}
            </ul>
          )}
        </div>
      </div>

      {/* Error Attendance */}
      {/* Charts Section */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-10">
        <div className="bg-white rounded-xl p-6 shadow">
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Select Month
            </label>
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

          <h2 className="text-lg font-semibold mb-4">
            Monthly Clock vs Break Time
          </h2>
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
          <h2 className="text-lg font-semibold mb-4">
            Employees by Department
          </h2>
          <ResponsiveContainer width="100%" height={250}>
            <PieChart>
              <Pie
                data={departmentData}
                dataKey="userCount"
                nameKey="departmentName"
                cx="50%"
                cy="50%"
                outerRadius={80}
                fill="#8884d8"
                label
              >
                {departmentData.map((entry, index) => (
                  <Cell
                    key={`cell-${index}`}
                    fill={pieColors[index % pieColors.length]}
                  />
                ))}
              </Pie>
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Management Sections */}
      <div className="bg-white rounded-xl p-6 shadow mb-10">
        <AttendanceOwnCard />
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
