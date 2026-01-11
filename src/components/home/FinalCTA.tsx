import { Link } from 'react-router-dom';
import { ArrowRight, Timer, Users, Zap, Sparkles, Clock, Lock } from 'lucide-react';

export const FinalCTA = () => (
  <section className="cta-section relative overflow-hidden">
    <div className="glow-effect" style={{ top: '30%', left: '30%', opacity: 0.2 }} />
     <div className="home-container relative z-10 text-center">
        {/* Urgency indicator */}
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-orange-500/20 border border-orange-500/30 mb-6">
          <Timer className="text-orange-500" size={16} />
          <span className="text-orange-400 text-sm font-medium">Limited time: 14-day free trial</span>
        </div>
        
        <h2 className="home-h2 mb-6">
          Ready to get your <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-400">time back?</span>
        </h2>
        
        <p className="text-xl text-gray-400 mb-8 max-w-2xl mx-auto">
          Join 1,000+ freelancers who save 8+ hours per month on admin work. 
          Your first invoice is just 60 seconds away.
        </p>

        {/* Social proof */}
        <div className="flex items-center justify-center gap-8 mb-8">
          <div className="flex items-center gap-2">
            <Users className="text-blue-400" size={20} />
            <span className="text-gray-400">1,000+ users</span>
          </div>
          <div className="flex items-center gap-2">
            <Zap className="text-yellow-400" size={20} />
            <span className="text-gray-400">3x faster payments</span>
          </div>
        </div>
        
        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
          <Link to="/register" className="btn-cta inline-flex items-center gap-2 text-lg px-8 py-4 shadow-2xl shadow-blue-500/20 hover:shadow-blue-500/40 transition-all duration-300 group">
            Start free trial now <ArrowRight className="group-hover:translate-x-1 transition-transform" />
          </Link>
          <div className="text-sm text-gray-500 space-y-1">
            <div className="flex items-center justify-center gap-2"><Sparkles size={14} /> No credit card required</div>
            <div className="flex items-center justify-center gap-2"><Clock size={14} /> Limited time offer</div>
          </div>
        </div>

        {/* Trust indicators */}
        <div className="mt-12 pt-8 border-t border-white/10">
          <div className="flex items-center justify-center gap-6 text-xs text-gray-500">
            <span className="flex items-center gap-2"><Lock size={12} /> Bank-level security</span>
            <span>•</span>
            <span>GDPR compliant</span>
            <span>•</span>
            <span>Cancel anytime</span>
          </div>
        </div>
     </div>
  </section>
);