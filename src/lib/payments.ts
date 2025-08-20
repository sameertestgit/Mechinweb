import { loadStripe } from '@stripe/stripe-js';
import { supabase } from './supabase';

const stripePublishableKey = import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY;
const stripePromise = stripePublishableKey ? loadStripe(stripePublishableKey) : null;

export interface PaymentIntent {
  id: string;
  client_secret: string;
  amount: number;
  currency: string;
  status: string;
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

      const response = await fetch('/.netlify/functions/create-payment-intent', {
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

  static async confirmPayment(paymentIntentId: string): Promise<boolean> {
    try {
      const stripe = await stripePromise;
      if (!stripe) {
        console.warn('Stripe not configured. Using demo mode.');
        // In demo mode, simulate successful payment
        return true;
      }

      const { error } = await stripe.confirmCardPayment(paymentIntentId);
      
      if (error) {
        console.error('Payment confirmation error:', error);
        return false;
      }

      return true;
    } catch (error) {
      console.error('Error confirming payment:', error);
      return false;
    }
  }

  static async processPaymentSuccess(
    paymentIntentId: string,
    serviceId: string,
    packageType: string,
    amount: number
  ): Promise<{ orderId: string; invoiceId: string }> {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('User not authenticated');

      // Create order record
      const { data: order, error: orderError } = await supabase
        .from('orders')
        .insert([{
          client_id: user.id,
          service_id: serviceId,
          package_type: packageType,
          amount_usd: amount,
          amount_inr: Math.round(amount * 83.5), // Approximate conversion
          currency: 'USD',
          status: 'paid',
          payment_intent_id: paymentIntentId
        }])
        .select()
        .single();

      if (orderError) throw orderError;

      // Create invoice record
      const invoiceNumber = `INV-${Date.now()}`;
      const { data: invoice, error: invoiceError } = await supabase
        .from('invoices')
        .insert([{
          order_id: order.id,
          client_id: user.id,
          invoice_number: invoiceNumber,
          amount_usd: amount,
          amount_inr: Math.round(amount * 83.5),
          currency: 'USD',
          tax_amount: amount * 0.1,
          total_amount: amount * 1.1,
          status: 'paid',
          due_date: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString()
        }])
        .select()
        .single();

      if (invoiceError) throw invoiceError;

      // Send confirmation email
      await this.sendPaymentConfirmationEmail(user.id, order.id, invoice.id);

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
  ): Promise<void> {
    try {
      await fetch('/.netlify/functions/send-payment-confirmation', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          clientId,
          orderId,
          invoiceId
        })
      });
    } catch (error) {
      console.error('Error sending confirmation email:', error);
    }
  }
}