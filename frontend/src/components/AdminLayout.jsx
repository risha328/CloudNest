import React, { useState } from 'react';
import AdminNavbar from './AdminNavbar';
import AdminSidebar from './AdminSidebar';

const AdminLayout = ({ children }) => {
  const [isCollapsed, setIsCollapsed] = useState(false);

  return (
    <div className="min-h-screen bg-gray-100">
      <AdminNavbar />
      <div className="flex">
        <div className="fixed top-16 left-0 h-full">
          <AdminSidebar isCollapsed={isCollapsed} setIsCollapsed={setIsCollapsed} />
        </div>
        <main className={`flex-1 p-6 pt-20 transition-all duration-300 ${isCollapsed ? 'ml-16' : 'ml-64'}`}>
          {children}
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;
