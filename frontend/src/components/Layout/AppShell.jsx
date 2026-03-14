import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useAuthStore } from '../../store/authStore';
import Sidebar from './Sidebar';
import Topbar from './Topbar';
import AuroraBackground from '../common/AuroraBackground';

export default function AppShell() {
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated);
  if (!isAuthenticated) return <Navigate to="/login" replace />;
  return (
    <>
      <AuroraBackground />
      <div className="app-shell">
        <Sidebar />
        <div className="app-main">
          <Topbar />
          <div className="page-content animate-fade">
            <Outlet />
          </div>
        </div>
      </div>
    </>
  );
}
