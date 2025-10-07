import { useContext } from 'react';
import { Navigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';

const AdminProtectedRoute = ({ children }) => {
  const { user } = useContext(AuthContext);
  const token = localStorage.getItem('token');

  if (!user && !token) {
    return <Navigate to="/admin/login" replace />;
  }

  if (user && user.role !== 'admin') {
    return <Navigate to="/login" replace />;
  }

  return children;
};

export default AdminProtectedRoute;
