import React from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import { FaRocket, FaUserAstronaut } from 'react-icons/fa';
import './Navbar.css';

const Navbar = () => {
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const isActive = (path) => {
    if (path === '/') {
      return location.pathname === '/';
    }
    return location.pathname.startsWith(path);
  };

  return (
    <nav className="navbar">
      <svg width="0" height="0" style={{ position: 'absolute' }}>
        <defs>
          <linearGradient id="logoGradient" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#667eea" />
            <stop offset="100%" stopColor="#f093fb" />
          </linearGradient>
        </defs>
      </svg>
      <div className="container">
        <div className="nav-content">
          <Link to="/" className="nav-logo">
            <span className="logo-icon">
              <FaRocket style={{ fill: 'url(#logoGradient)' }} />
            </span>
            <span>Beyond Earth</span>
          </Link>
          
          <div className="nav-links">
            <div className="nav-links-main">
              <Link to="/" className={isActive('/') && location.pathname === '/' ? 'active' : ''}>Home</Link>
              <Link to="/activities" className={isActive('/activities') ? 'active' : ''}>Activities</Link>
              {!user && <Link to="/contact" className={isActive('/contact') ? 'active' : ''}>Contact Us</Link>}
            </div>
            
            {user ? (
              <>
                <div className="nav-links-main">
                  <Link to="/booking" className={isActive('/booking') ? 'active' : ''}>Book Trip</Link>
                  <Link to="/dashboard" className={isActive('/dashboard') ? 'active' : ''}>Dashboard</Link>
                  {user.role === 'admin' && (
                    <Link to="/admin" className={isActive('/admin') ? 'active' : ''}>Admin</Link>
                  )}
                  <Link to="/subscription" className={isActive('/subscription') ? 'active' : ''}>Subscription</Link>
                  {user.subscription?.isActive && (
                    <Link to="/premium-content" className={isActive('/premium-content') ? 'active' : ''}>Premium</Link>
                  )}
                  <Link to="/contact" className={isActive('/contact') ? 'active' : ''}>Contact Us</Link>
                </div>
                <span className="nav-user">
                  <FaUserAstronaut style={{ marginRight: '6px' }} />
                  {user.name}
                </span>
                <button onClick={handleLogout} className="btn btn-outline">Logout</button>
              </>
            ) : (
              <div className="nav-links-auth">
                <Link to="/login" className={isActive('/login') ? 'active' : ''}>Login</Link>
                <Link to="/register" className={isActive('/register') ? 'active' : ''}>
                  <button className="btn btn-primary">Sign Up</button>
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;

