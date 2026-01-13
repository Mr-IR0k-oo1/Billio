import { Link } from 'react-router-dom';
import { ArrowRight, Timer, Sparkles, Clock, Lock, ArrowUpRight } from 'lucide-react';
import { motion } from 'framer-motion';

export const FinalCTA = () => (
  <section className="py-32 relative overflow-hidden bg-black">
    <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-white/10 to-transparent" />
    
    <div className="home-container relative z-10">
      <div className="max-w-5xl mx-auto">
        <div className="relative p-1 rounded-[2.5rem] bg-gradient-to-b from-white/10 to-transparent overflow-hidden">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_0%,rgba(59,130,246,0.15),transparent_70%)]" />
          
          <div className="relative bg-black/40 backdrop-blur-3xl rounded-[calc(2.5rem-4px)] p-12 md:p-20 text-center">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-blue-500/10 border border-blue-500/20 mb-8">
                <Timer className="text-blue-500 flex-shrink-0" size={16} />
                <span className="text-blue-400 text-xs font-bold uppercase tracking-widest">Limited Offer: 14-day free trial</span>
              </div>
              
              <h2 className="home-h2 text-4xl md:text-7xl mb-8 font-black tracking-tighter">
                Ready to get your <br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-blue-200 to-blue-600">time back?</span>
              </h2>
              
              <p className="text-xl text-gray-400 mb-12 max-w-2xl mx-auto leading-relaxed">
                Join 1,200+ freelancers who save 8+ hours per month. 
                Your first professional invoice is just 60 seconds away.
              </p>

              <div className="flex flex-col sm:flex-row gap-6 justify-center items-center mb-16">
                <Link to="/register" className="h-16 px-10 bg-white text-black rounded-2xl font-black text-xl flex items-center justify-center gap-3 hover:bg-gray-200 transition-all shadow-[0_0_30px_rgba(255,255,255,0.1)] group">
                  Start free trial now
                  <ArrowRight className="group-hover:translate-x-1 transition-transform" size={24} />
                </Link>
                <Link to="/login" className="h-16 px-10 bg-white/5 border border-white/10 text-white rounded-2xl font-bold flex items-center justify-center gap-2 hover:bg-white/10 transition-all">
                  View Demo 
                  <ArrowUpRight size={18} className="text-gray-500" />
                </Link>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-8 pt-12 border-t border-white/5 max-w-3xl mx-auto">
                 <div className="flex items-center justify-center gap-3 text-gray-500 text-sm">
                   <div className="w-8 h-8 rounded-full bg-white/5 flex items-center justify-center">
                      <Sparkles size={14} className="text-blue-500" />
                   </div>
                   No credit card required
                 </div>
                 <div className="flex items-center justify-center gap-3 text-gray-500 text-sm">
                   <div className="w-8 h-8 rounded-full bg-white/5 flex items-center justify-center">
                      <Lock size={14} className="text-blue-500" />
                   </div>
                   Bank-level security
                 </div>
                 <div className="flex items-center justify-center gap-3 text-gray-500 text-sm">
                   <div className="w-8 h-8 rounded-full bg-white/5 flex items-center justify-center">
                      <Clock size={14} className="text-blue-500" />
                   </div>
                   Cancel anytime
                 </div>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  </section>
);