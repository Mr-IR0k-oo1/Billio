import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { ArrowRight, PlayCircle } from 'lucide-react';
import Plasma from '../../pages/Plasma';

export const Hero = () => (
  <section className="hero-section">
    <div style={{ position: 'absolute', inset: 0, zIndex: 0, overflow: 'hidden' }}>
      <Plasma 
        color="#ff6b35"
        speed={0.6}
        direction="forward"
        scale={1.1}
        opacity={0.8}
        mouseInteractive={true}
      />
    </div>
    <div className="home-container relative z-10">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <span className="inline-block px-4 py-1.5 rounded-full bg-blue-500/10 text-blue-400 text-sm font-medium mb-6 border border-blue-500/20">
          New: AI-Powered Invoicing
        </span>
        <h1 className="home-h1">
          Create invoices in <br />
          <span className="text-white">60 seconds.</span>
        </h1>
        <p className="home-subtitle mb-10">
          Billio writes professional invoice descriptions for you, so you can get paid faster without the admin work.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
          <Link to="/register" className="btn-cta flex items-center gap-2">
            Create your first invoice <ArrowRight size={20} />
          </Link>
          <button className="btn-secondary flex items-center gap-2">
            <PlayCircle size={20} /> See how it works
          </button>
        </div>
        <p className="mt-6 text-sm text-gray-500">
          No credit card required • Cancel anytime
        </p>
      </motion.div>

      {/* Hero Image / UI Preview */}
      <motion.div 
        className="mt-16 glass-panel p-2 md:p-4 max-w-5xl mx-auto shadow-2xl shadow-blue-500/10"
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 0.2 }}
      >
        <div className="bg-[#0A0A0A] rounded-xl overflow-hidden aspect-[16/10] relative group border border-white/5">
           <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-gray-900 to-black">
              {/* Abstract UI representation */}
              <div className="w-3/4 h-3/4 glass-panel rounded-lg border border-white/10 p-6 flex flex-col gap-4">
                 <div className="h-8 w-1/3 bg-white/10 rounded"></div>
                 <div className="h-4 w-1/4 bg-white/5 rounded"></div>
                 <div className="mt-8 flex flex-col gap-3">
                    <div className="h-12 w-full bg-white/5 rounded flex items-center px-4 justify-between">
                       <div className="h-3 w-1/2 bg-white/10 rounded"></div>
                       <div className="h-3 w-1/6 bg-white/10 rounded"></div>
                    </div>
                    <div className="h-12 w-full bg-white/5 rounded flex items-center px-4 justify-between">
                       <div className="h-3 w-1/3 bg-white/10 rounded"></div>
                       <div className="h-3 w-1/6 bg-white/10 rounded"></div>
                    </div>
                 </div>
                 <div className="mt-auto flex justify-end">
                    <div className="h-10 w-32 bg-blue-500 rounded-lg shadow-lg shadow-blue-500/20"></div>
                 </div>
              </div>
           </div>
        </div>
      </motion.div>
    </div>
  </section>
);
