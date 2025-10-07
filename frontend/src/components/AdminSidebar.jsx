import React from 'react';
import { Link, useLocation } from 'react-router-dom';

const AdminSidebar = ({ isCollapsed, setIsCollapsed }) => {
  const location = useLocation();

  const menuItems = [
    { name: "Dashboard", icon: "📊", path: "/admin/dashboard" },
    { name: "File Management", icon: "📂", path: "/admin/files" },
    { name: "Folder Management", icon: "🗃️", path: "/admin/folders" },
    { name: "Users Management", icon: "👤", path: "/admin/users" },
    { name: "Analytics", icon: "📈", path: "/admin/analytics" },
    { name: "Storage Management", icon: "💾", path: "/admin/storage" },
  ];

  return (
    <div className={`bg-white shadow-lg h-screen border-r border-gray-200 overflow-hidden transition-all duration-300 ${isCollapsed ? 'w-16' : 'w-64'}`}>
      <div className="p-6 flex items-center justify-between">
        {!isCollapsed && <h2 className="text-lg font-semibold text-gray-800">Admin Panel</h2>}
        <button
          onClick={() => setIsCollapsed(!isCollapsed)}
          className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
        >
          <svg className="w-6 h-6 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
          </svg>
        </button>
      </div>
      <nav className="mt-6">
        <div className={`${isCollapsed ? 'px-2' : 'px-6'} space-y-2`}>
          {menuItems.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              className={`flex items-center ${isCollapsed ? 'px-3 py-3 justify-center' : 'px-4 py-3'} text-sm font-medium rounded-lg transition-colors ${
                location.pathname === item.path
                  ? 'bg-blue-100 text-blue-700'
                  : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'
              }`}
              title={isCollapsed ? item.name : ''}
            >
              <span className={`${isCollapsed ? 'mr-0' : 'mr-3'}`}>{item.icon}</span>
              {!isCollapsed && item.name}
            </Link>
          ))}
        </div>
      </nav>
    </div>
  );
};

export default AdminSidebar;
