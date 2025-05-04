import { useState, useEffect, useRef } from 'react';
import { BrowserRouter as Router, Routes, Route, Link, useLocation } from 'react-router-dom';
import Albums from './components/Albums';
import AlbumDetail from './components/AlbumDetail';
import CreateAlbum from './components/CreateAlbum';
import NotFound from './components/NotFound';
import './App.css';

// NavLink component with active state handling
const NavLink = ({ to, children, onClick }) => {
  const location = useLocation();
  const isActive = location.pathname === to || 
                  (to === '/' && location.pathname === '') ||
                  (to !== '/' && location.pathname.startsWith(to));
  
  return (
    <Link 
      to={to} 
      className={`nav-link ${isActive ? 'active' : ''}`}
      onClick={onClick}
    >
      {children}
    </Link>
  );
};

// Navigation component with animated hamburger menu for mobile
const Navigation = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const navRef = useRef(null);
  
  const toggleMenu = () => {
    setMenuOpen(!menuOpen);
  };

  const closeMenu = () => {
    setMenuOpen(false);
  };

  // Close menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (navRef.current && !navRef.current.contains(event.target) && menuOpen) {
        setMenuOpen(false);
      }
    };

    // Close menu when user clicks anywhere on the page
    document.addEventListener('mousedown', handleClickOutside);
    
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [menuOpen]);

  // Add escape key functionality to close menu
  useEffect(() => {
    const handleEscKey = (event) => {
      if (event.key === 'Escape' && menuOpen) {
        setMenuOpen(false);
      }
    };

    document.addEventListener('keydown', handleEscKey);
    
    return () => {
      document.removeEventListener('keydown', handleEscKey);
    };
  }, [menuOpen]);

  return (
    <nav className="main-nav" ref={navRef}>
      <button 
        className={`hamburger ${menuOpen ? 'open' : ''}`} 
        onClick={toggleMenu}
        aria-label="Toggle navigation menu"
        aria-expanded={menuOpen}
      >
        <span></span>
        <span></span>
        <span></span>
      </button>
      
      {/* Add overlay for mobile */}
      {menuOpen && (
        <div className="nav-overlay" onClick={closeMenu}></div>
      )}
      
      <div className={`nav-links ${menuOpen ? 'open' : ''}`}>
        <NavLink to="/" onClick={closeMenu}>Gallery</NavLink>
        <NavLink to="/create" onClick={closeMenu}>Create Album</NavLink>
        {/* Close button visible only on mobile */}
        <button className="mobile-close-button" onClick={closeMenu} aria-label="Close menu">
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <line x1="18" y1="6" x2="6" y2="18"></line>
            <line x1="6" y1="6" x2="18" y2="18"></line>
          </svg>
        </button>
      </div>
    </nav>
  );
};

// App component
function App() {
  const [theme, setTheme] = useState('light');
  const [scrolled, setScrolled] = useState(false);
  
  // Handle scroll for header effects
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 50) {
        setScrolled(true);
      } else {
        setScrolled(false);
      }
    };
    
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);
  
  // Use preferred color scheme from system
  useEffect(() => {
    // Check if user has a preference in localStorage
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme) {
      setTheme(savedTheme);
      document.body.className = savedTheme;
    } else {
      // Check system preference
      const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
      if (prefersDark) {
        setTheme('dark');
        document.body.className = 'dark';
      }
    }
  }, []);
  
  // Toggle between light and dark themes
  const toggleTheme = () => {
    const newTheme = theme === 'light' ? 'dark' : 'light';
    setTheme(newTheme);
    document.body.className = newTheme;
    localStorage.setItem('theme', newTheme);
  };

  return (
    <Router>
      <div className={`app ${theme}`}>
        <header className={`app-header ${scrolled ? 'scrolled' : ''}`}>
          <div className="header-content">
            <div className="logo">
              <Link to="/">
                <h1>Ica's Albums</h1>
                <div className="logo-icon">
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" width="24" height="24">
                    <path d="M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm-1 16H6c-.55 0-1-.45-1-1V6c0-.55.45-1 1-1h12c.55 0 1 .45 1 1v12c0 .55-.45 1-1 1z"/>
                    <path d="M9 12c1.65 0 3-1.35 3-3s-1.35-3-3-3-3 1.35-3 3 1.35 3 3 3zm0-4c.55 0 1 .45 1 1s-.45 1-1 1-1-.45-1-1 .45-1 1-1z"/>
                    <path d="M4 18h16v-4l-4-4-4 4-2-2z"/>
                  </svg>
                </div>
              </Link>
            </div>
            
            <div className="header-actions">
              <button 
                className="theme-toggle" 
                onClick={toggleTheme}
                aria-label={`Switch to ${theme === 'light' ? 'dark' : 'light'} mode`}
              >
                {theme === 'light' ? (
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" width="20" height="20">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
                  </svg>
                ) : (
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" width="20" height="20">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707" />
                  </svg>
                )}
              </button>
              <Navigation />
            </div>
          </div>
        </header>
        
        <main className="app-main">
          <Routes>
            <Route path="/" element={<Albums />} />
            <Route path="/albums/:id" element={<AlbumDetail />} />
            <Route path="/create" element={<CreateAlbum />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </main>
      
        <footer className="app-footer">
          <div className="footer-content">
            <div className="footer-info">
              <p>&copy; {new Date().getFullYear()} Ica's Album</p>
              <p>Organize your memories with ease</p>
            </div>
            <div className="footer-links">
              <a href="#">Privacy Policy</a>
              <a href="#">Terms of Service</a>
              <a href="#">Contact</a>
            </div>
          </div>
        </footer>
      </div>
    </Router>
  );
}

export default App;