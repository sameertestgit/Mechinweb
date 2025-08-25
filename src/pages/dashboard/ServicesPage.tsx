import React, { useState, useEffect } from 'react';
import { 
  Mail, 
  Shield, 
  Lock, 
  Cloud, 
  Database, 
  Server,
  ArrowRight,
  Star,
  CheckCircle,
  Zap
} from 'lucide-react';
import { Link } from 'react-router-dom';

const ServicesPage = () => {
  const [isVisible, setIsVisible] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState('all');

  useEffect(() => {
    setIsVisible(true);
  }, []);

  const categories = [
    { id: 'all', name: 'All Services', count: 6 },
    { id: 'email', name: 'Email Services', count: 2 },
    { id: 'security', name: 'Security', count: 2 },
    { id: 'cloud', name: 'Cloud Services', count: 2 }
  ];

  const services = [
    {
      id: 'email-migration',
      icon: Mail,
      title: 'Email Migration & Setup',
      description: 'Per mailbox migration with zero downtime and complete data integrity.',
      category: 'email',
      rating: 4.9,
      reviews: 127,
      startingPrice: 4,
      features: ['Per mailbox migration', 'Complete data backup', 'Zero downtime', 'Basic support'],
      popular: true,
      gradient: 'from-blue-500 to-cyan-500'
    },
    {
      id: 'email-deliverability',
      icon: Shield,
      title: 'Email Deliverability',
      description: 'Complete DNS and email authentication setup including SPF, DKIM, and DMARC configuration.',
      category: 'email',
      rating: 4.8,
      reviews: 89,
      startingPrice: 25,
      features: ['SPF/DKIM/DMARC setup', 'DNS troubleshooting', 'Deliverability optimization', 'Email support'],
      popular: false,
      gradient: 'from-green-500 to-emerald-500'
    },
    {
      id: 'ssl-setup',
      icon: Lock,
      title: 'SSL & HTTPS Setup',
      description: 'Professional SSL certificate installation, configuration, and automated renewal systems.',
      category: 'security',
      rating: 4.9,
      reviews: 156,
      startingPrice: 7,
      features: ['SSL installation', 'Auto-renewal setup', 'Security optimization', 'Performance monitoring'],
      popular: false,
      gradient: 'from-purple-500 to-pink-500'
    },
    {
      id: 'cloud-management',
      icon: Cloud,
      title: 'Cloud Suite Management',
      description: 'Expert administration and optimization of Google Workspace and Microsoft 365 environments.',
      category: 'cloud',
      rating: 4.7,
      reviews: 203,
      startingPrice: 25,
      features: ['Google Workspace setup', 'Microsoft 365 admin', 'User management', 'Integration support'],
      popular: true,
      gradient: 'from-orange-500 to-red-500'
    },
    {
      id: 'data-migration',
      icon: Database,
      title: 'Cloud Data Migration',
      description: 'Per drive/site/Teams chat migration between cloud platforms.',
      category: 'cloud',
      rating: 4.8,
      reviews: 94,
      startingPrice: 5,
      features: ['Per drive migration', 'Per site migration', 'Per Teams chat migration', 'Data integrity checks'],
      popular: false,
      gradient: 'from-indigo-500 to-purple-500'
    },
    {
      id: 'hosting-support',
      icon: Server,
      title: 'Hosting & Control Panel Support',
      description: 'Professional Plesk and cPanel troubleshooting, optimization, and ongoing maintenance.',
      category: 'hosting',
      rating: 4.6,
      reviews: 78,
      startingPrice: 15,
      features: ['Plesk optimization', 'cPanel troubleshooting', 'Performance tuning', 'Security hardening'],
      popular: false,
      gradient: 'from-teal-500 to-cyan-500'
    }
    ,
    {
      id: 'acronis-setup',
      icon: Database,
      title: 'Acronis Account Setup (Data Backup & Recovery)',
      description: 'One-time Acronis backup solution setup and configuration for comprehensive data protection.',
      category: 'backup',
      rating: 4.7,
      reviews: 45,
      startingPrice: 25,
      features: ['Account creation & setup', 'Complete configuration', 'Multi-device setup', 'Training and support'],
      popular: false,
      gradient: 'from-blue-500 to-indigo-500'
    }
  ];

  const filteredServices = selectedCategory === 'all' 
    ? services 
    : services.filter(service => service.category === selectedCategory);

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className={`transition-all duration-1000 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
        <div className="flex flex-col md:flex-row md:items-center md:justify-between">
          <div>
            <h1 className="text-3xl font-bold text-white mb-2">Purchase Services</h1>
            <p className="text-gray-400 text-lg">Choose from our professional IT services to grow your business</p>
          </div>
          <div className="mt-4 md:mt-0">
            <div className="bg-gradient-to-r from-cyan-500/10 to-purple-500/10 rounded-xl p-4 border border-cyan-500/20">
              <div className="flex items-center space-x-2">
                <Zap className="w-5 h-5 text-yellow-400" />
                <span className="text-white font-medium">24/7 Expert Support</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Category Filter */}
      <div className={`transition-all duration-1000 delay-200 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
        <div className="flex flex-wrap gap-3">
          {categories.map((category) => (
            <button
              key={category.id}
              onClick={() => setSelectedCategory(category.id)}
              className={`px-4 py-2 rounded-xl font-medium transition-all duration-200 ${
                selectedCategory === category.id
                  ? 'bg-gradient-to-r from-cyan-500 to-purple-600 text-white'
                  : 'bg-gray-800/50 text-gray-400 hover:text-white hover:bg-gray-700/50'
              }`}
            >
              {category.name} ({category.count})
            </button>
          ))}
        </div>
      </div>

      {/* Services Grid */}
      <div className={`grid md:grid-cols-2 lg:grid-cols-3 gap-6 transition-all duration-1000 delay-400 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
        {filteredServices.map((service, index) => {
          const IconComponent = service.icon;
          return (
            <div key={service.id} className="bg-gray-800/50 backdrop-blur-sm rounded-2xl p-6 border border-gray-700/50 hover:border-cyan-500/50 transition-all duration-300 transform hover:-translate-y-2 group relative overflow-hidden">
              {service.popular && (
                <div className="absolute top-4 right-4 bg-gradient-to-r from-yellow-400 to-orange-500 text-black px-3 py-1 rounded-full text-xs font-bold">
                  POPULAR
                </div>
              )}
              
              <div className={`w-16 h-16 bg-gradient-to-r ${service.gradient} rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300`}>
                <IconComponent className="w-8 h-8 text-white" />
              </div>
              
              <h3 className="text-xl font-bold text-white mb-3 group-hover:text-cyan-400 transition-colors duration-300">
                {service.title}
              </h3>
              
              <p className="text-gray-400 mb-4 leading-relaxed line-clamp-3">
                {service.description}
              </p>

              {/* Rating */}
              <div className="flex items-center space-x-2 mb-4">
                <div className="flex items-center space-x-1">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className={`w-4 h-4 ${i < Math.floor(service.rating) ? 'text-yellow-400 fill-current' : 'text-gray-600'}`} />
                  ))}
                </div>
                <span className="text-white font-medium">{service.rating}</span>
                <span className="text-gray-400 text-sm">({service.reviews} reviews)</span>
              </div>

              {/* Features */}
              <div className="space-y-2 mb-6">
                {service.features.slice(0, 3).map((feature, featureIndex) => (
                  <div key={featureIndex} className="flex items-center text-gray-400 text-sm">
                    <CheckCircle className="w-4 h-4 text-green-400 mr-2 flex-shrink-0" />
                    <span>{feature}</span>
                  </div>
                ))}
                {service.features.length > 3 && (
                  <div className="text-cyan-400 text-sm">
                    +{service.features.length - 3} more features
                  </div>
                )}
              </div>

              {/* Price and CTA */}
              <div className="flex items-center justify-between">
                <div>
                  <span className="text-gray-400 text-sm">Starting at</span>
                  <div className="text-2xl font-bold text-white">
                    ${service.startingPrice}
                  </div>
                </div>
                <Link
                  to={`/client/purchase/${service.id}`}
                  className="bg-gradient-to-r from-cyan-500 to-purple-600 text-white px-6 py-2 rounded-xl font-semibold hover:from-cyan-600 hover:to-purple-700 transition-all duration-300 transform hover:scale-105 inline-flex items-center space-x-2"
                >
                  <span>Purchase</span>
                  <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
            </div>
          );
        })}
      </div>

      {/* Bottom CTA */}
      <div className={`bg-gradient-to-r from-cyan-500/10 via-purple-500/10 to-pink-500/10 rounded-2xl p-8 border border-cyan-500/20 backdrop-blur-sm text-center transition-all duration-1000 delay-600 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
        <h2 className="text-2xl font-bold text-white mb-4">Need a Custom Solution?</h2>
        <p className="text-gray-400 mb-6 max-w-2xl mx-auto">
          Can't find exactly what you're looking for? We offer tailored IT solutions to meet your specific business requirements.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link
            to="/#contact"
            className="bg-gradient-to-r from-cyan-500 to-purple-600 text-white px-8 py-3 rounded-xl font-semibold hover:from-cyan-600 hover:to-purple-700 transition-all duration-300 transform hover:scale-105"
          >
            Request Custom Quote
          </Link>
        </div>
      </div>
    </div>
  );
};

export default ServicesPage;