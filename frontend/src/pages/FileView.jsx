import React, { useState, useEffect, useContext } from "react";
import { useParams } from "react-router-dom";
import API, { getComments, addComment, deleteComment, summarizeText, transcribeAudio, generateVideoThumbnail } from "../utils/api";
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
  const [versions, setVersions] = useState([]);
  const [selectedFile, setSelectedFile] = useState(null);
  const [updatePassword, setUpdatePassword] = useState("");
  const [updateExpiresAt, setUpdateExpiresAt] = useState("");
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState("");
  const [aiPreview, setAiPreview] = useState("");
  const [isGeneratingPreview, setIsGeneratingPreview] = useState(false);

  useEffect(() => {
    fetchFile();
    fetchFilePermissions();
    fetchVersions();
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

  const fetchVersions = async () => {
    try {
      const res = await API.get(`/files/${fileId}/versions`);
      setVersions(res.data);
    } catch (error) {
      console.error("Failed to fetch versions", error);
    }
  };

  const handleUpdate = async () => {
    if (!selectedFile) {
      setMessage("Please select a file to upload");
      return;
    }
    const formData = new FormData();
    formData.append("file", selectedFile);
    if (updatePassword) formData.append("password", updatePassword);
    if (updateExpiresAt) formData.append("expiresAt", updateExpiresAt);

    try {
      const res = await API.put(`/files/${fileId}`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      setMessage("File updated successfully");
      fetchVersions();
      setSelectedFile(null);
      setUpdatePassword("");
      setUpdateExpiresAt("");
    } catch (error) {
      setMessage(error.response?.data?.message || "Update failed");
    }
  };

  const handleRestore = async (version) => {
    try {
      const res = await API.post(`/files/${fileId}/restore/${version}`);
      setMessage("Version restored successfully");
      fetchVersions();
      // Refresh file data if needed
      fetchFile();
    } catch (error) {
      setMessage(error.response?.data?.message || "Restore failed");
    }
  };

  const fetchComments = async () => {
    try {
      const res = await getComments(fileId);
      setComments(res.data);
    } catch (error) {
      console.error("Failed to fetch comments", error);
      // Don't show error if no permission, just don't display comments
    }
  };

  const handleAccess = async () => {
    try {
      const res = await API.post(`/files/${fileId}/access`, { password });
      setViewUrl(res.data.viewUrl);
      setDownloadUrl(res.data.downloadUrl);
      setMessage("Access granted. Click view to see the file.");
      fetchComments(); // Fetch comments after access
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

      // Generate AI preview based on file type
      await generateAiPreview(blob);
    } catch (error) {
      setMessage("Failed to load file: " + (error.response?.data?.message || error.message));
    }
  };

  const generateAiPreview = async (blob) => {
    if (!file) return;

    setIsGeneratingPreview(true);
    try {
      if (file.mimeType.startsWith('text/')) {
        // For text files, read content and summarize
        const text = await blob.text();
        const summary = await summarizeText(text);
        setAiPreview(`Summary: ${summary}`);
      } else if (file.mimeType.startsWith('audio/')) {
        // For audio files, transcribe
        const transcription = await transcribeAudio(blob);
        setAiPreview(`Transcription: ${transcription}`);
      } else if (file.mimeType.startsWith('video/')) {
        // For video files, generate thumbnail description
        const description = await generateVideoThumbnail(blob, file.originalName);
        setAiPreview(`Video Description: ${description}`);
      } else {
        setAiPreview("AI preview not available for this file type.");
      }
    } catch (error) {
      console.error('Error generating AI preview:', error);
      setAiPreview("Unable to generate AI preview.");
    } finally {
      setIsGeneratingPreview(false);
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
    return user._id === file.ownerId || filePermissions.some(p => p.userId._id === user._id && (p.role === 'downloader' || p.role === 'uploader' || p.role === 'editor'));
  };

  const handleAddComment = async () => {
    if (!newComment.trim()) return;
    try {
      await addComment(fileId, newComment);
      setNewComment("");
      fetchComments();
    } catch (error) {
      console.error("Failed to add comment", error);
      setMessage("Failed to add comment");
    }
  };

  const handleDeleteComment = async (commentId) => {
    try {
      await deleteComment(commentId);
      fetchComments();
    } catch (error) {
      console.error("Failed to delete comment", error);
      setMessage("Failed to delete comment");
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
          {file && file.mimeType && file.mimeType.startsWith('image/') ? (
            <img src={fileBlobUrl} alt="File" className="max-w-full h-auto border" />
          ) : (
            <iframe src={fileBlobUrl} className="w-full h-96 border" title="File Viewer" />
          )}
        </div>
      )}

      {/* AI Preview Section */}
      {aiPreview && (
        <div className="mt-6 bg-blue-50 p-4 rounded-lg">
          <h2 className="text-xl font-bold mb-2">AI Preview</h2>
          {isGeneratingPreview ? (
            <p className="text-gray-600">Generating preview...</p>
          ) : (
            <p className="text-gray-800">{aiPreview}</p>
          )}
        </div>
      )}

      {/* Comments Section */}
      <div className="mt-6">
        <h2 className="text-xl font-bold mb-4">Comments</h2>
        {comments.length > 0 ? (
          <div className="space-y-4">
            {comments.map((comment) => (
              <div key={comment._id} className="border p-4 rounded">
                <div className="flex justify-between items-start">
                  <div>
                    <p className="font-semibold">{comment.userId.name}</p>
                    <p className="text-sm text-gray-600">{new Date(comment.createdAt).toLocaleString()}</p>
                    <p className="mt-2">{comment.content}</p>
                  </div>
                  {user && user._id === comment.userId._id && (
                    <button
                      onClick={() => handleDeleteComment(comment._id)}
                      className="text-red-600 hover:text-red-800"
                    >
                      Delete
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p>No comments yet.</p>
        )}
        <div className="mt-4">
          <textarea
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
            placeholder="Add a comment..."
            className="border p-2 w-full"
            rows="3"
          />
          <button
            onClick={handleAddComment}
            className="bg-blue-600 text-white px-4 py-2 rounded mt-2"
          >
            Add Comment
          </button>
        </div>
      </div>
    </div>
  );
};

export default FileView;
