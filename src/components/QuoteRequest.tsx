import React, { useState } from 'react';
import { Send, CheckCircle, Clock, DollarSign } from 'lucide-react';

const QuoteRequest: React.FC = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    service: '',
    projectDetails: '',
    budget: '',
    timeline: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showThankYou, setShowThankYou] = useState(false);

  const services = [
    'Email Migration & Setup',
    'Domain & Email Security (SPF, DKIM, DMARC)',
    'Secure SSL & HTTPS Setup',
    'Cloud Productivity Suite Management',
    'Cloud Data Migration',
    'Hosting & Control Panel Support'
  ];

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Basic validation
    if (!formData.name || !formData.email || !formData.service || !formData.projectDetails) {
      alert('Please fill in all required fields.');
      return;
    }
    
    setIsSubmitting(true);

    try {
      // For now, simulate successful submission
      // In production, this would connect to your backend API
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      setShowThankYou(true);
      setFormData({
        name: '',
        email: '',
        phone: '',
        service: '',
        projectDetails: '',
        budget: '',
        timeline: ''
      });
    } catch (error) {
      console.error('Error submitting quote:', error);
      alert('There was an error submitting your quote request. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (showThankYou) {
    return (
      <section id="quote" className="py-20 bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-cyan-500/10 to-purple-500/10"></div>
        <div className="container mx-auto px-6 relative z-10">
          <div className="max-w-2xl mx-auto text-center">
            <div className="bg-gray-800/50 backdrop-blur-sm rounded-2xl p-12 border border-cyan-500/20 shadow-2xl">
              <CheckCircle className="w-20 h-20 text-green-400 mx-auto mb-6 animate-bounce" />
              <h2 className="text-4xl font-bold text-white mb-4">Thank You!</h2>
              <p className="text-gray-300 text-lg mb-8">
                Your quote request has been submitted successfully. We'll review your requirements and send you a detailed proposal within 24 hours.
              </p>
              <div className="space-y-4 mb-8">
                <div className="flex items-center justify-center text-gray-300">
                  <Clock className="w-5 h-5 mr-2 text-cyan-400" />
                  <span>Response time: Within 24 hours</span>
                </div>
                <div className="flex items-center justify-center text-gray-300">
                  <DollarSign className="w-5 h-5 mr-2 text-green-400" />
                  <span>Free consultation included</span>
                </div>
              </div>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <button
                  onClick={() => setShowThankYou(false)}
                  className="px-8 py-3 bg-gradient-to-r from-cyan-500 to-blue-600 text-white rounded-lg hover:from-cyan-600 hover:to-blue-700 transition-all duration-300 transform hover:scale-105"
                >
                  Request Another Quote
                </button>
                <a
                  href="https://wa.me/1234567890"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-8 py-3 bg-gradient-to-r from-green-500 to-green-600 text-white rounded-lg hover:from-green-600 hover:to-green-700 transition-all duration-300 transform hover:scale-105"
                >
                  Chat on WhatsApp
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section id="quote" className="py-20 bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-r from-cyan-500/10 to-purple-500/10"></div>
      <div className="absolute top-20 left-10 w-72 h-72 bg-cyan-500/5 rounded-full blur-3xl animate-pulse"></div>
      <div className="absolute bottom-20 right-10 w-96 h-96 bg-purple-500/5 rounded-full blur-3xl animate-pulse delay-1000"></div>
      
      <div className="container mx-auto px-6 relative z-10">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
            Get Your Free
            <span className="bg-gradient-to-r from-cyan-400 to-purple-400 bg-clip-text text-transparent"> Quote</span>
          </h2>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto">
            Tell us about your project and we'll provide you with a detailed proposal and timeline within 24 hours.
          </p>
        </div>

        <div className="max-w-4xl mx-auto">
          <form onSubmit={handleSubmit} className="bg-gray-800/50 backdrop-blur-sm rounded-2xl p-8 border border-cyan-500/20 shadow-2xl">
            <div className="grid md:grid-cols-2 gap-6 mb-6">
              <div>
                <label htmlFor="name" className="block text-sm font-medium text-gray-300 mb-2">
                  Full Name *
                </label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  required
                  className="w-full px-4 py-3 bg-gray-700/50 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-transparent transition-all duration-300"
                  placeholder="Enter your full name"
                />
              </div>
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-300 mb-2">
                  Email Address *
                </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  required
                  className="w-full px-4 py-3 bg-gray-700/50 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-transparent transition-all duration-300"
                  placeholder="Enter your email address"
                />
              </div>
            </div>

            <div className="grid md:grid-cols-2 gap-6 mb-6">
              <div>
                <label htmlFor="phone" className="block text-sm font-medium text-gray-300 mb-2">
                  Phone Number
                </label>
                <input
                  type="tel"
                  id="phone"
                  name="phone"
                  value={formData.phone}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 bg-gray-700/50 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-transparent transition-all duration-300"
                  placeholder="Enter your phone number"
                />
              </div>
              <div>
                <label htmlFor="service" className="block text-sm font-medium text-gray-300 mb-2">
                  Service Required *
                </label>
                <select
                  id="service"
                  name="service"
                  value={formData.service}
                  onChange={handleInputChange}
                  required
                  className="w-full px-4 py-3 bg-gray-700/50 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-transparent transition-all duration-300"
                >
                  <option value="">Select a service</option>
                  {services.map((service, index) => (
                    <option key={index} value={service}>{service}</option>
                  ))}
                </select>
              </div>
            </div>

            <div className="grid md:grid-cols-2 gap-6 mb-6">
              <div>
                <label htmlFor="budget" className="block text-sm font-medium text-gray-300 mb-2">
                  Budget Range
                </label>
                <select
                  id="budget"
                  name="budget"
                  value={formData.budget}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 bg-gray-700/50 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-transparent transition-all duration-300"
                >
                  <option value="">Select budget range</option>
                  <option value="$100-$500">$100 - $500</option>
                  <option value="$500-$1000">$500 - $1,000</option>
                  <option value="$1000-$2500">$1,000 - $2,500</option>
                  <option value="$2500+">$2,500+</option>
                </select>
              </div>
              <div>
                <label htmlFor="timeline" className="block text-sm font-medium text-gray-300 mb-2">
                  Project Timeline
                </label>
                <select
                  id="timeline"
                  name="timeline"
                  value={formData.timeline}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 bg-gray-700/50 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-transparent transition-all duration-300"
                >
                  <option value="">Select timeline</option>
                  <option value="ASAP">ASAP (Rush Job)</option>
                  <option value="1-2 weeks">1-2 weeks</option>
                  <option value="2-4 weeks">2-4 weeks</option>
                  <option value="1-2 months">1-2 months</option>
                  <option value="Flexible">Flexible</option>
                </select>
              </div>
            </div>

            <div className="mb-8">
              <label htmlFor="projectDetails" className="block text-sm font-medium text-gray-300 mb-2">
                Project Details *
              </label>
              <textarea
                id="projectDetails"
                name="projectDetails"
                value={formData.projectDetails}
                onChange={handleInputChange}
                required
                rows={5}
                className="w-full px-4 py-3 bg-gray-700/50 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-transparent transition-all duration-300 resize-none"
                placeholder="Please describe your project requirements, current setup, and any specific challenges you're facing..."
              ></textarea>
            </div>

            <div className="text-center">
              <button
                onClick={() => setShowThankYou(false)}
                disabled={isSubmitting}
                className="inline-flex items-center px-8 py-4 bg-gradient-to-r from-cyan-500 to-purple-600 text-white font-semibold rounded-lg hover:from-cyan-600 hover:to-purple-700 focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:ring-offset-2 focus:ring-offset-gray-800 transition-all duration-300 transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
              >
                {isSubmitting ? (
                  <>
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-3"></div>
                    Submitting...
                  </>
                ) : (
                  <>
                    <Send className="w-5 h-5 mr-2" />
                    Get Free Quote
                  </>
                )}
              </button>
            </div>
                href="https://wa.me/15551234567?text=Hi%20Mechinweb,%20I%20just%20submitted%20a%20quote%20request."
        </div>
      </div>
    </section>
  );
};

export default QuoteRequest;