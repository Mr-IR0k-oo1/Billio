import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { 
  LayoutDashboard, 
  Users, 
  Package, 
  FileText, 
  LogOut,
  PlusCircle
} from 'lucide-react';

const Sidebar = () => {
  const location = useLocation();
  
  const links = [
    { to: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { to: '/invoices', label: 'Invoices', icon: FileText },
    { to: '/clients', label: 'Clients', icon: Users },
    { to: '/products', label: 'Products', icon: Package },
  ];

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    window.location.href = '/login';
  };

  return (
    <aside className="sidebar">
      <div className="brand">
        <h2 style={{ color: 'var(--accent-color)', marginBottom: '8px' }}>Billio</h2>
        <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>Intelligent Invoicing</p>
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
              <Icon size={20} />
              <span>{link.label}</span>
            </Link>
          );
        })}
      </nav>

      <div style={{ marginTop: 'auto' }}>
        <Link to="/invoices/new" className="nav-link" style={{ background: 'var(--glass)', color: 'var(--accent-color)', marginBottom: '12px' }}>
          <PlusCircle size={20} />
          <span>New Invoice</span>
        </Link>
        <button 
          className="nav-link" 
          onClick={handleLogout}
          style={{ width: '100%', border: 'none', background: 'none', cursor: 'pointer', textAlign: 'left' }}
        >
          <LogOut size={20} />
          <span>Logout</span>
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
          <div style={{
            position: 'fixed',
            top: '20px',
            right: '20px',
            background: 'linear-gradient(135deg, #f59e0b, #ef4444)',
            color: 'white',
            padding: '8px 16px',
            borderRadius: '20px',
            fontSize: '0.85rem',
            fontWeight: '600',
            zIndex: 1000,
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            boxShadow: '0 4px 12px rgba(239, 68, 68, 0.3)'
          }}>
            🔥 Demo Mode
          </div>
        )}
        {children}
      </main>
    </div>
  );
};
