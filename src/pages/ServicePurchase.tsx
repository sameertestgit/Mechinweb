import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { ArrowLeft, CreditCard, Lock, Calendar, Calculator } from 'lucide-react';
import { PaymentService } from '../lib/payments';
import { PricingService } from '../lib/pricing';
import CurrencyToggle from '../components/CurrencyToggle';
import QuantitySelector from '../components/QuantitySelector';
import AddOnSelector from '../components/AddOnSelector';

const ServicePurchase = () => {
  const { serviceId } = useParams();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [selectedPackage, setSelectedPackage] = useState('basic');
  const [selectedCurrency, setSelectedCurrency] = useState<'USD' | 'INR'>('USD');
  const [quantity, setQuantity] = useState(1);
  const [selectedAddOns, setSelectedAddOns] = useState<string[]>([]);
  const [localizedPrice, setLocalizedPrice] = useState(0);
  const [totalPrice, setTotalPrice] = useState(0);

  const service = PricingService.getService(serviceId as string);
  const currentPackage = service?.tiers[selectedPackage as keyof typeof service.tiers];

  // Define add-ons based on service type
  const getAddOns = () => {
    const commonAddOns = [
      {
        id: 'priority-support',
        name: 'Priority Support',
        description: '24/7 priority support with faster response times',
        price: 15,
        recommended: true
      },
      {
        id: 'extended-warranty',
        name: 'Extended Support (3 months)',
        description: 'Extended support coverage for 3 months post-delivery',
        price: 25
      }
    ];

    if (serviceId === 'cloud-management') {
      return [
        ...commonAddOns,
        {
          id: 'per-incident-support',
          name: 'Per Incident Support Package',
          description: 'Additional troubleshooting and configuration changes ($5 per incident)',
          price: 20
        }
      ];
    }

    if (serviceId === 'acronis-setup') {
      return [
        ...commonAddOns,
        {
          id: 'acronis-incident-support',
          name: 'Acronis Incident Support',
          description: 'Additional Acronis troubleshooting and configuration support',
          price: 15
        }
      ];
    }

    return commonAddOns;
  };

  const addOns = getAddOns();

  // Check if service supports quantity selection
  const isQuantityService = ['email-migration', 'data-migration'].includes(serviceId || '');

  useEffect(() => {
    if (currentPackage && serviceId) {
      PricingService.getLocalizedPrice(serviceId, selectedPackage, selectedCurrency)
        .then(price => {
          setLocalizedPrice(price);
          calculateTotalPrice(price);
        });
    }
  }, [currentPackage, selectedPackage, selectedCurrency, serviceId, quantity, selectedAddOns]);

  const calculateTotalPrice = (basePrice: number) => {
    let total = isQuantityService ? basePrice * quantity : basePrice;
    
    // Add selected add-ons
    selectedAddOns.forEach(addOnId => {
      const addOn = addOns.find(a => a.id === addOnId);
      if (addOn) {
        total += addOn.price;
      }
    });
    
    setTotalPrice(total);
  };

  const handleCurrencyChange = (currency: 'USD' | 'INR', amount: number) => {
    setSelectedCurrency(currency);
  };

  const handleQuantityChange = (newQuantity: number) => {
    setQuantity(newQuantity);
  };

  const handleAddOnToggle = (addOnId: string) => {
    setSelectedAddOns(prev => 
      prev.includes(addOnId)
        ? prev.filter(id => id !== addOnId)
        : [...prev, addOnId]
    );
  };

  const handlePurchase = async () => {
    setIsLoading(true);
    
    try {
      if (!currentPackage || !serviceId) {
        throw new Error('Invalid service or package');
      }

      // Create payment intent with Zoho integration
      const paymentIntent = await PaymentService.createPaymentIntent(
        serviceId,
        selectedPackage,
        totalPrice,
        selectedCurrency.toLowerCase()
      );

      if (paymentIntent.payment_url) {
        // Redirect to Zoho payment page
        window.location.href = paymentIntent.payment_url;
      } else {
        // Fallback to demo payment
        const paymentMethod = window.confirm(
          'Choose your payment method:\n\nOK = Credit/Debit Card\nCancel = Bank Transfer'
        );
        
        if (paymentMethod !== null) {
          await new Promise(resolve => setTimeout(resolve, 2000));
          navigate(`/thank-you?type=payment&amount=${totalPrice}&currency=${selectedCurrency}`);
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
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-12">
              <h1 className="text-4xl font-bold text-white mb-4">{service.name}</h1>
              <p className="text-xl text-gray-400">{service.description}</p>
            </div>

            <div className="grid lg:grid-cols-3 gap-8">
              {/* Package Selection */}
              <div className="lg:col-span-2 space-y-8">
                <div>
                  <h2 className="text-2xl font-bold text-white mb-6">Choose Your Package</h2>
                  <div className="space-y-4">
                    {Object.entries(service.tiers).map(([key, pkg]) => (
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
                              ${pkg.price}{isQuantityService ? '/unit' : ''}
                            </span>
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

                {/* Quantity Selection for applicable services */}
                {isQuantityService && (
                  <div>
                    <h2 className="text-2xl font-bold text-white mb-6">
                      <Calculator className="inline w-6 h-6 mr-2" />
                      Quantity Selection
                    </h2>
                    <QuantitySelector
                      label={serviceId === 'email-migration' ? 'Number of Mailboxes' : 'Number of Users'}
                      quantity={quantity}
                      onQuantityChange={handleQuantityChange}
                      unitPrice={currentPackage?.price || 0}
                      currency={selectedCurrency}
                      min={1}
                      max={1000}
                    />
                  </div>
                )}

                {/* Add-On Services */}
                <div>
                  <AddOnSelector
                    addOns={addOns}
                    selectedAddOns={selectedAddOns}
                    onAddOnToggle={handleAddOnToggle}
                    currency={selectedCurrency}
                  />
                </div>
              </div>

              {/* Order Summary & Payment */}
              <div className="lg:col-span-1">
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
                    
                    {isQuantityService && (
                      <div className="flex justify-between">
                        <span className="text-gray-400">
                          {serviceId === 'email-migration' ? 'Mailboxes:' : 'Users:'}
                        </span>
                        <span className="text-white">{quantity}</span>
                      </div>
                    )}
                    
                    <div className="border-t border-gray-700 pt-4">
                      <div className="flex justify-between mb-2">
                        <span className="text-gray-400">Base Price:</span>
                        <span className="text-white">
                          {selectedCurrency === 'USD' ? '$' : '₹'}{isQuantityService ? (localizedPrice * quantity) : localizedPrice}
                        </span>
                      </div>
                      
                      {selectedAddOns.length > 0 && (
                        <>
                          {selectedAddOns.map(addOnId => {
                            const addOn = addOns.find(a => a.id === addOnId);
                            return addOn ? (
                              <div key={addOnId} className="flex justify-between mb-2">
                                <span className="text-gray-400 text-sm">{addOn.name}:</span>
                                <span className="text-white text-sm">
                                  +{selectedCurrency === 'USD' ? '$' : '₹'}{addOn.price}
                                </span>
                              </div>
                            ) : null;
                          })}
                        </>
                      )}
                    </div>
                    
                    <div className="border-t border-gray-700 pt-4">
                      <CurrencyToggle 
                        usdAmount={totalPrice}
                        onCurrencyChange={handleCurrencyChange}
                      />
                    </div>
                    
                    <hr className="border-gray-700" />
                    <div className="flex justify-between text-lg font-bold">
                      <span className="text-white">Total:</span>
                      <span className="text-cyan-400">
                        {selectedCurrency === 'USD' ? '$' : '₹'}{totalPrice}
                      </span>
                    </div>
                  </div>

                  <div className="space-y-4 mb-6">
                    <div className="flex items-center space-x-2 text-gray-400">
                      <Lock className="h-4 w-4" />
                      <span className="text-sm">Secure payment powered by Zoho Invoice</span>
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