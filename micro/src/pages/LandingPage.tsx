import { useNavigate } from 'react-router-dom';
import { 
  Plus, 
  Sparkles, 
  ShieldCheck, 
  Zap, 
  ChevronRight, 
  FileText,
  Mail,
  Clock,
  CheckCircle2,
  HelpCircle,
  ArrowRight
} from 'lucide-react';
import { motion } from 'framer-motion';

export default function LandingPage() {
  const navigate = useNavigate();

  const pricingPlans = [
    {
      name: "Free",
      price: "$0",
      features: ["Manual invoices", "Basic client management", "PDF exports", "Limited usage"],
      btnText: "Start for Free",
      highlight: false
    },
    {
      name: "Pro",
      price: "$15",
      period: "/month",
      features: ["AI invoice descriptions", "AI payment reminders", "Unlimited invoices", "Custom branding"],
      btnText: "Go Pro",
      highlight: true
    },
    {
      name: "Business",
      price: "Custom",
      features: ["Document auto-fill", "Expense categorization", "Recurring invoices", "Priority support"],
      btnText: "Coming Soon",
      highlight: false,
      disabled: true
    }
  ];

  const faqs = [
    {
      q: "Is the AI accurate?",
      a: "Yes! While the AI generates highly professional line items based on your description, you always have full control to review and edit everything before sending."
    },
    {
      q: "Do you store my client data?",
      a: "We store your data securely in an isolated database. Your client information and invoice history are private and never shared."
    },
    {
      q: "Is this accounting software?",
      a: "No. Micro is built specifically for invoicing—making it as fast and simple as possible without the bloat of full accounting suites."
    },
    {
      q: "Can I export my invoices?",
      a: "Absolutely. Every invoice can be downloaded as a professional PDF or sent directly via email."
    }
  ];

  return (
    <div style={{ background: 'var(--bg-color)', color: 'var(--text-primary)', minHeight: '100vh', scrollBehavior: 'smooth' }}>
      {/* Navbar */}
      <nav style={{ 
        display: 'flex', 
        justifyContent: 'space-between', 
        alignItems: 'center', 
        padding: '20px 8%',
        borderBottom: '1px solid var(--glass-border)',
        backdropFilter: 'blur(10px)',
        position: 'sticky',
        top: 0,
        zIndex: 100,
        background: 'rgba(5, 5, 5, 0.8)'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <div style={{ width: '32px', height: '32px', background: 'var(--accent-color)', borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <FileText size={18} color="white" />
          </div>
          <span style={{ fontSize: '1.5rem', fontWeight: 800, fontFamily: 'Outfit' }}>Micro</span>
        </div>
        <div style={{ display: 'flex', gap: '24px', alignItems: 'center' }}>
          <button onClick={() => navigate('/login')} className="btn-ghost" style={{ fontSize: '0.9rem' }}>Sign In</button>
          <button onClick={() => navigate('/register')} className="btn-primary" style={{ padding: '8px 20px', fontSize: '0.9rem' }}>Get Started</button>
        </div>
      </nav>

      {/* Hero Section */}
      <section style={{ padding: '120px 8% 80px', textAlign: 'center', position: 'relative' }}>
        <div style={{ 
          position: 'absolute', 
          top: '0%', 
          left: '50%', 
          transform: 'translateX(-50%)', 
          width: '800px', 
          height: '600px', 
          background: 'radial-gradient(circle, rgba(59, 130, 246, 0.12) 0%, transparent 70%)',
          zIndex: -1 
        }} />
        
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <h1 style={{ fontSize: '5rem', fontWeight: 800, lineHeight: 1.1, marginBottom: '24px', letterSpacing: '-0.03em' }}>
            Create invoices in <span style={{ color: 'var(--accent-color)' }}>60 seconds.</span> <br/>
            Not 10 minutes.
          </h1>
          <p style={{ fontSize: '1.4rem', color: 'var(--text-secondary)', maxWidth: '800px', margin: '0 auto 48px', lineHeight: 1.6 }}>
            AI writes your invoice descriptions, fills line items, and helps you get paid faster — without spreadsheets or templates.
          </p>
          <div style={{ display: 'flex', gap: '20px', justifyContent: 'center' }}>
            <button onClick={() => navigate('/register')} className="btn-primary" style={{ padding: '18px 40px', fontSize: '1.1rem', display: 'flex', alignItems: 'center', gap: '12px', boxShadow: '0 10px 25px -5px rgba(59, 130, 246, 0.4)' }}>
              Create Your First Invoice <ArrowRight size={20} />
            </button>
            <button onClick={() => {
               document.getElementById('demo')?.scrollIntoView({ behavior: 'smooth' });
            }} className="btn-ghost" style={{ padding: '18px 40px', fontSize: '1.1rem', border: '1px solid var(--glass-border)' }}>
              See How It Works
            </button>
          </div>
        </motion.div>
      </section>

      {/* Problem Section */}
      <section style={{ padding: '100px 8%', background: 'rgba(255, 255, 255, 0.01)' }}>
        <div style={{ maxWidth: '1000px', margin: '0 auto', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '80px', alignItems: 'center' }}>
          <div>
            <h2 style={{ fontSize: '3rem', marginBottom: '24px', fontWeight: 700 }}>Invoicing steals time from real work.</h2>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
               {[
                 "Writing the same invoice descriptions again and again",
                 "Manually copying data into templates",
                 "Forgetting to follow up on unpaid invoices",
                 "Switching between tools just to get paid"
               ].map((item, i) => (
                 <div key={i} style={{ display: 'flex', gap: '16px', alignItems: 'center' }}>
                   <div style={{ width: '24px', height: '24px', background: 'rgba(239, 68, 68, 0.1)', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                     <div style={{ width: '8px', height: '8px', background: 'var(--error-color)', borderRadius: '50%' }} />
                   </div>
                   <p style={{ fontSize: '1.1rem', color: 'var(--text-secondary)' }}>{item}</p>
                 </div>
               ))}
            </div>
            <blockquote style={{ marginTop: '40px', paddingLeft: '24px', borderLeft: '3px solid var(--accent-color)', fontStyle: 'italic', color: 'var(--accent-color)', fontSize: '1.25rem' }}>
              "None of this makes you more money."
            </blockquote>
          </div>
          <div className="glass-card" style={{ height: '400px', background: 'rgba(239, 68, 68, 0.03)', borderColor: 'rgba(239, 68, 68, 0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
             <Clock size={120} style={{ opacity: 0.1, color: 'var(--error-color)' }} />
          </div>
        </div>
      </section>

      {/* Solution Section */}
      <section id="demo" style={{ padding: '120px 8%' }}>
        <div style={{ textAlign: 'center', marginBottom: '80px' }}>
          <h2 style={{ fontSize: '3.5rem', marginBottom: '16px' }}>Your invoices, written for you.</h2>
          <p style={{ color: 'var(--text-secondary)', fontSize: '1.2rem' }}>No buzzwords. Just outcomes.</p>
        </div>
        
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '40px' }}>
          <div className="glass-card" style={{ padding: '48px' }}>
            <div style={{ width: '48px', height: '48px', background: 'rgba(124, 58, 237, 0.1)', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '32px' }}>
              <Sparkles color="#7c3aed" />
            </div>
            <h3 style={{ fontSize: '1.5rem', marginBottom: '16px' }}>1. Describe the work. That’s it.</h3>
            <p style={{ color: 'var(--text-secondary)', lineHeight: 1.6, fontSize: '1.1rem' }}>
              Type a short sentence like "Spent 5 hours on logo design." AI turns it into clean, professional line items.
            </p>
          </div>
          <div className="glass-card" style={{ padding: '48px' }}>
            <div style={{ width: '48px', height: '48px', background: 'rgba(59, 130, 246, 0.1)', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '32px' }}>
              <Zap color="#3b82f6" />
            </div>
            <h3 style={{ fontSize: '1.5rem', marginBottom: '16px' }}>2. Send polished invoices instantly</h3>
            <p style={{ color: 'var(--text-secondary)', lineHeight: 1.6, fontSize: '1.1rem' }}>
              Generate beautiful, high-quality PDFs and email them directly to your clients in one click.
            </p>
          </div>
          <div className="glass-card" style={{ padding: '48px' }}>
            <div style={{ width: '48px', height: '48px', background: 'rgba(16, 185, 129, 0.1)', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '32px' }}>
              <Mail color="#10b981" />
            </div>
            <h3 style={{ fontSize: '1.5rem', marginBottom: '16px' }}>3. Follow up without awkward emails</h3>
            <p style={{ color: 'var(--text-secondary)', lineHeight: 1.6, fontSize: '1.1rem' }}>
              AI drafts polite, professional reminders when invoices are overdue, so you don't have to.
            </p>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section style={{ padding: '100px 8%', background: '#0a0a0a', textAlign: 'center' }}>
        <h2 style={{ fontSize: '2.5rem', marginBottom: '64px' }}>How it works</h2>
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '40px', maxWidth: '1000px', margin: '0 auto', flexWrap: 'wrap' }}>
          <div style={{ flex: '1', minWidth: '200px' }}>
            <div style={{ fontSize: '3rem', fontWeight: 800, color: 'var(--glass-border)', marginBottom: '16px' }}>01</div>
            <p style={{ fontSize: '1.1rem' }}>Describe the work in one sentence</p>
          </div>
          <ChevronRight size={32} style={{ color: 'var(--glass-border)' }} />
          <div style={{ flex: '1', minWidth: '200px' }}>
            <div style={{ fontSize: '3rem', fontWeight: 800, color: 'var(--glass-border)', marginBottom: '16px' }}>02</div>
            <p style={{ fontSize: '1.1rem' }}>Review AI-generated line items</p>
          </div>
          <ChevronRight size={32} style={{ color: 'var(--glass-border)' }} />
          <div style={{ flex: '1', minWidth: '200px' }}>
            <div style={{ fontSize: '3rem', fontWeight: 800, color: 'var(--accent-color)', marginBottom: '16px' }}>03</div>
            <p style={{ fontSize: '1.1rem', fontWeight: 600 }}>Send invoice & get paid</p>
          </div>
        </div>
      </section>

      {/* Trust Section */}
      <section style={{ padding: '100px 8%', textAlign: 'center' }}>
        <h2 style={{ fontSize: '2.5rem', marginBottom: '48px' }}>Built for freelancers who bill for their time.</h2>
        <div style={{ display: 'flex', justifyContent: 'center', gap: '48px', flexWrap: 'wrap' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', color: 'var(--text-secondary)' }}>
            <CheckCircle2 size={24} color="var(--success-color)" />
            <span style={{ fontSize: '1.1rem' }}>Designed for freelancers and small teams</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', color: 'var(--text-secondary)' }}>
            <CheckCircle2 size={24} color="var(--success-color)" />
            <span style={{ fontSize: '1.1rem' }}>No accounting jargon</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', color: 'var(--text-secondary)' }}>
            <CheckCircle2 size={24} color="var(--success-color)" />
            <span style={{ fontSize: '1.1rem' }}>You’re always in control — nothing is auto-sent</span>
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section style={{ padding: '100px 8%', background: 'rgba(255, 255, 255, 0.01)' }}>
        <div style={{ textAlign: 'center', marginBottom: '64px' }}>
          <h2 style={{ fontSize: '3rem', marginBottom: '16px' }}>Simple, transparent pricing.</h2>
          <p style={{ color: 'var(--text-secondary)', fontSize: '1.2rem' }}>Cancel anytime. No hidden fees.</p>
        </div>
        
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '32px', maxWidth: '1100px', margin: '0 auto' }}>
          {pricingPlans.map((plan, i) => (
            <div 
              key={i} 
              className="glass-card" 
              style={{ 
                padding: '48px', 
                border: plan.highlight ? '2px solid var(--accent-color)' : '1px solid var(--glass-border)',
                position: 'relative',
                display: 'flex',
                flexDirection: 'column'
              }}
            >
              {plan.highlight && (
                <div style={{ position: 'absolute', top: '-16px', left: '50%', transform: 'translateX(-50%)', background: 'var(--accent-color)', color: 'white', padding: '4px 16px', borderRadius: '20px', fontSize: '0.8rem', fontWeight: 700 }}>
                  MOST POPULAR
                </div>
              )}
              <h3 style={{ fontSize: '1.5rem', marginBottom: '16px' }}>{plan.name}</h3>
              <div style={{ marginBottom: '32px' }}>
                <span style={{ fontSize: '3.5rem', fontWeight: 800 }}>{plan.price}</span>
                {plan.period && <span style={{ color: 'var(--text-secondary)' }}>{plan.period}</span>}
              </div>
              <div style={{ flex: 1, marginBottom: '40px' }}>
                {plan.features.map((f, j) => (
                  <div key={j} style={{ display: 'flex', gap: '12px', alignItems: 'center', marginBottom: '12px', color: 'var(--text-secondary)' }}>
                    <Plus size={14} />
                    <span>{f}</span>
                  </div>
                ))}
              </div>
              <button 
                onClick={() => !plan.disabled && navigate('/register')} 
                className={plan.highlight ? "btn-primary" : "btn-ghost"}
                style={{ width: '100%', padding: '14px', border: plan.highlight ? 'none' : '1px solid var(--glass-border)' }}
                disabled={plan.disabled}
              >
                {plan.btnText}
              </button>
            </div>
          ))}
        </div>
      </section>

      {/* FAQ Section */}
      <section style={{ padding: '100px 8%', maxWidth: '800px', margin: '0 auto' }}>
        <h2 style={{ fontSize: '2.5rem', marginBottom: '48px', textAlign: 'center' }}>Frequently Asked Questions</h2>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '32px' }}>
          {faqs.map((faq, i) => (
            <div key={i}>
              <div style={{ display: 'flex', gap: '16px', marginBottom: '12px' }}>
                <HelpCircle size={24} color="var(--accent-color)" />
                <h4 style={{ fontSize: '1.25rem' }}>{faq.q}</h4>
              </div>
              <p style={{ color: 'var(--text-secondary)', paddingLeft: '40px', lineHeight: 1.6 }}>{faq.a}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Final CTA */}
      <section style={{ padding: '120px 8%', textAlign: 'center' }}>
        <div className="glass-card" style={{ 
          padding: '80px 40px', 
          background: 'linear-gradient(135deg, rgba(59, 130, 246, 0.1) 0%, rgba(124, 58, 237, 0.15) 100%)',
          border: '1px solid rgba(255, 255, 255, 0.1)',
          maxWidth: '1000px',
          margin: '0 auto'
        }}>
          <h2 style={{ fontSize: '3.5rem', marginBottom: '24px', fontWeight: 800 }}>Stop wasting time on invoices.</h2>
          <p style={{ fontSize: '1.3rem', color: 'var(--text-secondary)', maxWidth: '600px', margin: '0 auto 48px' }}>
            Takes less than a minute to create your first one.
          </p>
          <button onClick={() => navigate('/register')} className="btn-primary" style={{ padding: '20px 64px', fontSize: '1.25rem', boxShadow: '0 15px 35px -5px rgba(59, 130, 246, 0.5)' }}>
            Create Your First Invoice Now
          </button>
        </div>
      </section>

      {/* Footer */}
      <footer style={{ padding: '64px 8%', borderTop: '1px solid var(--glass-border)', textAlign: 'center' }}>
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '8px', marginBottom: '24px' }}>
          <FileText size={20} color="var(--accent-color)" />
          <span style={{ fontSize: '1.2rem', fontWeight: 800 }}>Micro</span>
        </div>
        <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>
          &copy; 2025 Micro Invoicing. All rights reserved. <br/>
          Built for freelancers who value their time.
        </p>
      </footer>
    </div>
  );
}
