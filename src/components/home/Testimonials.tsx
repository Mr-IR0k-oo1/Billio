import { motion } from 'framer-motion';
import { Star } from 'lucide-react';

export const Testimonials = () => {
  const testimonials = [
    {
      name: "Sarah Chen",
      role: "Freelance Designer",
      content: "Billio saved me 5+ hours per month. I just describe my work and it creates perfect invoices. Game changer for freelancers.",
      rating: 5,
      avatar: "SC"
    },
    {
      name: "Marcus Rodriguez", 
      role: "Web Developer",
      content: "The AI descriptions are surprisingly accurate. My clients love how professional the invoices look. Best $15/month I've spent.",
      rating: 5,
      avatar: "MR"
    },
    {
      name: "Emily Watson",
      role: "Marketing Consultant", 
      content: "Used to dread invoicing. Now it takes 2 minutes. The payment reminders have helped me get paid 40% faster too.",
      rating: 5,
      avatar: "EW"
    }
  ];

  return (
    <section className="py-24 relative overflow-hidden">
      <div className="glow-effect" style={{ top: '30%', left: '10%', opacity: 0.1 }} />
      <div className="home-container relative z-10">
        <div className="text-center mb-16">
          <h2 className="home-h2">Loved by 1,000+ freelancers</h2>
          <p className="home-subtitle">See what our users are saying about Billio</p>
        </div>
        
        <div className="grid md:grid-cols-3 gap-8 mb-16">
          {testimonials.map((testimonial, idx) => (
            <motion.div
              key={idx}
              className="glass-panel p-8 group hover:bg-white/5 transition-all duration-300"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: idx * 0.1 }}
            >
              <div className="flex items-center mb-4">
                {[...Array(testimonial.rating)].map((_, i) => (
                  <Star key={i} size={16} className="text-yellow-500 fill-yellow-500" />
                ))}
              </div>
              <p className="text-gray-300 mb-6 italic leading-relaxed">
                "{testimonial.content}"
              </p>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-purple-500 flex items-center justify-center text-white font-semibold text-sm">
                  {testimonial.avatar}
                </div>
                <div>
                  <div className="font-semibold text-white">{testimonial.name}</div>
                  <div className="text-sm text-gray-500">{testimonial.role}</div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Social Proof Stats */}
        <div className="glass-panel p-8 text-center">
          <div className="grid md:grid-cols-4 gap-8">
            {[
              { value: "1,000+", label: "Active Users" },
              { value: "50K+", label: "Invoices Created" },
              { value: "4.9/5", label: "User Rating" },
              { value: "3x", label: "Faster Payments" }
            ].map((stat, idx) => (
              <motion.div
                key={idx}
                className="group"
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.1 }}
              >
                <div className="text-3xl font-bold text-white mb-2 group-hover:text-blue-400 transition-colors">
                  {stat.value}
                </div>
                <div className="text-gray-500 text-sm uppercase tracking-wide">
                  {stat.label}
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};