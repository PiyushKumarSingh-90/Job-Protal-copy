// Header component with navigation
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import './Header.css';

const Header = () => {
  const { user, logout, isAuthenticated, hasRole } = useAuth();
  const navigate = useNavigate();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  // Handle logout
  const handleLogout = () => {
    logout();
    navigate('/');
    setIsMenuOpen(false); // Close menu after logout
  };

  // Toggle mobile menu
  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  // Close mobile menu when clicking on a link
  const closeMenu = () => {
    setIsMenuOpen(false);
  };

  return (
    <header className="modern-header">
      <div className="container">
        <nav className="navbar">
          {/* Logo/Brand */}
          <div className="brand">
            <Link to="/" className="brand-link" onClick={closeMenu}>
              <span className="brand-red">Red</span>
              <span className="brand-hire">Hire</span>
            </Link>
          </div>

          {/* Hamburger Menu Button for Mobile */}
          <button 
            className={`hamburger ${isMenuOpen ? 'hamburger-open' : ''}`}
            onClick={toggleMenu}
            aria-label="Toggle navigation menu"
          >
            <span className="hamburger-line"></span>
            <span className="hamburger-line"></span>
            <span className="hamburger-line"></span>
          </button>

          {/* Navigation Links */}
          <div className="nav-menu">
            <Link to="/" className="nav-item" onClick={closeMenu}>
              Home
            </Link>
            <Link to="/jobs" className="nav-item" onClick={closeMenu}>
              Jobs
            </Link>
            
            {/* Show different links based on authentication and role */}
            {isAuthenticated() && hasRole('employer') && (
              <>
                <Link to="/post-job" className="nav-item" onClick={closeMenu}>
                  Post Job
                </Link>
                <Link to="/my-jobs" className="nav-item" onClick={closeMenu}>
                  My Jobs
                </Link>
              </>
            )}
            
            {isAuthenticated() && hasRole('jobseeker') && (
              <Link to="/my-applications" className="nav-item" onClick={closeMenu}>
                My Applications
              </Link>
            )}
          </div>

          {/* User Actions */}
          <div className="user-actions">
            {isAuthenticated() ? (
              <>
                <div className="user-avatar">
                  <span className="avatar-text">
                    {user?.name?.charAt(0)?.toUpperCase() || 'U'}
                  </span>
                </div>
                <button 
                  onClick={handleLogout}
                  className="btn btn-ghost btn-sm"
                >
                  Logout
                </button>
              </>
            ) : (
              <>
                <Link to="/login" className="btn btn-login" onClick={closeMenu}>
                  Login
                </Link>
                <Link to="/register" className="btn btn-register" onClick={closeMenu}>
                  Register
                </Link>
              </>
            )}
          </div>

          {/* Mobile Side Drawer */}
          <div className={`mobile-drawer ${isMenuOpen ? 'mobile-drawer-open' : ''}`}>
            <div className="mobile-drawer-overlay" onClick={closeMenu}></div>
            <div className="mobile-drawer-content">
              <div className="mobile-drawer-header">
                <h3>Navigation</h3>
                <button 
                  className="mobile-drawer-close"
                  onClick={closeMenu}
                  aria-label="Close navigation menu"
                >
                  ×
                </button>
              </div>
              
              <div className="mobile-nav-links">
                <Link to="/" className="mobile-nav-item" onClick={closeMenu}>
                  Home
                </Link>
                <Link to="/jobs" className="mobile-nav-item" onClick={closeMenu}>
                  Jobs
                </Link>
                
                {/* Show different links based on authentication and role */}
                {isAuthenticated() && hasRole('employer') && (
                  <>
                    <Link to="/post-job" className="mobile-nav-item" onClick={closeMenu}>
                      Post Job
                    </Link>
                    <Link to="/my-jobs" className="mobile-nav-item" onClick={closeMenu}>
                      My Jobs
                    </Link>
                  </>
                )}
                
                {isAuthenticated() && hasRole('jobseeker') && (
                  <Link to="/my-applications" className="mobile-nav-item" onClick={closeMenu}>
                    My Applications
                  </Link>
                )}

                {/* User Actions in Mobile Menu */}
                <div className="mobile-user-actions">
                  {isAuthenticated() ? (
                    <>
                      <div className="mobile-user-info">
                        <div className="mobile-user-avatar">
                          <span className="avatar-text">
                            {user?.name?.charAt(0)?.toUpperCase() || 'U'}
                          </span>
                        </div>
                        <span className="mobile-user-name">{user?.name || 'User'}</span>
                      </div>
                      <button 
                        onClick={handleLogout}
                        className="mobile-logout-btn"
                      >
                        Logout
                      </button>
                    </>
                  ) : (
                    <div className="mobile-auth-buttons">
                      <Link to="/login" className="mobile-btn mobile-btn-login" onClick={closeMenu}>
                        Login
                      </Link>
                      <Link to="/register" className="mobile-btn mobile-btn-register" onClick={closeMenu}>
                        Register
                      </Link>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </nav>
      </div>
    </header>
  );
};

export default Header;
