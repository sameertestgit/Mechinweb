import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ArrowLeft, Download, Printer, Mail } from 'lucide-react';

const InvoiceView = () => {
  const { invoiceId } = useParams();
  const [invoice, setInvoice] = useState(null);

  useEffect(() => {
    // Mock invoice data - in real app, fetch from API
    const mockInvoice = {
      id: invoiceId,
      number: `INV-${invoiceId}`,
      date: '2024-01-20',
      dueDate: '2024-02-20',
      status: 'Paid',
      client: {
        name: 'John Doe',
        email: 'john@example.com',
        company: 'Tech Solutions Inc.',
        address: '123 Business St, Suite 100\nNew York, NY 10001'
      },
      service: {
        name: 'Email Migration & Setup',
        description: 'Professional email migration with zero downtime',
        package: 'Standard Package',
        quantity: 1,
        price: 799
      },
      subtotal: 799,
      tax: 79.90,
      total: 878.90,
      paymentMethod: 'Credit Card',
      notes: 'Thank you for choosing Mechinweb for your IT services.'
    };
    
    setInvoice(mockInvoice);
  }, [invoiceId]);

  const handlePrint = () => {
    window.print();
  };

  const handleDownload = () => {
    // In real app, generate PDF
    alert('PDF download functionality would be implemented here');
  };

  if (!invoice) {
    return (
      <div className="min-h-screen bg-gray-900 pt-20 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-4xl font-bold text-white mb-4">Loading Invoice...</h1>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-900 pt-20">
      {/* Back to Dashboard */}
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8 print:hidden">
        <div className="flex items-center justify-between">
          <Link 
            to="/client/dashboard"
            className="inline-flex items-center space-x-2 text-cyan-400 hover:text-cyan-300 transition-colors duration-300"
          >
            <ArrowLeft className="h-5 w-5" />
            <span>Back to Dashboard</span>
          </Link>
          
          <div className="flex space-x-4">
            <button
              onClick={handlePrint}
              className="inline-flex items-center space-x-2 px-4 py-2 bg-gray-700 text-white rounded-lg hover:bg-gray-600 transition-colors duration-300"
            >
              <Printer className="h-4 w-4" />
              <span>Print</span>
            </button>
            <button
              onClick={handleDownload}
              className="inline-flex items-center space-x-2 px-4 py-2 bg-cyan-500 text-white rounded-lg hover:bg-cyan-600 transition-colors duration-300"
            >
              <Download className="h-4 w-4" />
              <span>Download PDF</span>
            </button>
          </div>
        </div>
      </div>

      {/* Invoice */}
      <section className="py-12 bg-gray-800 print:bg-white print:py-0">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-4xl mx-auto">
            <div className="bg-white rounded-2xl shadow-2xl print:shadow-none print:rounded-none">
              {/* Invoice Header */}
              <div className="p-8 border-b border-gray-200">
                <div className="flex items-center justify-between mb-8">
                  <div>
                    <h1 className="text-3xl font-bold text-gray-900">Mechinweb</h1>
                    <p className="text-gray-600">IT Solutions & Cloud Services</p>
                  </div>
                  <div className="text-right">
                    <h2 className="text-2xl font-bold text-gray-900">INVOICE</h2>
                    <p className="text-gray-600">{invoice.number}</p>
                  </div>
                </div>
                
                <div className="grid md:grid-cols-2 gap-8">
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">From:</h3>
                    <div className="text-gray-600">
                      <p>Mechinweb</p>
                      <p>contact@mechinweb.com</p>
                      <p>+1 (555) 123-4567</p>
                    </div>
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">Bill To:</h3>
                    <div className="text-gray-600">
                      <p className="font-semibold">{invoice.client.name}</p>
                      {invoice.client.company && <p>{invoice.client.company}</p>}
                      <p>{invoice.client.email}</p>
                      <div className="whitespace-pre-line">{invoice.client.address}</div>
                    </div>
                  </div>
                </div>
                
                <div className="grid md:grid-cols-3 gap-8 mt-8">
                  <div>
                    <h3 className="text-sm font-semibold text-gray-900 mb-1">Invoice Date:</h3>
                    <p className="text-gray-600">{new Date(invoice.date).toLocaleDateString()}</p>
                  </div>
                  <div>
                    <h3 className="text-sm font-semibold text-gray-900 mb-1">Due Date:</h3>
                    <p className="text-gray-600">{new Date(invoice.dueDate).toLocaleDateString()}</p>
                  </div>
                  <div>
                    <h3 className="text-sm font-semibold text-gray-900 mb-1">Status:</h3>
                    <span className={`inline-block px-3 py-1 text-sm rounded-full ${
                      invoice.status === 'Paid' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                    }`}>
                      {invoice.status}
                    </span>
                  </div>
                </div>
              </div>

              {/* Invoice Items */}
              <div className="p-8">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-gray-200">
                      <th className="text-left py-4 text-sm font-semibold text-gray-900">Service</th>
                      <th className="text-center py-4 text-sm font-semibold text-gray-900">Qty</th>
                      <th className="text-right py-4 text-sm font-semibold text-gray-900">Price</th>
                      <th className="text-right py-4 text-sm font-semibold text-gray-900">Total</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr className="border-b border-gray-100">
                      <td className="py-4">
                        <div>
                          <p className="font-semibold text-gray-900">{invoice.service.name}</p>
                          <p className="text-sm text-gray-600">{invoice.service.description}</p>
                          <p className="text-sm text-gray-500">{invoice.service.package}</p>
                        </div>
                      </td>
                      <td className="text-center py-4 text-gray-600">{invoice.service.quantity}</td>
                      <td className="text-right py-4 text-gray-600">${invoice.service.price}</td>
                      <td className="text-right py-4 text-gray-900 font-semibold">${invoice.service.price}</td>
                    </tr>
                  </tbody>
                </table>
                
                {/* Totals */}
                <div className="mt-8 flex justify-end">
                  <div className="w-64">
                    <div className="flex justify-between py-2">
                      <span className="text-gray-600">Subtotal:</span>
                      <span className="text-gray-900">${invoice.subtotal}</span>
                    </div>
                    <div className="flex justify-between py-2">
                      <span className="text-gray-600">Tax (10%):</span>
                      <span className="text-gray-900">${invoice.tax}</span>
                    </div>
                    <div className="flex justify-between py-2 border-t border-gray-200 font-bold text-lg">
                      <span className="text-gray-900">Total:</span>
                      <span className="text-gray-900">${invoice.total}</span>
                    </div>
                  </div>
                </div>
                
                {/* Payment Info */}
                <div className="mt-8 p-4 bg-gray-50 rounded-lg">
                  <h3 className="text-sm font-semibold text-gray-900 mb-2">Payment Information:</h3>
                  <p className="text-sm text-gray-600">Payment Method: {invoice.paymentMethod}</p>
                  <p className="text-sm text-gray-600">Status: {invoice.status}</p>
                </div>
                
                {/* Notes */}
                {invoice.notes && (
                  <div className="mt-8">
                    <h3 className="text-sm font-semibold text-gray-900 mb-2">Notes:</h3>
                    <p className="text-sm text-gray-600">{invoice.notes}</p>
                  </div>
                )}
              </div>
              
              {/* Footer */}
              <div className="p-8 border-t border-gray-200 bg-gray-50">
                <div className="text-center text-sm text-gray-600">
                  <p>Thank you for choosing Mechinweb for your IT services!</p>
                  <p className="mt-2">For questions about this invoice, contact us at contact@mechinweb.com</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default InvoiceView;