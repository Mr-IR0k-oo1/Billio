import { Github, Twitter, Linkedin, Mail, NotepadTextDashed } from 'lucide-react';
import { ModernAnimatedFooter } from '../ui/modern-animated-footer';

export const Footer = () => {
  const socialLinks = [
    {
      icon: <Twitter className="w-6 h-6" />,
      href: "#",
      label: "Twitter",
    },
    {
      icon: <Linkedin className="w-6 h-6" />,
      href: "#",
      label: "LinkedIn",
    },
    {
      icon: <Github className="w-6 h-6" />,
      href: "#",
      label: "GitHub",
    },
    {
      icon: <Mail className="w-6 h-6" />,
      href: "mailto:support@billio.ai",
      label: "Email",
    },
  ];

  const navLinks = [
    { label: "Features", href: "#features" },
    { label: "Pricing", href: "#pricing" },
    { label: "Testimonials", href: "#testimonials" },
    { label: "FAQ", href: "#faq" },
    { label: "Terms", href: "#" },
    { label: "Privacy", href: "#" },
  ];

  return (
    <ModernAnimatedFooter
      brandName="Billio"
      brandDescription="AI-powered invoicing for modern freelancers. Stop wasting hours on admin and get your time back."
      socialLinks={socialLinks}
      navLinks={navLinks}
      brandIcon={<NotepadTextDashed className="w-8 sm:w-10 md:w-14 h-8 sm:h-10 md:h-14 text-background drop-shadow-lg" />}
    />
  );
};
