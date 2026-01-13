import { useState } from 'react';
import { Plus, Minus, HelpCircle, ArrowRight } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link } from 'react-router-dom';

export const FAQ = () => {
  const [openIndex, setOpenIndex] = useState<number | null>(null);
  
  const faqs = [
    { q: "Is the AI accurate?", a: "The AI acts as an intelligent draft generator. You review and edit every line item before it's sent, giving you 100% control over the final professional document." },
    { q: "Is Billio accounting software?", a: "No. Billio is a specialized invoicing and billing tool. While it tracks your incoming revenue, it's designed to complement your existing accounting workflow, not replace it." },
    { q: "Can I export invoices?", a: "Absolutely. Every invoice can be downloaded as an industry-standard PDF or printed directly. You can also send them via secure links to your clients." },
    { q: "Is my data secure?", a: "Your security is our priority. We use bank-level encryption (AES-256) to protect your data and and industry-standard security protocols for all transactions." }
  ];

  return (
    <section id="faq" className="py-32 bg-black relative overflow-hidden">
      <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-white/5 to-transparent" />
      
      <div className="home-container max-w-4xl relative z-10">
        <div className="text-center mb-20">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400 text-xs font-bold uppercase tracking-widest mb-4">
               Support
            </div>
            <h2 className="home-h2 text-4xl md:text-5xl mb-6">Frequently Asked <span className="text-blue-500">Questions</span></h2>
            <p className="text-gray-400 text-lg">Everything you need to know about professional invoicing with Billio.</p>
        </div>

        <div className="grid gap-4">
          {faqs.map((faq, i) => (
            <div 
                key={i} 
                className={`group rounded-2xl border transition-all duration-500 ${
                    openIndex === i 
                    ? 'bg-white/5 border-white/10 shadow-2xl shadow-black/40' 
                    : 'bg-transparent border-white/5 hover:border-white/10 hover:bg-white/[0.02]'
                }`}
            >
              <button 
                className="w-full flex items-center justify-between p-8 text-left transition-all"
                onClick={() => setOpenIndex(openIndex === i ? null : i)}
              >
                <div className="flex items-center gap-4">
                    <div className={`w-8 h-8 rounded-lg flex items-center justify-center transition-all duration-500 ${
                        openIndex === i ? 'bg-blue-500 text-white' : 'bg-white/5 text-gray-500'
                    }`}>
                        <HelpCircle size={16} />
                    </div>
                    <span className={`text-lg font-semibold transition-colors duration-500 ${openIndex === i ? 'text-white' : 'text-gray-300 group-hover:text-white'}`}>
                        {faq.q}
                    </span>
                </div>
                <div className={`w-6 h-6 rounded-full flex items-center justify-center border transition-all duration-500 ${
                    openIndex === i ? 'border-blue-500 text-blue-500 rotate-180' : 'border-white/10 text-gray-500'
                }`}>
                    {openIndex === i ? <Minus size={14} /> : <Plus size={14} />}
                </div>
              </button>
              
              <AnimatePresence>
                {openIndex === i && (
                  <motion.div 
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.3, ease: 'easeInOut' }}
                  >
                    <div className="p-8 pt-0 text-gray-400 leading-relaxed border-t border-white/5 mt-0">
                      <p className="pt-6">{faq.a}</p>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          ))}
        </div>

        <div className="mt-20 text-center p-12 rounded-3xl bg-blue-500/5 border border-blue-500/10">
            <h3 className="text-xl font-bold text-white mb-2">Still have questions?</h3>
            <p className="text-gray-400 mb-8">We're here to help you get paid faster.</p>
            <Link to="/contact" className="text-blue-500 font-bold hover:text-blue-400 transition-colors flex items-center justify-center gap-2">
                Contact Support <ArrowRight size={16} />
            </Link>
        </div>
      </div>
    </section>
  );
};
