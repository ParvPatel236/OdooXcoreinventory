import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Boxes } from 'lucide-react';
import { useAuthStore } from '../../store/authStore';
import AuroraBackground from '../../components/common/AuroraBackground';
import toast from 'react-hot-toast';

export default function SignupPage() {
  const [form, setForm] = useState({ name: '', email: '', password: '', role: 'Inventory Manager' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const signup = useAuthStore((s) => s.signup);
  const navigate = useNavigate();

  const set = (k) => (e) => setForm((f) => ({ ...f, [k]: e.target.value }));

  const handleSubmit = (e) => {
    e.preventDefault();
    setError('');
    if (!form.name || !form.email || !form.password) return setError('All fields are required.');
    if (form.password.length < 6) return setError('Password must be at least 6 characters.');
    setLoading(true);
    setTimeout(() => {
      const res = signup(form.name, form.email, form.password, form.role);
      setLoading(false);
      if (res.success) {
        toast.success('Account created! Welcome to CoreInventory.');
        navigate('/dashboard');
      } else {
        setError(res.error);
      }
    }, 500);
  };

  return (
    <div className="auth-page">
      <AuroraBackground />
      <div className="auth-left" style={{ justifyContent: 'center' }}>
        <div className="auth-card" style={{ maxWidth: 480 }}>
          <div className="auth-logo">
            <div className="auth-logo-icon"><Boxes size={26} color="#fff" /></div>
            <div>
              <div className="auth-logo-text">CoreInventory</div>
            </div>
          </div>
          <h2 className="auth-heading">Create your account</h2>
          <p className="auth-subheading">Join the team and start managing inventory.</p>

          <form onSubmit={handleSubmit} className="auth-form-gap">
            {error && <div className="auth-error">{error}</div>}
            <div>
              <label className="auth-label">Full Name</label>
              <input id="signup-name" className="auth-input" type="text" placeholder="John Smith" value={form.name} onChange={set('name')} />
            </div>
            <div>
              <label className="auth-label">Email Address</label>
              <input id="signup-email" className="auth-input" type="email" placeholder="john@company.com" value={form.email} onChange={set('email')} />
            </div>
            <div>
              <label className="auth-label">Role</label>
              <select id="signup-role" className="auth-input" value={form.role} onChange={set('role')} style={{ cursor: 'pointer' }}>
                <option>Inventory Manager</option>
                <option>Warehouse Staff</option>
              </select>
            </div>
            <div>
              <label className="auth-label">Password</label>
              <input id="signup-password" className="auth-input" type="password" placeholder="Min 6 characters" value={form.password} onChange={set('password')} />
            </div>
            <button type="submit" className="auth-btn" disabled={loading}>
              {loading ? 'Creating account…' : 'Create Account'}
            </button>
            <p className="auth-divider">
              Already have an account? <Link to="/login" className="auth-link">Sign in</Link>
            </p>
          </form>
        </div>
      </div>

      <div className="auth-right">
        <div className="auth-hero">
          <h2>Built for Real Operations</h2>
          <p>Whether you manage a single warehouse or a multi-site network, CoreInventory scales with your team.</p>
        </div>
      </div>
    </div>
  );
}
