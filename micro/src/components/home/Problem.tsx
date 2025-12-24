import { X } from 'lucide-react';

export const Problem = () => (
  <section className="problem-section">
    <div className="home-container">
      <div className="grid md:grid-cols-2 gap-12 items-center">
        <div>
          <h2 className="home-h2">Invoicing shouldn’t take longer than the work itself</h2>
          <p className="text-gray-400 mb-8 text-lg">
            Stop wasting hours on admin tasks. Billio removes the busywork so you can focus on what you do best.
          </p>
          <ul className="space-y-4">
            {[
              "Writing the same invoice descriptions every time",
              "Copying details into templates and PDFs",
              "Forgetting to follow up on unpaid invoices",
              "Switching tools just to send a bill"
            ].map((item, index) => (
              <li key={index} className="flex items-center gap-3 text-gray-300 problem-item">
                <div className="w-6 h-6 rounded-full bg-red-500/20 flex items-center justify-center text-red-500">
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
            {/* Visual representation of chaos/manual work */}
            <div className="space-y-4 opacity-50">
               <div className="h-4 bg-white/10 rounded w-3/4"></div>
               <div className="h-4 bg-white/10 rounded w-1/2"></div>
               <div className="h-4 bg-white/10 rounded w-5/6"></div>
               <div className="h-4 bg-white/10 rounded w-2/3"></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>
);
