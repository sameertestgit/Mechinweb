// Payment Processing API with Stripe Integration
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
const nodemailer = require('nodemailer');

// Email Configuration
const emailTransporter = nodemailer.createTransporter({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASSWORD
  }
});

// Service pricing configuration
const servicePricing = {
  'email-migration': {
    basic: 299,
    standard: 799,
    enterprise: 1499
  },
  'email-security': {
    basic: 199,
    advanced: 399,
    enterprise: 799
  },
  'ssl-setup': {
    basic: 149,
    standard: 299,
    enterprise: 499
  },
  'cloud-management': {
    basic: 399,
    standard: 299, // monthly
    enterprise: 599 // monthly
  },
  'data-migration': {
    basic: 499,
    standard: 999,
    enterprise: 1999
  },
  'hosting-support': {
    basic: 149,
    standard: 199, // monthly
    enterprise: 399 // monthly
  }
};

// Create payment intent
async function createPaymentIntent(req, res) {
  try {
    const { serviceId, packageType, clientId, clientEmail } = req.body;
    
    // Get service pricing
    const servicePrice = servicePricing[serviceId]?.[packageType];
    if (!servicePrice) {
      return res.status(400).json({
        success: false,
        message: 'Invalid service or package type'
      });
    }
    
    // Create payment intent with Stripe
    const paymentIntent = await stripe.paymentIntents.create({
      amount: servicePrice * 100, // Convert to cents
      currency: 'usd',
      metadata: {
        serviceId,
        packageType,
        clientId,
        clientEmail
      }
    });
    
    res.json({
      success: true,
      clientSecret: paymentIntent.client_secret,
      amount: servicePrice
    });
    
  } catch (error) {
    console.error('Payment intent creation error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to create payment intent',
      error: error.message
    });
  }
}

// Handle successful payment
async function handlePaymentSuccess(req, res) {
  try {
    const { paymentIntentId, clientId, serviceId, packageType } = req.body;
    
    // Verify payment with Stripe
    const paymentIntent = await stripe.paymentIntents.retrieve(paymentIntentId);
    
    if (paymentIntent.status !== 'succeeded') {
      return res.status(400).json({
        success: false,
        message: 'Payment not completed'
      });
    }
    
    // Create order record
    const order = {
      id: `ORD-${Date.now()}`,
      clientId,
      serviceId,
      packageType,
      amount: paymentIntent.amount / 100,
      status: 'paid',
      paymentIntentId,
      createdAt: new Date().toISOString()
    };
    
    // Generate invoice
    const invoice = await generateInvoice(order, paymentIntent);
    
    // Send confirmation emails
    await sendPaymentConfirmationEmails(order, invoice, paymentIntent);
    
    res.json({
      success: true,
      message: 'Payment processed successfully',
      orderId: order.id,
      invoiceId: invoice.id
    });
    
  } catch (error) {
    console.error('Payment processing error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to process payment',
      error: error.message
    });
  }
}

// Generate invoice
async function generateInvoice(order, paymentIntent) {
  const invoice = {
    id: `INV-${Date.now()}`,
    orderId: order.id,
    clientId: order.clientId,
    serviceId: order.serviceId,
    packageType: order.packageType,
    amount: order.amount,
    tax: order.amount * 0.1, // 10% tax
    total: order.amount * 1.1,
    status: 'paid',
    paymentMethod: 'Credit Card',
    paymentIntentId: paymentIntent.id,
    createdAt: new Date().toISOString(),
    dueDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString() // 30 days from now
  };
  
  // In production, save to database
  return invoice;
}

// Send payment confirmation emails
async function sendPaymentConfirmationEmails(order, invoice, paymentIntent) {
  const serviceNames = {
    'email-migration': 'Email Migration & Setup',
    'email-security': 'Domain & Email Security',
    'ssl-setup': 'SSL & HTTPS Setup',
    'cloud-management': 'Cloud Suite Management',
    'data-migration': 'Cloud Data Migration',
    'hosting-support': 'Hosting & Control Panel Support'
  };
  
  const serviceName = serviceNames[order.serviceId] || 'IT Service';
  const clientEmail = paymentIntent.metadata.clientEmail;
  
  // Email to customer
  const customerEmailOptions = {
    from: 'contact@mechinweb.com',
    to: clientEmail,
    subject: `Payment Confirmation - ${serviceName}`,
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <div style="background: linear-gradient(135deg, #10B981, #059669); padding: 30px; text-align: center;">
          <h1 style="color: white; margin: 0;">Payment Successful!</h1>
        </div>
        
        <div style="padding: 30px; background: #f8f9fa;">
          <p>Thank you for your payment! Your order has been confirmed and we'll begin working on your service immediately.</p>
          
          <div style="background: white; padding: 20px; border-radius: 8px; margin: 20px 0;">
            <h3 style="color: #10B981; margin-top: 0;">Order Details:</h3>
            <p><strong>Service:</strong> ${serviceName}</p>
            <p><strong>Package:</strong> ${order.packageType.charAt(0).toUpperCase() + order.packageType.slice(1)}</p>
            <p><strong>Order ID:</strong> ${order.id}</p>
            <p><strong>Invoice ID:</strong> ${invoice.id}</p>
            <p><strong>Amount Paid:</strong> $${order.amount}</p>
            <p><strong>Payment Date:</strong> ${new Date(order.createdAt).toLocaleDateString()}</p>
          </div>
          
          <div style="background: white; padding: 20px; border-radius: 8px; margin: 20px 0;">
            <h3 style="color: #10B981; margin-top: 0;">What happens next?</h3>
            <ol>
              <li>Our team will contact you within 24 hours to begin the project</li>
              <li>We'll provide you with a detailed project timeline</li>
              <li>You'll receive regular updates on the progress</li>
              <li>Upon completion, you'll get full documentation and support</li>
            </ol>
          </div>
          
          <div style="text-align: center; margin: 30px 0;">
            <a href="${process.env.CLIENT_PORTAL_URL || 'https://mechinweb.com/client/dashboard'}" 
               style="background: linear-gradient(135deg, #10B981, #059669); color: white; padding: 15px 30px; text-decoration: none; border-radius: 8px; font-weight: bold; margin-right: 10px;">
              View Dashboard
            </a>
            <a href="${process.env.CLIENT_PORTAL_URL || 'https://mechinweb.com'}/client/invoice/${invoice.id}" 
               style="background: #6B7280; color: white; padding: 15px 30px; text-decoration: none; border-radius: 8px; font-weight: bold;">
              Download Invoice
            </a>
          </div>
          
          <p>For immediate assistance:</p>
          <p>📧 Email: contact@mechinweb.com<br>
          📱 WhatsApp: +1 (555) 123-4567<br>
          📞 Phone: +1 (555) 123-4567</p>
          
          <p>Best regards,<br>
          The Mechinweb Team</p>
        </div>
      </div>
    `
  };

  // Email to business
  const businessEmailOptions = {
    from: 'contact@mechinweb.com',
    to: 'contact@mechinweb.com',
    subject: `New Payment Received - ${serviceName}`,
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #10B981;">New Payment Received</h2>
        
        <div style="background: #f8f9fa; padding: 20px; border-radius: 8px;">
          <h3>Payment Details:</h3>
          <p><strong>Service:</strong> ${serviceName}</p>
          <p><strong>Package:</strong> ${order.packageType.charAt(0).toUpperCase() + order.packageType.slice(1)}</p>
          <p><strong>Amount:</strong> $${order.amount}</p>
          <p><strong>Client Email:</strong> ${clientEmail}</p>
          <p><strong>Order ID:</strong> ${order.id}</p>
          <p><strong>Invoice ID:</strong> ${invoice.id}</p>
          <p><strong>Payment Intent ID:</strong> ${paymentIntent.id}</p>
          <p><strong>Payment Date:</strong> ${new Date(order.createdAt).toLocaleString()}</p>
        </div>
        
        <p><em>Please initiate the service delivery process and contact the client within 24 hours.</em></p>
      </div>
    `
  };

  await Promise.all([
    emailTransporter.sendMail(customerEmailOptions),
    emailTransporter.sendMail(businessEmailOptions)
  ]);
}

// Webhook handler for Stripe events
async function handleStripeWebhook(req, res) {
  const sig = req.headers['stripe-signature'];
  let event;

  try {
    event = stripe.webhooks.constructEvent(req.body, sig, process.env.STRIPE_WEBHOOK_SECRET);
  } catch (err) {
    console.error('Webhook signature verification failed:', err.message);
    return res.status(400).send(`Webhook Error: ${err.message}`);
  }

  // Handle the event
  switch (event.type) {
    case 'payment_intent.succeeded':
      const paymentIntent = event.data.object;
      console.log('Payment succeeded:', paymentIntent.id);
      // Handle successful payment
      break;
    case 'payment_intent.payment_failed':
      const failedPayment = event.data.object;
      console.log('Payment failed:', failedPayment.id);
      // Handle failed payment
      break;
    default:
      console.log(`Unhandled event type ${event.type}`);
  }

  res.json({ received: true });
}

module.exports = {
  createPaymentIntent,
  handlePaymentSuccess,
  handleStripeWebhook
};