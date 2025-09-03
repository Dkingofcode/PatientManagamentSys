import React, { useState } from "react";
import { X, CheckCircle, AlertCircle, FileText } from "lucide-react";

interface ResultsReviewModalProps {
  appointment: any;
  onClose: () => void;
  onSubmit: (signature: string, comments: string) => void;
}

const ResultsReviewModal: React.FC<ResultsReviewModalProps> = ({ appointment, onClose, onSubmit }) => {
  const [signature, setSignature] = useState("");
  const [comments, setComments] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(signature, comments);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto">
        <div className="p-6 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold text-gray-900">Review & Approve Lab Results</h3>
            <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
              <X size={20} />
            </button>
          </div>
        </div>
        <div className="p-6 space-y-6">
          <div className="bg-gray-50 p-4 rounded-lg">
            <h4 className="font-medium text-gray-900 mb-3 flex items-center">
              <FileText size={16} className="mr-2" />
              Lab Results
            </h4>
            <div className="space-y-3">
              {appointment.tests.map((test: any, index: number) => (
                <div key={index} className="bg-white p-3 rounded border">
                  <h5 className="font-medium text-gray-900">{test.name}</h5>
                  <div className="mt-2 text-sm text-gray-600">
                    <p><strong>Status:</strong> Completed</p>
                    <p><strong>Result:</strong> Normal ranges detected</p>
                    <p><strong>Lab Tech:</strong> James Brown</p>
                    <p><strong>Completed:</strong> {new Date().toLocaleString()}</p>
                  </div>
                  <div className="mt-2">
                    <button className="text-blue-600 hover:text-blue-800 text-sm flex items-center space-x-1">
                      <FileText size={14} />
                      <span>View Detailed Report</span>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Doctor's Comments
              </label>
              <textarea
                value={comments}
                onChange={(e) => setComments(e.target.value)}
                placeholder="Add your professional comments about the results..."
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                rows={4}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Digital Signature
              </label>
              <div className="flex items-center space-x-3">
                <FileText size={20} className="text-gray-400" />
                <input
                  type="text"
                  value={signature}
                  onChange={(e) => setSignature(e.target.value)}
                  placeholder="Type your full name as digital signature"
                  className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>
              <p className="text-xs text-gray-500 mt-1">
                By typing your name, you digitally sign and approve these results
              </p>
            </div>
            <div className="bg-blue-50 p-4 rounded-lg">
              <div className="flex items-center space-x-2 text-blue-800">
                <AlertCircle size={16} />
                <span className="text-sm font-medium">
                  Results will be securely sent to patient portal with 2FA protection
                </span>
              </div>
            </div>
            <div className="flex justify-end space-x-3 pt-4">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 text-gray-600 hover:text-gray-800"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 flex items-center space-x-2"
              >
                <CheckCircle size={16} />
                <span>Approve & Send to Patient</span>
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default ResultsReviewModal;