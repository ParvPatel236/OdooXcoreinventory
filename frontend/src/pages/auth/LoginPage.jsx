import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Boxes, Eye, EyeOff } from 'lucide-react';
import { useAuthStore } from '../../store/authStore';
import AuroraBackground from '../../components/common/AuroraBackground';
import toast from 'react-hot-toast';

export default function LoginPage() {
  const [email, setEmail] = useState('admin@coreinventory.com');
  const [password, setPassword] = useState('Admin@123');
  const [showPw, setShowPw] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const login = useAuthStore((s) => s.login);
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    setError('');
    if (!email || !password) return setError('Please fill in all fields.');
    setLoading(true);
    setTimeout(() => {
      const res = login(email.trim(), password);
      setLoading(false);
      if (res.success) {
        toast.success('Welcome back!');
        navigate('/dashboard');
      } else {
        setError(res.error);
      }
    }, 500);
  };

  return (
    <div className="auth-page">
      <AuroraBackground />
      <div className="auth-left">
        <div className="auth-card">
          <div className="auth-logo">
            <div className="auth-logo-icon"><Boxes size={26} color="#fff" /></div>
            <div>
              <div className="auth-logo-text">CoreInventory</div>
              <div className="auth-logo-sub" style={{ color: 'rgba(255,255,255,0.4)', fontSize: '0.7rem' }}>IMS Platform</div>
            </div>
          </div>

          <h2 className="auth-heading">Sign in to your account</h2>
          <p className="auth-subheading">Enter your credentials to access the inventory dashboard.</p>

          <form onSubmit={handleSubmit} className="auth-form-gap">
            {error && <div className="auth-error">{error}</div>}

            <div>
              <label className="auth-label">Email Address</label>
              <input
                id="login-email"
                className="auth-input"
                type="email"
                placeholder="admin@coreinventory.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                autoComplete="email"
              />
            </div>

            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6 }}>
                <label className="auth-label" style={{ marginBottom: 0 }}>Password</label>
                <Link to="/forgot-password" className="auth-link" style={{ fontSize: '0.75rem' }}>Forgot password?</Link>
              </div>
              <div style={{ position: 'relative' }}>
                <input
                  id="login-password"
                  className="auth-input"
                  type={showPw ? 'text' : 'password'}
                  placeholder="Enter your password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  autoComplete="current-password"
                  style={{ paddingRight: 42 }}
                />
                <button
                  type="button"
                  onClick={() => setShowPw((s) => !s)}
                  style={{ position: 'absolute', right: 12, top: '50%', transform: 'translateY(-50%)', color: 'rgba(255,255,255,0.4)', background: 'none', border: 'none', cursor: 'pointer' }}
                >
                  {showPw ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>

            <button type="submit" className="auth-btn" disabled={loading}>
              {loading ? 'Signing in…' : 'Sign In'}
            </button>

            <p className="auth-divider">
              Don't have an account? <Link to="/signup" className="auth-link">Create one</Link>
            </p>
          </form>

          <div style={{ marginTop: 24, padding: '12px 16px', background: 'rgba(79,110,247,0.08)', borderRadius: 8, border: '1px solid rgba(79,110,247,0.2)' }}>
            <p style={{ color: 'rgba(255,255,255,0.5)', fontSize: '0.72rem', marginBottom: 4 }}>Demo Credentials</p>
            <p style={{ color: 'rgba(255,255,255,0.75)', fontSize: '0.78rem' }}>admin@coreinventory.com / Admin@123</p>
          </div>
        </div>
      </div>

      <div className="auth-right">
        <div className="auth-hero">
          <h2>Smarter Inventory, Streamlined Operations</h2>
          <p>Replace manual registers with a real-time, centralized inventory platform.</p>
          <div className="auth-features">
            {[
              { icon: '📦', title: 'Real-Time Stock Tracking', desc: 'Monitor all products across multiple warehouses.' },
              { icon: '🚚', title: 'Receipts & Deliveries', desc: 'Manage incoming and outgoing goods seamlessly.' },
              { icon: '🔄', title: 'Internal Transfers', desc: 'Move stock between locations with a full audit trail.' },
              { icon: '📊', title: 'Analytics Dashboard', desc: 'KPIs, charts, and alerts at a glance.' },
            ].map((f) => (
              <div className="auth-feature" key={f.title}>
                <div className="auth-feature-icon" style={{ fontSize: '1.2rem' }}>{f.icon}</div>
                <div>
                  <div className="auth-feature-title">{f.title}</div>
                  <div className="auth-feature-text">{f.desc}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
