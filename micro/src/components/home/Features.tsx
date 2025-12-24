import React from 'react';
import { motion } from 'framer-motion';
import { FileText, Send, Clock } from 'lucide-react';

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

  return (
    <section className="solution-section" onMouseMove={handleMouseMove}>
      <div className="home-container">
        <div className="text-center mb-16">
          <h2 className="home-h2">Your invoices, written for you</h2>
          <p className="home-subtitle">
            AI-powered features that save you time and help you get paid faster.
          </p>
        </div>
        <div className="feature-grid">
          {[
            {
              icon: <FileText className="text-blue-500" size={32} />,
              title: "Describe the work",
              desc: "Write one short sentence. Billio turns it into clean invoice line items."
            },
            {
              icon: <Send className="text-green-500" size={32} />,
              title: "Send polished invoices instantly",
              desc: "Generate a professional PDF and email it in one click."
            },
            {
              icon: <Clock className="text-purple-500" size={32} />,
              title: "Stay on top of payments",
              desc: "Draft polite payment reminders when invoices are overdue."
            }
          ].map((feature, idx) => (
            <motion.div 
              key={idx}
              className="feature-card group"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: idx * 0.1 }}
            >
              <div className="mb-6 p-4 rounded-xl bg-white/5 w-fit border border-white/5 group-hover:border-blue-500/30 group-hover:bg-blue-500/10 transition-colors">
                {feature.icon}
              </div>
              <h3 className="text-xl font-bold text-white mb-3">{feature.title}</h3>
              <p className="text-gray-400 leading-relaxed">{feature.desc}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};
