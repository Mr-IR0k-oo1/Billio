import { motion } from 'framer-motion';

export const Audience = () => (
  <section className="py-32 border-y border-white/5 bg-black relative overflow-hidden">
    <div
      className="absolute inset-0 opacity-30"
      style={{
        backgroundImage: 'radial-gradient(rgba(59, 130, 246, 0.1) 1px, transparent 1px)',
        backgroundSize: '24px 24px',
        WebkitMaskImage: 'radial-gradient(ellipse 50% 50% at 50% 50%, black 70%, transparent 100%)',
        maskImage: 'radial-gradient(ellipse 50% 50% at 50% 50%, black 70%, transparent 100%)'
      }}
    />
    
    <div className="home-container text-center relative z-10">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        whileInView={{ opacity: 1, scale: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6 }}
      >
        <h2 className="home-h2 text-3xl md:text-5xl mb-6 font-bold">Built for the <span className="text-blue-500">modern freelancer</span></h2>
        <p className="home-subtitle text-gray-400 max-w-2xl mx-auto mb-16 text-lg">
            Whether you're a solo creator or a growing agency, Billio handles the boring stuff so you can focus on your craft.
        </p>
      </motion.div>

      <div className="flex flex-wrap justify-center gap-4 max-w-4xl mx-auto">
        {["Designers", "Developers", "Marketers", "Consultants", "Agencies", "Copywriters", "Photographers", "Artists"].map((role, i) => (
          <div 
            key={i} 
            className="px-8 py-4 rounded-2xl bg-white/[0.03] border border-white/10 text-gray-300 font-semibold hover:bg-blue-500/10 hover:border-blue-500/30 hover:text-blue-400 transition-all cursor-default hover:scale-105 shadow-xl shadow-black/20"
          >
            {role}
          </div>
        ))}
      </div>
    </div>
  </section>
);
