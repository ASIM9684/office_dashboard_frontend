import { useEffect, useState } from "react";
import { jwtDecode } from "jwt-decode";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import { showSuccessToast } from "../../utils/toast";

// Utility functions
const parseTimeStringToSeconds = (timeStr) => {
  const [h, m, s] = timeStr.split(":").map(Number);
  return h * 3600 + m * 60 + s;
};

const formatSecondsToHHMMSS = (totalSeconds) => {
  const h = Math.floor(totalSeconds / 3600);
  const m = Math.floor((totalSeconds % 3600) / 60);
  const s = Math.floor(totalSeconds % 60);
  return [h, m, s].map((v) => String(v).padStart(2, "0")).join(":");
};

// Attendance Card Component
const AttendanceCard = ({ clockIn, clockOut, breakTime, workDuration }) => (
  <div className="bg-white shadow rounded-xl p-4 mb-4 w-full">
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
      <div>
        <span className="font-medium text-gray-700">🕘 Clock In:</span>
        <div className="text-gray-800">{clockIn}</div>
      </div>
      <div>
        <span className="font-medium text-gray-700">🕔 Clock Out:</span>
        <div className="text-gray-800">{clockOut}</div>
      </div>
      <div>
        <span className="font-medium text-gray-700">☕ Break Time:</span>
        <div className="text-gray-800">{breakTime}</div>
      </div>
      <div>
        <span className="font-medium text-gray-700">💼 Work Duration:</span>
        <div className="text-gray-800">{workDuration}</div>
      </div>
    </div>
  </div>
);

// Main Component
const AttendanceOwnCard = () => {
  const [attendanceData, setAttendanceData] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedMonth, setSelectedMonth] = useState(() => {
    const now = new Date();
    return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}`;
  });

  const exportToPDF = () => {
    const token = localStorage.getItem("token");
    const decoded = jwtDecode(token);
    const userName = decoded.name;

    const doc = new jsPDF();
    doc.setFontSize(16);
    doc.text("Attendance Report", 14, 15);
    doc.setFontSize(12);
    doc.text(`User: ${userName}`, 14, 23);

    const tableData = filteredData.map((entry) => {
      const start = new Date(entry.startTime);
      const end = entry.endTime ? new Date(entry.endTime) : null;
      
      const breakTime = entry.breakTime || "00:00:00";

      let workDuration = "—";
      if (end) {
        const workSecs = (end - start) / 1000;
        workDuration = formatSecondsToHHMMSS(workSecs > 0 ? workSecs : 0);
      }
          //  const clockIn = start.toLocaleString();
          //       const clockOut = end ? end.toLocaleString() : "—";
      return [
        start.toLocaleString(),
        end ? end.toLocaleString() : "—",
        breakTime,
        workDuration,
      ];
    });

    autoTable(doc, {
      head: [["Clock In", "Clock Out", "Break Time", "Work Duration"]],
      body: tableData,
      startY: 30,
      styles: { fontSize: 10 },
    });

    const summaryY = doc.lastAutoTable.finalY + 10;

    let totalBreakSeconds = 0;
    let totalWorkSeconds = 0;

    filteredData.forEach((entry) => {
      const start = new Date(entry.startTime);
      const end = entry.endTime ? new Date(entry.endTime) : null;
      const breakSecs = parseTimeStringToSeconds(entry.breakTime || "00:00:00");

      if (start && end) {
        const workSecs = (end - start) / 1000 - breakSecs;
        totalWorkSeconds += workSecs > 0 ? workSecs : 0;
      }

      totalBreakSeconds += breakSecs;
    });

    const totalWork = formatSecondsToHHMMSS(totalWorkSeconds);
    const totalBreak = formatSecondsToHHMMSS(totalBreakSeconds);

    doc.text(`Total Work Time: ${totalWork}`, 14, summaryY);
    doc.text(`Total Break Time: ${totalBreak}`, 14, summaryY + 8);

    const fileName = `Attendance_Report_${selectedMonth}.pdf`;
    doc.save(fileName);
 showSuccessToast("Attendance Record Generated Successfully");
  };

  useEffect(() => {
    const fetchAttendance = async () => {
      try {
        const token = localStorage.getItem("token");
        const decoded = jwtDecode(token);
        const id = decoded.userId;
        const res = await fetch(`https://fb9759c5-4ae7-4c96-8cf7-e24bd6228144-00-ncf9c4z1e6yi.pike.replit.dev/getAttendenceById/${id}`);
        const data = await res.json();
        if (!res.ok) throw new Error(data.message || "Failed to fetch");
        setAttendanceData(data);
        setLoading(false);
      } catch (err) {
        console.error("Fetch error:", err);
        setLoading(false);
      }
    };

    fetchAttendance();
  }, []);

  useEffect(() => {
    const [year, month] = selectedMonth.split("-");
    const filtered = attendanceData.filter((entry) => {
      const entryDate = new Date(entry.createdAt);
      return (
        entryDate.getFullYear() === parseInt(year) &&
        entryDate.getMonth() === parseInt(month) - 1
      );
    });
    setFilteredData(filtered);
  }, [attendanceData, selectedMonth]);

  const handleMonthChange = (e) => {
    setSelectedMonth(e.target.value);
  };

  return (
    <div className="min-h-screen rounded p-4">
      <div className=" mx-auto">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between mb-6">
          <h1 className="text-2xl font-bold text-gray-800">🗓️ Attendance Records</h1>
<div className="mt-4 md:mt-0 flex flex-col md:flex-row gap-2 items-start md:items-center">

            <label className="text-sm font-medium text-gray-700 mr-2">Select Month:</label>
            <input
              type="month"
              value={selectedMonth}
              onChange={handleMonthChange}
              className="border rounded-md px-3 py-1 text-sm text-gray-700"
            />
            <button
              onClick={exportToPDF}
              className="bg-red-600 text-white px-4 py-1 rounded-md text-sm hover:bg-red-700"
            >
              Export PDF
            </button>
          </div>
        </div>

        {loading ? (
          <p className="text-gray-600">Loading attendance...</p>
        ) : filteredData.length === 0 ? (
          <p className="text-gray-500">No records found for selected month.</p>
        ) : (
          <>
            {/* Monthly Summary */}
            <div className="mt-6 p-4 bg-white rounded-xl shadow mb-4">
              <h2 className="text-lg font-semibold text-gray-800 mb-2">🔢 Monthly Summary</h2>
              {(() => {
                let totalBreakSeconds = 0;
                let totalWorkSeconds = 0;

                filteredData.forEach((entry) => {
                  const start = new Date(entry.startTime);
                  const end = entry.endTime ? new Date(entry.endTime) : null;
                  const breakSecs = parseTimeStringToSeconds(entry.breakTime || "00:00:00");

                  if (start && end) {
                    const workSecs = (end - start) / 1000 - breakSecs;
                    totalWorkSeconds += workSecs > 0 ? workSecs : 0;
                  }

                  totalBreakSeconds += breakSecs;
                });

                const totalWork = formatSecondsToHHMMSS(totalWorkSeconds);
                const totalBreak = formatSecondsToHHMMSS(totalBreakSeconds);

                return (
                  <div className="text-sm text-gray-700 space-y-1">
                    <div>
                      Total Work Time: <span className="font-semibold">{totalWork}</span>
                    </div>
                    <div>
                      Total Break Time: <span className="font-semibold">{totalBreak}</span>
                    </div>
                  </div>
                );
              })()}
            </div>

            {/* Attendance Cards */}
            <div className="space-y-4">
              {filteredData.map((entry, idx) => {
                const start = new Date(entry.startTime);
                const end = entry.endTime ? new Date(entry.endTime) : null;
           const clockIn = start.toLocaleString();
                const clockOut = end ? end.toLocaleString() : "—";
                const breakTime = entry.breakTime || "00:00:00";

                let workDuration = "—";
                if (end) {
                  const workSecs = (end - start) / 1000;
                  workDuration = formatSecondsToHHMMSS(workSecs > 0 ? workSecs : 0);
                }

                return (
                  <AttendanceCard
                    key={idx}
                    clockIn={clockIn}
                    clockOut={clockOut}
                    breakTime={breakTime}
                    workDuration={workDuration}
                  />
                );
              })}
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default AttendanceOwnCard;