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
  Repeat,
  Search,
  Bell,
  ChevronRight,
  User
} from 'lucide-react';

const TopBar = () => {
  const [isScrolled, setIsScrolled] = React.useState(false);
  const location = useLocation();
  const path = location.pathname.split('/').filter(Boolean);
  const userJson = localStorage.getItem('user');
  const user = userJson ? JSON.parse(userJson) : { email: 'user@billio.com' };

  React.useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <header className={`topbar transition-all duration-500 ${isScrolled ? 'scrolled' : ''}`}>
      <div className="flex items-center gap-1.5 text-[10px] uppercase tracking-[0.15em] font-bold text-muted-foreground/60">
        <span className="hover:text-white cursor-pointer transition-colors">Workspace</span>
        {path.map((p, i) => (
          <React.Fragment key={p}>
            <ChevronRight size={10} className="text-muted-foreground/30" />
            <span className={`capitalize ${i === path.length - 1 ? 'text-white' : 'hover:text-white cursor-pointer transition-colors'}`}>
              {p.replace('-', ' ')}
            </span>
          </React.Fragment>
        ))}
      </div>

      <div className="flex items-center gap-8 ml-auto">
        <div className="relative group hidden md:block">
          <Search size={14} className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground/40 group-focus-within:text-white transition-colors" />
          <input 
            type="text" 
            placeholder="Search anything..." 
            className="w-72 bg-white/[0.03] border border-white/[0.05] rounded-xl pl-11 pr-4 py-2.5 text-xs focus:bg-white/[0.05] focus:border-white/10 transition-all outline-none placeholder:text-muted-foreground/30"
          />
        </div>

        <button className="relative p-2 text-muted-foreground/60 hover:text-white transition-colors group">
          <Bell size={18} />
          <span className="absolute top-2 right-2 w-1.5 h-1.5 bg-white rounded-full border border-background group-hover:scale-110 transition-transform"></span>
        </button>

        <div className="flex items-center gap-4 pl-4 border-l border-white/[0.05]">
          <div className="text-right hidden sm:block">
            <p className="text-xs font-semibold text-white leading-tight">{user.email.split('@')[0]}</p>
            <p className="text-[9px] text-muted-foreground/40 uppercase tracking-wider font-bold">Premium</p>
          </div>
          <div className="w-10 h-10 rounded-xl bg-white/[0.03] border border-white/[0.05] flex items-center justify-center hover:bg-white/[0.05] transition-colors cursor-pointer group">
            <User size={18} className="text-muted-foreground group-hover:text-white transition-colors" />
          </div>
        </div>
      </div>
    </header>
  );
};

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
        <h2 className="text-2xl font-bold tracking-tight text-white mb-1.5">Billio<span className="text-white/40">.</span></h2>
        <p className="text-[9px] tracking-[0.3em] uppercase text-muted-foreground/40 font-bold">Standard of Excellence</p>
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

      <div className="mt-auto space-y-3">
        <Link to="/invoices/new" className="flex items-center gap-3 px-5 py-3.5 rounded-xl bg-white text-black hover:bg-white/90 transition-all duration-500 shadow-xl shadow-white/5 group">
          <PlusCircle size={18} className="group-hover:rotate-90 transition-transform duration-500" />
          <span className="text-sm font-bold">Create New</span>
        </Link>
        <button 
          className="nav-link w-full text-left" 
          onClick={handleLogout}
        >
          <LogOut size={18} />
          <span className="text-sm">Sign Out</span>
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
        <TopBar />
        {/* Demo Mode Indicator */}
        {isDemo && (
          <div className="fixed top-[5.5rem] right-8 px-4 py-2 bg-gradient-to-r from-amber-500 to-orange-600 text-white rounded-full text-[10px] font-bold shadow-lg shadow-orange-500/20 flex items-center gap-2 z-[100] animate-in fade-in slide-in-from-top-4 duration-500 ring-1 ring-white/20">
            <span className="relative flex h-1.5 w-1.5">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-white opacity-75"></span>
              <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-white"></span>
            </span>
            DEMO ENVIRONMENT
          </div>
        )}
        <div className="max-w-6xl mx-auto pt-4">
          {children}
        </div>
      </main>
    </div>
  );
};
