import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import API from "../utils/api";

const FileView = () => {
  const { id: fileId } = useParams();
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const [downloadUrl, setDownloadUrl] = useState("");
  const [fileName, setFileName] = useState("");

  useEffect(() => {
    // Optionally, fetch file metadata if public, but for now, just handle access
  }, [fileId]);

  const handleAccess = async () => {
    try {
      const res = await API.post(`/files/${fileId}/access`, { password });
      setDownloadUrl(res.data.downloadUrl);
      setMessage("Access granted. Click download to get the file.");
    } catch (error) {
      setMessage(error.response?.data?.message || "Access failed");
    }
  };

  const handleDownload = () => {
    if (downloadUrl) {
      // Use anchor element to trigger download
      const link = document.createElement("a");
      const backendBase = API.defaults.baseURL.replace('/api', '');
      link.href = backendBase + downloadUrl;
      link.download = ""; // Let browser decide filename
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  };

  return (
    <div className="p-6 max-w-md mx-auto">
      <h1 className="text-2xl font-bold mb-4">Access File</h1>
      <div className="mb-4">
        <input
          type="password"
          placeholder="Enter password (if required)"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="border p-2 w-full mb-2"
        />
        <button
          onClick={handleAccess}
          className="bg-blue-600 text-white px-4 py-2 rounded w-full"
        >
          Access File
        </button>
      </div>
      {message && (
        <p className="text-sm text-red-600 mb-4">{message}</p>
      )}
      {downloadUrl && (
        <button
          onClick={handleDownload}
          className="bg-green-600 text-white px-4 py-2 rounded w-full"
        >
          Download File
        </button>
      )}
    </div>
  );
};

export default FileView;
