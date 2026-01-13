import { X, Clock, AlertCircle, Ban, ZapOff } from 'lucide-react';
import { motion } from 'framer-motion';
import { AnimatedGroup } from '@/components/motion-primitives/animated-group';

export const Problem = () => (
  <section className="problem-section relative py-32 overflow-hidden">
    {/* Decorative background elements */}
    <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-white/5 to-transparent" />
    <div className="absolute bottom-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-white/5 to-transparent" />
    
    <div className="home-container relative z-10">
      <div className="grid lg:grid-cols-2 gap-16 items-center">
        <div>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <h2 className="home-h2 text-4xl md:text-6xl mb-6">
                Your time is worth <span className="text-blue-500">more</span> than admin work
            </h2>
            <p className="text-gray-400 mb-12 text-lg leading-relaxed max-w-xl">
              The average freelancer spends 8+ hours per month on invoicing. That's time you could spend growing your business, learning new skills, or just relaxing.
            </p>
          </motion.div>

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
                hidden: { opacity: 0, x: -20 },
                visible: { opacity: 1, x: 0 },
              },
            }}
            className="space-y-4"
          >
            {[
              { text: "Staring at a blank page, trying to describe your work professionally", icon: <AlertCircle size={14} /> },
              { text: "Copy-pasting client details into templates for the 10th time", icon: <Ban size={14} /> }, 
              { text: "Forgetting to follow up until you're desperate for cash flow", icon: <Clock size={14} /> },
              { text: "Juggling 3 different tools just to get paid on time", icon: <ZapOff size={14} /> }
            ].map((item, index) => (
              <div key={index} className="flex items-center gap-4 text-gray-300 group p-4 rounded-2xl border border-transparent hover:border-white/5 hover:bg-white/[0.02] transition-all">
                <div className="w-8 h-8 rounded-lg bg-blue-500/10 flex items-center justify-center text-blue-500/80 group-hover:scale-110 group-hover:bg-blue-500/20 transition-all">
                  {item.icon}
                </div>
                <span className="text-sm md:text-base font-medium text-gray-400 group-hover:text-gray-200 transition-colors">
                  {item.text}
                </span>
              </div>
            ))}
          </AnimatedGroup>
        </div>

        <div className="relative">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="glass-panel p-8 relative z-10 border-blue-500/10"
          >
            <div className="absolute -top-4 -right-4 bg-blue-500/20 border border-blue-500/30 text-blue-400 text-[10px] font-bold px-2 py-1 rounded backdrop-blur-md">
              MANUAL PROCESS
            </div>
            
            <div className="space-y-6 opacity-40 select-none pointer-events-none">
               {[0.8, 0.5, 0.9, 0.6, 0.4].map((width, i) => (
                 <div key={i} className="space-y-2">
                    <div className="h-2 bg-white/10 rounded-full" style={{ width: `${width * 100}%` }} />
                    <div className="h-1.5 bg-white/5 rounded-full w-1/3" />
                 </div>
               ))}
               
               <div className="pt-6 border-t border-white/5 flex gap-3">
                  <div className="h-8 w-24 bg-white/5 rounded-lg" />
                  <div className="h-8 w-16 bg-white/5 rounded-lg ml-auto" />
               </div>
            </div>

            {/* Overlay icons representing chaos */}
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                <div className="relative w-full h-full">
                    <motion.div 
                        animate={{ y: [0, -10, 0] }}
                        transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                        className="absolute top-1/4 left-1/3 p-3 bg-blue-500/20 rounded-xl border border-blue-500/40 text-blue-500 blur-[0.5px]"
                    >
                        <X size={20} />
                    </motion.div>
                    <motion.div 
                        animate={{ y: [0, 10, 0] }}
                        transition={{ duration: 5, repeat: Infinity, ease: "easeInOut", delay: 1 }}
                        className="absolute bottom-1/4 right-1/4 p-4 bg-blue-400/20 rounded-xl border border-blue-400/40 text-blue-400 blur-[1px]"
                    >
                        <Clock size={24} />
                    </motion.div>
                </div>
            </div>
          </motion.div>
          
          <div className="absolute -z-10 top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-72 h-72 bg-blue-500/5 blur-[100px] rounded-full" />
        </div>
      </div>
    </div>
  </section>
);