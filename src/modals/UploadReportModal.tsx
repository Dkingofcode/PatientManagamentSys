import React from "react";
import { useState } from "react";

function UploadReportModal({ appointment, onClose, onUpload }: any) {
  const [file, setFile] = useState<File | null>(null);
  const [notes, setNotes] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (file) {
      const report = {
        file,
        notes,
        uploadedAt: new Date().toISOString(),
      };
      onUpload(appointment.id, report);
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 max-w-lg w-full">
        <h3 className="text-lg font-semibold mb-4">Upload Report</h3>
        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="file"
            onChange={(e) => setFile(e.target.files?.[0] || null)}
            className="block w-full border border-gray-300 rounded-lg p-2"
            required
          />
          <textarea
            placeholder="Add notes..."
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            className="w-full border border-gray-300 rounded-lg p-2"
          />
          <div className="flex justify-end space-x-3">
            <button
              onClick={onClose}
              type="button"
              className="px-4 py-2 text-gray-600"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700"
            >
              Upload
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
