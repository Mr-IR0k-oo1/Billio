import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Mail, Lock, Loader2, ArrowRight, Sparkles } from 'lucide-react';
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

  return (
    <div className="min-h-screen flex items-center justify-center p-6 relative overflow-hidden bg-background">
      {/* Background Orbs */}
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-blue-500/10 blur-[120px] rounded-full -translate-y-1/2 translate-x-1/2" />
      <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-purple-500/10 blur-[120px] rounded-full translate-y-1/2 -translate-x-1/2" />

      <div className="glass-card w-full max-w-[440px] p-10 relative z-10">
        <div className="text-center mb-10">
          <div className="inline-flex items-center justify-center w-12 h-12 rounded-2xl bg-blue-500/10 border border-blue-500/20 mb-4">
            <Sparkles className="text-blue-500" size={24} />
          </div>
          <h1 className="text-4xl font-bold mb-2 premium-gradient-text">Billio</h1>
          <p className="text-muted-foreground">Welcome back, sign in to continue</p>
        </div>

        {error && (
          <div className="bg-red-500/10 border border-red-500/20 text-red-500 p-4 rounded-xl mb-6 text-sm text-center">
            {error}
          </div>
        )}

        <form onSubmit={handleLogin} className="space-y-6">
          <div className="form-group">
            <label>Email Address</label>
            <div className="relative">
              <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground" size={18} />
              <input 
                type="email" 
                placeholder="you@example.com"
                className="pl-12"
                value={email}
                onChange={e => setEmail(e.target.value)}
                required
              />
            </div>
          </div>

          <div className="form-group">
            <div className="flex items-center justify-between mb-2">
              <label className="mb-0">Password</label>
              <Link to="/forgot-password" title="Forgot Password" className="text-xs text-blue-400 hover:text-blue-300 transition-colors">
                Forgot Password?
              </Link>
            </div>
            <div className="relative">
              <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground" size={18} />
              <input 
                type="password" 
                placeholder="••••••••"
                className="pl-12"
                value={password}
                onChange={e => setPassword(e.target.value)}
                required
              />
            </div>
          </div>

          <button className="btn-cta w-full" disabled={loading}>
            {loading ? <Loader2 className="animate-spin mx-auto" /> : 'Sign In'}
          </button>
        </form>

        {/* Demo Login Section */}
        <div className="mt-8 p-6 rounded-2xl bg-white/[0.03] border border-white/5 relative group transition-all duration-300 hover:bg-white/[0.05]">
          <div className="text-center mb-4">
            <p className="text-blue-400 text-sm font-semibold mb-1 flex items-center justify-center gap-2">
              <Sparkles size={14} /> Quick Demo Access
            </p>
            <p className="text-muted-foreground text-xs">
              Try all features without registration
            </p>
          </div>
          
          <div className="bg-black/20 p-4 rounded-xl mb-4 text-xs font-mono space-y-2">
            <div className="flex justify-between">
              <span className="text-muted-foreground italic">Email:</span>
              <span className="text-white">demo@billio.com</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground italic">Pass:</span>
              <span className="text-white">demo123</span>
            </div>
          </div>
          
          <button
            onClick={() => {
              setEmail('demo@billio.com');
              setPassword('demo123');
              // Trigger login immediately
              const demoUser = { id: 1, email: 'demo@billio.com' };
              const demoToken = 'demo-token-' + Date.now();
              localStorage.setItem('token', demoToken);
              localStorage.setItem('user', JSON.stringify(demoUser));
              navigate('/dashboard');
            }}
            className="w-full btn-secondary text-sm py-2"
          >
            Use Demo Account
          </button>
        </div>

        <p className="text-center mt-8 text-sm text-muted-foreground">
          Don't have an account? <Link to="/register" className="text-blue-400 hover:text-blue-300 transition-colors font-medium">Register <ArrowRight className="inline-block" size={14} /></Link>
        </p>
      </div>
    </div>
  );
}
