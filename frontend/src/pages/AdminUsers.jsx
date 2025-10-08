import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../utils/api';
import AdminLayout from '../components/AdminLayout';

const AdminUsers = () => {
  const navigate = useNavigate();
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [sortConfig, setSortConfig] = useState({ key: 'createdAt', direction: 'desc' });
  const [selectedUsers, setSelectedUsers] = useState(new Set());
  const [actionLoading, setActionLoading] = useState(false);
  const [action, setAction] = useState('');
  const [showUserModal, setShowUserModal] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);

  const fetchUsers = useCallback(async () => {
    try {
      setLoading(true);
      setError('');
      const response = await api.get('/admin/users');
      setUsers(response.data);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to fetch users. Please try again.');
      console.error('Error fetching users:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchUsers();
  }, [fetchUsers]);

  // Filter users based on search term
  const filteredUsers = users.filter(user =>
    user.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.role?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Sort users
  const sortedUsers = React.useMemo(() => {
    const sortableUsers = [...filteredUsers];
    if (sortConfig.key) {
      sortableUsers.sort((a, b) => {
        const aValue = a[sortConfig.key] || '';
        const bValue = b[sortConfig.key] || '';
        
        if (aValue < bValue) {
          return sortConfig.direction === 'asc' ? -1 : 1;
        }
        if (aValue > bValue) {
          return sortConfig.direction === 'asc' ? 1 : -1;
        }
        return 0;
      });
    }
    return sortableUsers;
  }, [filteredUsers, sortConfig]);

  const handleSort = (key) => {
    setSortConfig(current => ({
      key,
      direction: current.key === key && current.direction === 'asc' ? 'desc' : 'asc'
    }));
  };

  const handleRetry = () => {
    fetchUsers();
  };

  const getSortIcon = (columnKey) => {
    if (sortConfig.key !== columnKey) return '↕️';
    return sortConfig.direction === 'asc' ? '↑' : '↓';
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const formatNumber = (num) => {
    return new Intl.NumberFormat().format(num || 0);
  };

  const getUserStatus = (user) => {
    if (user.isSuspended) {
      return { status: 'suspended', label: 'Suspended', color: 'bg-red-100 text-red-800' };
    }
    if (user.isActive === false) {
      return { status: 'inactive', label: 'Inactive', color: 'bg-gray-100 text-gray-800' };
    }
    if (user.emailVerified === false) {
      return { status: 'unverified', label: 'Unverified', color: 'bg-yellow-100 text-yellow-800' };
    }
    return { status: 'active', label: 'Active', color: 'bg-green-100 text-green-800' };
  };

  const getRoleBadge = (role) => {
    const roleConfig = {
      admin: { color: 'bg-purple-100 text-purple-800', icon: '👑' },
      user: { color: 'bg-blue-100 text-blue-800', icon: '👤' },
      moderator: { color: 'bg-orange-100 text-orange-800', icon: '🛡️' },
      premium: { color: 'bg-yellow-100 text-yellow-800', icon: '⭐' }
    };
    
    const config = roleConfig[role] || { color: 'bg-gray-100 text-gray-800', icon: '❓' };
    return (
      <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium ${config.color}`}>
        {config.icon} {role.charAt(0).toUpperCase() + role.slice(1)}
      </span>
    );
  };

  const handleSelectUser = (userId) => {
    setSelectedUsers(prev => {
      const newSelected = new Set(prev);
      if (newSelected.has(userId)) {
        newSelected.delete(userId);
      } else {
        newSelected.add(userId);
      }
      return newSelected;
    });
  };

  const handleSelectAll = () => {
    if (selectedUsers.size === sortedUsers.length) {
      setSelectedUsers(new Set());
    } else {
      setSelectedUsers(new Set(sortedUsers.map(user => user._id)));
    }
  };

  const handleBulkAction = async (actionType) => {
    if (!selectedUsers.size) return;
    
    const actionMessages = {
      suspend: 'suspend',
      activate: 'activate',
      delete: 'delete'
    };
    
    if (!confirm(`Are you sure you want to ${actionMessages[actionType]} ${selectedUsers.size} user(s)?`)) {
      return;
    }

    try {
      setActionLoading(true);
      setAction(actionType);
      
      switch (actionType) {
        case 'suspend':
          await api.post('/admin/users/bulk-suspend', { userIds: Array.from(selectedUsers) });
          break;
        case 'activate':
          await api.post('/admin/users/bulk-activate', { userIds: Array.from(selectedUsers) });
          break;
        case 'delete':
          await api.post('/admin/users/bulk-delete', { userIds: Array.from(selectedUsers) });
          break;
        default:
          break;
      }
      
      await fetchUsers();
      setSelectedUsers(new Set());
    } catch (err) {
      setError(`Failed to ${actionType} users. Please try again.`);
    } finally {
      setActionLoading(false);
      setAction('');
    }
  };

  const handleUserAction = async (userId, actionType) => {
    try {
      setActionLoading(true);
      
      switch (actionType) {
        case 'suspend':
          await api.post(`/admin/users/${userId}/suspend`);
          break;
        case 'activate':
          await api.post(`/admin/users/${userId}/activate`);
          break;
        case 'delete':
          if (!confirm('Are you sure you want to delete this user? This action cannot be undone.')) return;
          await api.delete(`/admin/users/${userId}`);
          break;
        default:
          break;
      }
      
      await fetchUsers();
    } catch (err) {
      setError(`Failed to ${actionType} user. Please try again.`);
    } finally {
      setActionLoading(false);
    }
  };

  const viewUserDetails = (user) => {
    setSelectedUser(user);
    setShowUserModal(true);
  };

  const totalStats = React.useMemo(() => {
    return {
      totalUsers: users.length,
      activeUsers: users.filter(u => u.isActive !== false && !u.isSuspended).length,
      suspendedUsers: users.filter(u => u.isSuspended).length,
      adminUsers: users.filter(u => u.role === 'admin').length,
    };
  }, [users]);

  const getUserInitials = (name) => {
    return name
      ?.split(' ')
      .map(part => part.charAt(0))
      .join('')
      .toUpperCase()
      .substring(0, 2) || '??';
  };

  if (loading) {
    return (
      <AdminLayout>
        <div className="flex items-center justify-center min-h-96">
          <div className="text-center">
            <div className="w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
            <p className="text-gray-600">Loading users...</p>
          </div>
        </div>
      </AdminLayout>
    );
  }

  if (error && users.length === 0) {
    return (
      <AdminLayout>
        <div className="max-w-2xl mx-auto mt-8">
          <div className="bg-red-50 border border-red-200 rounded-xl p-6">
            <div className="flex items-center mb-3">
              <div className="w-6 h-6 bg-red-100 rounded-full flex items-center justify-center mr-3">
                <span className="text-red-600 text-sm">!</span>
              </div>
              <h3 className="text-red-800 font-semibold">Unable to Load Users</h3>
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
            <h1 className="text-3xl font-bold text-gray-900">User Management</h1>
            <p className="text-gray-600 mt-1">
              Manage and monitor all users in the system
            </p>
          </div>
          <div className="flex items-center gap-3">
            <span className="bg-blue-100 text-blue-800 text-sm font-medium px-3 py-1 rounded-full">
              {formatNumber(users.length)} total users
            </span>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Users</p>
                <p className="text-2xl font-bold text-gray-900 mt-1">{formatNumber(totalStats.totalUsers)}</p>
              </div>
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                <span className="text-blue-600 text-xl">👥</span>
              </div>
            </div>
          </div>

          <div
            className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm cursor-pointer hover:shadow-md transition-shadow"
            onClick={() => navigate('/admin/analytics')}
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Active Users</p>
                <p className="text-2xl font-bold text-gray-900 mt-1">{formatNumber(totalStats.activeUsers)}</p>
              </div>
              <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                <span className="text-green-600 text-xl">✅</span>
              </div>
            </div>
          </div>

          <div
            className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm cursor-pointer hover:shadow-md transition-shadow"
            onClick={() => navigate('/admin/analytics')}
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Suspended</p>
                <p className="text-2xl font-bold text-gray-900 mt-1">{formatNumber(totalStats.suspendedUsers)}</p>
              </div>
              <div className="w-12 h-12 bg-red-100 rounded-lg flex items-center justify-center">
                <span className="text-red-600 text-xl">⛔</span>
              </div>
            </div>
          </div>

          <div
            className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm cursor-pointer hover:shadow-md transition-shadow"
            onClick={() => navigate('/admin/analytics')}
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Administrators</p>
                <p className="text-2xl font-bold text-gray-900 mt-1">{formatNumber(totalStats.adminUsers)}</p>
              </div>
              <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
                <span className="text-purple-600 text-xl">👑</span>
              </div>
            </div>
          </div>
        </div>

        {/* Search and Actions Section */}
        <div className="bg-white p-4 rounded-xl border border-gray-200 shadow-sm">
          <div className="flex flex-col sm:flex-row gap-4 justify-between items-start sm:items-center">
            <div className="flex-1 w-full sm:max-w-md">
              <input
                type="text"
                placeholder="Search users by name, email, or role..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            
            <div className="flex flex-wrap items-center gap-2">
              {selectedUsers.size > 0 && (
                <>
                  <button
                    onClick={() => handleBulkAction('activate')}
                    disabled={actionLoading}
                    className="bg-green-600 hover:bg-green-700 disabled:bg-green-400 text-white px-3 py-2 rounded-lg transition-colors duration-200 flex items-center gap-2 text-sm"
                  >
                    {actionLoading && action === 'activate' ? (
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    ) : (
                      '✅'
                    )}
                    Activate
                  </button>
                  
                  <button
                    onClick={() => handleBulkAction('suspend')}
                    disabled={actionLoading}
                    className="bg-yellow-600 hover:bg-yellow-700 disabled:bg-yellow-400 text-white px-3 py-2 rounded-lg transition-colors duration-200 flex items-center gap-2 text-sm"
                  >
                    {actionLoading && action === 'suspend' ? (
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    ) : (
                      '⏸️'
                    )}
                    Suspend
                  </button>
                  
                  <button
                    onClick={() => handleBulkAction('delete')}
                    disabled={actionLoading}
                    className="bg-red-600 hover:bg-red-700 disabled:bg-red-400 text-white px-3 py-2 rounded-lg transition-colors duration-200 flex items-center gap-2 text-sm"
                  >
                    {actionLoading && action === 'delete' ? (
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    ) : (
                      '🗑️'
                    )}
                    Delete
                  </button>
                  
                  <span className="text-sm text-gray-600 mx-2">
                    {selectedUsers.size} selected
                  </span>
                </>
              )}
              
              <button
                onClick={fetchUsers}
                className="bg-gray-100 hover:bg-gray-200 text-gray-700 px-4 py-2 rounded-lg transition-colors duration-200 flex items-center gap-2"
              >
                🔄 Refresh
              </button>
            </div>
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

        {/* Users Table */}
        <div className="bg-white shadow-sm rounded-xl border border-gray-200 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider w-12">
                    <input
                      type="checkbox"
                      checked={selectedUsers.size === sortedUsers.length && sortedUsers.length > 0}
                      onChange={handleSelectAll}
                      className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                    />
                  </th>
                  <th 
                    className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100 transition-colors"
                    onClick={() => handleSort('name')}
                  >
                    <div className="flex items-center gap-2">
                      User
                      <span className="text-gray-400">{getSortIcon('name')}</span>
                    </div>
                  </th>
                  <th 
                    className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100 transition-colors"
                    onClick={() => handleSort('email')}
                  >
                    <div className="flex items-center gap-2">
                      Email
                      <span className="text-gray-400">{getSortIcon('email')}</span>
                    </div>
                  </th>
                  <th 
                    className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100 transition-colors"
                    onClick={() => handleSort('role')}
                  >
                    <div className="flex items-center gap-2">
                      Role
                      <span className="text-gray-400">{getSortIcon('role')}</span>
                    </div>
                  </th>
                  <th 
                    className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100 transition-colors"
                    onClick={() => handleSort('createdAt')}
                  >
                    <div className="flex items-center gap-2">
                      Joined
                      <span className="text-gray-400">{getSortIcon('createdAt')}</span>
                    </div>
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {sortedUsers.length === 0 ? (
                  <tr>
                    <td colSpan="7" className="px-6 py-12 text-center">
                      <div className="text-gray-500">
                        {searchTerm ? 'No users match your search.' : 'No users found.'}
                      </div>
                    </td>
                  </tr>
                ) : (
                  sortedUsers.map((user) => {
                    const status = getUserStatus(user);
                    return (
                      <tr 
                        key={user._id} 
                        className="hover:bg-gray-50 transition-colors duration-150"
                      >
                        <td className="px-6 py-4 whitespace-nowrap">
                          <input
                            type="checkbox"
                            checked={selectedUsers.has(user._id)}
                            onChange={() => handleSelectUser(user._id)}
                            className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                          />
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center mr-3 text-white font-semibold text-sm">
                              {getUserInitials(user.name)}
                            </div>
                            <div>
                              <div className="text-sm font-medium text-gray-900">
                                {user.name}
                              </div>
                              <div className="text-xs text-gray-500">
                                ID: {user._id?.substring(0, 8)}...
                              </div>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-900">{user.email}</div>
                          {user.lastLogin && (
                            <div className="text-xs text-gray-500">
                              Last login: {formatDate(user.lastLogin)}
                            </div>
                          )}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          {getRoleBadge(user.role)}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {formatDate(user.createdAt)}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${status.color}`}>
                            {status.label}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center gap-2">
                            <button
                              onClick={() => viewUserDetails(user)}
                              className="text-blue-600 hover:text-blue-900 p-1 rounded transition-colors"
                              title="View Details"
                            >
                              👁️
                            </button>
                            <button
                              onClick={() => handleUserAction(user._id, user.isSuspended ? 'activate' : 'suspend')}
                              disabled={actionLoading}
                              className="text-yellow-600 hover:text-yellow-900 p-1 rounded transition-colors disabled:opacity-50"
                              title={user.isSuspended ? 'Activate User' : 'Suspend User'}
                            >
                              {user.isSuspended ? '✅' : '⏸️'}
                            </button>
                            <button
                              onClick={() => handleUserAction(user._id, 'delete')}
                              disabled={actionLoading}
                              className="text-red-600 hover:text-red-900 p-1 rounded transition-colors disabled:opacity-50"
                              title="Delete User"
                            >
                              🗑️
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
          
          {/* Table Footer */}
          {sortedUsers.length > 0 && (
            <div className="bg-gray-50 px-6 py-3 border-t border-gray-200">
              <div className="flex justify-between items-center text-sm text-gray-600">
                <span>
                  Showing {formatNumber(sortedUsers.length)} of {formatNumber(users.length)} users
                  {searchTerm && ` (filtered)`}
                </span>
                <span className="text-xs">
                  Sorted by {sortConfig.key} ({sortConfig.direction})
                </span>
              </div>
            </div>
          )}
        </div>

        {/* User Detail Modal */}
        {showUserModal && selectedUser && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-xl max-w-md w-full max-h-[90vh] overflow-y-auto">
              <div className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-semibold text-gray-900">User Details</h3>
                  <button
                    onClick={() => setShowUserModal(false)}
                    className="text-gray-400 hover:text-gray-600"
                  >
                    ✕
                  </button>
                </div>
                
                <div className="space-y-4">
                  <div className="flex items-center gap-4">
                    <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white font-semibold text-lg">
                      {getUserInitials(selectedUser.name)}
                    </div>
                    <div>
                      <h4 className="text-xl font-bold text-gray-900">{selectedUser.name}</h4>
                      <p className="text-gray-600">{selectedUser.email}</p>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <span className="font-medium text-gray-500">Role:</span>
                      <div className="mt-1">{getRoleBadge(selectedUser.role)}</div>
                    </div>
                    <div>
                      <span className="font-medium text-gray-500">Status:</span>
                      <div className="mt-1">
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getUserStatus(selectedUser).color}`}>
                          {getUserStatus(selectedUser).label}
                        </span>
                      </div>
                    </div>
                    <div>
                      <span className="font-medium text-gray-500">Joined:</span>
                      <p className="text-gray-900">{formatDate(selectedUser.createdAt)}</p>
                    </div>
                    <div>
                      <span className="font-medium text-gray-500">Last Login:</span>
                      <p className="text-gray-900">{selectedUser.lastLogin ? formatDate(selectedUser.lastLogin) : 'Never'}</p>
                    </div>
                  </div>
                  
                  {selectedUser.lastIp && (
                    <div>
                      <span className="font-medium text-gray-500 text-sm">Last IP Address:</span>
                      <p className="text-gray-900 font-mono text-sm">{selectedUser.lastIp}</p>
                    </div>
                  )}
                </div>
                
                <div className="flex gap-3 mt-6 pt-4 border-t border-gray-200">
                  <button
                    onClick={() => handleUserAction(selectedUser._id, selectedUser.isSuspended ? 'activate' : 'suspend')}
                    disabled={actionLoading}
                    className="flex-1 bg-yellow-600 hover:bg-yellow-700 disabled:bg-yellow-400 text-white px-4 py-2 rounded-lg transition-colors duration-200"
                  >
                    {selectedUser.isSuspended ? 'Activate User' : 'Suspend User'}
                  </button>
                  <button
                    onClick={() => {
                      setShowUserModal(false);
                      handleUserAction(selectedUser._id, 'delete');
                    }}
                    disabled={actionLoading}
                    className="flex-1 bg-red-600 hover:bg-red-700 disabled:bg-red-400 text-white px-4 py-2 rounded-lg transition-colors duration-200"
                  >
                    Delete User
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </AdminLayout>
  );
};

export default AdminUsers;