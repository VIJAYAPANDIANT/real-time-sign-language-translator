import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { Settings, History, Video, LogOut, LogIn, UserPlus } from 'lucide-react';
import './Navbar.css';

export function Navbar() {
  const location = useLocation();
  const navigate = useNavigate();
  const { isAuthenticated, logout } = useAuth();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <nav className="navbar glass-panel">
      <div className="navbar-container">
        <Link to="/" className="navbar-brand">
          <div className="navbar-logo">
            <span className="logo-text">SignLang AI</span>
            <span className="logo-dot"></span>
          </div>
        </Link>

        <div className="navbar-links">
          {isAuthenticated ? (
            <>
              <Link 
                to="/translate" 
                className={`nav-link ${location.pathname === '/translate' ? 'active' : ''}`}
              >
                <Video size={18} />
                <span>Studio</span>
              </Link>
              <Link 
                to="/history" 
                className={`nav-link ${location.pathname === '/history' ? 'active' : ''}`}
              >
                <History size={18} />
                <span>History</span>
              </Link>
              <Link 
                to="/settings" 
                className={`nav-link ${location.pathname === '/settings' ? 'active' : ''}`}
              >
                <Settings size={18} />
                <span>Settings</span>
              </Link>
              <button onClick={handleLogout} className="nav-link btn-logout">
                <LogOut size={18} />
                <span>Logout</span>
              </button>
            </>
          ) : (
            <>
              <Link 
                to="/login" 
                className="btn btn-outline"
              >
                <LogIn size={18} />
                <span>Sign In</span>
              </Link>
              <Link 
                to="/signup" 
                className="btn btn-primary"
              >
                <UserPlus size={18} />
                <span>Sign Up</span>
              </Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
}
