import { useState } from 'react';
import { useNavigate, useSearchParams, Link } from 'react-router-dom';
import { Lock, Loader2, ArrowLeft, ShieldCheck, Key } from 'lucide-react';
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
        <div className="min-h-screen flex items-center justify-center p-6 bg-[radial-gradient(circle_at_top_right,rgba(59,130,246,0.05),transparent),radial-gradient(circle_at_bottom_left,rgba(124,58,237,0.05),transparent)]">
            <div className="glass-card w-full max-w-[420px] p-10 text-center">
                <div className="w-16 h-16 bg-red-500/10 rounded-2xl flex items-center justify-center text-red-500 mx-auto mb-6 border border-red-500/20">
                  <ShieldCheck size={32} />
                </div>
                <h2 className="text-2xl font-bold mb-3 text-white">Invalid Link</h2>
                <p className="text-muted-foreground text-sm leading-relaxed mb-8">This password reset link is securely expired or was never authorized. Please request a new one.</p>
                <Link to="/forgot-password" title="Request Password Reset" className="btn-cta w-full py-3.5 no-underline flex items-center justify-center">Request New Link</Link>
                <div className="mt-8 pt-8 border-t border-white/5">
                  <Link to="/login" className="text-muted-foreground hover:text-white transition-colors text-sm no-underline inline-flex items-center gap-2">
                    <ArrowLeft size={16} /> Back to Login
                  </Link>
                </div>
            </div>
        </div>
     );
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-6 bg-[radial-gradient(circle_at_top_right,rgba(59,130,246,0.05),transparent),radial-gradient(circle_at_bottom_left,rgba(124,58,237,0.05),transparent)]">
      <div className="glass-card w-full max-w-[420px] p-10 relative overflow-hidden">
        <div className="absolute top-0 right-0 p-8 opacity-10 pointer-events-none">
          <Key size={120} className="text-blue-500" />
        </div>

        <div className="text-center mb-10">
          <div className="w-16 h-16 bg-blue-500/10 rounded-2xl flex items-center justify-center text-blue-500 mx-auto mb-6 border border-blue-500/20">
            <Lock size={32} />
          </div>
          <h1 className="text-3xl font-bold mb-3 tracking-tight">Set New Password</h1>
          <p className="text-muted-foreground text-sm leading-relaxed">
            Protect your account with a strong, unique password. Use at least 6 characters.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="form-group">
            <label className="text-xs uppercase tracking-widest font-bold text-muted-foreground pl-1">New Password</label>
            <div className="relative mt-2">
              <Lock size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground" />
              <input 
                type="password" 
                placeholder="••••••••"
                className="pl-12 w-full py-3.5"
                value={password}
                onChange={e => setPassword(e.target.value)}
                required
                minLength={6}
              />
            </div>
          </div>

          <div className="form-group">
            <label className="text-xs uppercase tracking-widest font-bold text-muted-foreground pl-1">Confirm New Password</label>
            <div className="relative mt-2">
              <Lock size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground" />
              <input 
                type="password" 
                placeholder="••••••••"
                className="pl-12 w-full py-3.5"
                value={confirmPassword}
                onChange={e => setConfirmPassword(e.target.value)}
                required
                minLength={6}
              />
            </div>
          </div>

          <button className="btn-cta w-full py-3.5 font-bold flex items-center justify-center gap-3 group" disabled={loading}>
            {loading ? (
              <Loader2 className="animate-spin" size={20} />
            ) : (
              <>
                Update Password
                <ArrowLeft size={18} className="rotate-180 group-hover:translate-x-1 transition-transform" />
              </>
            )}
          </button>
        </form>

        <div className="mt-8 pt-8 border-t border-white/5 text-center">
          <Link 
            to="/login" 
            className="text-muted-foreground hover:text-white transition-colors text-sm font-medium inline-flex items-center gap-2 no-underline"
          >
            <ArrowLeft size={16} /> Nevermind, back to login
          </Link>
        </div>
      </div>
    </div>
  );
}
