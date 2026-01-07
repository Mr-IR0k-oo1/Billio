import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { ArrowRight, PlayCircle, Target, Sparkles } from 'lucide-react';
import React from 'react';
import Plasma, { PlasmaFallback } from '../../pages/Plasma';

export const Hero = () => (
  <section className="hero-section">
    <div style={{ position: 'absolute', inset: 0, zIndex: 0, overflow: 'hidden' }}>
      <React.Suspense fallback={<PlasmaFallback />}>
        <Plasma 
          color="#ff6b35"
          speed={0.6}
          direction="forward"
          scale={1.1}
          opacity={0.8}
          mouseInteractive={true}
        />
      </React.Suspense>
    </div>
    <div className="home-container relative z-10">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <span className="trusted-badge">
          <Target size={16} className="inline-block mr-2" /> Trusted by 1,000+ freelancers
        </span>
        <h1 className="home-h1">
          Stop wasting hours on <br />
          <span className="text-white">admin work.</span>
        </h1>
        <p className="home-subtitle mb-10">
          AI writes your invoice descriptions in seconds. Get paid 3x faster with professional invoices that practically write themselves.
        </p>
        <div className="hero-buttons">
          <Link to="/register" className="btn-cta btn-cta-with-icon">
            Start free trial <ArrowRight size={20} />
          </Link>
          <button className="btn-secondary btn-secondary-with-icon">
            <PlayCircle size={20} /> Watch 2-min demo
          </button>
        </div>
        <p className="hero-note">
          <Sparkles size={16} className="inline-block mr-2" /> 14-day free trial • No credit card required
        </p>
      </motion.div>

      {/* Hero Image / UI Preview */}
      <motion.div 
        className="hero-preview glass-panel"
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 0.2 }}
      >
        <div className="preview-screen">
           <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-gray-900 to-black">
              {/* Enhanced UI representation with AI input */}
              <div className="w-full h-full glass-panel border border-white/10 p-8 flex flex-col">
                 {/* Header */}
                 <div className="flex items-center justify-between mb-6">
                    <div className="h-6 w-24 bg-white/10 rounded"></div>
                    <div className="flex gap-2">
                      <div className="h-6 w-6 bg-white/5 rounded"></div>
                      <div className="h-6 w-6 bg-white/5 rounded"></div>
                    </div>
                 </div>
                 
                 {/* AI Input Section */}
                 <div className="mb-6">
                    <div className="h-4 w-32 bg-blue-500/20 rounded mb-3"></div>
                    <div className="h-12 w-full bg-white/5 rounded-lg border border-blue-500/20 flex items-center px-4">
                      <div className="h-3 w-3/4 bg-white/10 rounded"></div>
                      <div className="ml-auto h-6 w-16 bg-blue-500 rounded"></div>
                    </div>
                 </div>
                 
                 {/* Generated Items */}
                 <div className="flex-1 flex flex-col gap-3">
                    <div className="h-3 w-2/3 bg-green-500/20 rounded"></div>
                    <div className="space-y-2">
                      <div className="h-10 w-full bg-white/5 rounded flex items-center px-3 justify-between">
                        <div className="h-2.5 w-1/3 bg-white/10 rounded"></div>
                        <div className="h-2.5 w-16 bg-white/10 rounded"></div>
                      </div>
                      <div className="h-10 w-full bg-white/5 rounded flex items-center px-3 justify-between">
                        <div className="h-2.5 w-2/5 bg-white/10 rounded"></div>
                        <div className="h-2.5 w-20 bg-white/10 rounded"></div>
                      </div>
                      <div className="h-10 w-full bg-white/5 rounded flex items-center px-3 justify-between">
                        <div className="h-2.5 w-1/2 bg-white/10 rounded"></div>
                        <div className="h-2.5 w-14 bg-white/10 rounded"></div>
                      </div>
                    </div>
                 </div>
                 
                 {/* Action Buttons */}
                 <div className="flex justify-between items-center mt-6 pt-4 border-t border-white/5">
                    <div className="h-10 w-28 bg-white/5 rounded-lg"></div>
                    <div className="h-10 w-24 bg-blue-500 rounded-lg shadow-lg shadow-blue-500/20"></div>
                 </div>
              </div>
           </div>
        </div>
      </motion.div>
    </div>
  </section>
);
