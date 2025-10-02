import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import API from "../utils/api";

const FileView = () => {
  const { id: fileId } = useParams();
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const [viewUrl, setViewUrl] = useState("");
  const [fileBlobUrl, setFileBlobUrl] = useState("");
  const [fileName, setFileName] = useState("");

  useEffect(() => {
    // Optionally, fetch file metadata if public, but for now, just handle access
  }, [fileId]);

  const handleAccess = async () => {
    try {
      const res = await API.post(`/files/${fileId}/access`, { password });
      setViewUrl(res.data.viewUrl.replace('/api', ''));
      setMessage("Access granted. Click view to see the file.");
    } catch (error) {
      setMessage(error.response?.data?.message || "Access failed");
    }
  };

  const handleView = async () => {
    try {
      const res = await API.get(viewUrl, { responseType: 'blob' });
      const blob = new Blob([res.data], { type: res.headers['content-type'] });
      const url = URL.createObjectURL(blob);
      setFileBlobUrl(url);
      setMessage("File loaded. View below.");
    } catch (error) {
      setMessage("Failed to load file: " + (error.response?.data?.message || error.message));
    }
  };

  return (
    <div className="p-6 max-w-4xl mx-auto">
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
      {viewUrl && !fileBlobUrl && (
        <button
          onClick={handleView}
          className="bg-green-600 text-white px-4 py-2 rounded w-full"
        >
          View File
        </button>
      )}
      {fileBlobUrl && (
        <div className="mt-4">
          <iframe src={fileBlobUrl} width="100%" height="600px" title="File Viewer" />
        </div>
      )}
    </div>
  );
};

export default FileView;
