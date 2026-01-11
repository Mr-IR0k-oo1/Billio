import { FileText } from 'lucide-react';

export const Footer = () => (
  <footer className="footer bg-black">
    <div className="home-container flex flex-col md:flex-row justify-between items-center gap-8">
      <div className="flex items-center gap-2">
        <div className="w-6 h-6 bg-blue-500 rounded flex items-center justify-center">
            <FileText size={14} className="text-white" />
        </div>
        <span className="text-white font-bold font-[Outfit]">Billio</span>
        <span className="text-gray-600 mx-2">|</span>
        <span className="text-gray-500 text-sm">Invoices, done faster.</span>
      </div>
      <div className="flex gap-8 text-sm text-gray-500">
        <a href="#" className="hover:text-white transition-colors">Privacy</a>
        <a href="#" className="hover:text-white transition-colors">Terms</a>
        <a href="#" className="hover:text-white transition-colors">Contact</a>
        <a href="#pricing" className="hover:text-white transition-colors">Pricing</a>
      </div>
      <div className="text-gray-600 text-sm">
        © {new Date().getFullYear()} Billio
      </div>
    </div>
  </footer>
);
