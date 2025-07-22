import { jwtDecode } from "jwt-decode";
import {
  Users,
  Building,
  CalendarCheck,
  FileText,
  ClipboardList,
  Clock,
  X,
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
  const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth());
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
      updatetodayattendance("Clock Out", true);

    } catch (err) {
      console.error("Error submitting attendance:", err);
      alert("Server error");
    }
  };

  const [startTimestamp, setStartTimestamp] = useState(null);

  useEffect(() => {
    let interval;

    if (clockInRunning && startTimestamp) {
      interval = setInterval(() => {
        const elapsed = Math.floor((Date.now() - new Date(startTimestamp)) / 1000);
        setClockInTime(elapsed);
      }, 1000);
    }

    return () => clearInterval(interval);
  }, [clockInRunning, startTimestamp]);


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
          setStartTimestamp(data.startTime);
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

  const todayAttendance = async (status) => {
    try {
      const token = localStorage.getItem("token");
      const decoded = jwtDecode(token);
      const userId = decoded.userId;
      const name = decoded.name;
      const start = new Date().toISOString();


      // 2. Log to today's attendance
      const res = await axios.post("https://office-dashboard-backend.zeabur.app/addTodayAttendance", {
        userId,
        startTime: start,
        status,
      });

      if (res.status === 201) {
        localStorage.setItem("attendanceId", res.data.attendance._id);
        setStartTimestamp(start);
        setStartTime(start);
        setClockInRunning(true);
        showSuccessToast("You're Clocked In");
        await axios.post("https://office-dashboard-backend.zeabur.app/clockSheet", {
          name: name,
          status: status,
          clockedInTime: new Date(start).toLocaleString(),
          clockedOutTime: "",
          breakTime: "",
          comment: "Started Working",
        });
      } else {
        console.error("Failed to submit attendance:", res.data.message);
        showErrorToast(res.data.message || "Failed to clock in");
      }

    } catch (error) {
      console.error("Error submitting attendance:", error);
      const errorMsg = error.response?.data?.message || "Something went wrong";
      showErrorToast(errorMsg);
    }
  };

  const updatetodayattendance = async (status, shouldSetEndTime = false) => {
    try {
      const time = new Date(startTime).toLocaleString();
      console.log(time);

      const token = localStorage.getItem("token");
      const decoded = jwtDecode(token);
      const userId = decoded.userId;
      const name = decoded.name;

      const endTime = shouldSetEndTime ? new Date().toISOString() : null;
      const formattedBreakTime = formatTime(breakTime);
      const comment =
        status === "On Break"
          ? "On Break"
          : status === "Clock Out"
            ? "Clock Out"
            : status === "Working"
              ? "Working"
              : "";

      axios.post(`https://office-dashboard-backend.zeabur.app/updateclockSheet`, {
        name,
        status,
        clockInTime: time,
        clockedOutTime: shouldSetEndTime ? new Date().toLocaleString() : "",
        breakTime: formattedBreakTime,
        comment: comment,
      }).catch(err => {
        console.warn("Google Sheet update failed (not blocking):", err?.response?.data?.message || err.message);
      });;



      await axios.put(
        `https://office-dashboard-backend.zeabur.app/updatetodayattendance/${userId}`,
        {
          status,
          endTime: shouldSetEndTime ? new Date().toISOString() : null,
          breakTime: formattedBreakTime
        }
      );
      const message =
        status === "On Break"
          ? "Enjoy your break!"
          : status === "Working"
            ? "Welcome back to work!"
            : status === "Clock Out"
              ? "You have successfully clocked out."
              : "Status updated.";

      if (status === "Clock Out") {
        setClockInRunning(false);
        setBreakRunning(false);
        setClockInTime(0);
        setStartTimestamp(null);
      }
      else if (status === "Working") {
        setBreakRunning(false);
      }
      showSuccessToast(message);
    } catch (error) {
      const errorMessage = error.response?.data?.message || "Something went wrong";
      showErrorToast(errorMessage);
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
    <div className="">
      <div className="flex flex-col md:flex-row md:items-center justify-between mb-3">
        <h1 className="text-2xl font-bold mb-6 text-gray-800">Dashboard</h1>

        <div className="flex items-center gap-x-5 mb-6">
          <div className="text-left text-md text-gray-700  mb-2 md:mb-0 space-y-1 font-semibold">
            {
              breakRunning ? (
                <div>Break Timer: {formatTime(breakTime)}</div>
              ) : (
                <div>{clockInRunning ? "Currently" : ""} Clock In Timer: {formatTime(clockInTime)}</div>
              )
            }
          </div>
          <button
            onClick={() => {
              if (clockInRunning) {
                submitAttendance();
              } else {
                todayAttendance("Working");
              }
            }}
            className="bg-green-500 hover:bg-green-600 py-2 px-4 font-semibold text-white rounded min-w-[120px] min-h-[45px]"
          >
            {clockInRunning ? "Clock Out" : "Clock In"}
          </button>
          {clockInRunning && (

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
                  } else {
                    updatetodayattendance("Working", false);
                  }

                  return newState;
                });
              }}
              className="bg-[#ff0] hover:bg-[#ecec2e] border border-slateblue  py-2 px-4 font-semibold text-slateblue rounded min-w-[120px] min-h-[45px]"
            >
              {breakRunning ? "Pause Break" : "Start Break"}
            </button>
          )
          }
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
          <h2 className="text-xl font-semibold mb-4 text-gray-800 flex items-center gap-2">
            <Clock/> Pending Tasks
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
          <h2 className="text-xl font-semibold mb-4 text-red-600 flex items-center gap-2">
        <X color="red" strokeWidth={3} /> <span>Error Attendance</span>

          </h2>
          {errorAttendance.length === 0 ? (
            <p className="text-gray-500">No attendance errors.</p>
          ) : (
            <ul className="space-y-2">
              {errorAttendance.map((entry, idx) => {
                const start = new Date(entry.startTime);
                const end =
                  entry.status === "Clock Out" && entry.endTime
                    ? new Date(entry.endTime)
                    : new Date();

                const message = entry.status == "Clock Out" ? "Clock Out" : "Hasn't Clocked Out";

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
                      Issue: {message}
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
    <div className="bg-blue-100 text-slateblue p-3 rounded-full">{icon}</div>
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
    <button className="mt-4 text-sm text-slateblue font-medium hover:underline">
      Go to {title}
    </button>
  </div>
);

export default Dashboard;
