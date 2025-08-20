import React from 'react';
import { Link } from 'react-router-dom';
import { Server, Mail, Phone, MapPin, Facebook, Twitter, Linkedin, Instagram } from 'lucide-react';

const Footer = () => {
  const currentYear = new Date().getFullYear();

  const services = [
    { name: 'Email Migration & Setup', href: '/services/email-migration' },
    { name: 'Domain & Email Security', href: '/services/email-security' },
    { name: 'SSL & HTTPS Setup', href: '/services/ssl-setup' },
    { name: 'Cloud Suite Management', href: '/services/cloud-management' },
    { name: 'Cloud Data Migration', href: '/services/data-migration' },
    { name: 'Hosting Support', href: '/services/hosting-support' }
  ];

  const quickLinks = [
    { name: 'About Us', href: '/#about', isHash: true },
    { name: 'Services', href: '/#services', isHash: true },
    { name: 'Blog', href: '/#blog', isHash: true },
    { name: 'Contact', href: '/#contact', isHash: true },
    { name: 'Client Login', href: '/client/login', isHash: false },
    { name: 'Get Quote', href: '/#contact', isHash: true }
  ];

  const handleNavClick = (href: string) => {
    if (href.startsWith('/#')) {
      if (window.location.pathname !== '/') {
        window.location.href = href;
      } else {
        const element = document.getElementById(href.substring(2));
        if (element) {
          element.scrollIntoView({ behavior: 'smooth' });
        }
      }
    }
  };

  return (
    <footer className="bg-gray-900 text-white">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Company Info */}
          <div className="space-y-4">
            <div className="flex items-center space-x-3">
              <div className="relative">
                <div className="p-2 bg-gradient-to-r from-cyan-500 via-blue-500 to-purple-600 rounded-xl shadow-lg">
                  <Server className="h-6 w-6 text-white" />
                </div>
                <div className="absolute -top-1 -right-1 w-3 h-3 bg-green-400 rounded-full animate-pulse"></div>
              </div>
              <div>
                <span className="text-lg font-bold bg-gradient-to-r from-cyan-400 via-blue-400 to-purple-400 bg-clip-text text-transparent">
                  Mechinweb
                </span>
                <div className="text-xs text-gray-400 -mt-1">IT Solutions</div>
              </div>
            </div>
            <p className="text-gray-400 text-sm leading-relaxed">
              Professional IT services and solutions for businesses of all sizes. 
              We specialize in cloud management, email security, and digital transformation.
            </p>
            <div className="flex space-x-4">
              <a href="#" className="text-gray-400 hover:text-cyan-400 transition-colors duration-200">
                <Facebook className="h-5 w-5" />
              </a>
              <a href="#" className="text-gray-400 hover:text-cyan-400 transition-colors duration-200">
                <Twitter className="h-5 w-5" />
              </a>
              <a href="#" className="text-gray-400 hover:text-cyan-400 transition-colors duration-200">
                <Linkedin className="h-5 w-5" />
              </a>
              <a href="#" className="text-gray-400 hover:text-cyan-400 transition-colors duration-200">
                <Instagram className="h-5 w-5" />
              </a>
            </div>
          </div>

          {/* Services */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-white">Services</h3>
            <ul className="space-y-2">
              {services.map((service, index) => (
                <li key={index}>
                  <Link
                    to={service.href}
                    className="text-gray-400 hover:text-cyan-400 transition-colors duration-200 text-sm"
                  >
                    {service.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Quick Links */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-white">Quick Links</h3>
            <ul className="space-y-2">
              {quickLinks.map((link, index) => (
                <li key={index}>
                  {link.isHash ? (
                    <button
                      onClick={() => handleNavClick(link.href)}
                      className="text-gray-400 hover:text-cyan-400 transition-colors duration-200 text-sm text-left"
                    >
                      {link.name}
                    </button>
                  ) : (
                    <Link
                      to={link.href}
                      className="text-gray-400 hover:text-cyan-400 transition-colors duration-200 text-sm"
                    >
                      {link.name}
                    </Link>
                  )}
                </li>
              ))}
            </ul>
          </div>

          {/* Contact Info */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-white">Contact Info</h3>
            <div className="space-y-3">
              <div className="flex items-center space-x-3">
                <Mail className="h-4 w-4 text-cyan-400" />
                <a 
                  href="mailto:contact@mechinweb.com" 
                  className="text-gray-400 hover:text-cyan-400 transition-colors duration-200 text-sm"
                >
                  contact@mechinweb.com
                </a>
              </div>
              <div className="flex items-center space-x-3">
                <Phone className="h-4 w-4 text-cyan-400" />
                <a 
                  href="tel:+15551234567" 
                  className="text-gray-400 hover:text-cyan-400 transition-colors duration-200 text-sm"
                >
                  +1 (555) 123-4567
            <div className="p-2 bg-gradient-to-r from-cyan-500 via-blue-500 to-purple-600 rounded-xl shadow-lg">
              <svg className="h-6 w-6 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M12 2L2 7l10 5 10-5-10-5z"/>
                <path d="M2 17l10 5 10-5"/>
                <path d="M2 12l10 5 10-5"/>
              </svg>
              <div className="flex items-start space-x-3">
            <div className="absolute -top-1 -right-1 w-3 h-3 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-full animate-pulse"></div>
                <span className="text-gray-400 text-sm">
                  123 Tech Street<br />
            <span className="text-lg font-bold bg-gradient-to-r from-cyan-400 via-blue-400 to-purple-400 bg-clip-text text-transparent">
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-gray-800 mt-8 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
            <p className="text-gray-400 text-sm">
              © {currentYear} Mechinweb IT Solutions. All rights reserved.
            </p>
            <div className="flex space-x-6">
              <Link to="/privacy" className="text-gray-400 hover:text-cyan-400 transition-colors duration-200 text-sm">
                Privacy Policy
              </Link>
              <Link to="/terms" className="text-gray-400 hover:text-cyan-400 transition-colors duration-200 text-sm">
                Terms of Service
              </Link>
              <Link to="/cookies" className="text-gray-400 hover:text-cyan-400 transition-colors duration-200 text-sm">
                Cookie Policy
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;