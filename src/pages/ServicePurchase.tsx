import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { ArrowLeft, CreditCard, Lock, Calendar } from 'lucide-react';
import { PaymentService } from '../lib/payments';
import { PricingService } from '../lib/pricing';
import CurrencyToggle from '../components/CurrencyToggle';
import { ZohoService } from '../lib/zoho';

const ServicePurchase = () => {
  const { serviceId } = useParams();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [selectedPackage, setSelectedPackage] = useState('basic');
  const [selectedCurrency, setSelectedCurrency] = useState<'USD' | 'INR'>('USD');
  const [localizedPrice, setLocalizedPrice] = useState(0);

  const service = PricingService.getService(serviceId as string);
  const currentPackage = service?.tiers[selectedPackage as keyof typeof service.tiers];

  useEffect(() => {
    if (currentPackage && serviceId) {
      PricingService.getLocalizedPrice(serviceId, selectedPackage, selectedCurrency)
        .then(setLocalizedPrice);
    }
  }, [currentPackage, selectedPackage, selectedCurrency, serviceId]);

  const handleCurrencyChange = (currency: 'USD' | 'INR', amount: number) => {
    setSelectedCurrency(currency);
  };

  const handlePurchase = async () => {
    setIsLoading(true);
    
    try {
      if (!currentPackage || !serviceId) {
        throw new Error('Invalid service or package');
      }

      // Create Zoho invoice and order
      const paymentIntent = await PaymentService.createPaymentIntent(
        serviceId,
        selectedPackage,
        localizedPrice || currentPackage.price,
        selectedCurrency.toLowerCase()
      );
      
      // Redirect to Zoho payment page or show payment options
      if (paymentIntent.payment_url) {
        // Open Zoho payment page in new tab
        window.open(paymentIntent.payment_url, '_blank');
        
        // Show payment pending message
        alert('Please complete your payment in the opened tab. Once payment is confirmed, your order will be processed.');
        navigate('/client/orders');
      } else {
        // For demo purposes, simulate successful payment
        const success = await PaymentService.confirmPayment(paymentIntent.invoice_id);
      
        if (success) {
          // Process payment success
          const result = await PaymentService.processPaymentSuccess(
            paymentIntent.invoice_id,
            serviceId,
            selectedPackage,
            localizedPrice || currentPackage.price
          );
        
          navigate(`/payment-success?order=${result.orderId}&invoice=${result.invoiceId}`);
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
                        </div>
                      </div>
                      <ul className="space-y-2">
                        {tier.features.map((feature, index) => (
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
                      <span className="text-cyan-400">
                        {selectedCurrency === 'USD' ? '$' : '₹'}{localizedPrice || currentPackage?.price || 0}
                      </span>
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