import React, { useState, useEffect } from 'react';
import { 
  FileText, 
  Search, 
  Download, 
  Eye,
  Calendar,
  DollarSign,
  Filter,
  CheckCircle,
  Clock,
  AlertCircle
} from 'lucide-react';
import { Link } from 'react-router-dom';

const InvoicesPage = () => {
  const [isVisible, setIsVisible] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');

  useEffect(() => {
    setIsVisible(true);
  }, []);

  const invoices = [
    {
      id: 'INV-001',
      number: 'INV-2024-001',
      service: 'Email Migration & Setup',
      date: '2024-01-15',
      dueDate: '2024-02-15',
      amount: 799,
      tax: 79.90,
      total: 878.90,
      status: 'paid',
      paidDate: '2024-01-16'
    },
    {
      id: 'INV-002',
      number: 'INV-2024-002',
      service: 'SSL & HTTPS Setup',
      date: '2024-01-20',
      dueDate: '2024-02-20',
      amount: 299,
      tax: 29.90,
      total: 328.90,
      status: 'paid',
      paidDate: '2024-01-21'
    },
    {
      id: 'INV-003',
      number: 'INV-2024-003',
      service: 'Domain Security Setup',
      date: '2024-01-22',
      dueDate: '2024-02-15',
      amount: 399,
      tax: 39.90,
      total: 438.90,
      status: 'overdue',
      paidDate: null
    },
    {
      id: 'INV-004',
      number: 'INV-2024-004',
      service: 'Cloud Management - Monthly',
      date: '2024-02-01',
      dueDate: '2024-02-28',
      amount: 299,
      tax: 29.90,
      total: 328.90,
      status: 'pending',
      paidDate: null
    }
  ];

  const statusOptions = [
    { value: 'all', label: 'All Invoices', count: invoices.length },
    { value: 'paid', label: 'Paid', count: invoices.filter(i => i.status === 'paid').length },
    { value: 'pending', label: 'Pending', count: invoices.filter(i => i.status === 'pending').length },
    { value: 'overdue', label: 'Overdue', count: invoices.filter(i => i.status === 'overdue').length }
  ];

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'paid':
        return <CheckCircle className="w-4 h-4 text-green-500" />;
      case 'pending':
        return <Clock className="w-4 h-4 text-yellow-500" />;
      case 'overdue':
        return <AlertCircle className="w-4 h-4 text-red-500" />;
      default:
        return <Clock className="w-4 h-4 text-gray-500" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'paid':
        return 'bg-green-500/20 text-green-400 border-green-500/30';
      case 'pending':
        return 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30';
      case 'overdue':
        return 'bg-red-500/20 text-red-400 border-red-500/30';
      default:
        return 'bg-gray-500/20 text-gray-400 border-gray-500/30';
    }
  };

  const filteredInvoices = invoices.filter(invoice => {
    const matchesSearch = invoice.service.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         invoice.number.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || invoice.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const totalAmount = invoices.reduce((sum, invoice) => sum + invoice.total, 0);
  const paidAmount = invoices.filter(i => i.status === 'paid').reduce((sum, invoice) => sum + invoice.total, 0);
  const pendingAmount = invoices.filter(i => i.status !== 'paid').reduce((sum, invoice) => sum + invoice.total, 0);

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className={`transition-all duration-1000 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
        <div className="flex flex-col md:flex-row md:items-center md:justify-between">
          <div>
            <h1 className="text-3xl font-bold text-white mb-2">Invoices</h1>
            <p className="text-gray-400 text-lg">View and manage your billing history</p>
          </div>
          <div className="mt-4 md:mt-0">
            <button className="bg-gradient-to-r from-cyan-500 to-purple-600 text-white px-6 py-3 rounded-xl font-semibold hover:from-cyan-600 hover:to-purple-700 transition-all duration-300 transform hover:scale-105 inline-flex items-center space-x-2">
              <Download className="w-4 h-4" />
              <span>Download All</span>
            </button>
          </div>
        </div>
      </div>

      {/* Summary Cards */}
      <div className={`grid md:grid-cols-3 gap-6 transition-all duration-1000 delay-200 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
        <div className="bg-gray-800/50 backdrop-blur-sm rounded-2xl p-6 border border-gray-700/50">
          <div className="flex items-center space-x-4">
            <div className="p-3 bg-blue-500/20 rounded-xl">
              <DollarSign className="w-6 h-6 text-blue-400" />
            </div>
            <div>
              <p className="text-gray-400 text-sm">Total Invoiced</p>
              <p className="text-2xl font-bold text-white">${totalAmount.toFixed(2)}</p>
            </div>
          </div>
        </div>
        
        <div className="bg-gray-800/50 backdrop-blur-sm rounded-2xl p-6 border border-gray-700/50">
          <div className="flex items-center space-x-4">
            <div className="p-3 bg-green-500/20 rounded-xl">
              <CheckCircle className="w-6 h-6 text-green-400" />
            </div>
            <div>
              <p className="text-gray-400 text-sm">Paid</p>
              <p className="text-2xl font-bold text-white">${paidAmount.toFixed(2)}</p>
            </div>
          </div>
        </div>
        
        <div className="bg-gray-800/50 backdrop-blur-sm rounded-2xl p-6 border border-gray-700/50">
          <div className="flex items-center space-x-4">
            <div className="p-3 bg-yellow-500/20 rounded-xl">
              <Clock className="w-6 h-6 text-yellow-400" />
            </div>
            <div>
              <p className="text-gray-400 text-sm">Outstanding</p>
              <p className="text-2xl font-bold text-white">${pendingAmount.toFixed(2)}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className={`transition-all duration-1000 delay-400 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
        <div className="flex flex-col md:flex-row gap-4">
          {/* Search */}
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              placeholder="Search invoices..."
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

      {/* Invoices Table */}
      <div className={`transition-all duration-1000 delay-600 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
        <div className="bg-gray-800/50 backdrop-blur-sm rounded-2xl border border-gray-700/50 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-700/50">
                <tr>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-300">Invoice</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-300">Service</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-300">Date</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-300">Due Date</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-300">Amount</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-300">Status</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-300">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-700/50">
                {filteredInvoices.map((invoice) => (
                  <tr key={invoice.id} className="hover:bg-gray-700/30 transition-colors">
                    <td className="px-6 py-4">
                      <div>
                        <p className="text-white font-medium">{invoice.number}</p>
                        <p className="text-gray-400 text-sm">{invoice.id}</p>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-white">{invoice.service}</td>
                    <td className="px-6 py-4 text-gray-300">{invoice.date}</td>
                    <td className="px-6 py-4">
                      <span className={`text-sm ${
                        invoice.status === 'overdue' ? 'text-red-400' : 'text-gray-300'
                      }`}>
                        {invoice.dueDate}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div>
                        <p className="text-white font-semibold">${invoice.total.toFixed(2)}</p>
                        <p className="text-gray-400 text-sm">+${invoice.tax.toFixed(2)} tax</p>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center space-x-2">
                        {getStatusIcon(invoice.status)}
                        <span className={`px-3 py-1 rounded-full text-xs border ${getStatusColor(invoice.status)}`}>
                          {invoice.status}
                        </span>
                      </div>
                      {invoice.paidDate && (
                        <p className="text-gray-400 text-xs mt-1">Paid: {invoice.paidDate}</p>
                      )}
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center space-x-2">
                        <Link
                          to={`/client/invoice/${invoice.id}`}
                          className="p-2 text-gray-400 hover:text-cyan-400 transition-colors"
                          title="View Invoice"
                        >
                          <Eye className="w-4 h-4" />
                        </Link>
                        <button
                          className="p-2 text-gray-400 hover:text-green-400 transition-colors"
                          title="Download PDF"
                        >
                          <Download className="w-4 h-4" />
                        </button>
                        {invoice.status !== 'paid' && (
                          <button className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-1 rounded-lg text-xs font-medium transition-colors">
                            Pay Now
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {filteredInvoices.length === 0 && (
        <div className="text-center py-12">
          <FileText className="w-16 h-16 text-gray-600 mx-auto mb-4" />
          <h3 className="text-xl font-bold text-white mb-2">No invoices found</h3>
          <p className="text-gray-400 mb-6">
            {searchTerm || statusFilter !== 'all' 
              ? 'Try adjusting your search or filter criteria'
              : 'You don\'t have any invoices yet'
            }
          </p>
        </div>
      )}
    </div>
  );
};

export default InvoicesPage;