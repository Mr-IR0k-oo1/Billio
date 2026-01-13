import { Link } from 'react-router-dom';
import { CheckCircle2, Star, Zap, ShieldCheck } from 'lucide-react';
import { motion } from 'framer-motion';
import { AnimatedGroup } from '@/components/motion-primitives/animated-group';

export const Pricing = () => (
  <section id="pricing" className="py-32 relative overflow-hidden">
    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-blue-500/10 blur-[120px] rounded-full pointer-events-none" />
    
    <div className="home-container relative z-10">
      <div className="text-center mb-24">
        <motion.div
           initial={{ opacity: 0, y: 20 }}
           whileInView={{ opacity: 1, y: 0 }}
           viewport={{ once: true }}
           transition={{ duration: 0.6 }}
        >
            <h2 className="home-h2 text-4xl md:text-6xl mb-6">Simple pricing for <span className="text-blue-500">every freelancer</span></h2>
            <p className="home-subtitle text-lg text-gray-400 max-w-2xl mx-auto mb-8">Start free, upgrade when you need more power. No hidden fees.</p>
        </motion.div>
        
        <div className="flex flex-wrap items-center justify-center gap-6 mt-8">
          <div className="flex items-center gap-1.5 px-4 py-2 rounded-full bg-white/5 border border-white/5">
            {[...Array(5)].map((_, i) => (
              <Star key={i} size={14} className="text-blue-500 fill-blue-500" />
            ))}
            <span className="text-gray-300 text-sm ml-2 font-medium">4.9/5 Rating</span>
          </div>
          <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/5">
            <ShieldCheck size={16} className="text-blue-500" />
            <span className="text-gray-300 text-sm font-medium">14-day free trial on Pro</span>
          </div>
        </div>
      </div>
      
      <AnimatedGroup
        variants={{
          container: {
            visible: {
              transition: {
                staggerChildren: 0.1,
              },
            },
          },
          item: {
            hidden: { opacity: 0, y: 30 },
            visible: { opacity: 1, y: 0 },
          },
        }}
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto"
      >
        {/* Free Plan */}
        <div className="pricing-card group hover:border-white/10 transition-all duration-500 bg-[#080808] border-white/5">
          <h3 className="text-xl font-bold text-white mb-2">Starter</h3>
          <p className="text-gray-500 text-sm mb-8 leading-relaxed">Perfect for exploring Billio's core features.</p>
          <div className="mb-10">
             <span className="text-5xl font-bold text-white tracking-tight">$0</span>
             <span className="text-gray-500 ml-1">/mo</span>
          </div>
          <div className="space-y-4 mb-10 flex-1">
            {[
              { text: "3 invoices per month", active: true },
              { text: "Basic templates", active: true },
              { text: "Email support", active: true },
              { text: "AI descriptions", active: false },
              { text: "Smart reminders", active: false },
            ].map((feature, i) => (
              <div key={i} className={`flex items-center gap-3 text-sm ${feature.active ? 'text-gray-300' : 'text-gray-600'}`}>
                {feature.active ? <CheckCircle2 size={18} className="text-blue-500/50" /> : <div className="w-[18px] h-[18px] rounded-full border border-white/10" />}
                {feature.text}
              </div>
            ))}
          </div>
          <Link to="/register" className="h-12 flex items-center justify-center rounded-xl bg-white/5 border border-white/10 text-white font-bold hover:bg-white/10 transition-all">
            Get Started
          </Link>
        </div>
        
        {/* Pro Plan */}
        <div className="pricing-card featured relative bg-[#080808]/80 backdrop-blur-xl border-blue-500/20 shadow-[0_0_40px_rgba(59,130,246,0.1)]">
          <div className="absolute -top-4 left-1/2 -translate-x-1/2">
            <div className="bg-gradient-to-r from-blue-600 to-blue-400 text-white text-[10px] font-bold px-3 py-1 rounded-full shadow-lg shadow-blue-500/20 tracking-wider uppercase flex items-center gap-1.5">
              <Zap size={10} className="fill-white" />
              Most Popular
            </div>
          </div>
          <h3 className="text-xl font-bold text-white mb-2">Professional</h3>
          <p className="text-gray-400 text-sm mb-8 leading-relaxed">Everything you need to scale your business.</p>
          <div className="mb-10">
             <div className="flex items-baseline">
               <span className="text-5xl font-bold text-white tracking-tight">$15</span>
               <span className="text-gray-400 ml-1">/mo</span>
             </div>
             <p className="mt-2 text-green-400 text-xs font-bold uppercase tracking-wider">Save $180 per year</p>
          </div>
          <div className="space-y-4 mb-10 flex-1">
            {[
              "Unlimited invoices",
              "AI-written descriptions",
              "Smart payment reminders",
              "Custom branding",
              "Advanced analytics",
              "Priority support"
            ].map((feature, i) => (
              <div key={i} className="flex items-center gap-3 text-sm text-gray-200">
                <CheckCircle2 size={18} className="text-blue-500" />
                <span className="font-medium">{feature}</span>
              </div>
            ))}
          </div>
          <div className="space-y-3">
            <Link to="/register" className="h-14 flex items-center justify-center rounded-xl bg-white text-black font-bold hover:bg-gray-200 transition-all shadow-xl shadow-white/5">
              Start 14-Day Free Trial
            </Link>
            <p className="text-[10px] text-gray-500 text-center uppercase tracking-widest font-mono">No credit card required</p>
          </div>
        </div>

        {/* Business Plan */}
        <div className="pricing-card group bg-[#080808] border-white/5 opacity-80 hover:opacity-100 transition-opacity">
          <h3 className="text-xl font-bold text-white mb-2">Business</h3>
          <p className="text-gray-500 text-sm mb-8 leading-relaxed">For small teams and growing agencies.</p>
          <div className="mb-10 flex items-center gap-3">
             <span className="text-5xl font-bold text-white tracking-tight">$29</span>
             <span className="text-gray-500">/mo</span>
             <div className="bg-blue-500/10 text-blue-400 text-[10px] font-bold px-2 py-0.5 rounded border border-blue-500/20 uppercase tracking-tighter">Waitlist</div>
          </div>
          <div className="space-y-4 mb-10 flex-1">
             {[
               "Everything in Pro",
               "Team collaboration",
               "Client portal",
               "Recurring invoices",
               "API access",
               "Dedicated manager"
             ].map((feature, i) => (
               <div key={i} className="flex items-center gap-3 text-sm text-gray-400">
                 <CheckCircle2 size={18} className="text-gray-700" />
                 {feature}
               </div>
             ))}
          </div>
          <button className="h-12 w-full flex items-center justify-center rounded-xl bg-white/5 border border-white/10 text-gray-500 font-bold cursor-not-allowed">
            Join Waitlist
          </button>
        </div>
      </AnimatedGroup>

      {/* Money-back guarantee */}
      <motion.div 
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        transition={{ delay: 0.5 }}
        className="text-center mt-16"
      >
        <div className="inline-flex items-center gap-3 px-6 py-3 rounded-2xl bg-green-500/5 border border-green-500/10">
          <div className="w-8 h-8 rounded-full bg-green-500/10 flex items-center justify-center">
            <CheckCircle2 size={18} className="text-green-500" />
          </div>
          <span className="text-green-400/80 font-medium text-sm">30-day money-back guarantee. No questions asked.</span>
        </div>
      </motion.div>
    </div>
  </section>
);