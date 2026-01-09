import { useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { Lock, Loader2, ArrowLeft } from 'lucide-react';
import { api } from '../lib/api';
import toast from 'react-hot-toast';

export default function ResetPassword() {
  const [searchParams] = useSearchParams();
  const token = searchParams.get('token');
  
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (password !== confirmPassword) {
      toast.error('Passwords do not match');
      return;
    }

    if (!token) {
      toast.error('Invalid or missing reset token');
      return;
    }

    setLoading(true);
    
    try {
      await api.post('/auth/reset-password', { token, newPassword: password });
      toast.success('Password reset successfully');
      navigate('/login');
    } catch (err: any) {
      toast.error(err.response?.data?.error || 'Failed to reset password');
    } finally {
      setLoading(false);
    }
  };

  if (!token) {
     return (
        <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'radial-gradient(circle at top right, #3b82f611, transparent), radial-gradient(circle at bottom left, #7c3aed11, transparent)' }}>
            <div className="glass-card" style={{ padding: '40px', textAlign: 'center' }}>
                <h2 style={{ color: 'var(--error-color)', marginBottom: '16px' }}>Invalid Link</h2>
                <p style={{ marginBottom: '24px', color: 'var(--text-secondary)' }}>This password reset link is invalid or has expired.</p>
                <button onClick={() => navigate('/login')} className="btn-primary">Return to Login</button>
            </div>
        </div>
     );
  }

  return (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'radial-gradient(circle at top right, #3b82f611, transparent), radial-gradient(circle at bottom left, #7c3aed11, transparent)' }}>
      <div className="glass-card" style={{ width: '100%', maxWidth: '400px', padding: '40px' }}>
        <div style={{ textAlign: 'center', marginBottom: '32px' }}>
          <h1 style={{ color: 'var(--accent-color)', fontSize: '2rem', marginBottom: '8px' }}>Reset Password</h1>
          <p style={{ color: 'var(--text-secondary)' }}>Enter your new password below</p>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>New Password</label>
            <div style={{ position: 'relative' }}>
              <Lock size={18} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-secondary)' }} />
              <input 
                type="password" 
                placeholder="••••••••"
                style={{ width: '100%', paddingLeft: '40px' }}
                value={password}
                onChange={e => setPassword(e.target.value)}
                required
                minLength={6}
              />
            </div>
          </div>

          <div className="form-group">
            <label>Confirm Password</label>
            <div style={{ position: 'relative' }}>
              <Lock size={18} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-secondary)' }} />
              <input 
                type="password" 
                placeholder="••••••••"
                style={{ width: '100%', paddingLeft: '40px' }}
                value={confirmPassword}
                onChange={e => setConfirmPassword(e.target.value)}
                required
                minLength={6}
              />
            </div>
          </div>

          <button className="btn-primary" style={{ width: '100%', marginTop: '12px', padding: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center' }} disabled={loading}>
            {loading ? <Loader2 className="animate-spin" /> : 'Reset Password'}
          </button>
        </form>

        <div style={{ marginTop: '24px', textAlign: 'center' }}>
          <span 
            onClick={() => navigate('/login')} 
            style={{ color: 'var(--text-secondary)', cursor: 'pointer', display: 'inline-flex', alignItems: 'center', gap: '4px', fontSize: '0.9rem' }}
          >
            <ArrowLeft size={14} /> Back to Login
          </span>
        </div>
      </div>
    </div>
  );
}
