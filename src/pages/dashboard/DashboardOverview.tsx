import React, { useState, useEffect } from 'react';
import { 
  TrendingUp, 
  Package, 
  CreditCard, 
  FileText, 
  ArrowUpRight,
  Clock,
  CheckCircle,
  AlertCircle,
  DollarSign
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { RealtimeService } from '../../lib/realtime';
import { getCurrentUser } from '../../lib/auth';

const DashboardOverview = () => {
  const [isVisible, setIsVisible] = useState(false);
  const [orders, setOrders] = useState([]);
  const [invoices, setInvoices] = useState([]);

  useEffect(() => {
    setIsVisible(true);
    
    // Set up real-time subscriptions
    const setupRealtimeSubscriptions = async () => {
      try {
        const user = await getCurrentUser();
        if (user) {
          // Subscribe to order updates
          const unsubscribeOrders = RealtimeService.subscribeToOrders(user.id, (payload) => {
            console.log('Order update:', payload);
            // Update orders state based on payload
          });

          // Subscribe to invoice updates
          const unsubscribeInvoices = RealtimeService.subscribeToInvoices(user.id, (payload) => {
            console.log('Invoice update:', payload);
            // Update invoices state based on payload
          });

          // Cleanup subscriptions on unmount
          return () => {
            unsubscribeOrders();
            unsubscribeInvoices();
          };
        }
      } catch (error) {
        console.error('Error setting up real-time subscriptions:', error);
      }
    };

    setupRealtimeSubscriptions();
  }, []);

  const stats = [
    {
      icon: Package,
      label: 'Active Orders',
      value: '3',
      change: '+2 this month',
      color: 'from-blue-500 to-cyan-500',
      bgColor: 'bg-blue-500/10'
    },
    {
      icon: CreditCard,
      label: 'Total Spent',
      value: '$1,247',
      change: '+$299 this month',
      color: 'from-green-500 to-emerald-500',
      bgColor: 'bg-green-500/10'
    },
    {
      icon: FileText,
      label: 'Invoices',
      value: '8',
      change: '2 pending',
      color: 'from-purple-500 to-pink-500',
      bgColor: 'bg-purple-500/10'
    },
    {
      icon: TrendingUp,
      label: 'Savings',
      value: '$450',
      change: 'vs market rate',
      color: 'from-orange-500 to-red-500',
      bgColor: 'bg-orange-500/10'
    }
  ];

  const recentOrders = [
    {
      id: 'ORD-001',
      service: 'Email Migration & Setup',
      status: 'completed',
      date: '2024-01-15',
      amount: 299
    },
    {
      id: 'ORD-002',
      service: 'SSL & HTTPS Setup',
      status: 'in-progress',
      date: '2024-01-20',
      amount: 149
    },
    {
      id: 'ORD-003',
      service: 'Domain Security Setup',
      status: 'pending',
      date: '2024-01-22',
      amount: 199
    }
  ];

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed':
        return <CheckCircle className="w-4 h-4 text-green-500" />;
      case 'in-progress':
        return <Clock className="w-4 h-4 text-yellow-500" />;
      case 'pending':
        return <AlertCircle className="w-4 h-4 text-orange-500" />;
      default:
        return <Clock className="w-4 h-4 text-gray-500" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed':
        return 'bg-green-500/20 text-green-400 border-green-500/30';
      case 'in-progress':
        return 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30';
      case 'pending':
        return 'bg-orange-500/20 text-orange-400 border-orange-500/30';
      default:
        return 'bg-gray-500/20 text-gray-400 border-gray-500/30';
    }
  };

  return (
    <div className="space-y-8">
      {/* Welcome Section */}
      <div className={`transition-all duration-1000 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
        <div className="bg-gradient-to-r from-cyan-500/10 via-purple-500/10 to-pink-500/10 rounded-2xl p-8 border border-cyan-500/20 backdrop-blur-sm">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-white mb-2">Welcome back! 👋</h1>
              <p className="text-gray-400 text-lg">Here's what's happening with your services</p>
            </div>
            <div className="hidden md:block">
              <Link
                to="/client/services"
                className="bg-gradient-to-r from-cyan-500 to-purple-600 text-white px-6 py-3 rounded-xl font-semibold hover:from-cyan-600 hover:to-purple-700 transition-all duration-300 transform hover:scale-105 inline-flex items-center space-x-2"
              >
                <span>Browse Services</span>
                <ArrowUpRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Stats Grid */}
      <div className={`grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 transition-all duration-1000 delay-200 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
        {stats.map((stat, index) => {
          const IconComponent = stat.icon;
          return (
            <div key={index} className="bg-gray-800/50 backdrop-blur-sm rounded-2xl p-6 border border-gray-700/50 hover:border-cyan-500/50 transition-all duration-300 transform hover:-translate-y-1">
              <div className="flex items-center justify-between mb-4">
                <div className={`p-3 rounded-xl ${stat.bgColor}`}>
                  <IconComponent className="w-6 h-6 text-white" />
                </div>
                <div className={`text-xs px-2 py-1 rounded-full bg-gradient-to-r ${stat.color} text-white`}>
                  {stat.change}
                </div>
              </div>
              <div>
                <p className="text-gray-400 text-sm mb-1">{stat.label}</p>
                <p className="text-2xl font-bold text-white">{stat.value}</p>
              </div>
            </div>
          );
        })}
      </div>

      {/* Recent Activity */}
      <div className={`grid lg:grid-cols-3 gap-8 transition-all duration-1000 delay-400 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
        {/* Recent Orders */}
        <div className="lg:col-span-2">
          <div className="bg-gray-800/50 backdrop-blur-sm rounded-2xl p-6 border border-gray-700/50">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold text-white">Recent Orders</h2>
              <Link
                to="/client/orders"
                className="text-cyan-400 hover:text-cyan-300 text-sm font-medium inline-flex items-center space-x-1"
              >
                <span>View All</span>
                <ArrowUpRight className="w-4 h-4" />
              </Link>
            </div>
            
            <div className="space-y-4">
              {recentOrders.map((order) => (
                <div key={order.id} className="flex items-center justify-between p-4 bg-gray-700/30 rounded-xl hover:bg-gray-700/50 transition-colors">
                  <div className="flex items-center space-x-4">
                    {getStatusIcon(order.status)}
                    <div>
                      <p className="text-white font-medium">{order.service}</p>
                      <p className="text-gray-400 text-sm">{order.id} • {order.date}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-white font-semibold">${order.amount}</p>
                    <span className={`text-xs px-2 py-1 rounded-full border ${getStatusColor(order.status)}`}>
                      {order.status.replace('-', ' ')}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="space-y-6">
          <div className="bg-gray-800/50 backdrop-blur-sm rounded-2xl p-6 border border-gray-700/50">
            <h2 className="text-xl font-bold text-white mb-6">Quick Actions</h2>
            <div className="space-y-3">
              <Link
                to="/client/services"
                className="w-full flex items-center space-x-3 p-3 bg-gradient-to-r from-cyan-500/20 to-purple-600/20 rounded-xl hover:from-cyan-500/30 hover:to-purple-600/30 transition-all duration-200 border border-cyan-500/30"
              >
                <Package className="w-5 h-5 text-cyan-400" />
                <span className="text-white font-medium">Purchase Service</span>
              </Link>
              <Link
                to="/client/payments"
                className="w-full flex items-center space-x-3 p-3 bg-gray-700/50 rounded-xl hover:bg-gray-700/70 transition-colors"
              >
                <CreditCard className="w-5 h-5 text-gray-400" />
                <span className="text-white font-medium">Make Payment</span>
              </Link>
              <Link
                to="/client/invoices"
                className="w-full flex items-center space-x-3 p-3 bg-gray-700/50 rounded-xl hover:bg-gray-700/70 transition-colors"
              >
                <FileText className="w-5 h-5 text-gray-400" />
                <span className="text-white font-medium">View Invoices</span>
              </Link>
            </div>
          </div>

          {/* Support Card */}
          <div className="bg-gradient-to-br from-green-500/10 to-emerald-500/10 rounded-2xl p-6 border border-green-500/20">
            <h3 className="text-lg font-bold text-white mb-2">Need Help?</h3>
            <p className="text-gray-400 text-sm mb-4">Our support team is here to help you 24/7</p>
            <div className="space-y-2">
              <a
                href="https://wa.me/15551234567"
                target="_blank"
                rel="noopener noreferrer"
                className="w-full bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors inline-flex items-center justify-center"
              >
                WhatsApp Support
              </a>
              <Link
                to="/#contact"
                className="w-full bg-gray-700 hover:bg-gray-600 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors inline-flex items-center justify-center"
              >
                Contact Form
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardOverview;