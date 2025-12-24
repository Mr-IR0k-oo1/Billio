import { Link } from 'react-router-dom';
import { CheckCircle2 } from 'lucide-react';

export const Pricing = () => (
  <section id="pricing" className="py-24 relative overflow-hidden">
    <div className="glow-effect" style={{ top: '50%', left: '50%', transform: 'translate(-50%, -50%)', opacity: 0.15 }} />
    <div className="home-container relative z-10">
      <div className="text-center mb-16">
        <h2 className="home-h2">Simple, transparent pricing</h2>
        <p className="home-subtitle">Cancel anytime. No hidden fees.</p>
      </div>
      <div className="pricing-grid max-w-6xl mx-auto">
        {/* Free Plan */}
        <div className="pricing-card">
          <h3 className="text-xl font-bold text-white mb-4">Free</h3>
          <div className="mb-8">
             <span className="pricing-val">$0</span>
             <span className="pricing-period">/mo</span>
          </div>
          <ul className="space-y-4 mb-8 flex-1">
            <li className="flex items-center gap-3 text-gray-300">
              <CheckCircle2 size={18} className="text-gray-500 shrink-0" /> Manual invoices
            </li>
            <li className="flex items-center gap-3 text-gray-300">
              <CheckCircle2 size={18} className="text-gray-500 shrink-0" /> Limited usage
            </li>
          </ul>
          <Link to="/register" className="btn-secondary text-center">Get Started</Link>
        </div>
        
        {/* Pro Plan */}
        <div className="pricing-card featured transform md:-translate-y-4">
          <div className="absolute -top-5 left-0 right-0 flex justify-center">
            <div className="bg-gradient-to-r from-blue-600 to-blue-400 text-white text-xs font-bold px-4 py-1.5 rounded-full shadow-lg shadow-blue-500/30 tracking-wide uppercase">
              Most Popular
            </div>
          </div>
          <h3 className="text-xl font-bold text-white mb-4">Pro</h3>
          <div className="mb-8">
             <span className="pricing-val">$15</span>
             <span className="pricing-period">/mo</span>
          </div>
          <ul className="space-y-4 mb-8 flex-1">
            <li className="flex items-center gap-3 text-white">
              <CheckCircle2 size={18} className="text-blue-400 shrink-0" /> 
              <span>AI-written descriptions</span>
            </li>
            <li className="flex items-center gap-3 text-white">
              <CheckCircle2 size={18} className="text-blue-400 shrink-0" /> 
              <span>AI payment reminders</span>
            </li>
            <li className="flex items-center gap-3 text-white">
              <CheckCircle2 size={18} className="text-blue-400 shrink-0" /> 
              <span>Unlimited invoices</span>
            </li>
          </ul>
          <Link to="/register" className="btn-cta text-center w-full block">Start Free Trial</Link>
        </div>

        {/* Business Plan */}
        <div className="pricing-card opacity-80 hover:opacity-100">
          <h3 className="text-xl font-bold text-white mb-4">Business</h3>
          <div className="mb-8">
             <span className="text-2xl font-bold text-gray-400">Coming Soon</span>
          </div>
          <ul className="space-y-4 mb-8 flex-1">
            <li className="flex items-center gap-3 text-gray-400">
              <CheckCircle2 size={18} className="text-gray-600 shrink-0" /> Document auto-fill
            </li>
            <li className="flex items-center gap-3 text-gray-400">
              <CheckCircle2 size={18} className="text-gray-600 shrink-0" /> Expense categorization
            </li>
            <li className="flex items-center gap-3 text-gray-400">
              <CheckCircle2 size={18} className="text-gray-600 shrink-0" /> Recurring invoices
            </li>
          </ul>
          <button className="btn-secondary text-center w-full" disabled>Join Waitlist</button>
        </div>
      </div>
    </div>
  </section>
);
