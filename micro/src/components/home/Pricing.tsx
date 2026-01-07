import { Link } from 'react-router-dom';
import { CheckCircle2, Star, Zap } from 'lucide-react';

export const Pricing = () => (
  <section id="pricing" className="py-24 relative overflow-hidden">
    <div className="glow-effect" style={{ top: '50%', left: '50%', transform: 'translate(-50%, -50%)', opacity: 0.15 }} />
    <div className="home-container relative z-10">
      <div className="text-center mb-16">
        <h2 className="home-h2">Simple pricing for every freelancer</h2>
        <p className="home-subtitle">Start free, upgrade when you need more power</p>
        
        {/* Trust badges */}
        <div className="flex items-center justify-center gap-6 mt-6">
          <div className="flex items-center gap-1">
            {[...Array(5)].map((_, i) => (
              <Star key={i} size={16} className="text-yellow-500 fill-yellow-500" />
            ))}
            <span className="text-gray-400 text-sm ml-2">4.9/5 from 500+ reviews</span>
          </div>
          <div className="text-gray-500">•</div>
          <span className="text-gray-400 text-sm">14-day free trial on Pro</span>
        </div>
      </div>
      
      <div className="pricing-grid max-w-6xl mx-auto">
        {/* Free Plan */}
        <div className="pricing-card hover:transform hover:-translate-y-2 transition-all duration-300">
          <h3 className="text-xl font-bold text-white mb-2">Starter</h3>
          <p className="text-gray-500 text-sm mb-6">Perfect for trying out Billio</p>
          <div className="mb-8">
             <span className="pricing-val">$0</span>
             <span className="pricing-period">/mo</span>
          </div>
          <ul className="space-y-4 mb-8 flex-1">
            <li className="flex items-center gap-3 text-gray-300">
              <CheckCircle2 size={18} className="text-gray-500 shrink-0" /> 3 invoices per month
            </li>
            <li className="flex items-center gap-3 text-gray-300">
              <CheckCircle2 size={18} className="text-gray-500 shrink-0" /> Basic templates
            </li>
            <li className="flex items-center gap-3 text-gray-300">
              <CheckCircle2 size={18} className="text-gray-500 shrink-0" /> Email support
            </li>
            <li className="flex items-center gap-3 text-gray-400">
              <span className="w-5 h-5 border border-gray-600 rounded-full shrink-0" />
              AI descriptions
            </li>
            <li className="flex items-center gap-3 text-gray-400">
              <span className="w-5 h-5 border border-gray-600 rounded-full shrink-0" />
              Payment reminders
            </li>
          </ul>
          <Link to="/register" className="btn-secondary text-center w-full block">Get Started</Link>
        </div>
        
        {/* Pro Plan */}
        <div className="pricing-card featured transform md:-translate-y-4 hover:transform hover:md:-translate-y-6 transition-all duration-300">
          <div className="absolute -top-5 left-0 right-0 flex justify-center">
            <div className="bg-gradient-to-r from-blue-600 to-blue-400 text-white text-xs font-bold px-4 py-1.5 rounded-full shadow-lg shadow-blue-500/30 tracking-wide uppercase flex items-center gap-2">
              <Zap size={12} />
              Most Popular
            </div>
          </div>
          <h3 className="text-xl font-bold text-white mb-2">Professional</h3>
          <p className="text-gray-400 text-sm mb-6">For serious freelancers</p>
          <div className="mb-8">
             <div className="flex items-baseline">
               <span className="pricing-val">$15</span>
               <span className="pricing-period">/mo</span>
               <span className="ml-2 text-green-400 text-sm font-medium">Save $180/year</span>
             </div>
          </div>
          <ul className="space-y-4 mb-8 flex-1">
            <li className="flex items-center gap-3 text-white">
              <CheckCircle2 size={18} className="text-blue-400 shrink-0" /> 
              <span className="font-medium">Unlimited invoices</span>
            </li>
            <li className="flex items-center gap-3 text-white">
              <CheckCircle2 size={18} className="text-blue-400 shrink-0" /> 
              <span className="font-medium">AI-written descriptions</span>
            </li>
            <li className="flex items-center gap-3 text-white">
              <CheckCircle2 size={18} className="text-blue-400 shrink-0" /> 
              <span className="font-medium">Smart payment reminders</span>
            </li>
            <li className="flex items-center gap-3 text-white">
              <CheckCircle2 size={18} className="text-blue-400 shrink-0" /> 
              <span className="font-medium">Advanced analytics</span>
            </li>
            <li className="flex items-center gap-3 text-white">
              <CheckCircle2 size={18} className="text-blue-400 shrink-0" /> 
              <span className="font-medium">Priority support</span>
            </li>
          </ul>
          <div className="space-y-3">
            <Link to="/register" className="btn-cta text-center w-full block">Start 14-day free trial</Link>
            <p className="text-xs text-gray-500 text-center">No credit card required</p>
          </div>
        </div>

        {/* Business Plan */}
        <div className="pricing-card opacity-80 hover:opacity-100 transition-opacity">
          <h3 className="text-xl font-bold text-white mb-2">Business</h3>
          <p className="text-gray-400 text-sm mb-6">For growing teams</p>
          <div className="mb-8">
             <div className="flex items-center gap-2">
               <span className="text-2xl font-bold text-white">$29</span>
               <span className="pricing-period">/mo</span>
               <div className="bg-blue-500/20 text-blue-400 text-xs px-2 py-1 rounded">Coming Soon</div>
             </div>
          </div>
          <ul className="space-y-4 mb-8 flex-1">
            <li className="flex items-center gap-3 text-gray-300">
              <CheckCircle2 size={18} className="text-gray-500 shrink-0" /> Everything in Pro
            </li>
            <li className="flex items-center gap-3 text-gray-300">
              <CheckCircle2 size={18} className="text-gray-500 shrink-0" /> Team collaboration
            </li>
            <li className="flex items-center gap-3 text-gray-300">
              <CheckCircle2 size={18} className="text-gray-500 shrink-0" /> Client portal
            </li>
            <li className="flex items-center gap-3 text-gray-300">
              <CheckCircle2 size={18} className="text-gray-500 shrink-0" /> Recurring invoices
            </li>
            <li className="flex items-center gap-3 text-gray-300">
              <CheckCircle2 size={18} className="text-gray-500 shrink-0" /> API access
            </li>
          </ul>
          <button className="btn-secondary text-center w-full opacity-60 cursor-not-allowed" disabled>
            Join Waitlist
          </button>
        </div>
      </div>

      {/* Money-back guarantee */}
      <div className="text-center mt-12">
        <div className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-green-500/10 border border-green-500/20">
          <CheckCircle2 size={20} className="text-green-500" />
          <span className="text-green-400 font-medium">30-day money-back guarantee</span>
        </div>
      </div>
    </div>
  </section>
);