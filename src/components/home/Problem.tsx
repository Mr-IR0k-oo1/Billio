import { X } from 'lucide-react';

export const Problem = () => (
  <section className="problem-section">
    <div className="home-container">
      <div className="grid md:grid-cols-2 gap-12 items-center">
        <div>
          <h2 className="home-h2">Your time is worth more than admin work</h2>
          <p className="text-gray-400 mb-8 text-lg">
            The average freelancer spends 8+ hours per month on invoicing. That's time you could spend growing your business.
          </p>
          <ul className="space-y-4">
            {[
              "Staring at a blank page, trying to describe your work professionally",
              "Copy-pasting client details into templates for the 10th time this week", 
              "Forgetting to follow up until you're desperate for cash flow",
              "Juggling 3 different tools just to get paid on time",
              "Wondering if your invoices look professional enough"
            ].map((item, index) => (
              <li key={index} className="flex items-center gap-3 text-gray-300 problem-item group">
                <div className="w-6 h-6 rounded-full bg-red-500/20 flex items-center justify-center text-red-500 group-hover:scale-110 transition-transform">
                  <X size={14} />
                </div>
                {item}
              </li>
            ))}
          </ul>
        </div>
        <div className="relative">
          <div className="glow-effect" style={{ width: '400px', height: '400px', right: 0 }} />
          <div className="glass-panel p-8 relative z-10">
            {/* Enhanced visual representation of chaos/manual work */}
            <div className="space-y-4 opacity-50">
               <div className="flex items-center gap-3">
                 <div className="h-4 w-4 bg-red-500/30 rounded"></div>
                 <div className="h-4 bg-white/10 rounded w-3/4"></div>
               </div>
               <div className="flex items-center gap-3">
                 <div className="h-4 w-4 bg-orange-500/30 rounded"></div>
                 <div className="h-4 bg-white/10 rounded w-1/2"></div>
               </div>
               <div className="flex items-center gap-3">
                 <div className="h-4 w-4 bg-yellow-500/30 rounded"></div>
                 <div className="h-4 bg-white/10 rounded w-5/6"></div>
               </div>
               <div className="flex items-center gap-3">
                 <div className="h-4 w-4 bg-red-500/30 rounded"></div>
                 <div className="h-4 bg-white/10 rounded w-2/3"></div>
               </div>
               <div className="mt-6 flex gap-2">
                 <div className="h-8 w-20 bg-white/5 rounded"></div>
                 <div className="h-8 w-16 bg-white/5 rounded"></div>
               </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>
);