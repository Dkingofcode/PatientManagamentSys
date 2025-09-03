import React, { useState } from "react";
import { X, Send, AlertCircle } from "lucide-react";

interface ApprovalModalProps {
  appointment: any;
  onClose: () => void;
  onSubmit: (labTechnicianId?: string) => void;
}

const ApprovalModal: React.FC<ApprovalModalProps> = ({ appointment, onClose, onSubmit }) => {
  const [selectedLabTech, setSelectedLabTech] = useState("");
  const [notes, setNotes] = useState("");

  const labTechnicians = [
    { id: "4", name: "James Brown", specialty: "General Lab" },
    { id: "9", name: "Lisa Johnson", specialty: "Blood Analysis" },
    { id: "10", name: "Mark Wilson", specialty: "Radiology" },
  ];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(selectedLabTech || undefined);
  };

  const totalPrice = appointment.tests.reduce((sum: number, test: any) => sum + test.price, 0);

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg max-w-lg w-full mx-4">
        <div className="p-6 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold text-gray-900">Approve & Forward to Lab</h3>
            <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
              <X size={20} />
            </button>
          </div>
        </div>
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div className="bg-blue-50 p-4 rounded-lg">
            <h4 className="font-medium text-blue-900 mb-2">Test Details</h4>
            <div className="space-y-2">
              {appointment.tests.map((test: any, index: number) => (
                <div key={index} className="flex justify-between items-center text-sm">
                  <span className="text-blue-800">{test.name}</span>
                  <span className="font-medium text-blue-900">${test.price}</span>
                </div>
              ))}
              <div className="border-t border-blue-200 pt-2 flex justify-between items-center font-semibold">
                <span className="text-blue-900">Total</span>
                <span className="text-blue-900">${totalPrice}</span>
              </div>
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Assign to Lab Technician (Optional)
            </label>
            <select
              value={selectedLabTech}
              onChange={(e) => setSelectedLabTech(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">Auto-assign to available technician</option>
              {labTechnicians.map((tech) => (
                <option key={tech.id} value={tech.id}>
                  {tech.name} - {tech.specialty}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Notes for Lab (Optional)
            </label>
            <textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Any special instructions for the lab..."
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              rows={3}
            />
          </div>
          <div className="bg-green-50 p-4 rounded-lg">
            <div className="flex items-center space-x-2 text-green-800">
              <AlertCircle size={16} />
              <span className="text-sm font-medium">
                By approving, you confirm the test requests are accurate and ready for lab processing.
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
              <Send size={16} />
              <span>Approve & Forward</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ApprovalModal;