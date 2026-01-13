import React from 'react';
import { motion } from 'framer-motion';
import { FileText, Send, Clock, Zap, Shield, TrendingUp } from 'lucide-react';
import { AnimatedGroup } from '@/components/motion-primitives/animated-group';

export const Features = () => {
  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const cards = document.getElementsByClassName("feature-card");
    Array.from(cards).forEach((card) => {
      const rect = card.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      (card as HTMLElement).style.setProperty("--mouse-x", `${x}px`);
      (card as HTMLElement).style.setProperty("--mouse-y", `${y}px`);
    });
  };

  const features = [
    {
      icon: <Zap className="text-blue-500" size={24} />,
      title: "AI writes your descriptions",
      desc: "Just type 'Designed new landing page' and get professional, detailed line items in seconds.",
      highlight: "Save 2+ hours per invoice"
    },
    {
      icon: <Send className="text-blue-500" size={24} />,
      title: "One-click professional invoices",
      desc: "Generate beautiful PDFs with your branding and send them directly from the app.",
      highlight: "Industry-standard templates"
    },
    {
      icon: <Clock className="text-blue-500" size={24} />,
      title: "Smart payment reminders",
      desc: "AI drafts polite follow-ups when payments are late. Gets you paid 3x faster.",
      highlight: "40% faster payments"
    },
    {
      icon: <TrendingUp className="text-blue-500" size={24} />,
      title: "Real-time analytics",
      desc: "Track your earnings, overdue payments, and client payment patterns at a glance.",
      highlight: "Data-driven decisions"
    },
    {
      icon: <Shield className="text-blue-500" size={24} />,
      title: "Client database",
      desc: "Store client details, project history, and payment terms in one secure place.",
      highlight: "Centralized management"
    },
    {
      icon: <FileText className="text-blue-500" size={24} />,
      title: "Invoice templates",
      desc: "Create templates for recurring work. Duplicate and customize in seconds.",
      highlight: "10x faster for repeat work"
    }
  ];

  return (
    <section id="features" className="solution-section py-32" onMouseMove={handleMouseMove}>
      <div className="home-container">
        <div className="text-center mb-24">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <h2 className="home-h2 text-4xl md:text-6xl mb-6">Everything you need to <span className="text-blue-500">get paid faster</span></h2>
            <p className="home-subtitle text-lg md:text-xl text-gray-400 max-w-3xl mx-auto">
              Powerful AI features that eliminate admin work and help you focus on what you do best.
            </p>
          </motion.div>
        </div>

        <AnimatedGroup
            variants={{
                container: {
                    visible: {
                        transition: {
                            staggerChildren: 0.05,
                        },
                    },
                },
                item: {
                    hidden: { opacity: 0, y: 20, filter: 'blur(10px)' },
                    visible: { opacity: 1, y: 0, filter: 'blur(0px)' },
                },
            }}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
        >
          {features.map((feature, idx) => (
            <div 
              key={idx}
              className="feature-card group h-full flex flex-col"
            >
              <div className="relative z-10">
                <div className="mb-8 p-3 rounded-2xl bg-blue-500/5 w-fit border border-blue-500/10 group-hover:scale-110 group-hover:bg-blue-500/10 transition-all duration-500">
                    {feature.icon}
                </div>
                <h3 className="text-xl font-bold text-white mb-4 group-hover:text-blue-400 transition-colors duration-300">{feature.title}</h3>
                <p className="text-gray-400 leading-relaxed mb-8 flex-grow">{feature.desc}</p>
                <div className="inline-flex items-center gap-2 text-xs text-blue-400/80 font-semibold tracking-wider uppercase bg-blue-500/5 px-3 py-1 rounded-full border border-blue-500/10 group-hover:border-blue-500/30 transition-all duration-500">
                    {feature.highlight}
                </div>
              </div>
            </div>
          ))}
        </AnimatedGroup>
      </div>
    </section>
  );
};