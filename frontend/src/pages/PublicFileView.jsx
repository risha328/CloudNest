import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import API from "../utils/api";

const PublicFileView = () => {
  const { id: fileId } = useParams();
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const [viewUrl, setViewUrl] = useState("");
  const [downloadUrl, setDownloadUrl] = useState("");
  const [fileBlobUrl, setFileBlobUrl] = useState("");
  const [fileName, setFileName] = useState("");
  const [file, setFile] = useState(null);
  const [mimeType, setMimeType] = useState("");
  const [isGeneratingPreview, setIsGeneratingPreview] = useState(false);
  const [aiPreview, setAiPreview] = useState("");

  useEffect(() => {
    // For public files, try to access directly if no password, or prompt for password
    // But since backend requires access call, we'll handle it
  }, [fileId]);

  const handleAccess = async () => {
    try {
      const res = await API.post(`/files/public/${fileId}/access`, { password });
      // backend may return paths with or without the leading `/api` prefix.
      // Normalize to the frontend API helper's expected path (no leading /api)
      const view = res.data.viewUrl ? res.data.viewUrl.replace(/^\/api/, '') : '';
      const download = res.data.downloadUrl ? res.data.downloadUrl.replace(/^\/api/, '') : '';
      setViewUrl(view);
      setDownloadUrl(download);
      setMessage("Access granted. Click view to see the file.");
    } catch (error) {
      setMessage(error.response?.data?.message || "Access failed");
    }
  };

  const handleView = async () => {
    try {
      // Use the API axios instance so requests go to the backend (baseURL) instead
      // of the dev server. Request as blob to preserve binary data.
      const res = await API.get(viewUrl, { responseType: 'blob' });
      const contentType = res.headers['content-type'] || (res.data && res.data.type);
      const blob = new Blob([res.data], { type: contentType });
      setMimeType(contentType || 'application/octet-stream');
      const url = URL.createObjectURL(blob);
      setFileBlobUrl(url);
      setMessage('File loaded. View below.');

      // Optionally generate AI preview if needed, but for public, maybe skip
    } catch (error) {
      setMessage("Failed to load file: " + error.message);
    }
  };

  const handleDownload = async () => {
    try {
      const res = await API.get(`/files/public/${fileId}/download`, { responseType: 'blob' });
      const url = window.URL.createObjectURL(new Blob([res.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', 'file'); // Use a generic name or fetch filename
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
    } catch (error) {
      setMessage("Failed to download file: " + (error.response?.data?.message || error.message));
    }
  };

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">View Public File</h1>
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
        <p className={`text-sm mb-4 ${message.includes('granted') ? 'text-green-600' : 'text-red-600'}`}>
          {message}
        </p>
      )}
      {viewUrl && !fileBlobUrl && (
        <button
          onClick={handleView}
          className="bg-green-600 text-white px-4 py-2 rounded w-full mb-2"
        >
          View File
        </button>
      )}
      {downloadUrl && (
        <button
          onClick={handleDownload}
          className="bg-blue-600 text-white px-4 py-2 rounded w-full"
        >
          Download File
        </button>
      )}
      {fileBlobUrl && (
        <div className="mt-4">
          {mimeType && mimeType.startsWith('image/') ? (
            <img src={fileBlobUrl} alt="File" className="max-w-full h-auto border" />
          ) : (
            <iframe src={fileBlobUrl} className="w-full h-96 border" title="File Viewer" />
          )}
        </div>
      )}
    </div>
  );
};

export default PublicFileView;
