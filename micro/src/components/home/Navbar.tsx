import { Link } from 'react-router-dom';
import { FileText } from 'lucide-react';

export const Navbar = () => (
  <nav className="home-container flex justify-between items-center py-6">
    <div className="text-2xl font-bold font-[Outfit] text-white flex items-center gap-2">
      <div className="w-8 h-8 bg-blue-500 rounded-lg flex items-center justify-center">
        <FileText size={20} className="text-white" />
      </div>
      Billio
    </div>
    <div className="hidden md:flex gap-8 text-gray-400 text-sm font-medium">
      <a href="#how-it-works" className="hover:text-white transition-colors">How it Works</a>
      <a href="#pricing" className="hover:text-white transition-colors">Pricing</a>
      <a href="#faq" className="hover:text-white transition-colors">FAQ</a>
    </div>
    <div className="flex gap-4">
      <Link to="/login" className="px-4 py-2 text-sm font-medium text-gray-300 hover:text-white transition-colors">
        Log in
      </Link>
      <Link to="/register" className="px-4 py-2 text-sm font-medium bg-white text-black rounded-lg hover:bg-gray-100 transition-colors">
        Get Started
      </Link>
    </div>
  </nav>
);
