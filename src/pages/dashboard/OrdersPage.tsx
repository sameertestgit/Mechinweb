import React, { useState, useEffect } from 'react';
import { 
  Package, 
  Search, 
  Filter,
  Calendar,
  DollarSign,
  Clock,
  CheckCircle,
  AlertCircle,
  Eye,
  MessageCircle,
  Download
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { supabase } from '../../lib/supabase';
import { RealtimeService } from '../../lib/realtime';
import { getCurrentUser } from '../../lib/auth';

const OrdersPage = () => {
  const [isVisible, setIsVisible] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setIsVisible(true);
    initializeOrders();
  }, []);

  const initializeOrders = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        await loadOrders(user.id);
        
        // Set up real-time subscription
        const unsubscribe = RealtimeService.subscribeToOrders(user.id, (payload) => {
          loadOrders(user.id);
          
          // Show notification for status changes
          if (payload.eventType === 'UPDATE' && payload.new.status !== payload.old?.status) {
            const statusMessages = {
              'paid': 'Payment confirmed! Your order is being processed.',
              'completed': 'Service completed successfully!',
              'cancelled': 'Order has been cancelled.',
              'in-progress': 'Your order is now in progress!'
            };
            
            const message = statusMessages[payload.new.status as keyof typeof statusMessages];
            if (message) {
              RealtimeService.showNotification(
                'Order Status Update',
                message,
                payload.new.status === 'completed' ? 'success' : 'info'
              );
            }
          }
        });

        // Cleanup on unmount
        return () => {
          unsubscribe();
        };
      }
    } catch (error) {
      console.error('Error loading orders:', error);
    } finally {
      setLoading(false);
    }
  };

  const loadOrders = async (userId: string) => {
    try {
      const { data } = await supabase
        .from('orders')
        .select(`
          *,
          services (name, description)
        `)
        .eq('client_id', userId)
        .order('created_at', { ascending: false });
      
      setOrders(data || []);
    } catch (error) {
      console.error('Error loading orders:', error);
    }
  };

  const statusOptions = [
    { value: 'all', label: 'All Orders', count: orders.length },
    { value: 'pending', label: 'Pending', count: orders.filter(o => o.status === 'pending').length },
    { value: 'paid', label: 'Paid', count: orders.filter(o => o.status === 'paid').length },
    { value: 'completed', label: 'Completed', count: orders.filter(o => o.status === 'completed').length },
    { value: 'cancelled', label: 'Cancelled', count: orders.filter(o => o.status === 'cancelled').length }
  ];

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed':
        return <CheckCircle className="w-5 h-5 text-green-500" />;
      case 'paid':
        return <Clock className="w-5 h-5 text-yellow-500" />;
      case 'pending':
        return <AlertCircle className="w-5 h-5 text-orange-500" />;
      case 'cancelled':
        return <AlertCircle className="w-5 h-5 text-red-500" />;
      default:
        return <Clock className="w-5 h-5 text-gray-500" />;
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
      case 'cancelled':
        return 'bg-red-500/20 text-red-400 border-red-500/30';
      default:
        return 'bg-gray-500/20 text-gray-400 border-gray-500/30';
    }
  };

  const filteredOrders = orders.filter(order => {
    const matchesSearch = (order.service_id || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
                         order.id.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || order.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-cyan-500"></div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className={`transition-all duration-1000 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
        <div className="flex flex-col md:flex-row md:items-center md:justify-between">
          <div>
            <h1 className="text-3xl font-bold text-white mb-2">My Orders</h1>
            <p className="text-gray-400 text-lg">Track and manage your service orders</p>
          </div>
          <div className="mt-4 md:mt-0">
            <Link
              to="/client/services"
              className="bg-gradient-to-r from-cyan-500 to-purple-600 text-white px-6 py-3 rounded-xl font-semibold hover:from-cyan-600 hover:to-purple-700 transition-all duration-300 transform hover:scale-105 inline-flex items-center space-x-2"
            >
              <Package className="w-4 h-4" />
              <span>Order New Service</span>
            </Link>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className={`transition-all duration-1000 delay-200 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
        <div className="flex flex-col md:flex-row gap-4">
          {/* Search */}
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              placeholder="Search orders..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-3 bg-gray-800/50 border border-gray-600 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-transparent"
            />
          </div>

          {/* Status Filter */}
          <div className="flex flex-wrap gap-2">
            {statusOptions.map((option) => (
              <button
                key={option.value}
                onClick={() => setStatusFilter(option.value)}
                className={`px-4 py-2 rounded-xl font-medium transition-all duration-200 ${
                  statusFilter === option.value
                    ? 'bg-gradient-to-r from-cyan-500 to-purple-600 text-white'
                    : 'bg-gray-800/50 text-gray-400 hover:text-white hover:bg-gray-700/50'
                }`}
              >
                {option.label} ({option.count})
              </button>
            ))}
          </div>
        </div>
      </div>
                  <p className="text-white font-semibold">${order.amount_usd || 0}</p>
      {/* Orders List */}
      <div className={`space-y-6 transition-all duration-1000 delay-400 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
        {filteredOrders.map((order) => (
          <div key={order.id} className="bg-gray-800/50 backdrop-blur-sm rounded-2xl p-6 border border-gray-700/50 hover:border-cyan-500/50 transition-all duration-300">
            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between mb-6">
              <div className="flex items-center space-x-4 mb-4 lg:mb-0">
                    {order.status !== 'cancelled' && order.status !== 'completed' && (
                <div>
                  <h3 className="text-xl font-bold text-white">{order.service_id || 'Service'}</h3>
                  <p className="text-gray-400">{order.id} • {order.package_type} Package</p>
                    <p className="text-white font-medium">{order.services?.name || 'Service'}</p>
                    <p className="text-gray-400 text-sm">{order.id.slice(0, 8)} • {new Date(order.created_at).toLocaleDateString()}</p>
                  {order.status.replace('-', ' ')}
                </span>
              </div>
              
              <div className="flex items-center space-x-4">
                <div className="text-right">
                  <p className="text-2xl font-bold text-white">${order.amount_usd || 0}</p>
                  <p className="text-gray-400 text-sm">Order Total</p>
                </div>
              </div>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-6">
              <div>
                <p className="text-gray-400 text-sm mb-1">Description</p>
                <p className="text-white">{order.service_id} - {order.package_type} package</p>
              </div>
              
              <div>
                <p className="text-gray-400 text-sm mb-1">Order Date</p>
                <p className="text-white">{new Date(order.created_at).toLocaleDateString()}</p>
                {order.status === 'completed' && (
                  <>
                    <p className="text-gray-400 text-sm mb-1 mt-2">Completed Date</p>
                    <p className="text-green-400">{new Date(order.updated_at).toLocaleDateString()}</p>
                  </>
                )}
              </div>
              
              <div>
                <p className="text-gray-400 text-sm mb-1">Status</p>
                <p className="text-white capitalize">{order.status.replace('-', ' ')}</p>
              </div>
            </div>

            {/* Actions */}
            <div className="flex flex-wrap gap-3">
              <button className="bg-gray-700 hover:bg-gray-600 text-white px-4 py-2 rounded-lg font-medium transition-colors inline-flex items-center space-x-2">
                <Eye className="w-4 h-4" />
                <span>View Details</span>
              </button>
              
              {order.status !== 'cancelled' && (
                <button className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-medium transition-colors inline-flex items-center space-x-2">
                  <MessageCircle className="w-4 h-4" />
                  <span>Contact Support</span>
                </button>
              )}
              
              {order.status === 'completed' && (
                <button className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg font-medium transition-colors inline-flex items-center space-x-2">
                  <Download className="w-4 h-4" />
                  <span>Download Invoice</span>
                </button>
              )}
              
              {order.status === 'pending' && (
                <button className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg font-medium transition-colors">
                  Cancel Order
                </button>
              )}
            </div>
          </div>
          
          {orders.length === 0 && (
            <div className="text-center py-12">
              <Package className="w-16 h-16 text-gray-600 mx-auto mb-4" />
              <h3 className="text-xl font-bold text-white mb-2">No orders yet</h3>
              <p className="text-gray-400 mb-6">Start by purchasing one of our professional services</p>
              <Link
                to="/client/services"
                className="bg-gradient-to-r from-cyan-500 to-purple-600 text-white px-6 py-3 rounded-xl font-semibold hover:from-cyan-600 hover:to-purple-700 transition-all duration-300 transform hover:scale-105 inline-flex items-center space-x-2"
              >
                <Package className="w-4 h-4" />
                <span>Browse Services</span>
              </Link>
            </div>
          )}
        ))}
      </div>

      {filteredOrders.length === 0 && (
        <div className="text-center py-12">
          <Package className="w-16 h-16 text-gray-600 mx-auto mb-4" />
          <h3 className="text-xl font-bold text-white mb-2">No orders found</h3>
          <p className="text-gray-400 mb-6">
            {searchTerm || statusFilter !== 'all' 
              ? 'Try adjusting your search or filter criteria'
              : 'You haven\'t placed any orders yet'
            }
          </p>
          <Link
            to="/client/services"
            className="bg-gradient-to-r from-cyan-500 to-purple-600 text-white px-6 py-3 rounded-xl font-semibold hover:from-cyan-600 hover:to-purple-700 transition-all duration-300 transform hover:scale-105 inline-flex items-center space-x-2"
          >
            <Package className="w-4 h-4" />
            <span>Browse Services</span>
          </Link>
        </div>
      )}
    </div>
  );
};

export default OrdersPage;