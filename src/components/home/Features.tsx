import React from 'react';
import { motion } from 'framer-motion';
import { FileText, Send, Clock, Zap, Shield, TrendingUp } from 'lucide-react';

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
      icon: <Zap className="text-yellow-500" size={32} />,
      title: "AI writes your descriptions",
      desc: "Just type 'Designed new landing page for client' and get professional, detailed line items in seconds.",
      highlight: "Save 2+ hours per invoice"
    },
    {
      icon: <Send className="text-green-500" size={32} />,
      title: "One-click professional invoices",
      desc: "Generate beautiful PDFs with your branding and send them directly from the app. No more design work needed.",
      highlight: "Industry-standard templates"
    },
    {
      icon: <Clock className="text-purple-500" size={32} />,
      title: "Smart payment reminders",
      desc: "AI drafts polite follow-ups when payments are late. Gets you paid 3x faster without awkward conversations.",
      highlight: "40% faster payments on average"
    },
    {
      icon: <TrendingUp className="text-blue-500" size={32} />,
      title: "Real-time analytics",
      desc: "Track your earnings, overdue payments, and client payment patterns. Know exactly where your business stands.",
      highlight: "Make data-driven decisions"
    },
    {
      icon: <Shield className="text-indigo-500" size={32} />,
      title: "Client database",
      desc: "Store client details, project history, and payment terms. Never hunt for contact info again.",
      highlight: "Centralized client management"
    },
    {
      icon: <FileText className="text-orange-500" size={32} />,
      title: "Invoice templates",
      desc: "Create templates for recurring work. Duplicate and customize in seconds, not hours.",
      highlight: "10x faster for repeat work"
    }
  ];

  return (
    <section className="solution-section" onMouseMove={handleMouseMove}>
      <div className="home-container">
        <div className="text-center mb-16">
          <h2 className="home-h2">Everything you need to get paid faster</h2>
          <p className="home-subtitle">
            Powerful AI features that eliminate admin work and help you focus on growing your business.
          </p>
        </div>
        <div className="feature-grid">
          {features.map((feature, idx) => (
            <motion.div 
              key={idx}
              className="feature-card group"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: idx * 0.1 }}
            >
              <div className="mb-6 p-4 rounded-xl bg-white/5 w-fit border border-white/5 group-hover:border-blue-500/30 group-hover:bg-blue-500/10 transition-all duration-300">
                {feature.icon}
              </div>
              <h3 className="text-xl font-bold text-white mb-3">{feature.title}</h3>
              <p className="text-gray-400 leading-relaxed mb-4">{feature.desc}</p>
              <div className="inline-flex items-center gap-2 text-sm text-blue-400 font-medium">
                <div className="w-1.5 h-1.5 bg-blue-400 rounded-full"></div>
                {feature.highlight}
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};