import React from 'react';
import AdminNavbar from './AdminNavbar';
import AdminSidebar from './AdminSidebar';

const AdminLayout = ({ children }) => {
  return (
    <div className="min-h-screen bg-gray-100">
      <AdminNavbar />
      <div className="flex">
        <div className="fixed top-16 left-0 h-full">
          <AdminSidebar />
        </div>
        <main className="flex-1 ml-64 p-6 pt-20">
          {children}
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;
