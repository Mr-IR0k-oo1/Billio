import { FileText, Github, Twitter, Linkedin } from 'lucide-react';
import { Link } from 'react-router-dom';

export const Footer = () => (
  <footer className="py-20 bg-black border-t border-white/5">
    <div className="home-container">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-16">
        <div className="col-span-1 md:col-span-2">
          <Link to="/" className="flex items-center gap-3 mb-6 group">
            <div className="w-10 h-10 bg-blue-500 rounded-xl flex items-center justify-center shadow-lg shadow-blue-500/20 group-hover:scale-110 transition-transform">
                <FileText size={20} className="text-white" />
            </div>
            <span className="text-white text-2xl font-black tracking-tight font-[Outfit] group-hover:text-blue-500 transition-colors">Billio</span>
          </Link>
          <p className="text-gray-500 max-w-sm mb-8 leading-relaxed">
            Professional invoicing for modern freelancers. 
            Sent in seconds, paid in minutes.
          </p>
          <div className="flex gap-4">
            <a href="#" className="w-10 h-10 rounded-lg bg-white/5 flex items-center justify-center text-gray-500 hover:text-white hover:bg-white/10 transition-all border border-white/5">
              <Twitter size={18} />
            </a>
            <a href="#" className="w-10 h-10 rounded-lg bg-white/5 flex items-center justify-center text-gray-500 hover:text-white hover:bg-white/10 transition-all border border-white/5">
              <Github size={18} />
            </a>
            <a href="#" className="w-10 h-10 rounded-lg bg-white/5 flex items-center justify-center text-gray-500 hover:text-white hover:bg-white/10 transition-all border border-white/5">
              <Linkedin size={18} />
            </a>
          </div>
        </div>
        
        <div>
          <h4 className="text-white font-bold mb-6">Product</h4>
          <ul className="space-y-4 text-sm">
            <li><a href="#features" className="text-gray-500 hover:text-blue-500 transition-colors">Features</a></li>
            <li><a href="#pricing" className="text-gray-500 hover:text-blue-500 transition-colors">Pricing</a></li>
            <li><a href="#testimonials" className="text-gray-500 hover:text-blue-500 transition-colors">Testimonials</a></li>
            <li><a href="#faq" className="text-gray-500 hover:text-blue-500 transition-colors">FAQ</a></li>
          </ul>
        </div>

        <div>
           <h4 className="text-white font-bold mb-6">Legal</h4>
           <ul className="space-y-4 text-sm">
             <li><a href="#" className="text-gray-500 hover:text-blue-500 transition-colors">Privacy Policy</a></li>
             <li><a href="#" className="text-gray-500 hover:text-blue-500 transition-colors">Terms of Service</a></li>
             <li><a href="#" className="text-gray-500 hover:text-blue-500 transition-colors">Cookie Policy</a></li>
             <li><a href="#" className="text-gray-500 hover:text-blue-500 transition-colors">Security</a></li>
           </ul>
        </div>
      </div>
      
      <div className="pt-8 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-4">
        <p className="text-gray-600 text-xs tracking-widest uppercase font-mono">
          © {new Date().getFullYear()} Billio. All rights reserved.
        </p>
        <div className="flex items-center gap-6">
            <span className="text-[10px] text-gray-700 font-bold uppercase tracking-widest">Built with love for freelancers</span>
        </div>
      </div>
    </div>
  </footer>
);
