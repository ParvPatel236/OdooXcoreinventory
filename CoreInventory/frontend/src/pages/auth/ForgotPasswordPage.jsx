import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Boxes, Copy } from 'lucide-react';
import { useAuthStore } from '../../store/authStore';
import AuroraBackground from '../../components/common/AuroraBackground';
import toast from 'react-hot-toast';

const STEP = { EMAIL: 0, OTP: 1, RESET: 2, DONE: 3 };

export default function ForgotPasswordPage() {
  const [step, setStep] = useState(STEP.EMAIL);
  const [email, setEmail] = useState('');
  const [otp, setOtp] = useState('');
  const [demoOtp, setDemoOtp] = useState('');
  const [newPass, setNewPass] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { sendOtp, verifyOtp, resetPassword } = useAuthStore();
  const navigate = useNavigate();

  const sendOtpHandler = (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    setTimeout(() => {
      const res = sendOtp(email.trim());
      setLoading(false);
      if (res.success) {
        setDemoOtp(res.otp);
        setStep(STEP.OTP);
        toast.success('OTP sent! (Shown below for demo)');
      } else setError(res.error);
    }, 500);
  };

  const verifyOtpHandler = (e) => {
    e.preventDefault();
    setError('');
    const res = verifyOtp(otp.trim());
    if (res.success) setStep(STEP.RESET);
    else setError(res.error);
  };

  const resetHandler = (e) => {
    e.preventDefault();
    setError('');
    if (newPass.length < 6) return setError('Password must be at least 6 characters.');
    const res = resetPassword(email, newPass);
    if (res.success) { setStep(STEP.DONE); toast.success('Password reset successfully!'); }
    else setError(res.error);
  };

  return (
    <div className="auth-page">
      <AuroraBackground />
      <div className="auth-left">
        <div className="auth-card">
          <div className="auth-logo">
            <div className="auth-logo-icon"><Boxes size={26} color="#fff" /></div>
            <div><div className="auth-logo-text">CoreInventory</div></div>
          </div>

          {step === STEP.EMAIL && (
            <>
              <h2 className="auth-heading">Reset your password</h2>
              <p className="auth-subheading">Enter your email and we'll send an OTP.</p>
              <form onSubmit={sendOtpHandler} className="auth-form-gap">
                {error && <div className="auth-error">{error}</div>}
                <div>
                  <label className="auth-label">Email Address</label>
                  <input id="fp-email" className="auth-input" type="email" placeholder="you@company.com" value={email} onChange={(e) => setEmail(e.target.value)} />
                </div>
                <button type="submit" className="auth-btn" disabled={loading}>{loading ? 'Sending…' : 'Send OTP'}</button>
                <p className="auth-divider"><Link to="/login" className="auth-link">← Back to Login</Link></p>
              </form>
            </>
          )}

          {step === STEP.OTP && (
            <>
              <h2 className="auth-heading">Enter OTP</h2>
              <p className="auth-subheading">A 6-digit OTP was sent to <strong style={{ color: '#fff' }}>{email}</strong></p>
              {demoOtp && (
                <div style={{ background: 'rgba(79,110,247,0.12)', border: '1px solid rgba(79,110,247,0.25)', borderRadius: 8, padding: '12px 16px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 6 }}>
                  <div>
                    <p style={{ color: 'rgba(255,255,255,0.5)', fontSize: '0.7rem', marginBottom: 2 }}>Demo OTP (auto-generated):</p>
                    <span style={{ color: '#fff', fontWeight: 800, fontSize: '1.5rem', letterSpacing: '0.2em' }}>{demoOtp}</span>
                  </div>
                  <button className="btn" onClick={() => { setOtp(demoOtp); toast.success('OTP copied!'); }} style={{ color: 'rgba(255,255,255,0.6)' }}>
                    <Copy size={14} /> Fill
                  </button>
                </div>
              )}
              <form onSubmit={verifyOtpHandler} className="auth-form-gap" style={{ marginTop: 16 }}>
                {error && <div className="auth-error">{error}</div>}
                <div>
                  <label className="auth-label">6-Digit OTP</label>
                  <input id="fp-otp" className="auth-input" type="text" placeholder="e.g. 123456" maxLength={6} value={otp} onChange={(e) => setOtp(e.target.value)} style={{ letterSpacing: '0.3em', fontSize: '1.2rem', textAlign: 'center' }} />
                </div>
                <button type="submit" className="auth-btn">Verify OTP</button>
              </form>
            </>
          )}

          {step === STEP.RESET && (
            <>
              <h2 className="auth-heading">Set new password</h2>
              <p className="auth-subheading">Choose a strong new password.</p>
              <form onSubmit={resetHandler} className="auth-form-gap">
                {error && <div className="auth-error">{error}</div>}
                <div>
                  <label className="auth-label">New Password</label>
                  <input id="fp-newpass" className="auth-input" type="password" placeholder="Min 6 characters" value={newPass} onChange={(e) => setNewPass(e.target.value)} />
                </div>
                <button type="submit" className="auth-btn">Reset Password</button>
              </form>
            </>
          )}

          {step === STEP.DONE && (
            <>
              <h2 className="auth-heading">Password reset! 🎉</h2>
              <p className="auth-subheading">Your password has been updated successfully.</p>
              <div className="auth-success">You can now log in with your new password.</div>
              <button className="auth-btn" style={{ marginTop: 24 }} onClick={() => navigate('/login')}>Go to Login</button>
            </>
          )}
        </div>
      </div>
      <div className="auth-right">
        <div className="auth-hero">
          <h2>Secure Access Control</h2>
          <p>OTP-based password reset ensures only authorized users can access the system.</p>
        </div>
      </div>
    </div>
  );
}
