import React, { useState, useEffect, useContext } from "react";
import { useParams } from "react-router-dom";
import API from "../utils/api";
import { AuthContext } from "../context/AuthContext";

const FileView = () => {
  const { user } = useContext(AuthContext);
  const { id: fileId } = useParams();
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const [viewUrl, setViewUrl] = useState("");
  const [downloadUrl, setDownloadUrl] = useState("");
  const [fileBlobUrl, setFileBlobUrl] = useState("");
  const [fileName, setFileName] = useState("");
  const [file, setFile] = useState(null);
  const [filePermissions, setFilePermissions] = useState([]);

  useEffect(() => {
    fetchFile();
    fetchFilePermissions();
  }, [fileId]);

  const fetchFile = async () => {
    try {
      const res = await API.get(`/files/${fileId}`);
      setFile(res.data);
    } catch (error) {
      console.error("Failed to fetch file", error);
    }
  };

  const fetchFilePermissions = async () => {
    try {
      const res = await API.get(`/permissions/file/${fileId}`);
      setFilePermissions(res.data);
    } catch (error) {
      console.error("Failed to fetch file permissions", error);
    }
  };

  const handleAccess = async () => {
    try {
      const res = await API.post(`/files/${fileId}/access`, { password });
      setViewUrl(res.data.viewUrl.replace('/api', ''));
      setDownloadUrl(res.data.downloadUrl ? res.data.downloadUrl.replace('/api', '') : null);
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

  const handleDownload = async () => {
    try {
      const res = await API.get(`/files/${fileId}/download`, { responseType: 'blob' });

      const filename = file ? file.originalName : 'file';

      const url = window.URL.createObjectURL(new Blob([res.data], { type: file ? file.mimeType : res.headers['content-type'] }));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', filename);
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);
    } catch (error) {
      setMessage("Failed to download file: " + (error.response?.data?.message || error.message));
    }
  };

  const hasDownloadPermission = () => {
    if (!user || !file) return false;
    return user._id === file.ownerId || filePermissions.some(p => p.userId._id === user._id && (p.role === 'downloader' || p.role === 'editor'));
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
          <iframe src={fileBlobUrl} width="100%" height="600px" title="File Viewer" />
        </div>
      )}
    </div>
  );
};

export default FileView;
