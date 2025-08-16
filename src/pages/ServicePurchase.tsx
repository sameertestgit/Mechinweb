import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { ArrowLeft, CreditCard, Lock, Calendar } from 'lucide-react';
import { loadStripe } from '@stripe/stripe-js';
import CurrencyToggle from '../components/CurrencyToggle';
import { convertUSDToINR } from '../utils/currency';

const stripePromise = loadStripe('pk_test_your_publishable_key_here');

const ServicePurchase = () => {
  const { serviceId } = useParams();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [selectedPackage, setSelectedPackage] = useState('basic');
  const [selectedCurrency, setSelectedCurrency] = useState<'USD' | 'INR'>('USD');
  const [convertedAmount, setConvertedAmount] = useState(0);

  const services = {
    'email-migration': {
      name: 'Email Migration & Setup',
      description: 'Professional email migration with zero downtime and complete data integrity',
      packages: {
        basic: { name: 'Basic', price: 299, features: ['Up to 10 accounts', 'Email migration', 'Basic support', 'Data backup'] },
        standard: { name: 'Standard', price: 799, features: ['Up to 50 accounts', 'Everything in Basic', 'Priority support', 'Advanced configuration', '30-day post-migration support'] },
        enterprise: { name: 'Enterprise', price: 1499, features: ['50+ accounts', 'Everything in Standard', 'Dedicated project manager', 'Custom integrations', '90-day support'] }
      }
    },
    'email-security': {
      name: 'Domain & Email Security',
      description: 'Complete DNS and email authentication setup including SPF, DKIM, and DMARC',
      packages: {
        basic: { name: 'Basic Setup', price: 199, features: ['SPF, DKIM, DMARC setup', 'Basic DNS configuration', 'Email support'] },
        advanced: { name: 'Advanced', price: 399, features: ['Everything in Basic', 'Security monitoring', 'Monthly reports', 'Priority support'] },
        enterprise: { name: 'Enterprise', price: 799, features: ['Everything in Advanced', 'Custom policies', '24/7 monitoring', 'Dedicated security expert'] }
      }
    },
    'ssl-setup': {
      name: 'SSL & HTTPS Setup',
      description: 'Professional SSL certificate installation and automated renewal systems',
      packages: {
        basic: { name: 'Single Domain', price: 149, features: ['SSL certificate installation', 'HTTPS configuration', 'Security validation', 'Basic support'] },
        standard: { name: 'Multi-Domain', price: 299, features: ['Up to 5 domains', 'Everything in Single Domain', 'Centralized management', 'Priority support'] },
        enterprise: { name: 'Wildcard SSL', price: 499, features: ['Unlimited subdomains', 'Everything in Multi-Domain', 'Auto-renewal setup', 'Advanced monitoring', '24/7 support'] }
      }
    },
    'cloud-management': {
      name: 'Cloud Suite Management',
      description: 'Expert administration of Google Workspace and Microsoft 365 environments',
      packages: {
        basic: { name: 'Setup', price: 399, features: ['Initial setup', 'User configuration', 'Basic training', 'Documentation'] },
        standard: { name: 'Advanced', price: 299, features: ['Monthly management', 'Everything in Setup', 'Ongoing management', 'User support', 'Monthly optimization', 'Security monitoring'], recurring: true },
        enterprise: { name: 'Enterprise', price: 599, features: ['Everything in Advanced', 'Dedicated manager', '24/7 support', 'Custom integrations', 'Advanced analytics'], recurring: true }
      }
    }
  };

  const service = services[serviceId as keyof typeof services];
  const currentPackage = service?.packages[selectedPackage as keyof typeof service.packages];

  useEffect(() => {
    if (currentPackage) {
      convertUSDToINR(currentPackage.price).then(setConvertedAmount);
    }
  }, [currentPackage]);

  const handleCurrencyChange = (currency: 'USD' | 'INR', amount: number) => {
    setSelectedCurrency(currency);
  };

  const handlePurchase = async () => {
    setIsLoading(true);
    
    try {
      // Create payment intent
      const response = await fetch('/api/create-payment-intent', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          serviceId,
          packageType: selectedPackage,
          amount: currentPackage?.price
        })
      });

      const { clientSecret } = await response.json();
      
      // Redirect to Stripe Checkout or handle payment
      const stripe = await stripePromise;
      if (stripe) {
        const { error } = await stripe.confirmCardPayment(clientSecret);
        
        if (!error) {
          navigate('/client/payment-success');
        } else {
          alert('Payment failed. Please try again.');
        }
      }
    } catch (error) {
      console.error('Payment error:', error);
      alert('Payment failed. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  if (!service) {
    return (
      <div className="min-h-screen bg-gray-900 pt-20 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-4xl font-bold text-white mb-4">Service Not Found</h1>
          <Link to="/client/dashboard" className="text-cyan-400 hover:text-cyan-300">
            Return to Dashboard
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-900 pt-20">
      {/* Back to Dashboard */}
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Link 
          to="/client/dashboard"
          className="inline-flex items-center space-x-2 text-cyan-400 hover:text-cyan-300 transition-colors duration-300"
        >
          <ArrowLeft className="h-5 w-5" />
          <span>Back to Dashboard</span>
        </Link>
      </div>

      {/* Service Purchase */}
      <section className="py-12 bg-gray-800">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-12">
              <h1 className="text-4xl font-bold text-white mb-4">{service.name}</h1>
              <p className="text-xl text-gray-400">{service.description}</p>
            </div>

            <div className="grid lg:grid-cols-2 gap-12">
              {/* Package Selection */}
              <div>
                <h2 className="text-2xl font-bold text-white mb-6">Choose Your Package</h2>
                <div className="space-y-4">
                  {Object.entries(service.packages).map(([key, pkg]) => (
                    <div
                      key={key}
                      className={`p-6 rounded-2xl border-2 cursor-pointer transition-all duration-300 ${
                        selectedPackage === key
                          ? 'border-cyan-500 bg-cyan-500/10'
                          : 'border-gray-700 bg-gray-900 hover:border-gray-600'
                      }`}
                      onClick={() => setSelectedPackage(key)}
                    >
                      <div className="flex items-center justify-between mb-4">
                        <h3 className="text-xl font-bold text-white">{pkg.name}</h3>
                        <div className="text-right">
                          <span className="text-2xl font-bold text-cyan-400">
                            ${pkg.price}
                          </span>
                          {pkg.recurring && <span className="text-gray-400 text-sm">/month</span>}
                        </div>
                      </div>
                      <ul className="space-y-2">
                        {pkg.features.map((feature, index) => (
                          <li key={index} className="flex items-center text-gray-300">
                            <div className="w-2 h-2 bg-cyan-500 rounded-full mr-3"></div>
                            {feature}
                          </li>
                        ))}
                      </ul>
                    </div>
                  ))}
                </div>
              </div>

              {/* Order Summary & Payment */}
              <div>
                <div className="bg-gray-900 rounded-2xl p-8 border border-gray-700 sticky top-24">
                  <h2 className="text-2xl font-bold text-white mb-6">Order Summary</h2>
                  
                  <div className="space-y-4 mb-6">
                    <div className="flex justify-between">
                      <span className="text-gray-400">Service:</span>
                      <span className="text-white">{service.name}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-400">Package:</span>
                      <span className="text-white">{currentPackage?.name}</span>
                    </div>
                    
                    <div className="border-t border-gray-700 pt-4">
                      <CurrencyToggle 
                        usdAmount={currentPackage?.price || 0}
                        onCurrencyChange={handleCurrencyChange}
                      />
                    </div>
                    
                    <hr className="border-gray-700" />
                    <div className="flex justify-between text-lg font-bold">
                      <span className="text-white">Total:</span>
                      <CurrencyToggle 
                        usdAmount={currentPackage?.price || 0}
                        onCurrencyChange={handleCurrencyChange}
                        className="text-cyan-400"
                      />
                    </div>
                  </div>

                  <div className="space-y-4 mb-6">
                    <div className="flex items-center space-x-2 text-gray-400">
                      <Lock className="h-4 w-4" />
                      <span className="text-sm">Secure payment powered by Stripe</span>
                    </div>
                    <div className="flex items-center space-x-2 text-gray-400">
                      <Calendar className="h-4 w-4" />
                      <span className="text-sm">Service delivery within 24-48 hours</span>
                    </div>
                  </div>

                  <button
                    onClick={handlePurchase}
                    disabled={isLoading}
                    className="w-full bg-gradient-to-r from-cyan-500 to-blue-600 text-white py-4 rounded-lg font-semibold hover:from-cyan-600 hover:to-blue-700 focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:ring-offset-2 focus:ring-offset-gray-900 transition-all duration-300 transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
                  >
                    {isLoading ? (
                      <div className="flex items-center justify-center space-x-2">
                        <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                        <span>Processing...</span>
                      </div>
                    ) : (
                      <div className="flex items-center justify-center space-x-2">
                        <CreditCard className="h-5 w-5" />
                        <span>Purchase Now</span>
                      </div>
                    )}
                  </button>

                  <p className="text-xs text-gray-400 text-center mt-4">
                    By purchasing, you agree to our Terms of Service and Privacy Policy
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default ServicePurchase;