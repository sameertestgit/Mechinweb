// Zoho Invoice/Books integration
import { supabase } from './supabase';

export interface ZohoCustomer {
  contact_id: string;
  contact_name: string;
  company_name?: string;
  email: string;
  phone?: string;
}

export interface ZohoInvoice {
  invoice_id: string;
  invoice_number: string;
  customer_id: string;
  total: number;
  status: string;
  date: string;
  due_date: string;
}

export interface ZohoPayment {
  payment_id: string;
  invoice_id: string;
  amount: number;
  date: string;
  payment_mode: string;
}

export class ZohoService {
  private static async getAccessToken(): Promise<string> {
    try {
      // In production, this would be handled by an edge function
      // For now, we'll simulate the token retrieval
      const response = await fetch('/api/zoho/token', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        }
      });

      if (!response.ok) {
        throw new Error('Failed to get Zoho access token');
      }

      const data = await response.json();
      return data.access_token;
    } catch (error) {
      console.error('Error getting Zoho access token:', error);
      throw error;
    }
  }

  static async createCustomer(customerData: {
    name: string;
    email: string;
    phone?: string;
    company?: string;
  }): Promise<ZohoCustomer> {
    try {
      const response = await fetch('/api/zoho/customers', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(customerData)
      });

      if (!response.ok) {
        throw new Error('Failed to create Zoho customer');
      }

      return await response.json();
    } catch (error) {
      console.error('Error creating Zoho customer:', error);
      throw error;
    }
  }

  static async createInvoice(invoiceData: {
    customerId: string;
    serviceId: string;
    packageType: string;
    amount: number;
    currency: string;
  }): Promise<ZohoInvoice> {
    try {
      const response = await fetch('/api/zoho/invoices', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(invoiceData)
      });

      if (!response.ok) {
        throw new Error('Failed to create Zoho invoice');
      }

      return await response.json();
    } catch (error) {
      console.error('Error creating Zoho invoice:', error);
      throw error;
    }
  }

  static async recordPayment(paymentData: {
    invoiceId: string;
    amount: number;
    paymentMode: string;
    reference?: string;
  }): Promise<ZohoPayment> {
    try {
      const response = await fetch('/api/zoho/payments', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(paymentData)
      });

      if (!response.ok) {
        throw new Error('Failed to record Zoho payment');
      }

      return await response.json();
    } catch (error) {
      console.error('Error recording Zoho payment:', error);
      throw error;
    }
  }

  static async getInvoiceDetails(invoiceId: string): Promise<ZohoInvoice> {
    try {
      const response = await fetch(`/api/zoho/invoices/${invoiceId}`);

      if (!response.ok) {
        throw new Error('Failed to get invoice details');
      }

      return await response.json();
    } catch (error) {
      console.error('Error getting invoice details:', error);
      throw error;
    }
  }

  static async getCustomerInvoices(customerId: string): Promise<ZohoInvoice[]> {
    try {
      const response = await fetch(`/api/zoho/customers/${customerId}/invoices`);

      if (!response.ok) {
        throw new Error('Failed to get customer invoices');
      }

      return await response.json();
    } catch (error) {
      console.error('Error getting customer invoices:', error);
      throw error;
    }
  }
}