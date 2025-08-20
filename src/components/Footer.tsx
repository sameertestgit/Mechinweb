import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Server, Mail, Phone, MapPin, Facebook, Twitter, Linkedin, Instagram } from 'lucide-react';

const Footer: React.FC = () => {
  const navigate = useNavigate();

  const handleQuickLinkClick = (href: string) => {
    if (href.startsWith('/#')) {
      // If we're not on the home page, navigate to home first
      if (window.location.pathname !== '/') {
        navigate('/');
        // Wait for navigation to complete, then scroll
        setTimeout(() => {
          const element = document.querySelector(href.substring(1));
          if (element) {
            element.scrollIntoView({ behavior: 'smooth' });
          }
        }, 100);
      } else {
        // We're already on home page, just scroll
        const element = document.querySelector(href.substring(1));
        if (element) {
          element.scrollIntoView({ behavior: 'smooth' });
        }
      }
    }
  };

  const currentYear = new Date().getFullYear();

  const services = [
    'Email Migration & Setup',
    'Domain & Email Security',
    'SSL & HTTPS Setup',
    'Cloud Management',
    'Data Migration',
    'Hosting Support'
  ];

  const quickLinks = [
    { name: 'About Us', href: '/#about' },
    { name: 'Services', href: '/#services' },
    { name: 'Blog', href: '/#blog' },
    { name: 'Contact', href: '/#contact' },
    { name: 'Get Quote', href: '/#quote' }
  ];

  const socialLinks = [
    { icon: Facebook, href: '#', name: 'Facebook' },
    { icon: Twitter, href: '#', name: 'Twitter' },
    { icon: Linkedin, href: '#', name: 'LinkedIn' },
    { 
      icon: () => (
        <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
          <path d="M12 0C5.374 0 0 5.373 0 12s5.374 12 12 12 12-5.373 12-12S18.626 0 12 0zm5.568 8.16c-.169 1.858-.896 3.433-2.173 4.71-1.277 1.277-2.852 2.004-4.71 2.173-.38.035-.747.053-1.108.053s-.728-.018-1.108-.053c-1.858-.169-3.433-.896-4.71-2.173S2.555 10.018 2.386 8.16C2.351 7.78 2.333 7.413 2.333 7.052s.018-.728.053-1.108c.169-1.858.896-3.433 2.173-4.71S7.411 .038 9.269-.131C9.649-.166 10.016-.184 10.377-.184s.728.018 1.108.053c1.858.169 3.433.896 4.71 2.173s2.004 2.852 2.173 4.71c.035.38.053.747.053 1.108s-.018.728-.053 1.108z"/>
    { icon: Instagram, href: '#', name: 'Instagram' },
    { 
      icon: () => (
        <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
          <path d="M18.561 13.158c-1.102 0-2.135-.467-3.074-1.227l.228-1.076.008-.042c.207-1.143.849-3.06 2.839-3.06 1.47 0 2.705 1.19 2.705 2.61 0 1.6-1.171 2.795-2.706 2.795zM15.84 5.295c0-1.421 1.236-2.61 2.705-2.61 1.47 0 2.706 1.189 2.706 2.61 0 1.421-1.236 2.61-2.706 2.61-1.469 0-2.705-1.189-2.705-2.61zM5.295 13.158c-1.535 0-2.706-1.195-2.706-2.795 0-1.42 1.236-2.61 2.706-2.61 1.989 0 2.631 1.917 2.839 3.06l.008.042.228 1.076c-.939.76-1.972 1.227-3.075 1.227z"/>
    { 
      icon: () => (
        <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
          <path d="M23.004 15.588a.995.995 0 0 0-.044-.284l-2.683-8.042a1 1 0 0 0-.949-.684H4.672a1 1 0 0 0-.949.684L.94 15.304a.995.995 0 0 0-.044.284c-.003.032-.004.064-.004.096 0 .603.489 1.092 1.092 1.092h19.932c.603 0 1.092-.489 1.092-1.092 0-.032-.001-.064-.004-.096zM12.5 14.5h-1v-3h1v3zm0-4h-1v-1h1v1z"/>
        </svg>
      ), 
      href: 'https://www.fiverr.com/mechinweb', 
      name: 'Fiverr' 
    }
  ];

  return (
    <footer className="bg-gray-900 border-t border-gray-800 relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-r from-cyan-500/5 to-purple-500/5"></div>
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-cyan-500/5 rounded-full blur-3xl"></div>
      <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-purple-500/5 rounded-full blur-3xl"></div>
      
      <div className="container mx-auto px-6 py-16 relative z-10">
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Company Info */}
          <div className="lg:col-span-1">
            <div className="flex items-center mb-6">
              <div className="relative">
                <div className="w-12 h-12 bg-gradient-to-r from-cyan-500 to-purple-600 rounded-xl flex items-center justify-center">
                  <Server className="w-6 h-6 text-white" />
                </div>
                <div className="absolute -top-1 -right-1 w-4 h-4 bg-green-400 rounded-full animate-pulse"></div>
              </div>
              <div className="ml-3">
                <h3 className="text-2xl font-bold text-white">Mechinweb</h3>
                <p className="text-cyan-400 text-sm">IT Solutions</p>
              </div>
            </div>
            <p className="text-gray-300 mb-6 leading-relaxed">
              Your trusted partner for seamless IT & cloud solutions. We specialize in cloud migrations, 
              DNS troubleshooting, and hosting support.
            </p>
            <div className="flex space-x-4">
              {socialLinks.map((social, index) => {
                const IconComponent = social.icon;
                return (
                  <a
                    key={index}
                    href={social.href}
                    className="w-10 h-10 bg-gray-800 rounded-lg flex items-center justify-center text-gray-400 hover:text-white hover:bg-gradient-to-r hover:from-cyan-500 hover:to-purple-600 transition-all duration-300 transform hover:scale-110"
                    aria-label={social.name}
                  >
                    <IconComponent className="w-5 h-5" />
                  </a>
                );
              })}
            </div>
          </div>

          {/* Services */}
          <div>
            <h4 className="text-lg font-semibold text-white mb-6">Our Services</h4>
            <ul className="space-y-3">
              {services.map((service, index) => (
                <li key={index}>
                  <Link
                    to="/#services"
                    className="text-gray-300 hover:text-cyan-400 transition-colors duration-300 text-sm"
                  >
                    {service}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-lg font-semibold text-white mb-6">Quick Links</h4>
            <ul className="space-y-3">
              {quickLinks.map((link, index) => (
                <li key={index}>
                  <button
                    onClick={() => handleQuickLinkClick(link.href)}
                    className="text-gray-300 hover:text-cyan-400 transition-colors duration-300 text-sm"
                  >
                    {link.name}
                  </button>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h4 className="text-lg font-semibold text-white mb-6">Contact Info</h4>
            <div className="space-y-4">
              <div className="flex items-start">
                <Mail className="w-5 h-5 text-cyan-400 mr-3 mt-0.5 flex-shrink-0" />
                <div>
                  <p className="text-gray-300 text-sm">Email</p>
                  <a
                    href="mailto:contact@mechinweb.com"
                    className="text-white hover:text-cyan-400 transition-colors duration-300"
                  >
                    contact@mechinweb.com
                  </a>
                </div>
              </div>
              <div className="flex items-start">
                <Phone className="w-5 h-5 text-cyan-400 mr-3 mt-0.5 flex-shrink-0" />
                <div>
                  <p className="text-gray-300 text-sm">Phone</p>
                  <a
                    href="tel:+1234567890"
                    className="text-white hover:text-cyan-400 transition-colors duration-300"
                  >
                    +1 (234) 567-8900
                  </a>
                </div>
              </div>
              <div className="flex items-start">
                <MapPin className="w-5 h-5 text-cyan-400 mr-3 mt-0.5 flex-shrink-0" />
                <div>
                  <p className="text-gray-300 text-sm">Location</p>
                  <p className="text-white">Available Worldwide</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Section */}
        <div className="border-t border-gray-800 mt-12 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="text-gray-400 text-sm mb-4 md:mb-0">
              © {currentYear} Mechinweb. All rights reserved.
            </div>
            <div className="flex space-x-6 text-sm">
              <a href="#" className="text-gray-400 hover:text-cyan-400 transition-colors duration-300">
                Privacy Policy
              </a>
              <a href="#" className="text-gray-400 hover:text-cyan-400 transition-colors duration-300">
                Terms of Service
              </a>
              <a href="#" className="text-gray-400 hover:text-cyan-400 transition-colors duration-300">
                Cookie Policy
              </a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;