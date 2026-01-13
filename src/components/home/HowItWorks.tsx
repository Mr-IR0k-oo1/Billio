import { FileText, MousePointer2, Send, Check, Sparkles } from 'lucide-react';
import { motion } from 'framer-motion';

export const HowItWorks = () => (
  <section id="how-it-works" className="py-32 relative bg-black">
    <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-white/5 to-transparent" />
    
    <div className="home-container relative z-10">
      <div className="grid lg:grid-cols-2 gap-24 items-center">
        <div className="order-2 lg:order-1">
           <motion.div 
             initial={{ opacity: 0, x: -20 }}
             whileInView={{ opacity: 1, x: 0 }}
             viewport={{ once: true }}
             transition={{ duration: 0.8 }}
             className="relative p-1 rounded-3xl bg-gradient-to-br from-blue-500/20 to-transparent"
           >
              <div className="bg-[#000000] rounded-[calc(1.5rem-2px)] p-12 aspect-square flex flex-col justify-center items-center text-center relative overflow-hidden">
                  <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(59,130,246,0.1),transparent_70%)]" />
                  
                  <div className="w-24 h-24 bg-blue-500/10 rounded-[2rem] flex items-center justify-center text-blue-500 mb-8 mx-auto border border-blue-500/20 shadow-2xl shadow-blue-500/10 relative z-10">
                      <FileText size={48} />
                      <motion.div 
                        animate={{ scale: [1, 1.2, 1], opacity: [0.5, 1, 0.5] }}
                        transition={{ duration: 2, repeat: Infinity }}
                        className="absolute -top-2 -right-2 w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center border-4 border-[#000000]"
                      >
                        <Check size={10} className="text-white" />
                      </motion.div>
                  </div>
                  
                  <h4 className="text-white font-bold text-2xl mb-4 relative z-10">Invoice #2024-001</h4>
                  <p className="text-gray-500 text-sm mb-10 relative z-10 font-mono tracking-widest uppercase">Status: Finalizing...</p>
                  
                  <div className="w-48 h-1.5 bg-white/5 rounded-full relative z-10 overflow-hidden">
                    <motion.div 
                        initial={{ width: "0%" }}
                        whileInView={{ width: "100%" }}
                        viewport={{ once: true }}
                        transition={{ duration: 3, ease: "easeInOut" }}
                        className="h-full bg-blue-500 shadow-[0_0_10px_rgba(59,130,246,0.5)]" 
                    />
                  </div>
              </div>
           </motion.div>
        </div>

        <div className="order-1 lg:order-2">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <h2 className="home-h2 text-4xl md:text-6xl mb-12">Done in <span className="text-blue-500">under a minute.</span></h2>
          </motion.div>
          
          <div className="space-y-4">
            {[
              { title: "Describe your work", desc: "Just type what you did in plain English, like you're talking to a friend.", icon: <MousePointer2 size={20} /> },
              { title: "AI generates details", desc: "Billio instantly suggests professional line items and accurate pricing.", icon: <Sparkles size={20} /> },
              { title: "Review and send", desc: "One click to generate a perfect PDF and send it straight to your client.", icon: <Send size={20} /> }
            ].map((step, i) => (
              <motion.div 
                key={i}
                initial={{ opacity: 0, x: 20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1, duration: 0.5 }}
                className="group p-6 rounded-2xl border border-white/5 bg-white/[0.01] hover:bg-white/[0.03] hover:border-white/10 transition-all duration-300 flex items-start gap-6"
              >
                <div className="w-12 h-12 rounded-xl bg-blue-500/10 border border-blue-500/20 flex items-center justify-center text-blue-500 font-bold shrink-0 group-hover:scale-110 transition-transform duration-500">
                  {i + 1}
                </div>
                <div>
                  <h3 className="text-xl font-bold text-white mb-2 group-hover:text-blue-400 transition-colors duration-300">{step.title}</h3>
                  <p className="text-gray-400 text-sm leading-relaxed">{step.desc}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </div>
  </section>
);
