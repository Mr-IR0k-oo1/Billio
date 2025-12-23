import { useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Sparkles, 
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
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import Plasma from './Plasma';
gsap.registerPlugin(ScrollTrigger);

export default function LandingPage() {
  const navigate = useNavigate();
  const rootRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Reveal animations for sections
      const sections = document.querySelectorAll('section');
      sections.forEach((section) => {
        gsap.fromTo(section, 
          { opacity: 0, y: 50 },
          { 
            opacity: 1, 
            y: 0, 
            duration: 1,
            scrollTrigger: {
              trigger: section,
              start: 'top 80%',
              end: 'bottom 20%',
              toggleActions: 'play none none reverse'
            }
          }
        );
      });

      // Special animation for pricing cards
      gsap.from('.pricing-card', {
        scale: 0.9,
        opacity: 0,
        y: 30,
        stagger: 0.2,
        duration: 0.8,
        ease: 'power3.out',
        scrollTrigger: {
          trigger: '.pricing-grid',
          start: 'top 75%'
        }
      });
    }, rootRef);

    return () => ctx.revert();
  }, []);

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
      a: "No. Billio is built specifically for invoicing—making it as fast and simple as possible without the bloat of full accounting suites."
    },
    {
      q: "Can I export my invoices?",
      a: "Absolutely. Every invoice can be downloaded as a professional PDF or sent directly via email."
    }
  ];

  return (
    <div ref={rootRef} style={{ color: 'var(--text-primary)', minHeight: '100%', scrollBehavior: 'smooth', background: 'transparent' }}>

      {/* Navbar */}
      <nav style={{ 
        display: 'flex', 
        justifyContent: 'space-between', 
        alignItems: 'center', 
        padding: '20px 8%',
        background: 'transparent',
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        zIndex: 100
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <div style={{ width: '32px', height: '32px', background: 'var(--accent-color)', borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <FileText size={18} color="white" />
          </div>
          <span style={{ fontSize: '1.5rem', fontWeight: 800, fontFamily: 'Outfit' }}>Billio</span>
        </div>
        <div style={{ display: 'flex', gap: '24px', alignItems: 'center' }}>
          <button onClick={() => navigate('/login')} className="btn-ghost" style={{ fontSize: '0.9rem' }}>Sign In</button>
          <button onClick={() => navigate('/register')} className="btn-primary" style={{ padding: '8px 20px', fontSize: '0.9rem' }}>Get Started</button>
        </div>
      </nav>

      {/* Hero Section */}
      <section style={{ 
        height: '100vh', 
        display: 'flex', 
        flexDirection: 'column', 
        justifyContent: 'center', 
        alignItems: 'center', 
        padding: '0 8%', 
        textAlign: 'center', 
        position: 'relative', 
        overflow: 'hidden', 
        background: 'transparent'
      }}>
        <Plasma color="#3b82f6" opacity={0.3} className="hero-background" />


        
        <motion.div
          style={{ position: 'relative', zIndex: 1 }}
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1, ease: "easeOut" }}
        >
          <h1 style={{ fontSize: 'max(4rem, 6vw)', fontWeight: 800, lineHeight: 1.1, marginBottom: '24px', letterSpacing: '-0.03em' }}>
            Create invoices in <span style={{ color: 'var(--accent-color)', textShadow: '0 0 20px rgba(59, 130, 246, 0.4)' }}>60 seconds.</span> <br/>
            Not 10 minutes.
          </h1>
          <p style={{ fontSize: '1.4rem', color: 'var(--text-secondary)', maxWidth: '800px', margin: '0 auto 48px', lineHeight: 1.6 }}>
            AI writes your invoice descriptions, fills line items, and helps you get paid faster — without spreadsheets or templates.
          </p>
          <div style={{ display: 'flex', gap: '20px', justifyContent: 'center' }}>
            <button onClick={() => navigate('/register')} className="btn-primary" style={{ padding: '20px 48px', fontSize: '1.2rem', display: 'flex', alignItems: 'center', gap: '12px', boxShadow: '0 10px 40px -10px rgba(59, 130, 246, 0.5)' }}>
              Create Your First Invoice <ArrowRight size={20} />
            </button>
            <button onClick={() => {
               document.getElementById('demo')?.scrollIntoView({ behavior: 'smooth' });
            }} className="btn-ghost" style={{ padding: '20px 48px', fontSize: '1.2rem', border: '1px solid var(--glass-border)', background: 'rgba(255,255,255,0.05)' }}>
              See How It Works
            </button>
          </div>
        </motion.div>
      </section>

      {/* Problem Section */}
      <section style={{ padding: '120px 8%', position: 'relative' }}>
        <div style={{ maxWidth: '1000px', margin: '0 auto', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))', gap: '80px', alignItems: 'center' }}>
          <div>
            <h2 style={{ fontSize: '3rem', marginBottom: '24px', fontWeight: 700 }}>Invoicing steals time from real work.</h2>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
               {[
                 "Writing the same invoice descriptions again and again",
                 "Manually copying data into templates",
                 "Forgetting to follow up on unpaid invoices",
                 "Switching between tools just to get paid"
               ].map((item, i) => (
                 <div key={i} className="problem-item" style={{ display: 'flex', gap: '16px', alignItems: 'center' }}>
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
          <div className="glass-card" style={{ height: '400px', background: 'rgba(255, 255, 255, 0.03)', display: 'flex', alignItems: 'center', justifyContent: 'center', borderRadius: '24px' }}>
             <Clock size={160} style={{ opacity: 0.1, color: 'var(--accent-color)' }} />
          </div>
        </div>
      </section>

      {/* Solution Section */}
      <section id="demo" style={{ padding: '140px 8%' }}>
        <div style={{ textAlign: 'center', marginBottom: '80px' }}>
          <h2 style={{ fontSize: '3.5rem', marginBottom: '16px' }}>Your invoices, written for you.</h2>
          <p style={{ color: 'var(--text-secondary)', fontSize: '1.2rem' }}>No buzzwords. Just outcomes.</p>
        </div>
        
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '40px' }}>
          {[
            { icon: <Sparkles color="#7c3aed" />, title: "1. Describe the work. That’s it.", desc: "Type a short sentence like \"Spent 5 hours on logo design.\" AI turns it into clean, professional line items.", bg: "rgba(124, 58, 237, 0.05)" },
            { icon: <Zap color="#3b82f6" />, title: "2. Send polished invoices instantly", desc: "Generate beautiful, high-quality PDFs and email them directly to your clients in one click.", bg: "rgba(59, 130, 246, 0.05)" },
            { icon: <Mail color="#10b981" />, title: "3. Follow up without awkward emails", desc: "AI drafts polite, professional reminders when invoices are overdue, so you don't have to.", bg: "rgba(16, 185, 129, 0.05)" }
          ].map((item, i) => (
            <motion.div 
              key={i}
              whileHover={{ y: -10, background: 'rgba(255,255,255,0.05)' }}
              className="glass-card" 
              style={{ padding: '48px', borderRadius: '24px', border: '1px solid var(--glass-border)', background: item.bg }}
            >
              <div style={{ width: '64px', height: '64px', background: 'rgba(255,255,255,0.05)', borderRadius: '16px', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '32px' }}>
                {item.icon}
              </div>
              <h3 style={{ fontSize: '1.5rem', marginBottom: '16px' }}>{item.title}</h3>
              <p style={{ color: 'var(--text-secondary)', lineHeight: 1.6, fontSize: '1.1rem' }}>{item.desc}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* How It Works */}
      <section style={{ padding: '120px 8%', background: 'transparent', textAlign: 'center' }}>
        <h2 style={{ fontSize: '2.5rem', marginBottom: '64px' }}>How it works</h2>
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '40px', maxWidth: '1000px', margin: '0 auto', flexWrap: 'wrap' }}>
          <div style={{ flex: '1', minWidth: '200px' }}>
            <div style={{ fontSize: '3.5rem', fontWeight: 800, color: 'var(--accent-color)', opacity: 0.3, marginBottom: '16px' }}>01</div>
            <p style={{ fontSize: '1.1rem', fontWeight: 500 }}>Describe the work in one sentence</p>
          </div>
          <ChevronRight size={32} style={{ color: 'var(--glass-border)' }} />
          <div style={{ flex: '1', minWidth: '200px' }}>
            <div style={{ fontSize: '3.5rem', fontWeight: 800, color: 'var(--accent-color)', opacity: 0.3, marginBottom: '16px' }}>02</div>
            <p style={{ fontSize: '1.1rem', fontWeight: 500 }}>Review AI-generated line items</p>
          </div>
          <ChevronRight size={32} style={{ color: 'var(--accent-color)' }} />
          <div style={{ flex: '1', minWidth: '200px' }}>
            <div style={{ fontSize: '3.5rem', fontWeight: 800, color: 'var(--accent-color)', marginBottom: '16px' }}>03</div>
            <p style={{ fontSize: '1.2rem', fontWeight: 700 }}>Send invoice & get paid</p>
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section style={{ padding: '140px 8%' }}>
        <div style={{ textAlign: 'center', marginBottom: '80px' }}>
          <h2 style={{ fontSize: '3.5rem', marginBottom: '16px' }}>Simple, transparent pricing.</h2>
          <p style={{ color: 'var(--text-secondary)', fontSize: '1.2rem' }}>Cancel anytime. No hidden fees.</p>
        </div>
        
        <div className="pricing-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '32px', maxWidth: '1100px', margin: '0 auto' }}>
          {pricingPlans.map((plan, i) => (
            <div 
              key={i} 
              className="glass-card pricing-card" 
              style={{ 
                padding: '48px', 
                borderRadius: '32px',
                border: plan.highlight ? '2px solid var(--accent-color)' : '1px solid var(--glass-border)',
                background: plan.highlight ? 'rgba(59, 130, 246, 0.03)' : 'rgba(255,255,255,0.02)',
                position: 'relative',
                display: 'flex',
                flexDirection: 'column',
                transition: 'transform 0.3s ease'
              }}
            >
              {plan.highlight && (
                <div style={{ position: 'absolute', top: '-16px', left: '50%', transform: 'translateX(-50%)', background: 'var(--accent-color)', color: 'white', padding: '6px 20px', borderRadius: '30px', fontSize: '0.9rem', fontWeight: 700, letterSpacing: '0.05em' }}>
                  MOST POPULAR
                </div>
              )}
              <h3 style={{ fontSize: '1.5rem', marginBottom: '16px' }}>{plan.name}</h3>
              <div style={{ marginBottom: '40px' }}>
                <span style={{ fontSize: '4rem', fontWeight: 800 }}>{plan.price}</span>
                {plan.period && <span style={{ color: 'var(--text-secondary)', fontSize: '1.2rem' }}>{plan.period}</span>}
              </div>
              <div style={{ flex: 1, marginBottom: '48px' }}>
                {plan.features.map((f, j) => (
                  <div key={j} style={{ display: 'flex', gap: '16px', alignItems: 'center', marginBottom: '16px', color: 'var(--text-secondary)' }}>
                    <div style={{ width: '20px', height: '20px', borderRadius: '50%', background: 'rgba(59,130,246,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                      <CheckCircle2 size={12} color="var(--accent-color)" />
                    </div>
                    <span style={{ fontSize: '1.05rem' }}>{f}</span>
                  </div>
                ))}
              </div>
              <button 
                onClick={() => !plan.disabled && navigate('/register')} 
                className={plan.highlight ? "btn-primary" : "btn-ghost"}
                style={{ width: '100%', padding: '18px', border: plan.highlight ? 'none' : '1px solid var(--glass-border)', fontSize: '1.1rem', fontWeight: 600, borderRadius: '16px' }}
                disabled={plan.disabled}
              >
                {plan.btnText}
              </button>
            </div>
          ))}
        </div>
      </section>

      {/* FAQ Section */}
      <section style={{ padding: '120px 8%', maxWidth: '900px', margin: '0 auto' }}>
        <h2 style={{ fontSize: '3rem', marginBottom: '64px', textAlign: 'center' }}>Frequently Asked Questions</h2>
        <div style={{ display: 'grid', gap: '40px' }}>
          {faqs.map((faq, i) => (
            <div key={i} className="glass-card" style={{ padding: '32px', borderRadius: '20px' }}>
              <div style={{ display: 'flex', gap: '20px', marginBottom: '16px' }}>
                <HelpCircle size={28} color="var(--accent-color)" />
                <h4 style={{ fontSize: '1.3rem', fontWeight: 600 }}>{faq.q}</h4>
              </div>
              <p style={{ color: 'var(--text-secondary)', paddingLeft: '48px', lineHeight: 1.7, fontSize: '1.1rem' }}>{faq.a}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Final CTA */}
      <section style={{ padding: '140px 8%', textAlign: 'center' }}>
        <motion.div 
          whileHover={{ scale: 1.02 }}
          className="glass-card" 
          style={{ 
            padding: '100px 60px', 
            background: 'linear-gradient(135deg, rgba(59, 130, 246, 0.15) 0%, rgba(124, 58, 237, 0.2) 100%)',
            border: '1px solid rgba(255, 255, 255, 0.1)',
            borderRadius: '48px',
            maxWidth: '1100px',
            margin: '0 auto',
            position: 'relative',
            overflow: 'hidden'
          }}
        >
          <div style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', background: 'radial-gradient(circle at center, rgba(59, 130, 246, 0.1), transparent)', pointerEvents: 'none' }} />
          <h2 style={{ fontSize: 'max(3rem, 4vw)', marginBottom: '24px', fontWeight: 800 }}>Stop wasting time on invoices.</h2>
          <p style={{ fontSize: '1.4rem', color: 'var(--text-secondary)', maxWidth: '600px', margin: '0 auto 56px' }}>
            Takes less than a minute to create your first one.
          </p>
          <button onClick={() => navigate('/register')} className="btn-primary" style={{ padding: '24px 80px', fontSize: '1.4rem', borderRadius: '20px', boxShadow: '0 20px 50px -10px rgba(59, 130, 246, 0.6)' }}>
            Create Your First Invoice Now
          </button>
        </motion.div>
      </section>

      {/* Footer */}
      <footer style={{ padding: '80px 8%', borderTop: '1px solid var(--glass-border)', textAlign: 'center', background: 'transparent' }}>
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '12px', marginBottom: '32px' }}>
          <FileText size={24} color="var(--accent-color)" />
          <span style={{ fontSize: '1.5rem', fontWeight: 800 }}>Billio</span>
        </div>
        <p style={{ color: 'var(--text-secondary)', fontSize: '1rem', lineHeight: 1.6 }}>
          &copy; 2025 Billio Invoicing. All rights reserved. <br/>
          Built for freelancers who value their time.
        </p>
      </footer>
    </div>
  );
}
