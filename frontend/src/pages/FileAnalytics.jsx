import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import API from '../utils/api';

const FileAnalytics = () => {
  const { type, id } = useParams(); // type: 'file' or 'folder', id: fileId or folderId
  const navigate = useNavigate();
  const [analytics, setAnalytics] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchAnalytics();
  }, [type, id]);

  const fetchAnalytics = async () => {
    try {
      setLoading(true);
      let url;
      if (type === 'file') {
        url = `/files/${id}/stats`;
      } else if (type === 'folder') {
        url = `/files/folders/${id}/analytics`;
      } else {
        throw new Error('Invalid analytics type');
      }

      const response = await API.get(url);
      setAnalytics(response.data);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to fetch analytics');
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleString();
  };

  const groupByDate = (timestamps) => {
    const grouped = {};
    if (timestamps && Array.isArray(timestamps)) {
      timestamps.forEach(timestamp => {
        const date = new Date(timestamp).toDateString();
        grouped[date] = (grouped[date] || 0) + 1;
      });
    }
    return grouped;
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading analytics...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="text-red-600 text-lg font-semibold">Error</div>
          <p className="mt-2 text-gray-600">{error}</p>
          <button
            onClick={() => navigate('/dashboard')}
            className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            Back to Dashboard
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <button
            onClick={() => navigate('/dashboard')}
            className="mb-4 px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700"
          >
            ← Back to Dashboard
          </button>
          <h1 className="text-3xl font-bold text-gray-900">
            {type === 'file' ? 'File Analytics' : 'Folder Analytics'}
          </h1>
        </div>

        {type === 'file' && analytics && (
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-2xl font-semibold mb-4">{analytics.originalName}</h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
              <div className="bg-blue-50 p-4 rounded-lg">
                <h3 className="text-lg font-semibold text-blue-800">Views</h3>
                <p className="text-3xl font-bold text-blue-600">{analytics.viewCount}</p>
              </div>
              <div className="bg-green-50 p-4 rounded-lg">
                <h3 className="text-lg font-semibold text-green-800">Downloads</h3>
                <p className="text-3xl font-bold text-green-600">{analytics.downloadCount}</p>
              </div>
            </div>

            <div className="mb-8">
              <h3 className="text-xl font-semibold mb-4">View Trends</h3>
              <div className="bg-gray-50 p-4 rounded-lg">
                {Object.keys(groupByDate(analytics.viewTimestamps)).length > 0 ? (
                  <div className="space-y-2">
                    {Object.entries(groupByDate(analytics.viewTimestamps)).map(([date, count]) => (
                      <div key={date} className="flex justify-between">
                        <span>{date}</span>
                        <span className="font-semibold">{count} views</span>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-gray-500">No view data available</p>
                )}
              </div>
            </div>

            <div className="mb-8">
              <h3 className="text-xl font-semibold mb-4">Download Trends</h3>
              <div className="bg-gray-50 p-4 rounded-lg">
                {Object.keys(groupByDate(analytics.downloadTimestamps)).length > 0 ? (
                  <div className="space-y-2">
                    {Object.entries(groupByDate(analytics.downloadTimestamps)).map(([date, count]) => (
                      <div key={date} className="flex justify-between">
                        <span>{date}</span>
                        <span className="font-semibold">{count} downloads</span>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-gray-500">No download data available</p>
                )}
              </div>
            </div>

            <div className="text-sm text-gray-600">
              <p>Created: {formatDate(analytics.createdAt)}</p>
              {analytics.expiresAt && <p>Expires: {formatDate(analytics.expiresAt)}</p>}
            </div>
          </div>
        )}

        {type === 'folder' && analytics && (
          <div className="space-y-6">
            <div className="bg-white rounded-lg shadow-md p-6">
              <h2 className="text-2xl font-semibold mb-4">Folder Overview</h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-blue-50 p-4 rounded-lg">
                  <h3 className="text-lg font-semibold text-blue-800">Total Files</h3>
                  <p className="text-3xl font-bold text-blue-600">{analytics.totalFiles}</p>
                </div>
                <div className="bg-green-50 p-4 rounded-lg">
                  <h3 className="text-lg font-semibold text-green-800">Total Views</h3>
                  <p className="text-3xl font-bold text-green-600">{analytics.totalViews}</p>
                </div>
                <div className="bg-purple-50 p-4 rounded-lg">
                  <h3 className="text-lg font-semibold text-purple-800">Total Downloads</h3>
                  <p className="text-3xl font-bold text-purple-600">{analytics.totalDownloads}</p>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-lg shadow-md p-6">
              <h2 className="text-2xl font-semibold mb-4">Files in Folder</h2>
              <div className="space-y-4">
                {analytics.files.map((file) => (
                  <div key={file._id} className="border rounded-lg p-4">
                    <div className="flex justify-between items-start mb-2">
                      <h3 className="text-lg font-semibold">{file.originalName}</h3>
                      <div className="text-sm text-gray-600">
                        Created: {formatDate(file.createdAt)}
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <span className="text-sm text-gray-600">Views:</span>
                        <span className="ml-2 font-semibold">{file.viewCount}</span>
                      </div>
                      <div>
                        <span className="text-sm text-gray-600">Downloads:</span>
                        <span className="ml-2 font-semibold">{file.downloadCount}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default FileAnalytics;
