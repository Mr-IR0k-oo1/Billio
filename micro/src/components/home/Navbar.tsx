import { Link } from 'react-router-dom';
import { FileText } from 'lucide-react';

export const Navbar = () => (
  <nav className="navbar">
      <div className="home-container">
        <div className="navbar-content">
          <div className="logo">
            <div className="logo-icon">
              <FileText size={20} />
            </div>
            Billio
          </div>
          <div className="nav-links">
            <a href="#how-it-works">How it Works</a>
            <a href="#pricing">Pricing</a>
            <a href="#faq">FAQ</a>
          </div>
          <div className="nav-actions">
            <Link to="/login" className="login-link">Log in</Link>
            <Link to="/register" className="get-started-btn">Get Started</Link>
          </div>
        </div>
      </div>
    </nav>
);
