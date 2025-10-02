import React, { useState, useEffect, useContext } from "react";
import API from "../utils/api";
import { AuthContext } from "../context/AuthContext";

const Dashboard = () => {
  const { user } = useContext(AuthContext);
  const [folders, setFolders] = useState([]);
  const [selectedFolder, setSelectedFolder] = useState(null);
  const [files, setFiles] = useState([]);
  const [newFolderName, setNewFolderName] = useState("");
  const [uploadFile, setUploadFile] = useState(null);
  const [password, setPassword] = useState("");
  const [expiresAt, setExpiresAt] = useState("");
  const [uploadMessage, setUploadMessage] = useState("");
  const [folderMessage, setFolderMessage] = useState("");

  useEffect(() => {
    if (user) {
      fetchFolders();
    }
  }, [user]);

  useEffect(() => {
    if (selectedFolder) {
      fetchFiles(selectedFolder._id);
    } else {
      setFiles([]);
    }
  }, [selectedFolder]);

  const fetchFolders = async () => {
    try {
      const res = await API.get("/folders");
      setFolders(res.data);
      if (res.data.length > 0) {
        setSelectedFolder(res.data[0]);
      }
    } catch (error) {
      console.error("Failed to fetch folders", error);
    }
  };

  const fetchFiles = async (folderId) => {
    try {
      const res = await API.get("/files", { params: { folderId } });
      setFiles(res.data);
    } catch (error) {
      console.error("Failed to fetch files", error);
    }
  };

  const handleCreateFolder = async () => {
    if (!newFolderName.trim()) {
      setFolderMessage("Folder name cannot be empty");
      return;
    }
    try {
      const res = await API.post("/folders", { name: newFolderName });
      setFolders([res.data, ...folders]);
      setNewFolderName("");
      setFolderMessage("Folder created successfully");
    } catch (error) {
      setFolderMessage("Failed to create folder");
      console.error(error);
    }
  };

  const handleFileChange = (e) => {
    setUploadFile(e.target.files[0]);
  };

  const handleUpload = async () => {
    if (!uploadFile) {
      setUploadMessage("Please select a file to upload");
      return;
    }
    if (!selectedFolder) {
      setUploadMessage("Please select a folder");
      return;
    }
    const formData = new FormData();
    formData.append("file", uploadFile);
    formData.append("folderId", selectedFolder._id);
    if (password) formData.append("password", password);
    if (expiresAt) formData.append("expiresAt", expiresAt);

    try {
      const res = await API.post("/files", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      setUploadMessage("File uploaded successfully");
      fetchFiles(selectedFolder._id);
      setUploadFile(null);
      setPassword("");
      setExpiresAt("");
      // Reset file input value
      document.getElementById("fileInput").value = "";
    } catch (error) {
      setUploadMessage("File upload failed");
      console.error(error);
    }
  };

  const getSecureLink = (fileId) => {
    return `${window.location.origin}/file/${fileId}`;
  };

  return (
    <div className="p-6 max-w-5xl mx-auto">
      <h1 className="text-3xl font-bold mb-6">Dashboard</h1>

      <div className="mb-6">
        <h2 className="text-xl font-semibold mb-2">Folders</h2>
        <div className="flex mb-2">
          <input
            type="text"
            placeholder="New folder name"
            value={newFolderName}
            onChange={(e) => setNewFolderName(e.target.value)}
            className="border p-2 flex-grow mr-2"
          />
          <button
            onClick={handleCreateFolder}
            className="bg-blue-600 text-white px-4 py-2 rounded"
          >
            Create Folder
          </button>
        </div>
        {folderMessage && (
          <p className="text-sm text-red-600 mb-2">{folderMessage}</p>
        )}
        <div className="flex space-x-4 overflow-x-auto">
          {folders.map((folder) => (
            <button
              key={folder._id}
              onClick={() => setSelectedFolder(folder)}
              className={`px-4 py-2 rounded whitespace-nowrap ${
                selectedFolder && selectedFolder._id === folder._id
                  ? "bg-blue-600 text-white"
                  : "bg-gray-200"
              }`}
            >
              {folder.name}
            </button>
          ))}
        </div>
      </div>

      {selectedFolder && (
        <div>
          <h2 className="text-xl font-semibold mb-2">
            Files in "{selectedFolder.name}"
          </h2>
          <div className="mb-4">
            <input
              type="file"
              id="fileInput"
              onChange={handleFileChange}
              className="mb-2"
            />
            <input
              type="password"
              placeholder="Password (optional)"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="border p-2 mb-2 w-full max-w-xs"
            />
            <input
              type="datetime-local"
              placeholder="Expiry (optional)"
              value={expiresAt}
              onChange={(e) => setExpiresAt(e.target.value)}
              className="border p-2 mb-2 w-full max-w-xs"
            />
            <button
              onClick={handleUpload}
              className="bg-green-600 text-white px-4 py-2 rounded"
            >
              Upload File
            </button>
            {uploadMessage && (
              <p className="text-sm text-red-600 mt-2">{uploadMessage}</p>
            )}
          </div>

          <table className="w-full border-collapse border border-gray-300">
            <thead>
              <tr>
                <th className="border border-gray-300 p-2 text-left">Name</th>
                <th className="border border-gray-300 p-2 text-left">Size</th>
                <th className="border border-gray-300 p-2 text-left">Expires At</th>
                <th className="border border-gray-300 p-2 text-left">Secure Link</th>
              </tr>
            </thead>
            <tbody>
              {files.map((file) => (
                <tr key={file._id}>
                  <td className="border border-gray-300 p-2">{file.originalName}</td>
                  <td className="border border-gray-300 p-2">{(file.size / 1024).toFixed(2)} KB</td>
                  <td className="border border-gray-300 p-2">
                    {file.expiresAt ? new Date(file.expiresAt).toLocaleString() : "Never"}
                  </td>
                  <td className="border border-gray-300 p-2">
                    <input
                      type="text"
                      readOnly
                      value={getSecureLink(file._id)}
                      className="w-full p-1 border rounded"
                      onFocus={(e) => e.target.select()}
                    />
                  </td>
                </tr>
              ))}
              {files.length === 0 && (
                <tr>
                  <td colSpan="4" className="text-center p-4 text-gray-500">
                    No files in this folder.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default Dashboard;
