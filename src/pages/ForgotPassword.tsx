import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Mail, Loader2, ArrowLeft, ShieldCheck, Sparkles } from 'lucide-react';
import { api } from '../lib/api';
import toast from 'react-hot-toast';

export default function ForgotPassword() {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      await api.post('/auth/forgot-password', { email });
      setSent(true);
      toast.success('Reset link sent to your email');
    } catch (err: any) {
      toast.error(err.response?.data?.error || 'Failed to send reset link');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-6 bg-[radial-gradient(circle_at_top_right,rgba(59,130,246,0.05),transparent),radial-gradient(circle_at_bottom_left,rgba(124,58,237,0.05),transparent)]">
      <div className="glass-card w-full max-w-[420px] p-10 relative overflow-hidden">
        <div className="absolute top-0 right-0 p-8 opacity-10 pointer-events-none">
          <Sparkles size={120} className="text-blue-500" />
        </div>

        <div className="text-center mb-10">
          <div className="w-16 h-16 bg-blue-500/10 rounded-2xl flex items-center justify-center text-blue-500 mx-auto mb-6 border border-blue-500/20">
            <Mail size={32} />
          </div>
          <h1 className="text-3xl font-bold mb-3 tracking-tight">Forgot Password</h1>
          <p className="text-muted-foreground text-sm leading-relaxed">
            Don't worry, it happens. Enter your professional email and we'll send you a secure link to reset your password.
          </p>
        </div>

        {sent ? (
          <div className="space-y-8">
            <div className="bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 p-6 rounded-2xl text-center leading-relaxed">
              <ShieldCheck className="mx-auto mb-4" size={32} />
              <p className="text-sm">
                We've dispatched a secure recovery link to <strong className="text-white font-bold">{email}</strong>.
              </p>
              <p className="text-xs mt-2 opacity-80">Check your spam folder if you don't see it in a few minutes.</p>
            </div>
            <button 
              onClick={() => navigate('/login')}
              className="btn-cta w-full py-3.5 flex items-center justify-center gap-2"
            >
              Return to Login
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="form-group">
              <label className="text-xs uppercase tracking-widest font-bold text-muted-foreground pl-1">Business Email</label>
              <div className="relative mt-2">
                <Mail size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground" />
                <input 
                  type="email" 
                  placeholder="name@company.com"
                  className="pl-12 w-full py-3.5"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  required
                />
              </div>
            </div>

            <button className="btn-cta w-full py-3.5 font-bold flex items-center justify-center gap-3 group" disabled={loading}>
              {loading ? (
                <Loader2 className="animate-spin" size={20} />
              ) : (
                <>
                  Connect Link
                  <ArrowLeft size={18} className="rotate-180 group-hover:translate-x-1 transition-transform" />
                </>
              )}
            </button>
          </form>
        )}

        <div className="mt-8 pt-8 border-t border-white/5 text-center">
          <Link 
            to="/login" 
            className="text-muted-foreground hover:text-white transition-colors text-sm font-medium inline-flex items-center gap-2 no-underline"
          >
            <ArrowLeft size={16} /> Back to standard login
          </Link>
        </div>
      </div>
    </div>
  );
}
