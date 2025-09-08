import React from "react";
import { User, RefreshCw, CheckCircle, Eye } from "lucide-react";
const AppointmentCard = ({ appointment, patient, onReschedule, onApprove, onViewResults }) => {
    const getStatusColor = (status) => {
        switch (status) {
            case "scheduled": return "bg-yellow-100 text-yellow-800";
            case "in-progress": return "bg-blue-100 text-blue-800";
            case "lab-completed": return "bg-purple-100 text-purple-800";
            case "completed": return "bg-green-100 text-green-800";
            default: return "bg-gray-100 text-gray-800";
        }
    };
    const getStatusText = (status) => {
        switch (status) {
            case "scheduled": return "Pending Approval";
            case "in-progress": return "Lab Processing";
            case "lab-completed": return "Results Ready";
            case "completed": return "Completed";
            default: return status;
        }
    };
    return (<div className="p-6 hover:bg-gray-50 transition-colors">
      <div className="flex items-start justify-between">
        <div className="flex items-start space-x-4">
          <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
            <User size={20} className="text-blue-600"/>
          </div>
          <div className="flex-1">
            <div className="flex items-center space-x-3 mb-2">
              <h3 className="text-lg font-medium text-gray-900">{patient?.name || "Unknown Patient"}</h3>
              <span className="text-sm text-gray-500">{patient?.email}</span>
            </div>
            <div className="flex items-center space-x-4 mb-3">
              <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(appointment.status)}`}>
                {getStatusText(appointment.status)}
              </span>
              <span className="text-sm text-gray-600">Date: {appointment.date}</span>
              <span className="text-sm text-gray-600">Time: {appointment.time}</span>
            </div>
            <div className="mb-3">
              <p className="text-sm text-gray-600 mb-1">Requested Tests:</p>
              <div className="flex flex-wrap gap-2">
                {appointment.tests.map((test, index) => (<span key={index} className="inline-flex px-2 py-1 text-xs bg-blue-50 text-blue-700 rounded">
                    {test.name} - ${test.price}
                  </span>))}
              </div>
            </div>
            {appointment.doctorApproved && (<div className="text-xs text-green-600 mb-2">
                <span className="font-medium">✅ Approved for Lab Processing</span>
                {appointment.approvedAt && (<span className="ml-2">on {new Date(appointment.approvedAt).toLocaleString()}</span>)}
              </div>)}
          </div>
        </div>
        <div className="flex items-center space-x-2">
          <button onClick={onReschedule} className="px-3 py-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors flex items-center space-x-1" title="Reschedule Appointment">
            <RefreshCw size={16}/>
            <span className="text-sm">Reschedule</span>
          </button>
          {!appointment.doctorApproved ? (<button onClick={onApprove} className="px-3 py-2 bg-green-600 text-white text-sm rounded-lg hover:bg-green-700 transition-colors flex items-center space-x-1" title="Approve & Forward to Lab">
              <CheckCircle size={16}/>
              <span>Approve & Forward</span>
            </button>) : appointment.status === "lab-completed" ? (<button onClick={onViewResults} className="px-3 py-2 bg-purple-600 text-white text-sm rounded-lg hover:bg-purple-700 transition-colors flex items-center space-x-1" title="Review & Approve Results">
              <Eye size={16}/>
              <span>Review Results</span>
            </button>) : (<div className="flex items-center text-green-600" title="Approved for Lab">
              <CheckCircle size={20}/>
              <span className="text-xs ml-1">Approved</span>
            </div>)}
        </div>
      </div>
    </div>);
};
export default AppointmentCard;
