import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Mail, Lock, Loader2, UserPlus, ArrowRight, Sparkles, ShieldCheck } from 'lucide-react';
import { api } from '../lib/api';

export default function Register() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      return setError('Passwords do not match');
    }
    
    setLoading(true);
    setError('');
    
    try {
      const res = await api.post('/auth/register', { email, password });
      localStorage.setItem('token', res.token);
      localStorage.setItem('user', JSON.stringify(res.user));
      navigate('/dashboard');
    } catch (err: any) {
      setError(err.message || 'Registration failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-6 bg-[radial-gradient(circle_at_top_right,rgba(59,130,246,0.05),transparent),radial-gradient(circle_at_bottom_left,rgba(124,58,237,0.05),transparent)]">
      <div className="glass-card w-full max-w-[440px] p-10 relative overflow-hidden">
        {/* Decorative Background Icon */}
        <div className="absolute top-0 right-0 p-8 opacity-10 pointer-events-none">
          <UserPlus size={140} className="text-blue-500" />
        </div>

        <div className="text-center mb-10">
          <div className="w-16 h-16 bg-blue-500/10 rounded-2xl flex items-center justify-center text-blue-500 mx-auto mb-6 border border-blue-500/20">
            <ShieldCheck size={32} />
          </div>
          <h1 className="text-4xl font-bold premium-gradient-text mb-2">Join Billio</h1>
          <p className="text-muted-foreground text-sm tracking-wide uppercase font-semibold opacity-70">Create Professional Identity</p>
        </div>

        {error && (
          <div className="bg-red-500/10 border border-red-500/20 text-red-500 p-4 rounded-xl mb-6 text-sm text-center animate-in fade-in slide-in-from-top-2">
            {error}
          </div>
        )}

        <form onSubmit={handleRegister} className="space-y-6">
          <div className="form-group">
            <label className="text-xs uppercase tracking-widest font-bold text-muted-foreground pl-1">Professional Email</label>
            <div className="relative mt-2">
              <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground" size={18} />
              <input 
                type="email" 
                placeholder="you@agency.com"
                className="pl-12 w-full py-3.5"
                value={email}
                onChange={e => setEmail(e.target.value)}
                required
              />
            </div>
          </div>

          <div className="form-group">
            <label className="text-xs uppercase tracking-widest font-bold text-muted-foreground pl-1">Secure Password</label>
            <div className="relative mt-2">
              <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground" size={18} />
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
            <label className="text-xs uppercase tracking-widest font-bold text-muted-foreground pl-1">Verify Password</label>
            <div className="relative mt-2">
              <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground" size={18} />
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
                Confirm Credentials
                <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
              </>
            )}
          </button>
        </form>

        <div className="mt-10 pt-8 border-t border-white/5">
          <div className="bg-blue-500/[0.03] border border-blue-500/10 rounded-2xl p-6 text-center">
            <p className="text-muted-foreground text-xs mb-3 italic">
              Evaluating for your business?
            </p>
            <Link to="/login" className="text-blue-400 hover:text-blue-300 transition-colors font-bold text-sm inline-flex items-center gap-2 no-underline">
              <Sparkles size={14} /> Use Demo Access <ArrowRight size={14} />
            </Link>
          </div>
        </div>

        <p className="text-center mt-8 text-sm text-muted-foreground">
          Existing accounts? <Link to="/login" className="text-blue-400 hover:text-blue-300 transition-colors font-bold no-underline">Portal Entry</Link>
        </p>
      </div>
    </div>
  );
}
