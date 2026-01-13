import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Sparkles, ArrowRight, Check, Terminal, Cpu, Send, RefreshCw } from 'lucide-react';

export const InteractiveDemo = () => {
  const [currentStep, setCurrentStep] = useState(0);
  const [inputText, setInputText] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  
  const demoSteps = [
    {
      title: "Input your task",
      subtitle: "Just describe what you did in plain English",
      icon: <Send size={18} className="text-blue-500" />
    },
    {
      title: "AI Analysis",
      subtitle: "Watch Billio break it down into professional line items",
      icon: <Cpu size={18} className="text-blue-400" />
    },
    {
      title: "Send & Get Paid",
      subtitle: "Your professional invoice is ready to send",
      icon: <Check size={18} className="text-blue-500" />
    }
  ];

  const aiOutput = [
    "Frontend Development - React component architecture",
    "Backend Integration - RESTful API endpoints",
    "Database Setup - MongoDB schema design", 
    "Responsive Design - Mobile-first approach",
    "Testing & QA - Cross-browser compatibility"
  ];

  const handleGenerate = () => {
    if (!inputText.trim()) return;
    setIsGenerating(true);
    setTimeout(() => {
      setIsGenerating(false);
      setCurrentStep(1);
    }, 2500);
  };

  const handleNext = () => {
    if (currentStep < demoSteps.length - 1) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handleReset = () => {
    setCurrentStep(0);
    setInputText('');
  };

  return (
    <section className="py-32 relative overflow-hidden bg-black">
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-blue-500/5 blur-[120px] rounded-full pointer-events-none" />
      
      <div className="home-container relative z-10">
        <div className="text-center mb-20">
          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="home-h2 text-4xl md:text-6xl mb-6"
          >
            See the <span className="text-blue-500">Magic</span> in Action
          </motion.h2>
          <p className="home-subtitle text-gray-400 text-lg md:text-xl max-w-2xl mx-auto">
            Experience how Billio transforms simple notes into professional, billable line items in seconds.
          </p>
        </div>

        <div className="max-w-5xl mx-auto grid lg:grid-cols-[300px_1fr] gap-12 items-start">
          {/* Steps Side */}
          <div className="space-y-4">
            {demoSteps.map((step, index) => (
              <div 
                key={index}
                className={`p-6 rounded-2xl border transition-all duration-500 ${
                  index === currentStep 
                  ? 'bg-blue-500/10 border-blue-500/30 shadow-lg shadow-blue-500/5' 
                  : index < currentStep 
                  ? 'bg-blue-500/5 border-blue-500/20'
                  : 'bg-white/[0.02] border-white/5 opacity-50'
                }`}
              >
                <div className="flex items-center gap-4 mb-2">
                  <div className={`w-8 h-8 rounded-lg flex items-center justify-center border ${
                    index === currentStep 
                    ? 'bg-blue-500/20 border-blue-500/40 text-blue-400' 
                    : index < currentStep 
                    ? 'bg-blue-500/20 border-blue-500/40 text-blue-400'
                    : 'bg-white/5 border-white/10 text-gray-500'
                  }`}>
                    {index < currentStep ? <Check size={16} /> : step.icon}
                  </div>
                  <h3 className={`font-bold ${index === currentStep ? 'text-white' : 'text-gray-400'}`}>
                    {step.title}
                  </h3>
                </div>
                <p className="text-sm text-gray-500 leading-relaxed">
                  {step.subtitle}
                </p>
              </div>
            ))}
          </div>

          {/* Output Side - Terminal Style */}
          <div className="relative group">
            <div className="absolute -inset-0.5 bg-gradient-to-r from-blue-500/20 to-blue-300/20 rounded-3xl blur opacity-75 group-hover:opacity-100 transition duration-1000 group-hover:duration-200"></div>
            <div className="relative glass-panel rounded-3xl border border-white/10 overflow-hidden bg-black/40 backdrop-blur-3xl min-h-[400px] flex flex-col">
              {/* Terminal Header */}
              <div className="p-4 border-b border-white/5 flex items-center gap-4 bg-white/5">
                <div className="flex gap-2">
                  <div className="w-3 h-3 rounded-full bg-blue-500/20" />
                  <div className="w-3 h-3 rounded-full bg-blue-400/20" />
                  <div className="w-3 h-3 rounded-full bg-blue-300/20" />
                </div>
                <div className="flex items-center gap-2 text-[10px] font-mono text-gray-500 uppercase tracking-widest">
                  <Terminal size={12} />
                  billio-ai-v2.0.4.sh
                </div>
              </div>

              <div className="p-8 flex-grow">
                <AnimatePresence mode="wait">
                  {currentStep === 0 && (
                    <motion.div
                      key="step0"
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      className="space-y-6"
                    >
                      <div className="space-y-3">
                        <label className="text-xs font-mono text-blue-400 uppercase tracking-wider">Session Input</label>
                        <textarea
                          value={inputText}
                          onChange={(e) => setInputText(e.target.value)}
                          placeholder="e.g., 'Built a responsive dashboard with real-time analytics using Next.js and Tailwind'"
                          className="w-full h-32 p-4 bg-white/5 border border-white/10 rounded-xl text-white placeholder-gray-600 focus:outline-none focus:border-blue-500/50 resize-none font-mono text-sm leading-relaxed"
                        />
                      </div>
                      <button
                        onClick={handleGenerate}
                        disabled={!inputText.trim() || isGenerating}
                        className="w-full h-14 bg-white text-black rounded-xl font-bold flex items-center justify-center gap-3 hover:bg-gray-200 transition-all disabled:opacity-50 group"
                      >
                        {isGenerating ? (
                          <RefreshCw className="animate-spin" size={20} />
                        ) : (
                          <>
                            <Sparkles size={18} />
                            Generate Line Items
                            <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
                          </>
                        )}
                      </button>
                    </motion.div>
                  )}

                  {currentStep === 1 && (
                    <motion.div
                      key="step1"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      className="space-y-6"
                    >
                       <div className="flex items-center gap-3 text-xs font-mono text-blue-400">
                         <span className="flex h-2 w-2 rounded-full bg-blue-500 animate-pulse" />
                         COMPILATION SUCCESSFUL - 5 ITEMS GENERATED
                       </div>
                       
                       <div className="space-y-3">
                         {aiOutput.map((item, i) => (
                           <motion.div 
                            key={i}
                            initial={{ opacity: 0, x: -10 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: i * 0.2 }}
                            className="p-3 bg-white/5 border border-white/5 rounded-lg text-gray-300 font-mono text-sm flex items-center gap-3"
                           >
                             <span className="text-blue-500">{i + 1}.</span>
                             {item}
                           </motion.div>
                         ))}
                       </div>

                       <button
                        onClick={handleNext}
                        className="w-full h-14 border border-blue-500/30 bg-blue-500/5 text-blue-400 rounded-xl font-bold flex items-center justify-center gap-3 hover:bg-blue-500/10 transition-all"
                      >
                        Continue to Final Invoice <ArrowRight size={18} />
                      </button>
                    </motion.div>
                  )}

                  {currentStep === 2 && (
                    <motion.div
                      key="step2"
                      initial={{ opacity: 0, scale: 0.95 }}
                      animate={{ opacity: 1, scale: 1 }}
                      className="text-center py-12"
                    >
                      <div className="w-24 h-24 bg-blue-500/10 rounded-3xl border border-blue-500/20 flex items-center justify-center mx-auto mb-8 shadow-2xl shadow-blue-500/10">
                        <Check className="text-blue-500" size={48} />
                      </div>
                      <h3 className="text-2xl font-bold text-white mb-4">Ready to Send!</h3>
                      <p className="text-gray-400 mb-12 max-w-sm mx-auto">
                        Your professional PDF has been generated and is ready to be delivered to your client.
                      </p>
                      
                      <div className="flex flex-col gap-4">
                        <Link to="/register" className="h-14 bg-blue-600 text-white rounded-xl font-bold flex items-center justify-center gap-3 hover:bg-blue-500 transition-all shadow-xl shadow-blue-600/20">
                          Try it for real <ArrowRight size={20} />
                        </Link>
                        <button
                          onClick={handleReset}
                          className="h-14 bg-white/5 border border-white/10 text-gray-400 rounded-xl font-bold hover:bg-white/10 transition-all"
                        >
                          Try demo again
                        </button>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};