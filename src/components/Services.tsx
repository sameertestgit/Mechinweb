import React from 'react';
import { Link } from 'react-router-dom';
import { 
  Mail, 
  Shield, 
  Lock, 
  Cloud, 
  Database, 
  Server,
  ArrowRight,
  CheckCircle
} from 'lucide-react';

const Services: React.FC = () => {
  const services = [
    {
      icon: Mail,
      title: 'Email Migration & Setup',
      description: 'Seamless email migration between platforms with zero downtime and complete data integrity.',
      features: ['Zero downtime migration', 'Complete data backup', '24/7 support'],
      link: '/services/email-migration',
      gradient: 'from-blue-500 to-cyan-500'
    },
    {
      icon: Shield,
      title: 'Domain & Email Security',
      description: 'Complete DNS and email authentication setup including SPF, DKIM, and DMARC configuration.',
      features: ['SPF/DKIM/DMARC setup', 'DNS troubleshooting', 'Security monitoring'],
      link: '/services/email-security',
      gradient: 'from-green-500 to-emerald-500'
    },
    {
      icon: Lock,
      title: 'Secure SSL & HTTPS Setup',
      description: 'Professional SSL certificate installation, configuration, and automated renewal systems.',
      features: ['SSL installation', 'Auto-renewal setup', 'Security optimization'],
      link: '/services/ssl-setup',
      gradient: 'from-purple-500 to-pink-500'
    },
    {
      icon: Cloud,
      title: 'Cloud Productivity Suite Management',
      description: 'Expert administration and optimization of Google Workspace and Microsoft 365 environments.',
      features: ['Google Workspace setup', 'Microsoft 365 admin', 'User management'],
      link: '/services/cloud-management',
      gradient: 'from-orange-500 to-red-500'
    },
    {
      icon: Database,
      title: 'Cloud Data Migration',
      description: 'Secure migration of data between Microsoft Teams, SharePoint, OneDrive, and Google Drive.',
      features: ['Teams migration', 'SharePoint transfer', 'Drive synchronization'],
      link: '/services/data-migration',
      gradient: 'from-indigo-500 to-purple-500'
    },
    {
      icon: Server,
      title: 'Hosting & Control Panel Support',
      description: 'Professional Plesk and cPanel troubleshooting, optimization, and ongoing maintenance.',
      features: ['Plesk optimization', 'cPanel troubleshooting', 'Performance tuning'],
      link: '/services/hosting-support',
      gradient: 'from-teal-500 to-cyan-500'
    }
  ];

  // Add Acronis service to the services array
  services.push({
    icon: Database,
    title: 'Acronis Account Setup (Data Backup & Recovery)',
    description: 'Professional Acronis backup solution setup and configuration for comprehensive data protection.',
    features: ['Account creation & setup', 'Multi-device configuration', 'Automated backup schedules'],
    link: '/services/acronis-setup',
    gradient: 'from-blue-500 to-indigo-500'
  });

  const allServices = [
    ...services.slice(0, 6), // Original 6 services
    {
      icon: Database,
      title: 'Acronis Account Setup (Data Backup & Recovery)',
      description: 'Professional Acronis backup solution setup and configuration for comprehensive data protection.',
      features: ['Account creation & setup', 'Multi-device configuration', 'Automated backup schedules'],
      link: '/services/acronis-setup',
      gradient: 'from-blue-500 to-indigo-500'
    }
  ];

  return (
    <section id="services" className="py-20 bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-r from-cyan-500/5 to-purple-500/5"></div>
      <div className="absolute top-20 left-10 w-72 h-72 bg-cyan-500/10 rounded-full blur-3xl animate-pulse"></div>
      <div className="absolute bottom-20 right-10 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl animate-pulse delay-1000"></div>
      
      <div className="container mx-auto px-6 relative z-10">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
            Our Professional
            <span className="bg-gradient-to-r from-cyan-400 to-purple-400 bg-clip-text text-transparent"> Services</span>
          </h2>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto">
            Comprehensive IT solutions designed to streamline your business operations and enhance your digital infrastructure.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {allServices.map((service, index) => {
            const IconComponent = service.icon;
            return (
              <div
                key={index}
                className="group bg-gray-800/50 backdrop-blur-sm rounded-2xl p-8 border border-gray-700/50 hover:border-cyan-500/50 transition-all duration-500 transform hover:scale-105 hover:shadow-2xl hover:shadow-cyan-500/20"
              >
                <div className={`w-16 h-16 bg-gradient-to-r ${service.gradient} rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300`}>
                  <IconComponent className="w-8 h-8 text-white" />
                </div>
                
                <h3 className="text-2xl font-bold text-white mb-4 group-hover:text-cyan-400 transition-colors duration-300">
                  {service.title}
                </h3>
                
                <p className="text-gray-300 mb-6 leading-relaxed">
                  {service.description}
                </p>

                <div className="space-y-2 mb-8">
                  {service.features.map((feature, featureIndex) => (
                    <div key={featureIndex} className="flex items-center text-gray-400">
                      <CheckCircle className="w-4 h-4 text-green-400 mr-2 flex-shrink-0" />
                      <span className="text-sm">{feature}</span>
                    </div>
                  ))}
                </div>

                <Link
                  to={service.link}
                  className="inline-flex items-center text-cyan-400 hover:text-cyan-300 font-semibold group-hover:translate-x-2 transition-all duration-300"
                >
                  Learn More
                  <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform duration-300" />
                </Link>
              </div>
            );
          })}
        </div>

        <div className="text-center mt-16">
          <div className="bg-gray-800/50 backdrop-blur-sm rounded-2xl p-8 border border-cyan-500/20 max-w-4xl mx-auto">
            <h3 className="text-2xl font-bold text-white mb-4">
              Need a Custom Solution?
            </h3>
            <p className="text-gray-300 mb-6">
              We offer tailored IT solutions to meet your specific business requirements. 
              Contact us for a personalized consultation and custom pricing.
            </p>
            <Link
              to="/#contact"
              className="inline-flex items-center px-8 py-4 bg-gradient-to-r from-cyan-500 to-purple-600 text-white font-semibold rounded-lg hover:from-cyan-600 hover:to-purple-700 transition-all duration-300 transform hover:scale-105"
            >
              Get Custom Quote
              <ArrowRight className="w-5 h-5 ml-2" />
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Services;