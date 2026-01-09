import { Navbar } from '../components/home/Navbar';
import { Problem } from '../components/home/Problem';
import { Features } from '../components/home/Features';
import { HowItWorks } from '../components/home/HowItWorks';
import { InteractiveDemo } from '../components/home/InteractiveDemo';
import { Testimonials } from '../components/home/Testimonials';
import { Pricing } from '../components/home/Pricing';
import { FAQ } from '../components/home/FAQ';
import { FinalCTA } from '../components/home/FinalCTA';
import { Footer } from '../components/home/Footer';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowRight, Sparkles, Zap, TrendingUp, Shield } from 'lucide-react';


const HeroSection = () => (
  <section className="min-h-screen flex items-center justify-center relative overflow-hidden pt-20">
    <div className="glow-effect" style={{ top: '20%', left: '10%', opacity: 0.15 }} />
    <div className="glow-effect" style={{ bottom: '20%', right: '10%', opacity: 0.1 }} />
    
    <div className="home-container relative z-10">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="text-center max-w-5xl mx-auto"
      >
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400 text-sm mb-6"
        >
          <Sparkles size={16} />
          AI-Powered Invoicing for Freelancers
        </motion.div>
        
        <h1 className="home-h1 mb-6">
          Get paid faster with{' '}
          <span className="bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 text-transparent bg-clip-text">
            AI-generated invoices
          </span>
        </h1>
        
        <p className="text-xl text-gray-400 mb-8 max-w-2xl mx-auto leading-relaxed">
          Transform how you manage billing. AI writes professional line items, sends smart reminders, and tracks payments automatically.
        </p>
        
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-12"
        >
          <Link to="/register" className="btn-cta text-lg px-8 py-4">
            Get Started Free
            <ArrowRight size={20} />
          </Link>
          <Link to="/login" className="btn-secondary text-lg px-8 py-4">
            View Demo
          </Link>
        </motion.div>
        
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.6 }}
          className="grid grid-cols-3 gap-8 max-w-2xl mx-auto"
        >
          {[
            { icon: <Zap size={24} className="text-yellow-500" />, label: "AI-Powered" },
            { icon: <TrendingUp size={24} className="text-green-500" />, label: "3x Faster" },
            { icon: <Shield size={24} className="text-blue-500" />, label: "Secure" },
          ].map((item, index) => (
            <div key={index} className="flex flex-col items-center gap-2">
              {item.icon}
              <span className="text-sm text-gray-400 font-medium">{item.label}</span>
            </div>
          ))}
        </motion.div>
      </motion.div>
      
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 0.8 }}
        className="mt-16 relative"
      >
        <div className="glass-panel p-8 max-w-4xl mx-auto">
          <div className="grid grid-cols-3 gap-4 mb-4">
            <div className="h-4 bg-white/10 rounded animate-pulse" />
            <div className="h-4 bg-white/10 rounded animate-pulse" style={{ animationDelay: '0.2s' }} />
            <div className="h-4 bg-white/10 rounded animate-pulse" style={{ animationDelay: '0.4s' }} />
          </div>
          <div className="space-y-3">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="flex items-center gap-3 p-3 rounded-lg bg-white/5 border border-white/5">
                <div className="w-4 h-4 rounded-full bg-blue-500/20" />
                <div className="flex-1 h-3 bg-white/10 rounded animate-pulse" style={{ animationDelay: `${i * 0.15}s` }} />
                <div className="w-20 h-3 bg-white/10 rounded" />
              </div>
            ))}
          </div>
        </div>
      </motion.div>
    </div>
  </section>
);

const StatsSection = () => (
  <section className="py-20 relative">
    <div className="home-container">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
        {[
          { value: "10,000+", label: "Active Users" },
          { value: "$2M+", label: "Invoices Processed" },
          { value: "40%", label: "Faster Payments" },
          { value: "4.9/5", label: "User Rating" },
        ].map((stat, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: index * 0.1 }}
            className="text-center"
          >
            <div className="text-4xl font-bold text-white mb-2">{stat.value}</div>
            <div className="text-gray-400">{stat.label}</div>
          </motion.div>
        ))}
      </div>
    </div>
  </section>
);

const HomePage = () => {
  return (
    <div className="min-h-screen bg-[#050505]">
      <Navbar />
      <HeroSection />
      <StatsSection />
      <Problem />
      <Features />
      <HowItWorks />
      <InteractiveDemo />
      <Testimonials />
      <Pricing />
      <FAQ />
      <FinalCTA />
      <Footer />
    </div>
  );
};

export default HomePage;