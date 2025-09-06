import React, { useState } from "react";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import timeGridPlugin from "@fullcalendar/timegrid";
import interactionPlugin from "@fullcalendar/interaction";
import type { CalendarOptions } from "@fullcalendar/core";

const Dashboard: React.FC = () => {
  const [events] = useState([
    {
      id: "1",
      title: "Charlie Nunez - Upper Limb Ultrasound",
      start: "2025-09-12T10:30:00",
      end: "2025-09-12T11:00:00",
      color: "#FF6B6B",
    },
    {
      id: "2",
      title: "Maya Jordan - Wrist CT Scan",
      start: "2025-09-12T09:30:00",
      end: "2025-09-12T11:00:00",
      color: "#4D96FF",
    },
    {
      id: "3",
      title: "Rosalie Underwood - Ankle MRI Scan",
      start: "2025-09-12T13:00:00",
      end: "2025-09-12T13:30:00",
      color: "#6A4C93",
    },
    {
      id: "4",
      title: "Jaime Perry - Chest X-ray",
      start: "2025-09-12T09:30:00",
      end: "2025-09-12T10:00:00",
      color: "#C77DFF",
    },
  ]);

  const calendarOptions: CalendarOptions = {
    plugins: [dayGridPlugin, timeGridPlugin, interactionPlugin],
    initialView: "timeGridDay",
    headerToolbar: {
      left: "",
      center: "title",
      right: "prev,next today",
    },
    slotMinTime: "08:00:00",
    slotMaxTime: "18:00:00",
    allDaySlot: false,
    events: events,
    height: "100%",
  };

  return (
    <div className="flex h-screen bg-gray-100">
      {/* Sidebar */}
      {/* <div className="w-20 bg-blue-600 text-white flex flex-col items-center py-6 space-y-6">
        <button className="hover:bg-blue-700 p-2 rounded">🏠</button>
        <button className="hover:bg-blue-700 p-2 rounded">📅</button>
        <button className="hover:bg-blue-700 p-2 rounded">🧾</button>
        <button className="hover:bg-blue-700 p-2 rounded">⚙️</button>
      </div> */}

      {/* Main Content */}
      <div className="flex-1 flex flex-col">
        {/* Tabs */}
        <div className="flex border-b bg-white px-6 py-3 space-x-6 text-gray-700 font-semibold">
          <span className="cursor-pointer">Visit Type</span>
          <span className="cursor-pointer">Patient’s Profile</span>
          <span className="cursor-pointer">Referral’s Profile</span>
          <span className="cursor-pointer">Exam’s Profile</span>
          <span className="cursor-pointer">Payment Method</span>
          <span className="cursor-pointer">Discharge Profile</span>
        </div>

        <div className="flex flex-1">
          {/* Calendar Section */}
          <div className="flex-1 bg-white p-4 shadow-md">
            <FullCalendar {...calendarOptions} />
          </div>

          {/* Right Panel */}
          <div className="w-80 bg-white border-l p-4 shadow-md flex flex-col">
            <h3 className="font-bold mb-4">Select date</h3>
            <input
              type="date"
              className="border p-2 rounded mb-6"
              defaultValue="2025-09-12"
            />

            <h3 className="font-bold mb-4">Recent Reservations</h3>
            <ul className="space-y-3 text-sm">
              <li className="p-2 bg-gray-50 rounded shadow">
                Brain MRI closed scan
              </li>
              <li className="p-2 bg-gray-50 rounded shadow">Sinuses CT scan</li>
              <li className="p-2 bg-gray-50 rounded shadow">
                Abdomen & pelvis Ultrasound scan
              </li>
              <li className="p-2 bg-gray-50 rounded shadow">
                Knee MRI open scan
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
