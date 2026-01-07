import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Mail, Lock, Loader2, ArrowRight } from 'lucide-react';
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
      navigate('/');
    } catch (err: any) {
      setError(err.message || 'Login failed. Please check your credentials.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'radial-gradient(circle at top right, #3b82f611, transparent), radial-gradient(circle at bottom left, #7c3aed11, transparent)' }}>
      <div className="glass-card" style={{ width: '100%', maxWidth: '400px', padding: '40px' }}>
        <div style={{ textAlign: 'center', marginBottom: '32px' }}>
          <h1 style={{ color: 'var(--accent-color)', fontSize: '2.5rem', marginBottom: '8px' }}>Billio</h1>
          <p style={{ color: 'var(--text-secondary)' }}>Welcome back, sign in to continue</p>
        </div>

        {error && (
          <div style={{ padding: '12px', background: 'rgba(239, 68, 68, 0.1)', color: 'var(--error-color)', borderRadius: '8px', marginBottom: '20px', fontSize: '0.9rem', textAlign: 'center' }}>
            {error}
          </div>
        )}

        <form onSubmit={handleLogin}>
          <div className="form-group">
            <label>Email Address</label>
            <div style={{ position: 'relative' }}>
              <Mail size={18} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-secondary)' }} />
              <input 
                type="email" 
                placeholder="you@example.com"
                style={{ width: '100%', paddingLeft: '40px' }}
                value={email}
                onChange={e => setEmail(e.target.value)}
                required
              />
            </div>
          </div>

          <div className="form-group">
            <label>Password</label>
            <div style={{ position: 'relative' }}>
              <Lock size={18} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-secondary)' }} />
              <input 
                type="password" 
                placeholder="••••••••"
                style={{ width: '100%', paddingLeft: '40px' }}
                value={password}
                onChange={e => setPassword(e.target.value)}
                required
              />
            </div>
          </div>

          <button className="btn-primary" style={{ width: '100%', marginTop: '12px', padding: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center' }} disabled={loading}>
            {loading ? <Loader2 className="animate-spin" /> : 'Sign In'}
          </button>
        </form>

        {/* Demo Login Section */}
        <div style={{ 
          marginTop: '32px', 
          padding: '20px', 
          background: 'linear-gradient(135deg, rgba(59, 130, 246, 0.1), rgba(139, 92, 246, 0.1))',
          borderRadius: '12px',
          border: '1px solid rgba(59, 130, 246, 0.2)'
        }}>
          <div style={{ textAlign: 'center', marginBottom: '16px' }}>
            <p style={{ color: '#60a5fa', fontSize: '0.9rem', fontWeight: '600', marginBottom: '8px' }}>
              🔥 Quick Demo Access
            </p>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.85rem' }}>
              Try all features without registration
            </p>
          </div>
          
          <div style={{ 
            background: 'rgba(255, 255, 255, 0.05)', 
            padding: '12px', 
            borderRadius: '8px',
            marginBottom: '16px',
            fontSize: '0.85rem'
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px' }}>
              <span style={{ color: 'var(--text-secondary)' }}>Email:</span>
              <span style={{ color: 'white', fontFamily: 'monospace' }}>demo@billio.com</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span style={{ color: 'var(--text-secondary)' }}>Password:</span>
              <span style={{ color: 'white', fontFamily: 'monospace' }}>demo123</span>
            </div>
          </div>
          
          <button
            onClick={() => {
              setEmail('demo@billio.com');
              setPassword('demo123');
              setTimeout(() => {
                document.querySelector<HTMLButtonElement>('.btn-primary')?.click();
              }, 100);
            }}
            style={{ 
              width: '100%', 
              padding: '10px', 
              background: 'linear-gradient(135deg, #3b82f6, #8b5cf6)',
              color: 'white', 
              border: 'none', 
              borderRadius: '8px',
              fontWeight: '600',
              cursor: 'pointer',
              transition: 'all 0.2s ease'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = 'translateY(-2px)';
              e.currentTarget.style.boxShadow = '0 10px 20px rgba(59, 130, 246, 0.3)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = 'translateY(0)';
              e.currentTarget.style.boxShadow = 'none';
            }}
          >
            Use Demo Account
          </button>
        </div>

        <p style={{ textAlign: 'center', marginTop: '24px', color: 'var(--text-secondary)', fontSize: '0.9rem' }}>
          Don't have an account? <span onClick={() => navigate('/register')} style={{ color: 'var(--accent-color)', cursor: 'pointer' }}>Register <ArrowRight size={14} style={{ verticalAlign: 'middle' }} /></span>
        </p>
      </div>
    </div>
  );
}
