import { supabase } from './supabase';
import { ZohoService } from './zoho';

export interface PaymentIntent {
  invoice_id: string;
  payment_url?: string;
  amount: number;
  currency: string;
}

export class PaymentService {
  // Create payment intent using Zoho Invoice
  static async createPaymentIntent(
    serviceId: string,
    packageType: string,
    amount: number,
    currency: string
  ): Promise<PaymentIntent> {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('User not authenticated');

      // Get client data
      const { data: client } = await supabase
        .from('clients')
        .select('*')
        .eq('id', user.id)
        .single();

      if (!client) throw new Error('Client not found');

      // Get service data
      const { data: service } = await supabase
        .from('services')
        .select('*')
        .eq('id', serviceId)
        .single();

      if (!service) throw new Error('Service not found');

      // Create order in database
      const { data: order, error: orderError } = await supabase
        .from('orders')
        .insert([{
          client_id: user.id,
          service_id: serviceId,
          package_type: packageType,
          amount_usd: currency === 'usd' ? amount : 0,
          amount_inr: currency === 'inr' ? amount : 0,
          currency: currency.toUpperCase(),
          status: 'pending',
          payment_gateway: 'zoho'
        }])
        .select()
        .single();

      if (orderError) throw orderError;

      // Create Zoho invoice
      const zohoInvoice = await ZohoService.createInvoice({
        customer: {
          name: client.name,
          email: client.email,
          company: client.company || ''
        },
        items: [{
          name: service.name,
          description: `${service.name} - ${packageType} package`,
          rate: amount,
          quantity: 1
        }],
        currency: currency.toUpperCase()
      });

      // Update order with Zoho invoice ID
      await supabase
        .from('orders')
        .update({
          zoho_invoice_id: zohoInvoice.invoice_id,
          zoho_customer_id: zohoInvoice.customer_id
        })
        .eq('id', order.id);

      return {
        invoice_id: zohoInvoice.invoice_id,
        payment_url: zohoInvoice.payment_url,
        amount,
        currency: currency.toUpperCase()
      };
    } catch (error) {
      console.error('Error creating payment intent:', error);
      throw error;
    }
  }

  // Confirm payment (webhook handler)
  static async confirmPayment(invoiceId: string): Promise<boolean> {
    try {
      // Get invoice status from Zoho
      const invoiceStatus = await ZohoService.getInvoiceStatus(invoiceId);
      
      if (invoiceStatus.status === 'paid') {
        // Update order status
        await supabase
          .from('orders')
          .update({ 
            status: 'paid',
            updated_at: new Date().toISOString()
          })
          .eq('zoho_invoice_id', invoiceId);

        return true;
      }
      
      return false;
    } catch (error) {
      console.error('Error confirming payment:', error);
      return false;
    }
  }

  // Process payment success
  static async processPaymentSuccess(
    invoiceId: string,
    serviceId: string,
    packageType: string,
    amount: number
  ) {
    try {
      // Get order by invoice ID
      const { data: order } = await supabase
        .from('orders')
        .select('*')
        .eq('zoho_invoice_id', invoiceId)
        .single();

      if (!order) throw new Error('Order not found');

      // Update order status to completed
      await supabase
        .from('orders')
        .update({ 
          status: 'completed',
          updated_at: new Date().toISOString()
        })
        .eq('id', order.id);

      // Create invoice record
      const { data: invoice } = await supabase
        .from('invoices')
        .insert([{
          order_id: order.id,
          client_id: order.client_id,
          invoice_number: `INV-${Date.now()}`,
          amount_usd: order.amount_usd,
          amount_inr: order.amount_inr,
          currency: order.currency,
          total_amount: amount,
          status: 'paid',
          due_date: new Date().toISOString()
        }])
        .select()
        .single();

      // Send confirmation email
      await this.sendPaymentConfirmationEmail(order.client_id, {
        orderId: order.id,
        invoiceId: invoice?.id,
        amount,
        currency: order.currency,
        serviceName: serviceId,
        packageType
      });

      return {
        orderId: order.id,
        invoiceId: invoice?.id
      };
    } catch (error) {
      console.error('Error processing payment success:', error);
      throw error;
    }
  }

  // Send payment confirmation email
  private static async sendPaymentConfirmationEmail(
    clientId: string,
    paymentDetails: any
  ) {
    try {
      const { data: client } = await supabase
        .from('clients')
        .select('*')
        .eq('id', clientId)
        .single();

      if (!client) return;

      // Call email service
      await supabase.functions.invoke('send-email', {
        body: {
          to: client.email,
          template: 'payment_confirmation',
          variables: {
            clientName: client.name,
            ...paymentDetails
          }
        }
      });
    } catch (error) {
      console.error('Error sending payment confirmation email:', error);
    }
  }

  // Get user orders
  static async getUserOrders() {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('User not authenticated');

      const { data: orders, error } = await supabase
        .from('orders')
        .select(`
          *,
          services (name, description)
        `)
        .eq('client_id', user.id)
        .order('created_at', { ascending: false });

      if (error) throw error;
      return orders || [];
    } catch (error) {
      console.error('Error getting user orders:', error);
      throw error;
    }
  }

  // Get user invoices
  static async getUserInvoices() {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('User not authenticated');

      const { data: invoices, error } = await supabase
        .from('invoices')
        .select(`
          *,
          orders (
            services (name, description)
          )
        `)
        .eq('client_id', user.id)
        .order('created_at', { ascending: false });

      if (error) throw error;
      return invoices || [];
    } catch (error) {
      console.error('Error getting user invoices:', error);
      throw error;
    }
  }
}