import { supabase } from './supabase';
import { ZohoService } from './zoho';
import { EncryptionService } from './encryption';


export interface PaymentIntent {
  id: string;
  invoice_id: string;
  amount: number;
  currency: string;
  status: string;
  payment_url?: string;
}

export interface PaymentMethod {
  id: string;
  type: string;
  card?: {
    brand: string;
    last4: string;
    exp_month: number;
    exp_year: number;
  };
}

export class PaymentService {
  static async createPaymentIntent(
    serviceId: string,
    packageType: string,
    amount: number,
    currency: string = 'usd'
  ): Promise<PaymentIntent> {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('User not authenticated');

      // Get or create Zoho customer
      const { data: clientData } = await supabase
        .from('clients')
        .select('*')
        .eq('id', user.id)
        .single();

      if (!clientData) throw new Error('Client data not found');

      const zohoCustomer = await ZohoService.createCustomer({
        name: clientData.name,
        email: clientData.email,
        phone: clientData.phone,
        company: clientData.company
      });

      // Create Zoho invoice
      const zohoInvoice = await ZohoService.createInvoice({
        customerId: zohoCustomer.contact_id,
        serviceId,
        packageType,
        amount,
        currency
      });

      // Create order record
      const { data: order, error: orderError } = await supabase
        .from('orders')
        .insert([{
          client_id: user.id,
          service_id: serviceId,
          package_type: packageType,
          amount_usd: currency === 'usd' ? amount : amount / 83.5,
          amount_inr: currency === 'inr' ? amount : amount * 83.5,
          currency: currency.toUpperCase(),
          status: 'pending',
          zoho_invoice_id: zohoInvoice.invoice_id,
          zoho_customer_id: zohoCustomer.contact_id,
          payment_gateway: 'zoho'
        }])
        .select()
        .single();

      if (orderError) throw orderError;

      return {
        id: order.id,
        invoice_id: zohoInvoice.invoice_id,
        amount,
        currency,
        status: 'pending',
        payment_url: `https://invoice.zoho.com/invoices/${zohoInvoice.invoice_id}`
      };

    } catch (error) {
      console.error('Error creating payment intent:', error);
      throw error;
    }
  }
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${user.access_token}`
        },
        body: JSON.stringify({
          serviceId,
          packageType,
          amount,
          currency,
          clientId: user.id
        })
      });

      if (!response.ok) {
        throw new Error('Failed to create payment intent');
      }

      return await response.json();
    } catch (error) {
      console.error('Error creating payment intent:', error);
      throw error;
    }
  }

  static async confirmPayment(invoiceId: string, paymentReference?: string): Promise<boolean> {
    try {
      // In a real implementation, this would verify payment with Zoho
      // For now, we'll simulate successful payment confirmation
      console.log('Payment confirmed for invoice:', invoiceId);

      return true;
    } catch (error) {
      console.error('Error confirming payment:', error);
      return false;
    }
  }

  static async processPaymentSuccess(
    invoiceId: string,
    serviceId: string,
    packageType: string,
    amount: number,
    paymentReference?: string
  ): Promise<{ orderId: string; invoiceId: string }> {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('User not authenticated');

      // Update existing order to paid status
      const { data: order, error: orderError } = await supabase
        .from('orders')
        .update({
          status: 'paid',
          updated_at: new Date().toISOString()
        })
        .eq('zoho_invoice_id', invoiceId)
        .eq('client_id', user.id)
        .select()
        .single();

      if (orderError) throw orderError;

      // Record payment in Zoho
      if (paymentReference) {
        await ZohoService.recordPayment({
          invoiceId,
          amount,
          paymentMode: 'online',
          reference: paymentReference
        });
      }
      // Create invoice record
      const invoiceNumber = `INV-${Date.now()}`;
      const { data: invoice, error: invoiceError } = await supabase
        .from('invoices')
        .insert([{
          order_id: order.id,
          client_id: user.id,
          invoice_number: invoiceNumber,
          amount_usd: order.amount_usd,
          amount_inr: order.amount_inr,
          currency: order.currency,
          tax_amount: amount * 0.1,
          total_amount: amount * 1.1,
          status: 'paid',
          due_date: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString()
        }])
        .select()
        .single();

      if (invoiceError) throw invoiceError;

      // Send confirmation email
      await this.sendPaymentConfirmationEmail(user.id, order.id, invoice.id, serviceId, packageType, amount);

      return {
        orderId: order.id,
        invoiceId: invoice.id
      };
    } catch (error) {
      console.error('Error processing payment success:', error);
      throw error;
    }
  }

  static async sendPaymentConfirmationEmail(
    clientId: string,
    orderId: string,
    invoiceId: string
    serviceId: string,
    packageType: string,
    amount: number
  ): Promise<void> {
    try {
      const { data: clientData } = await supabase
        .from('clients')
        .select('name, email')
        .eq('id', clientId)
        .single();

      if (!clientData) throw new Error('Client not found');

      // Get service name
      const serviceNames = {
        'email-migration': 'Email Migration & Setup',
        'email-security': 'Domain & Email Security',
        'ssl-setup': 'SSL & HTTPS Setup',
        'cloud-management': 'Cloud Suite Management',
        'data-migration': 'Cloud Data Migration',
        'hosting-support': 'Hosting & Control Panel Support',
        'acronis-setup': 'Acronis Account Setup'
      };

      const serviceName = serviceNames[serviceId as keyof typeof serviceNames] || 'IT Service';

      await fetch('/api/send-email', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          template: 'payment_confirmation',
          to: clientData.email,
          variables: {
            client_name: clientData.name,
            service_name: serviceName,
            package_type: packageType.charAt(0).toUpperCase() + packageType.slice(1),
            order_id: orderId,
            amount: amount.toString(),
            payment_date: new Date().toLocaleDateString(),
            dashboard_url: `${window.location.origin}/client/dashboard`,
            invoice_url: `${window.location.origin}/client/invoices`
          }
        })
      });
    } catch (error) {
      console.error('Error sending confirmation email:', error);
    }
  }

  static async storePaymentMethod(paymentMethodData: {
    type: string;
    cardNumber?: string;
    expiryMonth?: number;
    expiryYear?: number;
    holderName?: string;
    isDefault?: boolean;
  }): Promise<void> {
    return await EncryptionService.storeEncryptedPaymentMethod(paymentMethodData);
  }

  static async getPaymentMethods(): Promise<any[]> {
    return await EncryptionService.getDecryptedPaymentMethods();
  }
}