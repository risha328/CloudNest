import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import API from '../utils/api';
import AdminLayout from '../components/AdminLayout';
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer,
  BarChart, Bar, PieChart, Pie, Cell, AreaChart, Area, RadarChart, Radar, PolarGrid,
  PolarAngleAxis, PolarRadiusAxis
} from 'recharts';

const AdminAnalytics = () => {
  const navigate = useNavigate();
  const [analyticsData, setAnalyticsData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [timeRange, setTimeRange] = useState('30d');
  const [activeTab, setActiveTab] = useState('overview');

  const fetchAnalyticsData = useCallback(async () => {
    try {
      setLoading(true);
      setError('');
      const response = await API.get(`/admin/analytics?range=${timeRange}`);
      setAnalyticsData(response.data);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to load analytics data. Please try again.');
      console.error('Error fetching analytics:', err);
    } finally {
      setLoading(false);
    }
  }, [timeRange]);

  useEffect(() => {
    fetchAnalyticsData();
  }, [fetchAnalyticsData]);

  const handleRetry = () => {
    fetchAnalyticsData();
  };

  const formatNumber = (num) => {
    return new Intl.NumberFormat().format(num || 0);
  };

  const formatFileSize = (bytes) => {
    if (!bytes) return '0 B';
    const units = ['B', 'KB', 'MB', 'GB', 'TB'];
    let size = bytes;
    let unitIndex = 0;

    while (size >= 1024 && unitIndex < units.length - 1) {
      size /= 1024;
      unitIndex++;
    }

    return `${size.toFixed(1)} ${units[unitIndex]}`;
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric'
    });
  };

  // Prepare data for charts
  const uploadTrendsData = analyticsData?.uploadTrends?.map(item => ({
    date: formatDate(item._id),
    fullDate: item._id,
    uploads: item.count,
    size: item.totalSize || 0
  })) || [];

  const downloadTrendsData = analyticsData?.downloadTrends?.map(item => ({
    date: formatDate(item._id),
    fullDate: item._id,
    downloads: item.count
  })) || [];

  const topDownloadedData = analyticsData?.topDownloadedFiles?.slice(0, 10).map((file, index) => ({
    id: file._id,
    name: file.originalName?.length > 15 ? file.originalName.substring(0, 15) + '...' : file.originalName,
    fullName: file.originalName,
    downloads: file.downloadCount || 0,
    views: file.viewCount || 0,
    owner: file.ownerName || 'Unknown',
    size: file.size || 0,
    type: file.fileType?.split('/')[0] || 'Unknown'
  })) || [];

  const topUsersData = analyticsData?.topUsersByUploads?.slice(0, 8).map(user => ({
    id: user._id,
    name: user.ownerName?.length > 12 ? user.ownerName.substring(0, 12) + '...' : user.ownerName || 'Unknown',
    fullName: user.ownerName,
    files: user.fileCount || 0,
    storage: user.totalStorage || 0,
    downloads: user.totalDownloads || 0
  })) || [];

  const fileTypeData = analyticsData?.fileTypeDistribution?.map(item => ({
    name: item._id?.split('/')[0] || 'Other',
    value: item.count,
    size: item.totalSize || 0
  })) || [];

  const malwareData = analyticsData?.malwareSummary?.map(item => ({
    name: item._id === 'malicious' ? 'Blocked' : 'Clean',
    value: item.count,
    color: item._id === 'malicious' ? '#EF4444' : '#10B981'
  })) || [{ name: 'Clean', value: 100, color: '#10B981' }];

  const userActivityData = analyticsData?.userActivity?.map(item => ({
    subject: item._id,
    active: item.activeUsers || 0,
    total: item.totalUsers || 0,
    full: 100
  })) || [];

  const systemStats = analyticsData?.systemHealth || {};
  const realTimeStats = analyticsData?.realTimeStats || {};

  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8', '#82CA9D'];
  const TIME_RANGES = [
    { value: '7d', label: '7D' },
    { value: '30d', label: '30D' },
    { value: '90d', label: '90D' },
    { value: '1y', label: '1Y' }
  ];

  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white p-3 border border-gray-200 rounded-lg shadow-lg">
          <p className="font-semibold text-gray-900">{label}</p>
          {payload.map((entry, index) => (
            <p key={index} style={{ color: entry.color }} className="text-sm">
              {entry.name}: {formatNumber(entry.value)}
              {entry.dataKey === 'storage' && ' GB'}
            </p>
          ))}
        </div>
      );
    }
    return null;
  };

  const StatCard = ({ title, value, change, icon, color, format, onClick }) => (
    <div
      className={`bg-white p-6 rounded-xl border border-gray-200 shadow-sm ${onClick ? 'cursor-pointer hover:shadow-md transition-shadow' : ''}`}
      onClick={onClick}
    >
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-gray-600">{title}</p>
          <p className={`text-2xl font-bold ${color} mt-1`}>
            {format ? format(value) : formatNumber(value)}
          </p>
          {change !== undefined && (
            <p className={`text-xs mt-1 ${change >= 0 ? 'text-green-600' : 'text-red-600'}`}>
              {change >= 0 ? '↗' : '↘'} {Math.abs(change)}% from last period
            </p>
          )}
        </div>
        <div className={`w-12 h-12 ${color.replace('text', 'bg').split('-')[0] + '-100'} rounded-lg flex items-center justify-center`}>
          <span className={`text-xl ${color}`}>{icon}</span>
        </div>
      </div>
    </div>
  );

  if (loading) {
    return (
      <AdminLayout>
        <div className="flex items-center justify-center min-h-96">
          <div className="text-center">
            <div className="w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
            <p className="text-gray-600">Loading analytics dashboard...</p>
          </div>
        </div>
      </AdminLayout>
    );
  }

  if (error && !analyticsData) {
    return (
      <AdminLayout>
        <div className="max-w-2xl mx-auto mt-8">
          <div className="bg-red-50 border border-red-200 rounded-xl p-6">
            <div className="flex items-center mb-3">
              <div className="w-6 h-6 bg-red-100 rounded-full flex items-center justify-center mr-3">
                <span className="text-red-600 text-sm">!</span>
              </div>
              <h3 className="text-red-800 font-semibold">Unable to Load Analytics</h3>
            </div>
            <p className="text-red-700 mb-4">{error}</p>
            <button
              onClick={handleRetry}
              className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg transition-colors duration-200"
            >
              Try Again
            </button>
          </div>
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <div className="p-6 space-y-6">
        {/* Header Section */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Analytics Dashboard</h1>
            <p className="text-gray-600 mt-1">
              Comprehensive insights and performance metrics
            </p>
          </div>

          <div className="flex items-center gap-3">
            <div className="flex bg-gray-100 rounded-lg p-1">
              {TIME_RANGES.map((range) => (
                <button
                  key={range.value}
                  onClick={() => setTimeRange(range.value)}
                  className={`px-3 py-1 text-sm font-medium rounded-md transition-colors ${
                    timeRange === range.value
                      ? 'bg-white text-gray-900 shadow-sm'
                      : 'text-gray-600 hover:text-gray-900'
                  }`}
                >
                  {range.label}
                </button>
              ))}
            </div>

            <button
              onClick={fetchAnalyticsData}
              className="bg-gray-100 hover:bg-gray-200 text-gray-700 px-4 py-2 rounded-lg transition-colors duration-200 flex items-center gap-2"
            >
              🔄 Refresh
            </button>
          </div>
        </div>

        {/* Error Banner */}
        {error && (
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
            <div className="flex items-center">
              <div className="w-5 h-5 bg-yellow-100 rounded-full flex items-center justify-center mr-3">
                <span className="text-yellow-600 text-sm">⚠</span>
              </div>
              <div className="flex-1">
                <p className="text-yellow-800 text-sm">{error}</p>
              </div>
              <button
                onClick={handleRetry}
                className="text-yellow-800 hover:text-yellow-900 font-medium text-sm"
              >
                Retry
              </button>
            </div>
          </div>
        )}

        {/* Key Metrics Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <StatCard
            title="Total Users"
            value={systemStats.totalUsers}
            change={realTimeStats.userGrowth}
            icon="👥"
            color="text-blue-600"
            onClick={() => navigate('/admin/users')}
          />
          <StatCard
            title="Total Files"
            value={systemStats.totalFiles}
            change={realTimeStats.fileGrowth}
            icon="📁"
            color="text-green-600"
            onClick={() => navigate('/admin/files')}
          />
          <StatCard
            title="Total Downloads"
            value={systemStats.totalDownloads}
            change={realTimeStats.downloadGrowth}
            icon="⬇️"
            color="text-purple-600"
          />
          <StatCard
            title="Storage Used"
            value={systemStats.totalStorage}
            change={realTimeStats.storageGrowth}
            icon="💾"
            color="text-orange-600"
            format={formatFileSize}
          />
        </div>

        {/* Navigation Tabs */}
        <div className="border-b border-gray-200">
          <nav className="-mb-px flex space-x-8">
            {['overview', 'users', 'files', 'security'].map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`py-2 px-1 border-b-2 font-medium text-sm capitalize ${
                  activeTab === tab
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                {tab}
              </button>
            ))}
          </nav>
        </div>

        {/* Overview Tab */}
        {activeTab === 'overview' && (
          <div className="space-y-6">
            {/* Upload & Download Trends */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              <div className="bg-white p-4 rounded-xl border border-gray-200 shadow-sm">
                <h3 className="text-base font-semibold text-gray-900 mb-3">Upload Trends</h3>
                <ResponsiveContainer width="100%" height={250}>
                  <AreaChart data={uploadTrendsData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                    <XAxis dataKey="date" />
                    <YAxis />
                    <Tooltip content={<CustomTooltip />} />
                    <Area type="monotone" dataKey="uploads" stroke="#0088FE" fill="#0088FE" fillOpacity={0.3} />
                  </AreaChart>
                </ResponsiveContainer>
              </div>

              <div className="bg-white p-4 rounded-xl border border-gray-200 shadow-sm">
                <h3 className="text-base font-semibold text-gray-900 mb-3">Download Trends</h3>
                <ResponsiveContainer width="100%" height={250}>
                  <AreaChart data={downloadTrendsData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                    <XAxis dataKey="date" />
                    <YAxis />
                    <Tooltip content={<CustomTooltip />} />
                    <Area type="monotone" dataKey="downloads" stroke="#00C49F" fill="#00C49F" fillOpacity={0.3} />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Top Content */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              <div className="bg-white p-4 rounded-xl border border-gray-200 shadow-sm">
                <h3 className="text-base font-semibold text-gray-900 mb-3">Top Downloaded Files</h3>
                <ResponsiveContainer width="100%" height={250}>
                  <BarChart data={topDownloadedData} layout="vertical">
                    <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                    <XAxis type="number" />
                    <YAxis type="category" dataKey="name" width={80} />
                    <Tooltip
                      content={({ active, payload, label }) => {
                        if (active && payload && payload.length) {
                          const data = payload[0].payload;
                          return (
                            <div className="bg-white p-3 border border-gray-200 rounded-lg shadow-lg">
                              <p className="font-semibold text-gray-900">{data.fullName}</p>
                              <p className="text-sm text-gray-600">Owner: {data.owner}</p>
                              <p className="text-sm text-gray-600">Type: {data.type}</p>
                              <p className="text-sm text-green-600">Downloads: {formatNumber(data.downloads)}</p>
                              <p className="text-sm text-blue-600">Views: {formatNumber(data.views)}</p>
                              <p className="text-sm text-gray-600">Size: {formatFileSize(data.size)}</p>
                            </div>
                          );
                        }
                        return null;
                      }}
                    />
                    <Bar dataKey="downloads" fill="#82ca9d" radius={[0, 4, 4, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>

              <div className="bg-white p-4 rounded-xl border border-gray-200 shadow-sm">
                <h3 className="text-base font-semibold text-gray-900 mb-3">File Type Distribution</h3>
                <ResponsiveContainer width="100%" height={250}>
                  <PieChart>
                    <Pie
                      data={fileTypeData}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      label={({ name, percent }) => `${name} (${(percent * 100).toFixed(1)}%)`}
                      outerRadius={90}
                      fill="#8884d8"
                      dataKey="value"
                    >
                      {fileTypeData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip
                      content={({ active, payload }) => {
                        if (active && payload && payload.length) {
                          const data = payload[0].payload;
                          return (
                            <div className="bg-white p-3 border border-gray-200 rounded-lg shadow-lg">
                              <p className="font-semibold text-gray-900">{data.name}</p>
                              <p className="text-sm text-gray-600">Files: {formatNumber(data.value)}</p>
                              <p className="text-sm text-gray-600">Size: {formatFileSize(data.size)}</p>
                            </div>
                          );
                        }
                        return null;
                      }}
                    />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>
        )}

        {/* Users Tab */}
        {activeTab === 'users' && (
          <div className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Top Users by Uploads</h3>
                <ResponsiveContainer width="100%" height={400}>
                  <BarChart data={topUsersData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip
                      content={({ active, payload }) => {
                        if (active && payload && payload.length) {
                          const data = payload[0].payload;
                          return (
                            <div className="bg-white p-3 border border-gray-200 rounded-lg shadow-lg">
                              <p className="font-semibold text-gray-900">{data.fullName}</p>
                              <p className="text-sm text-blue-600">Files: {formatNumber(data.files)}</p>
                              <p className="text-sm text-green-600">Downloads: {formatNumber(data.downloads)}</p>
                              <p className="text-sm text-gray-600">Storage: {formatFileSize(data.storage)}</p>
                            </div>
                          );
                        }
                        return null;
                      }}
                    />
                    <Bar dataKey="files" fill="#8884d8" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>

              <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">User Activity Radar</h3>
                <ResponsiveContainer width="100%" height={400}>
                  <RadarChart data={userActivityData}>
                    <PolarGrid />
                    <PolarAngleAxis dataKey="subject" />
                    <PolarRadiusAxis />
                    <Radar name="Active Users" dataKey="active" stroke="#0088FE" fill="#0088FE" fillOpacity={0.6} />
                    <Tooltip />
                  </RadarChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>
        )}

        {/* Security Tab */}
        {activeTab === 'security' && (
          <div className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Malware Scan Results</h3>
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie
                      data={malwareData}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      label={({ name, percent }) => `${name} (${(percent * 100).toFixed(1)}%)`}
                      outerRadius={100}
                      fill="#8884d8"
                      dataKey="value"
                    >
                      {malwareData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
                <div className="mt-4 grid grid-cols-2 gap-4 text-center">
                  <div>
                    <p className="text-2xl font-bold text-green-600">
                      {malwareData.find(d => d.name === 'Clean')?.value || 0}
                    </p>
                    <p className="text-sm text-gray-600">Clean Files</p>
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-red-600">
                      {malwareData.find(d => d.name === 'Blocked')?.value || 0}
                    </p>
                    <p className="text-sm text-gray-600">Blocked Files</p>
                  </div>
                </div>
              </div>

              <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Security Overview</h3>
                <div className="space-y-4">
                  <div className="flex justify-between items-center p-3 bg-green-50 rounded-lg">
                    <span className="text-green-800 font-medium">Successful Scans</span>
                    <span className="text-green-600 font-bold">
                      {analyticsData?.securityStats?.successfulScans || 0}
                    </span>
                  </div>
                  <div className="flex justify-between items-center p-3 bg-yellow-50 rounded-lg">
                    <span className="text-yellow-800 font-medium">Quarantined Files</span>
                    <span className="text-yellow-600 font-bold">
                      {analyticsData?.securityStats?.quarantinedFiles || 0}
                    </span>
                  </div>
                  <div className="flex justify-between items-center p-3 bg-red-50 rounded-lg">
                    <span className="text-red-800 font-medium">Security Alerts</span>
                    <span className="text-red-600 font-bold">
                      {analyticsData?.securityStats?.securityAlerts || 0}
                    </span>
                  </div>
                  <div className="flex justify-between items-center p-3 bg-blue-50 rounded-lg">
                    <span className="text-blue-800 font-medium">Last Scan</span>
                    <span className="text-blue-600 font-bold text-sm">
                      {analyticsData?.securityStats?.lastScan
                        ? formatDate(analyticsData.securityStats.lastScan)
                        : 'Never'
                      }
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Quick Stats Footer */}
        <div className="bg-gray-50 rounded-xl p-6 border border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Performance Summary</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
            <div>
              <p className="text-sm text-gray-600">Avg. Uploads/Day</p>
              <p className="text-xl font-bold text-gray-900">
                {formatNumber(Math.round(systemStats.totalFiles / 30))}
              </p>
            </div>
            <div>
              <p className="text-sm text-gray-600">Avg. Downloads/Day</p>
              <p className="text-xl font-bold text-gray-900">
                {formatNumber(Math.round(systemStats.totalDownloads / 30))}
              </p>
            </div>
            <div>
              <p className="text-sm text-gray-600">Active Users</p>
              <p className="text-xl font-bold text-gray-900">
                {formatNumber(realTimeStats.activeUsers || 0)}
              </p>
            </div>
            <div>
              <p className="text-sm text-gray-600">Scan Success Rate</p>
              <p className="text-xl font-bold text-green-600">
                {analyticsData?.securityStats?.scanSuccessRate || 100}%
              </p>
            </div>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
};

export default AdminAnalytics;
