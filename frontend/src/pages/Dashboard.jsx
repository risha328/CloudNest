// import React, { useState, useEffect, useContext } from "react";
// import API from "../utils/api";
// import { AuthContext } from "../context/AuthContext";

// const Dashboard = () => {
//   const { user } = useContext(AuthContext);
//   const [folders, setFolders] = useState([]);
//   const [selectedFolder, setSelectedFolder] = useState(null);
//   const [files, setFiles] = useState([]);
//   const [newFolderName, setNewFolderName] = useState("");
//   const [uploadFile, setUploadFile] = useState(null);
//   const [password, setPassword] = useState("");
//   const [expiresAt, setExpiresAt] = useState("");
//   const [uploadMessage, setUploadMessage] = useState("");
//   const [folderMessage, setFolderMessage] = useState("");

//   useEffect(() => {
//     if (user) {
//       fetchFolders();
//     }
//   }, [user]);

//   useEffect(() => {
//     if (selectedFolder) {
//       fetchFiles(selectedFolder._id);
//     } else {
//       setFiles([]);
//     }
//   }, [selectedFolder]);

//   const fetchFolders = async () => {
//     try {
//       const res = await API.get("/folders");
//       setFolders(res.data);
//       if (res.data.length > 0) {
//         setSelectedFolder(res.data[0]);
//       }
//     } catch (error) {
//       console.error("Failed to fetch folders", error);
//     }
//   };

//   const fetchFiles = async (folderId) => {
//     try {
//       const res = await API.get("/files", { params: { folderId } });
//       setFiles(res.data);
//     } catch (error) {
//       console.error("Failed to fetch files", error);
//     }
//   };

//   const handleCreateFolder = async () => {
//     if (!newFolderName.trim()) {
//       setFolderMessage("Folder name cannot be empty");
//       return;
//     }
//     try {
//       const res = await API.post("/folders", { name: newFolderName });
//       setFolders([res.data, ...folders]);
//       setNewFolderName("");
//       setFolderMessage("Folder created successfully");
//     } catch (error) {
//       setFolderMessage("Failed to create folder");
//       console.error(error);
//     }
//   };

//   const handleFileChange = (e) => {
//     setUploadFile(e.target.files[0]);
//   };

//   const handleUpload = async () => {
//     if (!uploadFile) {
//       setUploadMessage("Please select a file to upload");
//       return;
//     }
//     if (!selectedFolder) {
//       setUploadMessage("Please select a folder");
//       return;
//     }
//     const formData = new FormData();
//     formData.append("file", uploadFile);
//     formData.append("folderId", selectedFolder._id);
//     if (password) formData.append("password", password);
//     if (expiresAt) formData.append("expiresAt", expiresAt);

//     try {
//       const res = await API.post("/files", formData, {
//         headers: { "Content-Type": "multipart/form-data" },
//       });
//       setUploadMessage("File uploaded successfully");
//       fetchFiles(selectedFolder._id);
//       setUploadFile(null);
//       setPassword("");
//       setExpiresAt("");
//       // Reset file input value
//       document.getElementById("fileInput").value = "";
//     } catch (error) {
//       setUploadMessage("File upload failed");
//       console.error(error);
//     }
//   };

//   const getSecureLink = (fileId) => {
//     return `${window.location.origin}/file/${fileId}`;
//   };

//   return (
//     <div className="p-6 max-w-5xl mx-auto">
//       <h1 className="text-3xl font-bold mb-6">Dashboard</h1>

//       <div className="mb-6">
//         <h2 className="text-xl font-semibold mb-2">Folders</h2>
//         <div className="flex mb-2">
//           <input
//             type="text"
//             placeholder="New folder name"
//             value={newFolderName}
//             onChange={(e) => setNewFolderName(e.target.value)}
//             className="border p-2 flex-grow mr-2"
//           />
//           <button
//             onClick={handleCreateFolder}
//             className="bg-blue-600 text-white px-4 py-2 rounded"
//           >
//             Create Folder
//           </button>
//         </div>
//         {folderMessage && (
//           <p className="text-sm text-red-600 mb-2">{folderMessage}</p>
//         )}
//         <div className="flex space-x-4 overflow-x-auto">
//           {folders.map((folder) => (
//             <button
//               key={folder._id}
//               onClick={() => setSelectedFolder(folder)}
//               className={`px-4 py-2 rounded whitespace-nowrap ${
//                 selectedFolder && selectedFolder._id === folder._id
//                   ? "bg-blue-600 text-white"
//                   : "bg-gray-200"
//               }`}
//             >
//               {folder.name}
//             </button>
//           ))}
//         </div>
//       </div>

//       {selectedFolder && (
//         <div>
//           <h2 className="text-xl font-semibold mb-2">
//             Files in "{selectedFolder.name}"
//           </h2>
//           <div className="mb-4">
//             <input
//               type="file"
//               id="fileInput"
//               onChange={handleFileChange}
//               className="mb-2"
//             />
//             <input
//               type="password"
//               placeholder="Password (optional)"
//               value={password}
//               onChange={(e) => setPassword(e.target.value)}
//               className="border p-2 mb-2 w-full max-w-xs"
//             />
//             <input
//               type="datetime-local"
//               placeholder="Expiry (optional)"
//               value={expiresAt}
//               onChange={(e) => setExpiresAt(e.target.value)}
//               className="border p-2 mb-2 w-full max-w-xs"
//             />
//             <button
//               onClick={handleUpload}
//               className="bg-green-600 text-white px-4 py-2 rounded"
//             >
//               Upload File
//             </button>
//             {uploadMessage && (
//               <p className="text-sm text-red-600 mt-2">{uploadMessage}</p>
//             )}
//           </div>

//           <table className="w-full border-collapse border border-gray-300">
//             <thead>
//               <tr>
//                 <th className="border border-gray-300 p-2 text-left">Name</th>
//                 <th className="border border-gray-300 p-2 text-left">Size</th>
//                 <th className="border border-gray-300 p-2 text-left">Expires At</th>
//                 <th className="border border-gray-300 p-2 text-left">Secure Link</th>
//               </tr>
//             </thead>
//             <tbody>
//               {files.map((file) => (
//                 <tr key={file._id}>
//                   <td className="border border-gray-300 p-2">{file.originalName}</td>
//                   <td className="border border-gray-300 p-2">{(file.size / 1024).toFixed(2)} KB</td>
//                   <td className="border border-gray-300 p-2">
//                     {file.expiresAt ? new Date(file.expiresAt).toLocaleString() : "Never"}
//                   </td>
//                   <td className="border border-gray-300 p-2">
//                     <input
//                       type="text"
//                       readOnly
//                       value={getSecureLink(file._id)}
//                       className="w-full p-1 border rounded"
//                       onFocus={(e) => e.target.select()}
//                     />
//                   </td>
//                 </tr>
//               ))}
//               {files.length === 0 && (
//                 <tr>
//                   <td colSpan="4" className="text-center p-4 text-gray-500">
//                     No files in this folder.
//                   </td>
//                 </tr>
//               )}
//             </tbody>
//           </table>
//         </div>
//       )}
//     </div>
//   );
// };

// export default Dashboard;


import React, { useState, useEffect, useContext } from "react";
import { useNavigate } from "react-router-dom";
import API from "../utils/api";
import { AuthContext } from "../context/AuthContext";

const Dashboard = () => {
  const navigate = useNavigate();
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
  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);
  const [isCreateFolderModalOpen, setIsCreateFolderModalOpen] = useState(false);
  const [isShareModalOpen, setIsShareModalOpen] = useState(false);
  const [shareResource, setShareResource] = useState(null);
  const [permissions, setPermissions] = useState([]);
  const [filePermissions, setFilePermissions] = useState({});
  const [expandedFiles, setExpandedFiles] = useState(new Set());
  const [resourceOwner, setResourceOwner] = useState(null);
  const [newPermissionRole, setNewPermissionRole] = useState('viewer');
  const [userSearchQuery, setUserSearchQuery] = useState('');
  const [userSearchResults, setUserSearchResults] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  const [showUserDropdown, setShowUserDropdown] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const searchUsersDebounced = async () => {
      if (userSearchQuery.length >= 2) {
        try {
          const res = await API.get(`/users/search?query=${encodeURIComponent(userSearchQuery)}`);
          setUserSearchResults(res.data);
          setShowUserDropdown(true);
        } catch (error) {
          console.error("Failed to search users", error);
        }
      } else {
        setUserSearchResults([]);
        setShowUserDropdown(false);
      }
    };
    const timeoutId = setTimeout(searchUsersDebounced, 300);
    return () => clearTimeout(timeoutId);
  }, [userSearchQuery]);
  const [downloadingFileId, setDownloadingFileId] = useState(null);
  const [deletingFolderId, setDeletingFolderId] = useState(null);
  const [deletingFileId, setDeletingFileId] = useState(null);
  const [storageStats, setStorageStats] = useState({
    used: 0,
    total: 5368709120,
    filesCount: 0
  });

  // Fetch permissions for a specific file
  const fetchFilePermissions = async (fileId) => {
    try {
      const res = await API.get(`/permissions/file/${fileId}`);
      setFilePermissions(prev => ({ ...prev, [fileId]: res.data }));
    } catch (error) {
      console.error("Failed to fetch file permissions", error);
    }
  };

  const toggleFilePermissions = (fileId) => {
    setExpandedFiles(prev => {
      const newSet = new Set(prev);
      if (newSet.has(fileId)) {
        newSet.delete(fileId);
      } else {
        newSet.add(fileId);
        if (!filePermissions[fileId]) {
          fetchFilePermissions(fileId);
        }
      }
      return newSet;
    });
  };

  useEffect(() => {
    if (user) {
      fetchFolders();
      fetchStorageStats();
    }
  }, [user]);

  useEffect(() => {
    if (selectedFolder) {
      fetchFiles(selectedFolder._id);
    } else {
      setFiles([]);
    }
  }, [selectedFolder]);



  const fetchStorageStats = async () => {
    try {
      const res = await API.get("/files/storage/stats");
      setStorageStats(res.data);
    } catch (error) {
      console.error("Failed to fetch storage stats", error);
    }
  };

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
    setLoading(true);
    try {
      const res = await API.get("/files", { params: { folderId } });
      setFiles(res.data);
      // Fetch permissions for all files
      res.data.forEach(file => fetchFilePermissions(file._id));
    } catch (error) {
      console.error("Failed to fetch files", error);
    } finally {
      setLoading(false);
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
      setIsCreateFolderModalOpen(false);
      setTimeout(() => setFolderMessage(""), 3000);
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

    setLoading(true);
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
      fetchStorageStats();
      setUploadFile(null);
      setPassword("");
      setExpiresAt("");
      setIsUploadModalOpen(false);
      document.getElementById("fileInput").value = "";
      setTimeout(() => setUploadMessage(""), 3000);
    } catch (error) {
      setUploadMessage("File upload failed");
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const getSecureLink = (fileId) => {
    return `${window.location.origin}/file/${fileId}`;
  };

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text);
  };

  const formatFileSize = (bytes) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const formatStoragePercentage = () => {
    return ((storageStats.used / storageStats.total) * 100).toFixed(1);
  };

  // Permission functions
  const openShareModal = (type, id, name) => {
    setShareResource({ type, id, name });
    setPermissions([]);
    setResourceOwner(null);
    setSelectedUser(null);
    setUserSearchQuery('');
    setShowUserDropdown(false);
    setNewPermissionRole('viewer');
    fetchPermissions(id, type);
    setIsShareModalOpen(true);
  };



  const fetchPermissions = async (resourceId, resourceType) => {
    try {
      const res = await API.get(`/permissions/${resourceType}/${resourceId}`);
      setPermissions(res.data);
    } catch (error) {
      console.error("Failed to fetch permissions", error);
    }
  };

  const handleGrantPermission = async () => {
    if (!selectedUser) return;
    try {
      await API.post('/permissions/grant', {
        userId: selectedUser._id,
        resourceId: shareResource.id,
        resourceType: shareResource.type,
        role: newPermissionRole
      });
      fetchPermissions(shareResource.id, shareResource.type);
      setSelectedUser(null);
      setUserSearchQuery('');
      setShowUserDropdown(false);
      setNewPermissionRole('viewer');
    } catch (error) {
      console.error("Failed to grant permission", error);
    }
  };

  const handleRevokePermission = async (permissionId) => {
    try {
      const permission = permissions.find(p => p._id === permissionId);
      if (!permission) return;
      await API.delete(`/permissions/${shareResource.type}/${shareResource.id}/revoke/${permission.userId._id}`);
      fetchPermissions(shareResource.id, shareResource.type);
    } catch (error) {
      console.error("Failed to revoke permission", error);
    }
  };

  const handleDownload = async (fileId, fileName) => {
    setDownloadingFileId(fileId);
    try {
      const res = await API.post(`/files/${fileId}/access`, {});
      const downloadUrl = res.data.downloadUrl;
      const link = document.createElement('a');
      link.href = downloadUrl;
      link.download = fileName;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } catch (error) {
      console.error("Failed to download file", error);
      alert("You do not have permission to download this file or it requires a password.");
    } finally {
      setDownloadingFileId(null);
    }
  };

  const handleDeleteFolder = async (folderId, folderName) => {
    if (!window.confirm(`Are you sure you want to delete the folder "${folderName}" and all its files? This action cannot be undone.`)) {
      return;
    }

    setDeletingFolderId(folderId);
    try {
      await API.delete(`/folders/${folderId}`);
      setFolders(folders.filter(folder => folder._id !== folderId));
      if (selectedFolder && selectedFolder._id === folderId) {
        setSelectedFolder(null);
        setFiles([]);
      }
      fetchStorageStats();
    } catch (error) {
      console.error("Failed to delete folder", error);
      alert("Failed to delete folder. You may not have permission or the folder may not exist.");
    } finally {
      setDeletingFolderId(null);
    }
  };

  const handleDeleteFile = async (fileId, fileName) => {
    if (!window.confirm(`Are you sure you want to delete the file "${fileName}"? This action cannot be undone.`)) {
      return;
    }

    setDeletingFileId(fileId);
    try {
      await API.delete(`/files/${fileId}`);
      setFiles(files.filter(file => file._id !== fileId));
      fetchStorageStats();
    } catch (error) {
      console.error("Failed to delete file", error);
      alert("Failed to delete file. You may not have permission or the file may not exist.");
    } finally {
      setDeletingFileId(null);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Storage Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900">Storage Used</h3>
              <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
                <svg className="w-4 h-4 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 8h14M5 8a2 2 0 110-4h14a2 2 0 110 4M5 8v10a2 2 0 002 2h10a2 2 0 002-2V8m-9 4h4" />
                </svg>
              </div>
            </div>
            <div className="space-y-2">
              <div className="flex justify-between text-sm text-gray-600">
                <span>{formatFileSize(storageStats.used)} used</span>
                <span>{formatFileSize(storageStats.total)} total</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div 
                  className="bg-blue-600 h-2 rounded-full transition-all duration-300" 
                  style={{ width: `${formatStoragePercentage()}%` }}
                ></div>
              </div>
              <p className="text-xs text-gray-500">{formatStoragePercentage()}% of storage used</p>
            </div>
          </div>

          <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900">Total Files</h3>
              <div className="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center">
                <svg className="w-4 h-4 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
              </div>
            </div>
            <p className="text-3xl font-bold text-gray-900">{storageStats.filesCount}</p>
            <p className="text-sm text-gray-600">Files across all folders</p>
          </div>

          <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900">Secure Folders</h3>
              <div className="w-8 h-8 bg-purple-100 rounded-lg flex items-center justify-center">
                <svg className="w-4 h-4 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                </svg>
              </div>
            </div>
            <p className="text-3xl font-bold text-gray-900">{folders.length}</p>
            <p className="text-sm text-gray-600">Password-protected folders</p>
          </div>
        </div>

        {/* Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Folders Sidebar */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-lg font-semibold text-gray-900">Folders</h2>
                <button
                  onClick={() => setIsCreateFolderModalOpen(true)}
                  className="text-blue-600 hover:text-blue-700"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                  </svg>
                </button>
              </div>
              
              <div className="space-y-2">
                {folders.map((folder) => (
                  <button
                    key={folder._id}
                    onClick={() => setSelectedFolder(folder)}
                    className={`w-full flex items-center space-x-3 p-3 rounded-lg text-left transition-colors ${
                      selectedFolder && selectedFolder._id === folder._id
                        ? "bg-blue-50 border border-blue-200"
                        : "hover:bg-gray-50"
                    }`}
                  >
                    <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${
                      selectedFolder && selectedFolder._id === folder._id
                        ? "bg-blue-600 text-white"
                        : "bg-gray-100 text-gray-600"
                    }`}>
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-6l-2-2H5a2 2 0 00-2 2z" />
                      </svg>
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-gray-900 truncate">{folder.name}</p>
                      <p className="text-xs text-gray-500">{folder.fileCount || 0} files</p>
                    </div>
                    <div className="flex space-x-1">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          openShareModal('folder', folder._id, folder.name);
                        }}
                        className="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center hover:bg-gray-200 transition-colors"
                        title="Share Folder"
                      >
                        <svg className="w-4 h-4 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.367 2.684 3 3 0 00-5.367-2.684z" />
                        </svg>
                      </button>
                      {user._id === folder.ownerId && (
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleDeleteFolder(folder._id, folder.name);
                          }}
                          disabled={deletingFolderId === folder._id}
                          className="w-8 h-8 bg-red-100 rounded-full flex items-center justify-center hover:bg-red-200 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                          title="Delete Folder"
                        >
                          {deletingFolderId === folder._id ? (
                            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-red-600"></div>
                          ) : (
                            <svg className="w-4 h-4 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                            </svg>
                          )}
                        </button>
                      )}
                    </div>
                  </button>
                ))}
                
                {folders.length === 0 && (
                  <div className="text-center py-8">
                    <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-3">
                      <svg className="w-6 h-6 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-6l-2-2H5a2 2 0 00-2 2z" />
                      </svg>
                    </div>
                    <p className="text-gray-500 text-sm">No folders yet</p>
                    <button
                      onClick={() => setIsCreateFolderModalOpen(true)}
                      className="text-blue-600 text-sm hover:text-blue-700 mt-2"
                    >
                      Create your first folder
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Files Content */}
          <div className="lg:col-span-3">
            <div className="bg-white rounded-xl shadow-sm border border-gray-200">
              {/* Files Header */}
              <div className="p-6 border-b border-gray-200">
                <div className="flex items-center justify-between">
                  <div>
                    <h2 className="text-xl font-semibold text-gray-900">
                      {selectedFolder ? `Files in "${selectedFolder.name}"` : "Select a Folder"}
                    </h2>
                    <p className="text-gray-600 text-sm mt-1">
                      {selectedFolder ? `${files.length} files` : "Choose a folder to view files"}
                    </p>
                  </div>
                  {selectedFolder && (
                    <button
                      onClick={() => setIsUploadModalOpen(true)}
                      className="bg-blue-600 text-white px-4 py-2 rounded-lg font-medium hover:bg-blue-700 transition-colors flex items-center space-x-2 backdrop-blur-sm"
                    >
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                      </svg>
                      <span>Upload File</span>
                    </button>
                  )}
                </div>
              </div>

              {/* Files Table */}
              <div className="p-6">
                {loading ? (
                  <div className="flex justify-center items-center py-12">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                  </div>
                ) : selectedFolder ? (
                  <div className="overflow-hidden">
                    {files.length > 0 ? (
                      <div className="space-y-4">
                        {files.map((file) => (
                          <div key={file._id}>
                            <div className="flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
                              <div className="flex items-center space-x-4 flex-1 min-w-0">
                                <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                                  <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                                  </svg>
                                </div>
                                <div className="flex-1 min-w-0">
                                  <p className="text-sm font-medium text-gray-900 truncate">{file.originalName}</p>
                                  <div className="flex items-center space-x-4 text-xs text-gray-500 mt-1">
                                    <span>{formatFileSize(file.size)}</span>
                                    <span>•</span>
                                    <span>{new Date(file.createdAt).toLocaleDateString()}</span>
                                    {file.expiresAt && (
                                      <>
                                        <span>•</span>
                                        <span className="text-orange-600">
                                          Expires {new Date(file.expiresAt).toLocaleDateString()}
                                        </span>
                                      </>
                                    )}
                                  </div>
                                </div>
                              </div>
                              
                              <div className="flex items-center space-x-3">
                                <div className="relative flex-1 min-w-0 max-w-xs">
                                  <input
                                    type="text"
                                    readOnly
                                    value={getSecureLink(file._id)}
                                    className="w-full px-3 py-2 pr-20 text-sm border border-gray-300 rounded-lg bg-gray-50 truncate"
                                    onFocus={(e) => e.target.select()}
                                  />
                                  <button
                                    onClick={() => copyToClipboard(getSecureLink(file._id))}
                                    className="absolute right-1 top-1/2 transform -translate-y-1/2 bg-blue-600 text-white px-3 py-1 rounded text-xs hover:bg-blue-700 transition-colors"
                                  >
                                    Copy
                                  </button>
                                </div>
                                
                                {file.passwordProtected && (
                                  <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                                    <svg className="w-4 h-4 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                                    </svg>
                                  </div>
                                )}

                                <button
                                  onClick={() => openShareModal('file', file._id, file.originalName)}
                                  className="w-8 h-8 bg-orange-100 rounded-full flex items-center justify-center hover:bg-orange-200 transition-colors"
                                  title="Share File"
                                >
                                  <svg className="w-4 h-4 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.367 2.684 3 3 0 00-5.367-2.684z" />
                                  </svg>
                                </button>

                                <button
                                  onClick={() => navigate(`/analytics/file/${file._id}`)}
                                  className="w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center hover:bg-purple-200 transition-colors"
                                  title="View Analytics"
                                >
                                  <svg className="w-4 h-4 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                                  </svg>
                                </button>

                                {(user._id === file.ownerId || (filePermissions[file._id] && filePermissions[file._id].some(p => p.userId._id === user._id && (p.role === 'downloader' || p.role === 'editor')))) && (
                                  <button
                                    onClick={() => handleDownload(file._id, file.originalName)}
                                    disabled={downloadingFileId === file._id}
                                    className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center hover:bg-green-200 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                                    title="Download File"
                                  >
                                    {downloadingFileId === file._id ? (
                                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-green-600"></div>
                                    ) : (
                                      <svg className="w-4 h-4 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                                      </svg>
                                    )}
                                  </button>
                                )}

                                {(user._id === file.ownerId || (filePermissions[file._id] && filePermissions[file._id].some(p => p.userId._id === user._id && p.role === 'editor'))) && (
                                  <button
                                    onClick={() => handleDeleteFile(file._id, file.originalName)}
                                    disabled={deletingFileId === file._id}
                                    className="w-8 h-8 bg-red-100 rounded-full flex items-center justify-center hover:bg-red-200 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                                    title="Delete File"
                                  >
                                    {deletingFileId === file._id ? (
                                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-red-600"></div>
                                    ) : (
                                      <svg className="w-4 h-4 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                      </svg>
                                    )}
                                  </button>
                                )}
                              </div>
                            </div>
                            
                            {/* Permissions toggle button */}
                            <div className="mt-2 pl-16">
                              <button
                                onClick={() => toggleFilePermissions(file._id)}
                                className="text-sm text-blue-600 hover:underline focus:outline-none"
                                aria-expanded={expandedFiles.has(file._id)}
                                aria-controls={`permissions-${file._id}`}
                              >
                                {expandedFiles.has(file._id) ? 'Hide Permissions' : 'Show Permissions'}
                              </button>
                              
                              {/* Permissions list */}
                              {expandedFiles.has(file._id) && filePermissions[file._id] && (
                                <div
                                  id={`permissions-${file._id}`}
                                  className="mt-2 p-3 bg-gray-50 rounded-lg border border-gray-200 text-sm text-gray-700"
                                >
                                  {filePermissions[file._id].length > 0 ? (
                                    filePermissions[file._id].map((permission) => (
                                      <div key={permission._id} className="mb-1">
                                        <span className="font-medium">{permission.userId?.name || permission.userId?.email || permission.userId}</span>
                                        <span className="ml-2 capitalize text-gray-600">({permission.role})</span>
                                        <div className="text-xs text-gray-400">
                                          Granted by {permission.grantedBy?.name || permission.grantedBy?.email || permission.grantedBy}
                                        </div>
                                      </div>
                                    ))
                                  ) : (
                                    <div className="text-gray-500">No permissions granted</div>
                                  )}
                                </div>
                              )}
                            </div>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="text-center py-12">
                        <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                          <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                          </svg>
                        </div>
                        <h3 className="text-lg font-medium text-gray-900 mb-2">No files yet</h3>
                        <p className="text-gray-500 mb-4">Upload your first file to get started</p>
                        <button
                          onClick={() => setIsUploadModalOpen(true)}
                          className="bg-blue-600 text-white px-6 py-2 rounded-lg font-medium hover:bg-blue-700 transition-colors"
                        >
                          Upload File
                        </button>
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="text-center py-12">
                    <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                      <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-6l-2-2H5a2 2 0 00-2 2z" />
                      </svg>
                    </div>
                    <h3 className="text-lg font-medium text-gray-900 mb-2">No folder selected</h3>
                    <p className="text-gray-500">Select a folder from the sidebar or create a new one</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Create Folder Modal */}
      {isCreateFolderModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl p-6 w-full max-w-md">
            <h3 className="text-xl font-semibold text-gray-900 mb-4">Create New Folder</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Folder Name
                </label>
                <input
                  type="text"
                  value={newFolderName}
                  onChange={(e) => setNewFolderName(e.target.value)}
                  placeholder="Enter folder name"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                />
              </div>
              {folderMessage && (
                <p className={`text-sm ${folderMessage.includes('successfully') ? 'text-green-600' : 'text-red-600'}`}>
                  {folderMessage}
                </p>
              )}
              <div className="flex space-x-3 pt-4">
                <button
                  onClick={() => setIsCreateFolderModalOpen(false)}
                  className="flex-1 bg-gray-100 text-gray-700 py-3 px-4 rounded-lg font-medium hover:bg-gray-200 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={handleCreateFolder}
                  className="flex-1 bg-blue-600 text-white py-3 px-4 rounded-lg font-medium hover:bg-blue-700 transition-colors"
                >
                  Create Folder
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Upload File Modal */}
      {isUploadModalOpen && (
        <div className="fixed inset-0 backdrop-blur-sm bg-opacity-50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl p-6 w-full max-w-md border border-gray-300">
            <h3 className="text-xl font-semibold text-gray-900 mb-4">Upload File</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Select File
                </label>
                <input
                  type="file"
                  id="fileInput"
                  onChange={handleFileChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Password (Optional)
                </label>
                <input
                  type="password"
                  placeholder="Set a password for this file"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Expiration Date (Optional)
                </label>
                <input
                  type="datetime-local"
                  value={expiresAt}
                  onChange={(e) => setExpiresAt(e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                />
              </div>

              {uploadMessage && (
                <p className={`text-sm ${uploadMessage.includes('successfully') ? 'text-green-600' : 'text-red-600'}`}>
                  {uploadMessage}
                </p>
              )}

              <div className="flex space-x-3 pt-4">
                <button
                  onClick={() => setIsUploadModalOpen(false)}
                  className="flex-1 bg-gray-100 text-gray-700 py-3 px-4 rounded-lg font-medium hover:bg-gray-200 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={handleUpload}
                  disabled={loading}
                  className="flex-1 bg-blue-600 text-white py-3 px-4 rounded-lg font-medium hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2"
                >
                  {loading ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                      <span>Uploading...</span>
                    </>
                  ) : (
                    <span>Upload File</span>
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Share Modal */}
      {isShareModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl p-6 w-full max-w-md border border-gray-200">
            <h3 className="text-xl font-semibold text-gray-900 mb-4">
              Share {shareResource?.type === 'file' ? 'File' : 'Folder'}
            </h3>
            <p className="text-gray-600 mb-4">{shareResource?.name}</p>

            {/* Current Permissions */}
            <div className="mb-6">
              <h4 className="text-sm font-medium text-gray-900 mb-2">Current Permissions</h4>
              <div className="space-y-2 max-h-32 overflow-y-auto">
                {permissions.length > 0 ? (
                  permissions.map((permission) => (
                    <div key={permission._id} className="flex items-center justify-between p-2 bg-gray-50 rounded-lg">
                      <div>
                        <p className="text-sm font-medium text-gray-900">{permission.userId?.name || permission.userId?.email || permission.userId}</p>
                        <p className="text-xs text-gray-500 capitalize">{permission.role}</p>
                        <p className="text-xs text-gray-400">Granted by {permission.grantedBy?.name || permission.grantedBy?.email || permission.grantedBy}</p>
                      </div>
                      <button
                        onClick={() => handleRevokePermission(permission._id)}
                        className="text-red-600 hover:text-red-700 text-sm"
                      >
                        Remove
                      </button>
                    </div>
                  ))
                ) : (
                  <p className="text-sm text-gray-500">No permissions granted yet</p>
                )}
              </div>
            </div>

            {/* Grant New Permission */}
            <div className="space-y-4">
              <h4 className="text-sm font-medium text-gray-900">Grant Permission</h4>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Search User
                </label>
                <div className="relative">
                  <input
                    type="text"
                    value={userSearchQuery}
                    onChange={(e) => setUserSearchQuery(e.target.value)}
                    placeholder="Search for user"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                  />
                  {showUserDropdown && userSearchResults.length > 0 && (
                    <div className="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-lg shadow-lg max-h-40 overflow-y-auto">
                      {userSearchResults.map((user) => (
                        <div
                          key={user._id}
                          onClick={() => {
                            setSelectedUser(user);
                            setUserSearchQuery(user.name || user.email);
                            setShowUserDropdown(false);
                          }}
                          className="px-4 py-2 hover:bg-gray-100 cursor-pointer"
                        >
                          <p className="text-sm font-medium">{user.name}</p>
                          <p className="text-xs text-gray-500">{user.email}</p>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
                {selectedUser && (
                  <p className="text-sm text-green-600 mt-2">Selected: {selectedUser.name} ({selectedUser.email})</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Role
                </label>
                <select
                  value={newPermissionRole}
                  onChange={(e) => setNewPermissionRole(e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                >
                  <option value="viewer">Viewer</option>
                  <option value="downloader">Downloader</option>
                  <option value="editor">Editor</option>
                </select>
              </div>

              <div className="flex space-x-3 pt-4">
                <button
                  onClick={() => setIsShareModalOpen(false)}
                  className="flex-1 bg-gray-100 text-gray-700 py-3 px-4 rounded-lg font-medium hover:bg-gray-200 transition-colors"
                >
                  Close
                </button>
                <button
                  onClick={handleGrantPermission}
                  className="flex-1 bg-blue-600 text-white py-3 px-4 rounded-lg font-medium hover:bg-blue-700 transition-colors"
                >
                  Grant Permission
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Dashboard;
