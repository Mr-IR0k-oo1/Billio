import { FileText } from 'lucide-react';

export const HowItWorks = () => (
  <section id="how-it-works" className="py-24 relative">
    <div className="absolute inset-0 bg-gradient-to-b from-transparent to-black/50 pointer-events-none" />
    <div className="home-container relative z-10">
      <div className="grid md:grid-cols-2 gap-16 items-center">
        <div className="order-2 md:order-1">
           {/* Step Preview */}
           <div className="glass-panel p-1 rounded-2xl border border-white/10 relative overflow-hidden">
              <div className="absolute inset-0 bg-blue-500/5 blur-3xl" />
              <div className="bg-[#050505] rounded-xl p-8 aspect-square flex flex-col justify-center items-center text-center relative z-10">
                  <div className="w-20 h-20 bg-blue-500/10 rounded-2xl flex items-center justify-center text-blue-500 mb-6 mx-auto border border-blue-500/20 shadow-[0_0_30px_rgba(59,130,246,0.1)]">
                      <FileText size={40} />
                  </div>
                  <h4 className="text-white font-bold text-xl mb-3">Invoice Generated</h4>
                  <p className="text-gray-500 text-sm">Waiting for review...</p>
                  
                  {/* Fake loading bar */}
                  <div className="w-32 h-1 bg-gray-800 rounded-full mt-6 overflow-hidden">
                    <div className="h-full bg-blue-500 w-2/3 animate-pulse" />
                  </div>
              </div>
           </div>
        </div>
        <div className="order-1 md:order-2">
          <h2 className="home-h2 mb-8">Done in under a minute.</h2>
          <div className="space-y-6">
            {[
              { title: "Describe the work you did", desc: "Just typed plain text." },
              { title: "Review the invoice Billio creates", desc: "AI formats it perfectly." },
              { title: "Send and get paid", desc: "Direct via email or link." }
            ].map((step, i) => (
              <div key={i} className="step-card group cursor-default">
                <div className="step-number group-hover:scale-110 transition-transform duration-300">{i + 1}</div>
                <div>
                  <h3 className="text-lg font-bold text-white mb-1 group-hover:text-blue-400 transition-colors">{step.title}</h3>
                  <p className="text-gray-400 text-sm">{step.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  </section>
);
