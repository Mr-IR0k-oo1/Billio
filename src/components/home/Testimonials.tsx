import { motion } from 'framer-motion';
import { Star, Quote } from 'lucide-react';

export const Testimonials = () => {
  const testimonials = [
    {
      name: "Sarah Chen",
      role: "Freelance Designer",
      content: "Billio saved me 5+ hours per month. I just describe my work and it creates perfect invoices. It's like having a personal assistant.",
      rating: 5,
      avatar: "SC",
      color: "from-blue-600 to-blue-400"
    },
    {
      name: "Marcus Rodriguez", 
      role: "Web Developer",
      content: "The AI descriptions are surprisingly accurate. My clients love how professional the invoices look. Definitely worth the subscription.",
      rating: 5,
      avatar: "MR",
      color: "from-blue-500 to-blue-300"
    },
    {
      name: "Emily Watson",
      role: "Marketing Consultant", 
      content: "Used to dread invoicing. Now it takes minutes. The payment reminders have helped me get paid significantly faster too.",
      rating: 5,
      avatar: "EW",
      color: "from-blue-700 to-blue-500"
    }
  ];

  return (
    <section id="testimonials" className="py-32 relative overflow-hidden bg-black">
      <div className="absolute top-1/2 left-0 w-72 h-72 bg-blue-500/5 blur-[120px] rounded-full pointer-events-none" />
      <div className="absolute bottom-0 right-0 w-96 h-96 bg-blue-500/5 blur-[120px] rounded-full pointer-events-none" />
      
      <div className="home-container relative z-10">
        <div className="text-center mb-24">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <h2 className="home-h2 text-4xl md:text-6xl mb-6 font-bold">Loved by <span className="text-blue-500">1,000+</span> freelancers</h2>
            <p className="home-subtitle text-gray-400 text-lg md:text-xl max-w-2xl mx-auto">Don't just take our word for it. Here's what the community thinks.</p>
          </motion.div>
        </div>
        
      <div className="grid md:grid-cols-3 gap-8 mb-24">
        {testimonials.map((testimonial, idx) => (
          <div
            key={idx}
            className="glass-panel p-10 group hover:border-white/20 transition-all duration-500 relative flex flex-col h-full bg-white/[0.02]"
          >
            <Quote className="absolute top-6 right-8 text-white/5 group-hover:text-blue-500/20 transition-colors duration-500" size={48} />
            
            <div className="flex items-center mb-6">
              {[...Array(testimonial.rating)].map((_, i) => (
                <Star key={i} size={14} className="text-blue-500 fill-blue-500 mr-1" />
              ))}
            </div>
            
            <p className="text-gray-300 mb-10 italic leading-relaxed text-lg flex-grow">
              "{testimonial.content}"
            </p>
            
            <div className="flex items-center gap-4">
              <div className={`w-12 h-12 rounded-2xl bg-gradient-to-br ${testimonial.color} flex items-center justify-center text-white font-bold text-sm shadow-xl`}>
                {testimonial.avatar}
              </div>
              <div>
                <div className="font-bold text-white text-base">{testimonial.name}</div>
                <div className="text-xs text-gray-500 uppercase tracking-widest font-semibold">{testimonial.role}</div>
              </div>
            </div>
          </div>
        ))}
      </div>

        {/* Social Proof Stats */}
        <div className="p-1 rounded-3xl bg-gradient-to-r from-blue-500/20 via-blue-400/10 to-blue-500/20 max-w-5xl mx-auto">
          <div className="bg-black/40 backdrop-blur-3xl rounded-[calc(var(--radius-xl)+0.75rem)] p-12 overflow-hidden relative">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-12 relative z-10">
              {[
                { value: "1,200+", label: "Active Users", color: "text-white" },
                { value: "65K+", label: "Invoices Created", color: "text-blue-500" },
                { value: "4.9/5", label: "User Rating", color: "text-white" },
                { value: "3x", label: "Faster Payments", color: "text-blue-400" }
              ].map((stat, idx) => (
                <div key={idx} className="text-center">
                  <div className={`text-4xl font-black mb-3 ${stat.color} tracking-tighter`}>
                    {stat.value}
                  </div>
                  <div className="text-gray-500 text-[10px] font-bold uppercase tracking-[0.2em]">
                    {stat.label}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};