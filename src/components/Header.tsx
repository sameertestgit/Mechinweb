import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Server, Menu, X, ChevronDown } from 'lucide-react';

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [isServicesOpen, setIsServicesOpen] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    
    // Check if user is logged in
    const checkAuthStatus = () => {
      const token = localStorage.getItem('clientToken');
      setIsLoggedIn(!!token);
    };
    
    window.addEventListener('scroll', handleScroll);
    checkAuthStatus();
    
    // Listen for storage changes (login/logout from other tabs)
    window.addEventListener('storage', checkAuthStatus);
    
    return () => {
      window.removeEventListener('storage', checkAuthStatus);
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('clientToken');
    localStorage.removeItem('clientData');
    setIsLoggedIn(false);
    setIsMenuOpen(false);
    navigate('/');
  };

  const navItems = [
    { name: 'Home', href: '/#home' },
    { name: 'About', href: '/#about' },
    { name: 'Services', href: '/#services', hasDropdown: true },
    { name: 'Blog', href: '/#blog' },
    { name: 'Contact', href: '/#contact' }
  ];

  const services = [
    { name: 'Email Migration & Setup', href: '/services/email-migration' },
    { name: 'Domain & Email Security', href: '/services/email-security' },
    { name: 'SSL & HTTPS Setup', href: '/services/ssl-setup' },
    { name: 'Cloud Suite Management', href: '/services/cloud-management' },
    { name: 'Cloud Data Migration', href: '/services/data-migration' },
    { name: 'Hosting Support', href: '/services/hosting-support' }
  ];

  const handleNavClick = (href: string) => {
    if (href.startsWith('/#')) {
      navigate('/');
      setTimeout(() => {
        const element = document.getElementById(href.substring(2));
        if (element) {
          element.scrollIntoView({ behavior: 'smooth' });
        }
      }, 100);
    } else {
      navigate(href);
    }
    setIsServicesOpen(false);
    setIsMenuOpen(false);
  };

  return (
    <header className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
      isScrolled ? 'bg-gray-900/95 backdrop-blur-md shadow-lg border-b border-gray-700' : 'bg-transparent'
    }`}>
      <nav className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-3 group">
            <div className="relative">
              <div className="p-2 bg-gradient-to-r from-cyan-500 via-blue-500 to-purple-600 rounded-xl shadow-lg group-hover:shadow-cyan-500/25 transition-all duration-300">
                <Server className="h-7 w-7 text-white group-hover:rotate-12 transition-transform duration-300" />
              </div>
              <div className="absolute -top-1 -right-1 w-3 h-3 bg-green-400 rounded-full animate-pulse"></div>
            </div>
            <div>
              <span className="text-xl font-bold bg-gradient-to-r from-cyan-400 via-blue-400 to-purple-400 bg-clip-text text-transparent">
                Mechinweb
              </span>
              <div className="text-xs text-gray-400 -mt-1">IT Solutions</div>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:block">
            <div className="ml-10 flex items-baseline space-x-4">
              {navItems.map((item) => (
                <div
                  key={item.name}
                  className="relative"
                  onMouseEnter={() => item.hasDropdown && setIsServicesOpen(true)}
                  onMouseLeave={() => item.hasDropdown && setIsServicesOpen(false)}
                >
                  {item.hasDropdown ? (
                    <button
                      className={`flex items-center space-x-1 px-3 py-2 rounded-md text-sm font-medium transition-all duration-200 ${
                        isScrolled 
                          ? 'text-gray-300 hover:text-cyan-400 hover:bg-gray-800' 
                          : 'text-white hover:text-cyan-300 hover:bg-white/10'
                      }`}
                    >
                      <span>{item.name}</span>
                      <ChevronDown className={`h-4 w-4 transition-transform duration-200 ${
                        isServicesOpen ? 'rotate-180' : ''
                      }`} />
                    </button>
                  ) : (
                    <button
                      onClick={() => handleNavClick(item.href)}
                      className={`flex items-center space-x-1 px-3 py-2 rounded-md text-sm font-medium transition-all duration-200 ${
                        isScrolled 
                          ? 'text-gray-300 hover:text-cyan-400 hover:bg-gray-800' 
                          : 'text-white hover:text-cyan-300 hover:bg-white/10'
                      }`}
                    >
                      <span>{item.name}</span>
                    </button>
                  )}
                  
                  {/* Services Dropdown */}
                  {item.hasDropdown && (
                    <div className={`absolute top-full left-0 mt-2 w-64 bg-gray-800 rounded-xl shadow-2xl border border-gray-700 overflow-hidden transition-all duration-300 transform ${
                      isServicesOpen ? 'opacity-100 translate-y-0 visible' : 'opacity-0 -translate-y-2 invisible'
                    }`}>
                      <div className="py-2">
                        {services.map((service, index) => (
                          <button
                            key={index}
                            onClick={() => navigate(service.href)}
                            className="w-full text-left px-4 py-3 text-sm text-gray-300 hover:bg-gray-700 hover:text-cyan-400 transition-colors duration-200 flex items-center space-x-2"
                          >
                            <div className="w-2 h-2 bg-cyan-500 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-200"></div>
                            <span>{service.name}</span>
                          </button>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Auth Buttons */}
          <div className="hidden md:flex items-center space-x-4">
            {isLoggedIn ? (
              <>
                <Link
                  to="/client/dashboard"
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                    isScrolled 
                      ? 'text-gray-300 hover:text-cyan-400 hover:bg-gray-800' 
                      : 'text-white hover:text-cyan-300 hover:bg-white/10'
                  }`}
                >
                  Dashboard
                </Link>
                <button
                  onClick={handleLogout}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                    isScrolled 
                      ? 'text-gray-300 hover:text-cyan-400 hover:bg-gray-800' 
                      : 'text-white hover:text-cyan-300 hover:bg-white/10'
                  }`}
                >
                  Logout
                </button>
              </>
            ) : (
              <>
                <Link
                  to="/client/login"
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                    isScrolled 
                      ? 'text-gray-300 hover:text-cyan-400 hover:bg-gray-800' 
                      : 'text-white hover:text-cyan-300 hover:bg-white/10'
                  }`}
                >
                  Login
                </Link>
                <Link
                  to="/client/register"
                  className="bg-gradient-to-r from-cyan-500 to-blue-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:from-cyan-600 hover:to-blue-700 transition-all duration-300 transform hover:scale-105"
                >
                  Sign Up
                </Link>
              </>
            )}
          </div>

          {/* Mobile menu button */}
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className={`md:hidden inline-flex items-center justify-center p-2 rounded-md transition-colors duration-200 ${
              isScrolled 
                ? 'text-gray-300 hover:text-cyan-400 hover:bg-gray-800' 
                : 'text-white hover:text-cyan-300 hover:bg-white/10'
            }`}
          >
            {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div className="md:hidden">
            <div className="px-2 pt-2 pb-3 space-y-1 bg-gray-800/95 backdrop-blur-md rounded-lg mt-2 border border-gray-700">
              {navItems.map((item) => (
                <button
                  key={item.name}
                  onClick={() => handleNavClick(item.href)}
                  className="block w-full text-left px-3 py-2 rounded-md text-base font-medium text-gray-300 hover:text-cyan-400 hover:bg-gray-700 transition-colors duration-200"
                >
                  {item.name}
                </button>
              ))}
              
              <div className="border-t border-gray-700 pt-4 mt-4">
                {isLoggedIn ? (
                  <>
                    <Link
                      to="/client/dashboard"
                      className="block px-3 py-2 rounded-md text-base font-medium text-gray-300 hover:text-cyan-400 hover:bg-gray-700 transition-colors duration-200"
                      onClick={() => setIsMenuOpen(false)}
                    >
                      Dashboard
                    </Link>
                    <button
                      onClick={handleLogout}
                      className="block w-full text-left px-3 py-2 rounded-md text-base font-medium text-gray-300 hover:text-cyan-400 hover:bg-gray-700 transition-colors duration-200"
                    >
                      Logout
                    </button>
                  </>
                ) : (
                  <>
                    <Link
                      to="/client/login"
                      className="block px-3 py-2 rounded-md text-base font-medium text-gray-300 hover:text-cyan-400 hover:bg-gray-700 transition-colors duration-200"
                      onClick={() => setIsMenuOpen(false)}
                    >
                      Login
                    </Link>
                    <Link
                      to="/client/register"
                      className="block px-3 py-2 rounded-md text-base font-medium bg-gradient-to-r from-cyan-500 to-blue-600 text-white hover:from-cyan-600 hover:to-blue-700 transition-all duration-300"
                      onClick={() => setIsMenuOpen(false)}
                    >
                      Sign Up
                    </Link>
                  </>
                )}
              </div>
            </div>
          </div>
        )}
      </nav>
    </header>
  );
};

export default Header;