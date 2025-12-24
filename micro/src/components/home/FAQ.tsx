import { useState } from 'react';
import { ChevronDown, ChevronUp } from 'lucide-react';

export const FAQ = () => {
  const [openIndex, setOpenIndex] = useState<number | null>(null);
  
  const faqs = [
    { q: "Is the AI accurate?", a: "You review and edit everything before sending. The AI creates a draft based on your input, but you have full control." },
    { q: "Is Billio accounting software?", a: "No. Billio is focused on invoicing only. It connects seamlessly with your workflow but replaces document creation, not your ledger." },
    { q: "Can I export invoices?", a: "Yes, download PDFs anytime. You can also print them directly from the browser." },
    { q: "Is my data secure?", a: "Yes. Client data is stored securely using industry-standard encryption and never shared with third parties." }
  ];

  return (
    <section id="faq" className="py-24 bg-[#030303]">
      <div className="home-container max-w-3xl">
        <h2 className="home-h2 text-center mb-12">Frequently Asked Questions</h2>
        <div className="space-y-4">
          {faqs.map((faq, i) => (
            <div key={i} className={`faq-item-container ${openIndex === i ? 'active' : ''} bg-white/5 overflow-hidden`}>
              <button 
                className="w-full flex items-center justify-between p-6 text-left transition-colors"
                onClick={() => setOpenIndex(openIndex === i ? null : i)}
              >
                <span className={`font-medium transition-colors ${openIndex === i ? 'text-blue-400' : 'text-white'}`}>{faq.q}</span>
                {openIndex === i ? <ChevronUp className="text-blue-400" /> : <ChevronDown className="text-gray-400" />}
              </button>
              <div 
                  className={`overflow-hidden transition-all duration-300 ease-in-out ${openIndex === i ? 'max-h-48 opacity-100' : 'max-h-0 opacity-0'}`}
              >
                <div className="p-6 pt-0 text-gray-400 text-sm leading-relaxed border-t border-white/5 mt-0">
                  {faq.a}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
