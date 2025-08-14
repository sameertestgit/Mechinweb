import React, { useState, useEffect } from 'react';
import { getUSDToINRRate, formatCurrency, convertUSDToINR } from '../utils/currency';

interface CurrencyToggleProps {
  usdAmount: number;
  onCurrencyChange?: (currency: 'USD' | 'INR', amount: number) => void;
  className?: string;
}

const CurrencyToggle: React.FC<CurrencyToggleProps> = ({ 
  usdAmount, 
  onCurrencyChange,
  className = '' 
}) => {
  const [currency, setCurrency] = useState<'USD' | 'INR'>('USD');
  const [inrAmount, setInrAmount] = useState<number>(0);
  const [exchangeRate, setExchangeRate] = useState<number>(83.5);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchRate = async () => {
      setLoading(true);
      try {
        const rate = await getUSDToINRRate();
        setExchangeRate(rate);
        const converted = await convertUSDToINR(usdAmount);
        setInrAmount(converted);
      } catch (error) {
        console.error('Error fetching exchange rate:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchRate();
  }, [usdAmount]);

  const handleCurrencyToggle = (newCurrency: 'USD' | 'INR') => {
    setCurrency(newCurrency);
    const amount = newCurrency === 'USD' ? usdAmount : inrAmount;
    onCurrencyChange?.(newCurrency, amount);
  };

  const currentAmount = currency === 'USD' ? usdAmount : inrAmount;

  return (
    <div className={`flex items-center space-x-4 ${className}`}>
      <div className="flex items-center space-x-2">
        <span className="text-gray-400 text-sm">Currency:</span>
        <div className="flex bg-gray-700 rounded-lg p-1">
          <button
            onClick={() => handleCurrencyToggle('USD')}
            className={`px-3 py-1 text-sm font-medium rounded transition-all duration-200 ${
              currency === 'USD' 
                ? 'bg-cyan-500 text-white' 
                : 'text-gray-400 hover:text-white'
            }`}
          >
            USD
          </button>
          <button
            onClick={() => handleCurrencyToggle('INR')}
            className={`px-3 py-1 text-sm font-medium rounded transition-all duration-200 ${
              currency === 'INR' 
                ? 'bg-cyan-500 text-white' 
                : 'text-gray-400 hover:text-white'
            }`}
          >
            INR
          </button>
        </div>
      </div>
      
      <div className="flex items-center space-x-2">
        <span className="text-2xl font-bold text-cyan-400">
          {loading ? '...' : formatCurrency(currentAmount, currency)}
        </span>
        {currency === 'INR' && !loading && (
          <span className="text-xs text-gray-400">
            (Rate: ₹{exchangeRate.toFixed(2)}/USD)
          </span>
        )}
      </div>
    </div>
  );
};

export default CurrencyToggle;