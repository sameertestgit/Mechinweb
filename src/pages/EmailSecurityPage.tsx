import React, { useEffect, useState } from 'react';
import { Shield, ArrowRight, Lock, CheckCircle, AlertTriangle, Mail } from 'lucide-react';
import { Link } from 'react-router-dom';

const EmailSecurityPage = () => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    setIsVisible(true);
    window.scrollTo(0, 0);
  }, []);

  const securityFeatures = [
    {
      icon: Lock,
      title: "SPF Records",
      description: "Sender Policy Framework setup to prevent email spoofing and improve deliverability"
    },
    {
      icon: Shield,
      title: "DKIM Signing",
      description: "DomainKeys Identified Mail configuration for email authentication and integrity"
    },
    {
      icon: Mail,
      title: "DMARC Policies",
      description: "Domain-based Message Authentication, Reporting & Conformance implementation"
    }
  ];

  const benefits = [
    "Prevent email spoofing and phishing attacks",
    "Improve email deliverability rates",
    "Protect your domain reputation",
    "Comply with email security standards",
    "Reduce spam and fraudulent emails",
    "Enhanced email authentication"
  ];

  const faqs = [
    {
      question: "What access do you need to set up email security?",
      answer: "We need access to your domain's DNS management panel (where you manage DNS records) and your email platform admin panel. This allows us to configure SPF, DKIM, and DMARC records properly. We'll guide you through providing secure access."
    },
    {
      question: "Do I need to purchase anything for email security setup?",
      answer: "No additional purchases required. Email security setup uses DNS records and email platform configurations that are included with your existing services. We just need access to configure them properly."
    },
    {
      question: "How long does email security setup take?",
      answer: "Basic SPF, DKIM, and DMARC setup typically takes 2-4 hours. Advanced configurations with monitoring and reporting may take 1-2 business days depending on complexity."
    },
    {
      question: "Will this affect my current email delivery?",
      answer: "We implement email security gradually to avoid any delivery issues. We start with monitoring mode and gradually enforce policies to ensure smooth transition without affecting legitimate emails."
    }
  ];

  return (
    <div className="min-h-screen bg-gray-900 pt-20">
      {/* Hero Section */}
      <section className="py-20 bg-gradient-to-br from-purple-900 via-blue-900 to-cyan-900 relative overflow-hidden">
        <div className="absolute inset-0">
          {[...Array(50)].map((_, i) => (
            <div
              key={i}
              className="absolute bg-white/20 rounded-full animate-float"
              style={{
                width: `${Math.random() * 3 + 1}px`,
                height: `${Math.random() * 3 + 1}px`,
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
                animationDelay: `${Math.random() * 5}s`,
                animationDuration: `${3 + Math.random() * 4}s`
              }}
            />
          ))}
        </div>
        
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className={`max-w-4xl mx-auto text-center transition-all duration-1000 ${
            isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
          }`}>
            <div className="p-4 bg-gradient-to-r from-purple-500 to-cyan-600 rounded-2xl inline-block mb-8 shadow-2xl">
              <Shield className="h-16 w-16 text-white" />
            </div>
            
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-white mb-6">
              Domain & Email <span className="bg-gradient-to-r from-purple-300 to-cyan-300 bg-clip-text text-transparent">Security</span>
            </h1>
            
            <p className="text-xl text-purple-100 mb-8 leading-relaxed">
              Comprehensive DNS and email authentication setup including SPF, DKIM, and DMARC 
              to protect your domain and improve email deliverability.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link 
                to="/#quote"
                className="bg-white text-purple-600 font-semibold px-8 py-4 rounded-full hover:bg-purple-50 transition-all duration-300 transform hover:scale-105 shadow-lg"
              >
                Get Security Audit
              </Link>
              <Link 
                to="/#contact"
                className="border-2 border-white text-white font-semibold px-8 py-4 rounded-full hover:bg-white hover:text-purple-600 transition-all duration-300 transform hover:scale-105"
              >
                Contact Expert
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Security Features */}
      <section className="py-20 bg-gray-800">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-16">
              <h2 className="text-3xl sm:text-4xl font-bold text-white mb-6">
                Email Security <span className="bg-gradient-to-r from-purple-400 to-cyan-400 bg-clip-text text-transparent">Solutions</span>
              </h2>
              <p className="text-xl text-gray-400 max-w-3xl mx-auto">
                Advanced email authentication protocols to secure your domain and improve deliverability
              </p>
            </div>

            <div className="grid md:grid-cols-3 gap-8">
              {securityFeatures.map((feature, index) => {
                const IconComponent = feature.icon;
                return (
                  <div key={index} className="bg-gray-900 rounded-2xl p-8 border border-gray-700 hover:border-purple-500 transition-all duration-300 transform hover:-translate-y-2">
                    <div className="p-4 bg-gradient-to-r from-purple-500 to-cyan-600 rounded-xl inline-block mb-6">
                      <IconComponent className="h-8 w-8 text-white" />
                    </div>
                    <h3 className="text-xl font-bold text-white mb-4">{feature.title}</h3>
                    <p className="text-gray-400 leading-relaxed">{feature.description}</p>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="py-20 bg-gray-900">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-6xl mx-auto">
            <div className="grid lg:grid-cols-2 gap-12 items-center">
              <div>
                <h2 className="text-3xl sm:text-4xl font-bold text-white mb-6">
                  Why Email Security <span className="bg-gradient-to-r from-purple-400 to-cyan-400 bg-clip-text text-transparent">Matters</span>
                </h2>
                <p className="text-xl text-gray-400 mb-8 leading-relaxed">
                  Without proper email authentication, your domain is vulnerable to spoofing, 
                  phishing attacks, and poor deliverability rates.
                </p>
                
                <div className="space-y-4">
                  {benefits.map((benefit, index) => (
                    <div key={index} className="flex items-center space-x-3">
                      <CheckCircle className="h-5 w-5 text-green-500 flex-shrink-0" />
                      <span className="text-gray-300">{benefit}</span>
                    </div>
                  ))}
                </div>
              </div>
              
              <div className="bg-gray-800 rounded-2xl p-8 border border-gray-700">
                <div className="flex items-center space-x-3 mb-6">
                  <AlertTriangle className="h-8 w-8 text-yellow-500" />
                  <h3 className="text-xl font-bold text-white">Security Warning</h3>
                </div>
                <p className="text-gray-400 mb-6">
                  Domains without proper email authentication are 5x more likely to be used 
                  for phishing attacks and have 40% lower email deliverability rates.
                </p>
                <div className="bg-gradient-to-r from-purple-600 to-cyan-600 rounded-lg p-4">
                  <p className="text-white font-semibold">
                    Don't let your business emails end up in spam folders. 
                    Secure your domain today!
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* FAQs Section */}
      <section className="py-20 bg-gray-800">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-16">
              <h2 className="text-3xl sm:text-4xl font-bold text-white mb-6">
                Frequently Asked <span className="bg-gradient-to-r from-purple-400 to-cyan-400 bg-clip-text text-transparent">Questions</span>
              </h2>
              <p className="text-xl text-gray-400">
                Common questions about our email security service
              </p>
            </div>

            <div className="space-y-6">
              {faqs.map((faq, index) => (
                <div key={index} className="bg-gray-900 rounded-2xl p-6 border border-gray-700">
                  <h3 className="text-lg font-bold text-white mb-3">{faq.question}</h3>
                  <p className="text-gray-400 leading-relaxed">{faq.answer}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-purple-600 to-cyan-600">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-3xl sm:text-4xl font-bold text-white mb-6">
              Secure Your Email Domain Today
            </h2>
            <p className="text-xl text-purple-100 mb-8">
              Get a comprehensive email security audit and implementation plan
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link 
                to="/#contact"
                className="bg-white text-purple-600 font-semibold px-8 py-4 rounded-full hover:bg-purple-50 transition-all duration-300 transform hover:scale-105 shadow-lg inline-flex items-center justify-center space-x-2"
              >
                <span>Contact Us</span>
                <ArrowRight className="h-5 w-5" />
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default EmailSecurityPage;