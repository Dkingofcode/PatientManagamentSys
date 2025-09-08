import axios from "axios";
import { useState } from "react";

export default function ApproveResultForm({ resultId, onDone }: { resultId: string; onDone: () => void }) {
  const [remarks, setRemarks] = useState("");
  const [signature, setSignature] = useState<string | null>(null);
  const [status, setStatus] = useState("approved");
  const [loading, setLoading] = useState(false);

  const handleApprove = async () => {
    if (status === "approved" && !signature) {
      alert("Signature is required for approval");
      return;
    }
    setLoading(true);
    try {
      const token = localStorage.getItem("token");
      await axios.post(
        "http://localhost:8000/api/results/approve-result",
        {
          resultId,
          status,
          remarks,
          doctorSignature: signature,
        },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      alert(`Result ${status} successfully`);
      onDone();
    } catch (err: any) {
      console.error("Error approving result", err);
      alert(err.response?.data?.message || "Failed to approve result");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-3">
      <textarea
        value={remarks}
        onChange={(e) => setRemarks(e.target.value)}
        placeholder="Add remarks"
        className="w-full p-2 border rounded"
      />
      <select
        value={status}
        onChange={(e) => setStatus(e.target.value)}
        className="p-2 border rounded"
      >
        <option value="approved">Approve</option>
        <option value="rejected">Reject</option>
        <option value="needs_revision">Needs Revision</option>
      </select>
      {status === "approved" && (
        <input
          type="file"
          accept="image/*"
          onChange={async (e) => {
            const file = e.target.files?.[0];
            if (file) {
              const base64 = await fileToBase64(file);
              setSignature(base64);
            }
          }}
        />
      )}
      <button
        onClick={handleApprove}
        disabled={loading}
        className="px-4 py-2 bg-blue-600 text-white rounded"
      >
        {loading ? "Processing..." : "Submit"}
      </button>
    </div>
  );
}

function fileToBase64(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => {
      // Remove data:image/... prefix
      const base64 = (reader.result as string).split(",")[1];
      resolve(base64);
    };
    reader.onerror = reject;
  });
}
