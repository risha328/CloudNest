import axios from "axios";
import { GoogleGenerativeAI } from '@google/generative-ai';

const API = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || "http://localhost:7000/api",
});

// Attach token for protected routes
API.interceptors.request.use((req) => {
  const token = localStorage.getItem("token");
  if (token) req.headers.Authorization = `Bearer ${token}`;
  return req;
});

// Initialize Gemini AI
const genAI = new GoogleGenerativeAI(import.meta.env.VITE_GEMINI_API_KEY);

// Permission API functions
export const grantPermission = (userId, resourceId, resourceType, role) =>
  API.post('/permissions/grant', { userId, resourceId, resourceType, role });

export const revokePermission = (permissionId) =>
  API.delete(`/permissions/${permissionId}`);

export const getPermissions = (resourceId, resourceType) =>
  API.get(`/permissions?resourceId=${resourceId}&resourceType=${resourceType}`);

export const getUserPermissions = () =>
  API.get('/permissions/user');

// User API functions
export const searchUsers = (query) =>
  API.get(`/users/search?query=${encodeURIComponent(query)}`);

export const getUserById = (userId) =>
  API.get(`/users/${userId}`);

// Folder API functions
export const createFolder = (name) =>
  API.post('/folders', { name });

export const getFolders = () =>
  API.get('/folders');

export const deleteFolder = (folderId) =>
  API.delete(`/folders/${folderId}`);

export const toggleFavorite = (folderId) =>
  API.post(`/folders/${folderId}/favorite`);

export const getFavorites = () =>
  API.get('/folders/favorites');

export const getFilesByFolder = (folderId) =>
  API.get(`/files?folderId=${folderId}`);

// File API functions
export const uploadFile = (file, password, expiresAt, folderId) => {
  const formData = new FormData();
  formData.append('file', file);
  if (password) formData.append('password', password);
  if (expiresAt) formData.append('expiresAt', expiresAt);
  if (folderId) formData.append('folderId', folderId);
  return API.post('/files', formData, {
    headers: { 'Content-Type': 'multipart/form-data' }
  });
};

export const accessFile = (fileId, password) =>
  API.post(`/files/${fileId}/access`, { password });

export const downloadFile = (fileId) =>
  API.get(`/files/${fileId}/download`, { responseType: 'blob' });

export const getFileMetadata = (fileId) =>
  API.get(`/files/${fileId}/metadata`);

export const deleteFile = (fileId) =>
  API.delete(`/files/${fileId}`);

export const setExpiry = (fileId, expiresAt, maxDownloads) =>
  API.post(`/files/${fileId}/set-expiry`, { expiresAt, maxDownloads });

export const resetPassword = (fileId, newPassword) =>
  API.post(`/files/${fileId}/reset-password`, { newPassword });

export const getFileStats = (fileId) =>
  API.get(`/files/${fileId}/stats`);

export const getStorageStats = () =>
  API.get('/files/storage-stats');

export const getFolderAnalytics = (folderId) =>
  API.get(`/files/folder-analytics/${folderId}`);

// Comment API functions
export const getComments = (fileId) =>
  API.get(`/comments/${fileId}`);

export const addComment = (fileId, content) =>
  API.post('/comments', { fileId, content });

export const deleteComment = (commentId) =>
  API.delete(`/comments/${commentId}`);

// Helper function to convert blob to base64
const blobToBase64 = (blob) => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result.split(',')[1]);
    reader.onerror = reject;
    reader.readAsDataURL(blob);
  });
};

// AI Preview Functions
export const summarizeText = async (text) => {
  try {
    const model = genAI.getGenerativeModel({ model: 'gemini-2.0-flash-exp' });
    const prompt = `Summarize the following text in 2-3 sentences:\n\n${text}`;
    const result = await model.generateContent(prompt);
    const response = await result.response;
    return response.text();
  } catch (error) {
    console.error('Error summarizing text:', error);
    return 'Unable to generate summary.';
  }
};

export const transcribeAudio = async (audioBlob) => {
  try {
    // Convert blob to base64 for Gemini multimodal input
    const base64Audio = await blobToBase64(audioBlob);
    const model = genAI.getGenerativeModel({ model: 'gemini-2.0-flash-exp' });
    const prompt = 'Transcribe this audio file to text. Provide the full transcription.';
    const result = await model.generateContent([
      prompt,
      {
        inlineData: {
          mimeType: audioBlob.type,
          data: base64Audio
        }
      }
    ]);
    const response = await result.response;
    return response.text();
  } catch (error) {
    console.error('Error transcribing audio:', error);
    return 'Unable to transcribe audio.';
  }
};

export const generateVideoThumbnail = async (videoBlob, fileName) => {
  try {
    // Convert blob to base64 for Gemini multimodal input
    const base64Video = await blobToBase64(videoBlob);
    const model = genAI.getGenerativeModel({ model: 'gemini-2.0-flash-exp' });
    const prompt = `Generate a description of what this video might show. Filename: ${fileName}. Provide a detailed description of the video content.`;
    const result = await model.generateContent([
      prompt,
      {
        inlineData: {
          mimeType: videoBlob.type,
          data: base64Video
        }
      }
    ]);
    const response = await result.response;
    return response.text();
  } catch (error) {
    console.error('Error generating video thumbnail:', error);
    return 'Unable to generate video preview.';
  }
};

export default API;
