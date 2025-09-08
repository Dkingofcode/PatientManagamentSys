import React, { useState } from "react";
import { FileText, X, FileSignature as Signature, AlertCircle, XCircle, CheckCircle } from "lucide-react";
function ResultModal({ appointment, patient, onClose, onApprove, onReject, isLoading, }) {
    const [signature, setSignature] = useState("");
    const [comments, setComments] = useState("");
    const [rejectReason, setRejectReason] = useState("");
    const [showRejectForm, setShowRejectForm] = useState(false);
    const handleApproveSubmit = (e) => {
        e.preventDefault();
        onApprove(signature, comments);
    };
    const handleRejectSubmit = (e) => {
        e.preventDefault();
        onReject(rejectReason);
    };
    const toggleRejectForm = () => {
        setShowRejectForm(!showRejectForm);
        setRejectReason("");
    };
    return (<div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto">
        <div className="p-4 sm:p-6 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold text-gray-900">
              Review & Approve Lab Results
            </h3>
            <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
              <X size={20}/>
            </button>
          </div>
          <p className="text-sm text-gray-600 mt-1">Patient: {patient?.name}</p>
        </div>

        <div className="p-4 sm:p-6 space-y-4 sm:space-y-6">
          {/* Lab Results Display */}
          <div className="bg-gray-50 p-4 rounded-lg">
            <h4 className="font-medium text-gray-900 mb-3 flex items-center">
              <FileText size={16} className="mr-2"/>
              Lab Results
            </h4>
            {isLoading ? (<div className="text-center text-gray-600">
                <p>Loading results...</p>
              </div>) : appointment.results && appointment.results.length > 0 ? (<div className="space-y-3">
                {appointment.tests.map((test, index) => (<div key={index} className="bg-white p-3 rounded border">
                    <h5 className="font-medium text-gray-900">{test.name}</h5>
                    <div className="mt-2 text-sm text-gray-600">
                      <p>
                        <strong>Status:</strong>{" "}
                        {appointment.qcStatus || "Completed"}
                      </p>
                      <p>
                        <strong>Result:</strong>{" "}
                        {appointment.results[index] || "No result available"}
                      </p>
                      <p>
                        <strong>Lab Tech:</strong>{" "}
                        {appointment.assignedLabTech
                    ? `Tech ID: ${appointment.assignedLabTech}`
                    : "Unknown"}
                      </p>
                      <p>
                        <strong>Completed:</strong>{" "}
                        {appointment.completionTime
                    ? new Date(appointment.completionTime).toLocaleString("en-NG", { timeZone: "Africa/Lagos" })
                    : "N/A"}
                      </p>
                    </div>
                  </div>))}
              </div>) : (<div className="text-center text-gray-600">
                <p>No results available for this appointment.</p>
              </div>)}
          </div>

          {/* Uploaded Report Display */}
          {appointment.report && (<div className="bg-purple-50 p-4 rounded-lg">
              <h4 className="font-medium text-purple-900 mb-3 flex items-center">
                <FileText size={16} className="mr-2"/>
                Uploaded Report
              </h4>
              <div className="space-y-2 text-sm text-purple-800">
                <p>
                  <strong>File:</strong> {appointment.report.file.name}
                </p>
                <p>
                  <strong>Uploaded At:</strong>{" "}
                  {new Date(appointment.report.uploadedAt).toLocaleString("en-NG", { timeZone: "Africa/Lagos" })}
                </p>
                <p>
                  <strong>Technician Notes:</strong>{" "}
                  {appointment.report.notes || "No notes provided"}
                </p>
                <button onClick={() => alert(`Simulating download/view of file: ${appointment.report.file.name}`)} className="text-blue-600 hover:text-blue-800 flex items-center space-x-1 text-sm mt-2">
                  <FileText size={14}/>
                  <span>View/Download Report</span>
                </button>
              </div>
            </div>)}

          {/* Approval Form */}
          {!showRejectForm && (<form onSubmit={handleApproveSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Doctor's Comments
                </label>
                <textarea value={comments} onChange={(e) => setComments(e.target.value)} placeholder="Add your professional comments about the results..." className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm" rows={4}/>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Digital Signature
                </label>
                <div className="flex items-center space-x-3">
                  <Signature size={20} className="text-gray-400"/>
                  <input type="text" value={signature} onChange={(e) => setSignature(e.target.value)} placeholder="Type your full name as digital signature" className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm" required/>
                </div>
                <p className="text-xs text-gray-500 mt-1">
                  By typing your name, you digitally sign and approve these
                  results
                </p>
              </div>

              <div className="bg-blue-50 p-4 rounded-lg">
                <div className="flex items-center space-x-2 text-blue-800">
                  <AlertCircle size={16}/>
                  <span className="text-sm font-medium">
                    Results will be securely sent to patient portal with 2FA
                    protection
                  </span>
                </div>
              </div>

              <div className="flex justify-between space-x-3 pt-4">
                <button type="button" onClick={toggleRejectForm} className="px-3 sm:px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 flex items-center space-x-2 text-sm">
                  <XCircle size={16}/>
                  <span>Reject Results</span>
                </button>
                <div className="flex space-x-3">
                  <button type="button" onClick={onClose} className="px-3 sm:px-4 py-2 text-gray-600 hover:text-gray-800 text-sm">
                    Cancel
                  </button>
                  <button type="submit" className="px-3 sm:px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 flex items-center space-x-2 text-sm" disabled={isLoading || !appointment.results?.length} // Disable if loading or no results
        >
                    <CheckCircle size={16}/>
                    <span>Approve & Send to Patient</span>
                  </button>
                </div>
              </div>
            </form>)}

          {/* Rejection Form */}
          {showRejectForm && (<form onSubmit={handleRejectSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Reason for Rejection
                </label>
                <textarea value={rejectReason} onChange={(e) => setRejectReason(e.target.value)} placeholder="Provide the reason for rejecting these results..." className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm" rows={4} required/>
              </div>

              <div className="flex justify-between space-x-3 pt-4">
                <button type="button" onClick={toggleRejectForm} className="px-3 sm:px-4 py-2 text-gray-600 hover:text-gray-800 text-sm">
                  Back to Approval
                </button>
                <div className="flex space-x-3">
                  <button type="button" onClick={onClose} className="px-3 sm:px-4 py-2 text-gray-600 hover:text-gray-800 text-sm">
                    Cancel
                  </button>
                  <button type="submit" className="px-3 sm:px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 flex items-center space-x-2 text-sm" disabled={isLoading} // Disable if loading
        >
                    <XCircle size={16}/>
                    <span>Confirm Rejection</span>
                  </button>
                </div>
              </div>
            </form>)}
        </div>
      </div>
    </div>);
}
export default ResultModal;
