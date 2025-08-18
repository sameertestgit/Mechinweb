import React, { useState, useEffect } from 'react';
import { 
  CreditCard, 
  Plus, 
  Trash2, 
  Edit3,
  Shield,
  Calendar,
  DollarSign,
  Clock,
  CheckCircle,
  AlertCircle
} from 'lucide-react';

const PaymentsPage = () => {
  const [isVisible, setIsVisible] = useState(false);
  const [showAddCard, setShowAddCard] = useState(false);

  useEffect(() => {
    setIsVisible(true);
  }, []);

  const paymentMethods = [
    {
      id: 1,
      type: 'visa',
      last4: '4242',
      expiryMonth: 12,
      expiryYear: 2025,
      isDefault: true,
      brand: 'Visa'
    },
    {
      id: 2,
      type: 'mastercard',
      last4: '8888',
      expiryMonth: 8,
      expiryYear: 2026,
      isDefault: false,
      brand: 'Mastercard'
    }
  ];

  const pendingPayments = [
    {
      id: 'INV-003',
      service: 'Domain Security Setup',
      amount: 199,
      dueDate: '2024-02-15',
      status: 'overdue'
    },
    {
      id: 'INV-004',
      service: 'Cloud Management - Monthly',
      amount: 299,
      dueDate: '2024-02-28',
      status: 'due-soon'
    }
  ];

  const recentPayments = [
    {
      id: 'PAY-001',
      service: 'Email Migration & Setup',
      amount: 299,
      date: '2024-01-15',
      status: 'completed',
      method: '•••• 4242'
    },
    {
      id: 'PAY-002',
      service: 'SSL & HTTPS Setup',
      amount: 149,
      date: '2024-01-20',
      status: 'completed',
      method: '•••• 8888'
    }
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'overdue':
        return 'bg-red-500/20 text-red-400 border-red-500/30';
      case 'due-soon':
        return 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30';
      case 'completed':
        return 'bg-green-500/20 text-green-400 border-green-500/30';
      default:
        return 'bg-gray-500/20 text-gray-400 border-gray-500/30';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'overdue':
        return <AlertCircle className="w-4 h-4 text-red-500" />;
      case 'due-soon':
        return <Clock className="w-4 h-4 text-yellow-500" />;
      case 'completed':
        return <CheckCircle className="w-4 h-4 text-green-500" />;
      default:
        return <Clock className="w-4 h-4 text-gray-500" />;
    }
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className={`transition-all duration-1000 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
        <div className="flex flex-col md:flex-row md:items-center md:justify-between">
          <div>
            <h1 className="text-3xl font-bold text-white mb-2">Payments & Billing</h1>
            <p className="text-gray-400 text-lg">Manage your payment methods and billing history</p>
          </div>
          <div className="mt-4 md:mt-0">
            <button
              onClick={() => setShowAddCard(true)}
              className="bg-gradient-to-r from-cyan-500 to-purple-600 text-white px-6 py-3 rounded-xl font-semibold hover:from-cyan-600 hover:to-purple-700 transition-all duration-300 transform hover:scale-105 inline-flex items-center space-x-2"
            >
              <Plus className="w-4 h-4" />
              <span>Add Payment Method</span>
            </button>
          </div>
        </div>
      </div>

      {/* Pending Payments Alert */}
      {pendingPayments.length > 0 && (
        <div className={`bg-gradient-to-r from-red-500/10 to-orange-500/10 rounded-2xl p-6 border border-red-500/20 transition-all duration-1000 delay-200 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
          <div className="flex items-center space-x-3 mb-4">
            <AlertCircle className="w-6 h-6 text-red-400" />
            <h2 className="text-xl font-bold text-white">Pending Payments</h2>
          </div>
          <p className="text-gray-400 mb-4">You have {pendingPayments.length} pending payment(s) that require attention.</p>
          <div className="space-y-3">
            {pendingPayments.map((payment) => (
              <div key={payment.id} className="flex items-center justify-between p-4 bg-gray-800/50 rounded-xl">
                <div className="flex items-center space-x-4">
                  {getStatusIcon(payment.status)}
                  <div>
                    <p className="text-white font-medium">{payment.service}</p>
                    <p className="text-gray-400 text-sm">{payment.id} • Due: {payment.dueDate}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-white font-semibold">${payment.amount}</p>
                  <button className="bg-red-500 hover:bg-red-600 text-white px-4 py-1 rounded-lg text-sm font-medium transition-colors">
                    Pay Now
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      <div className="grid lg:grid-cols-3 gap-8">
        {/* Payment Methods */}
        <div className={`lg:col-span-2 transition-all duration-1000 delay-400 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
          <div className="bg-gray-800/50 backdrop-blur-sm rounded-2xl p-6 border border-gray-700/50">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold text-white">Payment Methods</h2>
              <button
                onClick={() => setShowAddCard(true)}
                className="text-cyan-400 hover:text-cyan-300 text-sm font-medium inline-flex items-center space-x-1"
              >
                <Plus className="w-4 h-4" />
                <span>Add New</span>
              </button>
            </div>
            
            <div className="space-y-4">
              {paymentMethods.map((method) => (
                <div key={method.id} className="flex items-center justify-between p-4 bg-gray-700/30 rounded-xl hover:bg-gray-700/50 transition-colors">
                  <div className="flex items-center space-x-4">
                    <div className={`w-12 h-8 rounded flex items-center justify-center text-white text-xs font-bold ${
                      method.type === 'visa' ? 'bg-blue-600' : 'bg-red-600'
                    }`}>
                      {method.brand.toUpperCase()}
                    </div>
                    <div>
                      <p className="text-white font-medium">•••• •••• •••• {method.last4}</p>
                      <p className="text-gray-400 text-sm">Expires {method.expiryMonth}/{method.expiryYear}</p>
                    </div>
                    {method.isDefault && (
                      <span className="bg-green-500/20 text-green-400 px-2 py-1 rounded-full text-xs border border-green-500/30">
                        Default
                      </span>
                    )}
                  </div>
                  <div className="flex items-center space-x-2">
                    <button className="p-2 text-gray-400 hover:text-cyan-400 transition-colors">
                      <Edit3 className="w-4 h-4" />
                    </button>
                    <button className="p-2 text-gray-400 hover:text-red-400 transition-colors">
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>

            {/* Add Card Form */}
            {showAddCard && (
              <div className="mt-6 p-6 bg-gray-700/30 rounded-xl border border-gray-600">
                <h3 className="text-lg font-bold text-white mb-4">Add New Payment Method</h3>
                <form className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">Card Number</label>
                    <input
                      type="text"
                      placeholder="1234 5678 9012 3456"
                      className="w-full px-4 py-3 bg-gray-600 border border-gray-500 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-cyan-500"
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-2">Expiry Date</label>
                      <input
                        type="text"
                        placeholder="MM/YY"
                        className="w-full px-4 py-3 bg-gray-600 border border-gray-500 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-cyan-500"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-2">CVC</label>
                      <input
                        type="text"
                        placeholder="123"
                        className="w-full px-4 py-3 bg-gray-600 border border-gray-500 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-cyan-500"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">Cardholder Name</label>
                    <input
                      type="text"
                      placeholder="John Doe"
                      className="w-full px-4 py-3 bg-gray-600 border border-gray-500 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-cyan-500"
                    />
                  </div>
                  <div className="flex items-center space-x-3">
                    <input type="checkbox" id="default" className="rounded" />
                    <label htmlFor="default" className="text-gray-300 text-sm">Set as default payment method</label>
                  </div>
                  <div className="flex space-x-3">
                    <button
                      type="submit"
                      className="bg-gradient-to-r from-cyan-500 to-purple-600 text-white px-6 py-2 rounded-lg font-semibold hover:from-cyan-600 hover:to-purple-700 transition-all duration-300"
                    >
                      Add Card
                    </button>
                    <button
                      type="button"
                      onClick={() => setShowAddCard(false)}
                      className="bg-gray-600 hover:bg-gray-500 text-white px-6 py-2 rounded-lg font-semibold transition-colors"
                    >
                      Cancel
                    </button>
                  </div>
                </form>
              </div>
            )}
          </div>
        </div>

        {/* Payment Summary */}
        <div className={`space-y-6 transition-all duration-1000 delay-600 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
          {/* Monthly Summary */}
          <div className="bg-gray-800/50 backdrop-blur-sm rounded-2xl p-6 border border-gray-700/50">
            <h3 className="text-lg font-bold text-white mb-4">This Month</h3>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-gray-400">Total Spent</span>
                <span className="text-2xl font-bold text-white">$448</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-gray-400">Pending</span>
                <span className="text-yellow-400 font-semibold">$498</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-gray-400">Next Payment</span>
                <span className="text-white font-medium">Feb 28</span>
              </div>
            </div>
          </div>

          {/* Security Info */}
          <div className="bg-gradient-to-br from-green-500/10 to-emerald-500/10 rounded-2xl p-6 border border-green-500/20">
            <div className="flex items-center space-x-3 mb-4">
              <Shield className="w-6 h-6 text-green-400" />
              <h3 className="text-lg font-bold text-white">Secure Payments</h3>
            </div>
            <p className="text-gray-400 text-sm mb-4">
              Your payment information is encrypted and secure. We use industry-standard security measures.
            </p>
            <div className="space-y-2 text-sm">
              <div className="flex items-center space-x-2">
                <CheckCircle className="w-4 h-4 text-green-400" />
                <span className="text-gray-300">256-bit SSL encryption</span>
              </div>
              <div className="flex items-center space-x-2">
                <CheckCircle className="w-4 h-4 text-green-400" />
                <span className="text-gray-300">PCI DSS compliant</span>
              </div>
              <div className="flex items-center space-x-2">
                <CheckCircle className="w-4 h-4 text-green-400" />
                <span className="text-gray-300">Fraud protection</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Recent Payments */}
      <div className={`transition-all duration-1000 delay-800 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
        <div className="bg-gray-800/50 backdrop-blur-sm rounded-2xl p-6 border border-gray-700/50">
          <h2 className="text-xl font-bold text-white mb-6">Recent Payments</h2>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-700">
                  <th className="text-left py-3 text-gray-400 font-medium">Service</th>
                  <th className="text-left py-3 text-gray-400 font-medium">Date</th>
                  <th className="text-left py-3 text-gray-400 font-medium">Method</th>
                  <th className="text-left py-3 text-gray-400 font-medium">Amount</th>
                  <th className="text-left py-3 text-gray-400 font-medium">Status</th>
                </tr>
              </thead>
              <tbody>
                {recentPayments.map((payment) => (
                  <tr key={payment.id} className="border-b border-gray-700/50">
                    <td className="py-4">
                      <div>
                        <p className="text-white font-medium">{payment.service}</p>
                        <p className="text-gray-400 text-sm">{payment.id}</p>
                      </div>
                    </td>
                    <td className="py-4 text-gray-300">{payment.date}</td>
                    <td className="py-4 text-gray-300">{payment.method}</td>
                    <td className="py-4 text-white font-semibold">${payment.amount}</td>
                    <td className="py-4">
                      <span className={`px-3 py-1 rounded-full text-xs border ${getStatusColor(payment.status)}`}>
                        {payment.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PaymentsPage;