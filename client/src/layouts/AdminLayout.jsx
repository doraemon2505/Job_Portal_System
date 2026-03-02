import { Outlet, Navigate } from 'react-router-dom';
import Sidebar from '../components/Sidebar';
import { useAuth } from '../context/AuthContext';

const AdminLayout = () => {
  const { user, loading } = useAuth();

  if (loading) return <div>Loading...</div>;

  // Protect Admin Route
  if (!user || user.role !== 'admin') {
    return <Navigate to="/" replace />;
  }

  return (
    <div className="flex h-screen bg-slate-950 overflow-hidden w-full">
      <Sidebar />
      <div className="flex-1 p-8 overflow-y-auto h-screen">
        <Outlet />
      </div>
    </div>
  );
};

export default AdminLayout;