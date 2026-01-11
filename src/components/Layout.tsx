import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { 
  LayoutDashboard, 
  Users, 
  Package, 
  FileText, 
  LogOut,
  PlusCircle,
  BarChart3,
  FileSpreadsheet,
  Settings as SettingsIcon,
  Repeat
} from 'lucide-react';

const Sidebar = () => {
  const location = useLocation();
  
  const links = [
    { to: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { to: '/invoices', label: 'Invoices', icon: FileText },
    { to: '/estimates', label: 'Estimates', icon: FileSpreadsheet },
    { to: '/recurring', label: 'Recurring', icon: Repeat },
    { to: '/clients', label: 'Clients', icon: Users },
    { to: '/products', label: 'Products', icon: Package },
    { to: '/reports', label: 'Reports', icon: BarChart3 },
    { to: '/settings', label: 'Settings', icon: SettingsIcon },
  ];

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    window.location.href = '/login';
  };

  return (
    <aside className="sidebar">
      <div className="brand px-4">
        <h2 className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-purple-400 mb-1">Billio</h2>
        <p className="text-[10px] tracking-[0.2em] uppercase text-muted-foreground font-semibold">Intelligent Invoicing</p>
      </div>
      
      <nav className="nav-links">
        {links.map((link) => {
          const Icon = link.icon;
          const isActive = location.pathname === link.to;
          return (
            <Link 
              key={link.to} 
              to={link.to} 
              className={`nav-link ${isActive ? 'active' : ''}`}
            >
              <Icon size={18} />
              <span className="text-sm">{link.label}</span>
            </Link>
          );
        })}
      </nav>

      <div className="mt-auto space-y-2">
        <Link to="/invoices/new" className="nav-link bg-blue-500/10 text-blue-400 border border-blue-500/20 hover:bg-blue-500/20">
          <PlusCircle size={18} />
          <span className="text-sm font-medium">New Invoice</span>
        </Link>
        <button 
          className="nav-link w-full text-left" 
          onClick={handleLogout}
        >
          <LogOut size={18} />
          <span className="text-sm">Logout</span>
        </button>
      </div>
    </aside>
  );
};

export const Layout = ({ children }: { children: React.ReactNode }) => {
  const isDemo = localStorage.getItem('token')?.startsWith('demo-token-');
  
  return (
    <div className="layout">
      <Sidebar />
      <main className="main-content">
        {/* Demo Mode Indicator */}
        {isDemo && (
          <div className="fixed top-6 right-6 px-4 py-2 bg-gradient-to-r from-amber-500 to-orange-600 text-white rounded-full text-xs font-bold shadow-lg shadow-orange-500/20 flex items-center gap-2 z-[100] animate-in fade-in slide-in-from-top-4 duration-500">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-white opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-white"></span>
            </span>
            DEMO MODE
          </div>
        )}
        <div className="max-w-6xl mx-auto">
          {children}
        </div>
      </main>
    </div>
  );
};
