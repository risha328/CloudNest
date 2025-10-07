import React from 'react';
import { Link, useLocation } from 'react-router-dom';

const AdminSidebar = () => {
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
    <div className="w-64 bg-white shadow-lg h-screen border-r border-gray-200 overflow-hidden">
      <div className="p-6">
        <h2 className="text-lg font-semibold text-gray-800">Admin Panel</h2>
      </div>
      <nav className="mt-6">
        <div className="px-6 space-y-2">
          {menuItems.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              className={`flex items-center px-4 py-3 text-sm font-medium rounded-lg transition-colors ${
                location.pathname === item.path
                  ? 'bg-blue-100 text-blue-700'
                  : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'
              }`}
            >
              <span className="mr-3">{item.icon}</span>
              {item.name}
            </Link>
          ))}
        </div>
      </nav>
    </div>
  );
};

export default AdminSidebar;
