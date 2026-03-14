import React, { useState } from 'react';
import { User, Mail, Shield } from 'lucide-react';
import { useAuthStore } from '../store/authStore';
import toast from 'react-hot-toast';

export default function ProfilePage() {
  const user = useAuthStore((s) => s.user);
  const [name, setName] = useState(user?.name || '');

  return (
    <div>
      <div className="page-header">
        <div className="page-header-left"><h1>My Profile</h1><p>Manage your account information</p></div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '280px 1fr', gap: 24, alignItems: 'start' }}>
        {/* Avatar Card */}
        <div className="card" style={{ textAlign: 'center', padding: 32 }}>
          <div style={{
            width: 80, height: 80, borderRadius: '50%',
            background: 'linear-gradient(135deg, var(--color-primary), #7c3aed)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            color: '#fff', fontWeight: 800, fontSize: '1.75rem',
            margin: '0 auto 16px'
          }}>
            {user?.avatar || 'U'}
          </div>
          <h3>{user?.name}</h3>
          <p style={{ fontSize: '0.82rem', marginTop: 4 }}>{user?.email}</p>
          <div style={{ marginTop: 12 }}>
            <span className="badge badge-ready">{user?.role}</span>
          </div>
        </div>

        {/* Info Card */}
        <div className="card">
          <div className="card-header"><div className="card-title">Account Details</div></div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
            {[
              { icon: User, label: 'Full Name', value: user?.name },
              { icon: Mail, label: 'Email Address', value: user?.email },
              { icon: Shield, label: 'Role', value: user?.role },
            ].map((row) => (
              <div key={row.label} style={{ display: 'flex', alignItems: 'center', gap: 14, padding: '14px 0', borderBottom: '1px solid var(--color-border-light)' }}>
                <div style={{ width: 38, height: 38, borderRadius: 'var(--radius-md)', background: 'var(--color-primary-light)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--color-primary)', flexShrink: 0 }}>
                  <row.icon size={16} />
                </div>
                <div>
                  <div style={{ fontSize: '0.72rem', fontWeight: 600, color: 'var(--color-text-muted)', textTransform: 'uppercase', letterSpacing: '0.06em' }}>{row.label}</div>
                  <div style={{ fontWeight: 600, marginTop: 2 }}>{row.value}</div>
                </div>
              </div>
            ))}
          </div>
          <div style={{ marginTop: 24 }}>
            <button className="btn btn-primary" onClick={() => toast.success('Profile updated! (Demo)')}>
              Save Changes
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
