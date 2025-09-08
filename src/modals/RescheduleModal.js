import React, { useState } from "react";
import { X } from "lucide-react";
const RescheduleModal = ({ appointment, onClose, onSubmit }) => {
    const [newDate, setNewDate] = useState(appointment.date);
    const [newTime, setNewTime] = useState(appointment.time);
    const [reason, setReason] = useState("");
    const availableTimes = [
        "09:00", "09:30", "10:00", "10:30", "11:00", "11:30",
        "14:00", "14:30", "15:00", "15:30", "16:00", "16:30",
    ];
    const handleSubmit = (e) => {
        e.preventDefault();
        onSubmit(newDate, newTime, reason);
    };
    return (<div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg max-w-md w-full mx-4">
        <div className="p-6 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold text-gray-900">Reschedule Appointment</h3>
            <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
              <X size={20}/>
            </button>
          </div>
        </div>
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Current Date & Time
            </label>
            <p className="text-sm text-gray-600 bg-gray-50 p-2 rounded">
              {appointment.date} at {appointment.time}
            </p>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              New Date
            </label>
            <input type="date" value={newDate} onChange={(e) => setNewDate(e.target.value)} min={new Date().toISOString().split("T")[0]} className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" required/>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              New Time
            </label>
            <select value={newTime} onChange={(e) => setNewTime(e.target.value)} className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" required>
              {availableTimes.map((time) => (<option key={time} value={time}>
                  {time}
                </option>))}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Reason for Reschedule
            </label>
            <textarea value={reason} onChange={(e) => setReason(e.target.value)} placeholder="Enter reason for rescheduling..." className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" rows={3}/>
          </div>
          <div className="flex justify-end space-x-3 pt-4">
            <button type="button" onClick={onClose} className="px-4 py-2 text-gray-600 hover:text-gray-800">
              Cancel
            </button>
            <button type="submit" className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
              Reschedule
            </button>
          </div>
        </form>
      </div>
    </div>);
};
export default RescheduleModal;
