import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Mail, Lock, Loader2, UserPlus, ArrowRight, Sparkles } from 'lucide-react';
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
    <div className="min-h-screen flex items-center justify-center p-6 relative overflow-hidden bg-background">
      {/* Background Orbs */}
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-blue-500/10 blur-[120px] rounded-full -translate-y-1/2 translate-x-1/2" />
      <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-purple-500/10 blur-[120px] rounded-full translate-y-1/2 -translate-x-1/2" />

      <div className="glass-card w-full max-w-[440px] p-10 relative z-10">
        <div className="text-center mb-10">
          <div className="inline-flex items-center justify-center w-12 h-12 rounded-2xl bg-blue-500/10 border border-blue-500/20 mb-4">
            <UserPlus className="text-blue-500" size={24} />
          </div>
          <h1 className="text-4xl font-bold mb-2 premium-gradient-text">Billio</h1>
          <p className="text-muted-foreground">Create an account to start invoicing</p>
        </div>

        {error && (
          <div className="bg-red-500/10 border border-red-500/20 text-red-500 p-4 rounded-xl mb-6 text-sm text-center">
            {error}
          </div>
        )}

        <form onSubmit={handleRegister} className="space-y-6">
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
            <label>Password</label>
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

          <div className="form-group">
            <label>Confirm Password</label>
            <div className="relative">
              <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground" size={18} />
              <input 
                type="password" 
                placeholder="••••••••"
                className="pl-12"
                value={confirmPassword}
                onChange={e => setConfirmPassword(e.target.value)}
                required
              />
            </div>
          </div>

          <button className="btn-cta w-full flex items-center justify-center gap-2" disabled={loading}>
            {loading ? <Loader2 className="animate-spin" /> : (
              <>
                <UserPlus size={18} />
                Create Account
              </>
            )}
          </button>
        </form>

        <div className="mt-8 p-6 rounded-2xl bg-blue-500/[0.03] border border-blue-500/10 text-center">
          <p className="text-muted-foreground text-xs mb-3">
            Want to try before you sign up?
          </p>
          <Link to="/login" className="text-blue-400 hover:text-blue-300 transition-colors font-semibold text-sm flex items-center justify-center gap-2">
            <Sparkles size={14} /> Use Demo Account <ArrowRight size={14} />
          </Link>
        </div>

        <p className="text-center mt-8 text-sm text-muted-foreground">
          Already have an account? <Link to="/login" className="text-blue-400 hover:text-blue-300 transition-colors font-medium">Sign In <ArrowRight className="inline-block" size={14} /></Link>
        </p>
      </div>
    </div>
  );
}
