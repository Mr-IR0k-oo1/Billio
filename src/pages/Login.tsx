import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Mail, Lock, Loader2, ArrowRight, Sparkles, UserCheck } from 'lucide-react';
import { api } from '../lib/api';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    
    // Demo user credentials
    if (email === 'demo@billio.com' && password === 'demo123') {
      const demoUser = { id: 1, email: 'demo@billio.com' };
      const demoToken = 'demo-token-' + Date.now();
      localStorage.setItem('token', demoToken);
      localStorage.setItem('user', JSON.stringify(demoUser));
      navigate('/dashboard');
      return;
    }
    
    try {
      const res = await api.post('/auth/login', { email, password });
      localStorage.setItem('token', res.token);
      localStorage.setItem('user', JSON.stringify(res.user));
      navigate('/dashboard');
    } catch (err: any) {
      setError(err.message || 'Login failed. Please check your credentials.');
    } finally {
      setLoading(false);
    }
  };

  const useDemo = () => {
    const demoUser = { id: 1, email: 'demo@billio.com' };
    const demoToken = 'demo-token-' + Date.now();
    localStorage.setItem('token', demoToken);
    localStorage.setItem('user', JSON.stringify(demoUser));
    navigate('/dashboard');
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-6 bg-[radial-gradient(circle_at_top_right,rgba(59,130,246,0.05),transparent),radial-gradient(circle_at_bottom_left,rgba(124,58,237,0.05),transparent)]">
      <div className="glass-card w-full max-w-[440px] p-10 relative overflow-hidden">
        {/* Decorative Background Icon */}
        <div className="absolute top-0 right-0 p-8 opacity-10 pointer-events-none">
          <Sparkles size={140} className="text-blue-500" />
        </div>

        <div className="text-center mb-10">
          <div className="w-16 h-16 bg-blue-500/10 rounded-2xl flex items-center justify-center text-blue-500 mx-auto mb-6 border border-blue-500/20">
            <UserCheck size={32} />
          </div>
          <h1 className="text-4xl font-bold premium-gradient-text mb-2">Billio</h1>
          <p className="text-muted-foreground text-sm tracking-wide uppercase font-semibold opacity-70">Client Intelligence Portal</p>
        </div>

        {error && (
          <div className="bg-red-500/10 border border-red-500/20 text-red-500 p-4 rounded-xl mb-6 text-sm text-center animate-in fade-in slide-in-from-top-2">
            {error}
          </div>
        )}

        <form onSubmit={handleLogin} className="space-y-6">
          <div className="form-group">
            <label className="text-xs uppercase tracking-widest font-bold text-muted-foreground pl-1">Email Identity</label>
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
            <div className="flex items-center justify-between pl-1">
              <label className="text-xs uppercase tracking-widest font-bold text-muted-foreground p-0">Password</label>
              <Link to="/forgot-password" title="Forgot Password" className="text-[10px] uppercase tracking-wider text-blue-400 hover:text-blue-300 transition-colors no-underline font-bold">
                Recovery Access
              </Link>
            </div>
            <div className="relative mt-2">
              <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground" size={18} />
              <input 
                type="password" 
                placeholder="••••••••"
                className="pl-12 w-full py-3.5"
                value={password}
                onChange={e => setPassword(e.target.value)}
                required
              />
            </div>
          </div>

          <button className="btn-cta w-full py-3.5 font-bold flex items-center justify-center gap-3 group" disabled={loading}>
            {loading ? (
              <Loader2 className="animate-spin" size={20} />
            ) : (
              <>
                Initialize Session
                <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
              </>
            )}
          </button>
        </form>

        {/* Improved Demo Login Section */}
        <div className="mt-10 pt-8 border-t border-white/5">
          <div className="bg-white/[0.03] border border-white/5 rounded-2xl p-6 hover:bg-white/[0.05] transition-all duration-300">
            <div className="flex items-center gap-4 mb-4">
              <div className="w-10 h-10 bg-amber-500/10 rounded-xl flex items-center justify-center text-amber-500 border border-amber-500/20">
                <Sparkles size={20} />
              </div>
              <div>
                <p className="text-white text-sm font-bold">Explore as Guest</p>
                <p className="text-muted-foreground text-[10px] uppercase tracking-wider font-semibold">Immediate access to features</p>
              </div>
            </div>
            
            <button
              onClick={useDemo}
              className="w-full btn-secondary py-2.5 text-xs font-bold uppercase tracking-widest"
            >
              Enter Demo Mode
            </button>
          </div>
        </div>

        <p className="text-center mt-8 text-sm text-muted-foreground">
          New to the platform? <Link to="/register" className="text-blue-400 hover:text-blue-300 transition-colors font-bold no-underline">Register Authority</Link>
        </p>
      </div>
    </div>
  );
}
