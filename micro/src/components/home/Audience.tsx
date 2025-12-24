
export const Audience = () => (
  <section className="py-24 border-y border-white/5 bg-[#020202] relative overflow-hidden">
    <div className="absolute inset-0 bg-[radial-gradient(#ffffff05_1px,transparent_1px)] [background-size:16px_16px] [mask-image:radial-gradient(ellipse_50%_50%_at_50%_50%,#000_70%,transparent_100%)]"></div>
    <div className="home-container text-center relative z-10">
      <h2 className="home-h2 mb-4">Built for freelancers and small teams</h2>
      <p className="home-subtitle mb-12">If you send invoices regularly, Billio saves you time.</p>
      <div className="flex flex-wrap justify-center gap-4">
        {["Designers", "Developers", "Marketers", "Consultants", "Small Agencies"].map((role, i) => (
          <span key={i} className="px-6 py-3 rounded-full bg-white/5 border border-white/10 text-gray-300 font-medium hover:bg-white/10 hover:border-white/20 transition-all cursor-default hover:scale-105">
            {role}
          </span>
        ))}
      </div>
    </div>
  </section>
);
