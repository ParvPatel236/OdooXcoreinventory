import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuthStore } from '../store/authStore';
import { canAccessPage } from '../utils/roleAccess';

export default function ProtectedRoute({ path, element }) {
  const user = useAuthStore((s) => s.user);
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated);

  if (!isAuthenticated || !user) {
    return <Navigate to="/login" replace />;
  }

  if (!canAccessPage(user.role, path)) {
    return (
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        minHeight: '100vh',
        background: 'var(--color-bg)',
        color: 'var(--color-text)',
        flexDirection: 'column',
        gap: '16px',
      }}>
        <h1 style={{ fontSize: '1.5rem', fontWeight: 700 }}>Access Denied</h1>
        <p style={{ color: 'var(--color-text-secondary)' }}>
          You don't have permission to access this page.
        </p>
        <a href="/dashboard" style={{
          color: 'var(--color-primary)',
          textDecoration: 'none',
          fontWeight: 600,
        }}>
          Go to Dashboard
        </a>
      </div>
    );
  }

  return element;
}
