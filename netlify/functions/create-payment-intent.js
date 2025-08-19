const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);

exports.handler = async (event, context) => {
  if (event.httpMethod !== 'POST') {
    return { statusCode: 405, body: 'Method Not Allowed' };
  }

  try {
    const { serviceId, packageType, amount, currency, clientId } = JSON.parse(event.body);

    // Validate input
    if (!serviceId || !packageType || !amount || !clientId) {
      return {
        statusCode: 400,
        body: JSON.stringify({ error: 'Missing required parameters' })
      };
    }

    // Create payment intent
    const paymentIntent = await stripe.paymentIntents.create({
      amount: Math.round(amount * 100), // Convert to cents
      currency: currency || 'usd',
      metadata: {
        serviceId,
        packageType,
        clientId
      },
      automatic_payment_methods: {
        enabled: true,
      },
    });

    return {
      statusCode: 200,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Headers': 'Content-Type, Authorization',
        'Access-Control-Allow-Methods': 'POST, OPTIONS'
      },
      body: JSON.stringify({
        id: paymentIntent.id,
        client_secret: paymentIntent.client_secret,
        amount: amount,
        currency: currency || 'usd',
        status: paymentIntent.status
      })
    };

  } catch (error) {
    console.error('Payment intent creation error:', error);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: 'Failed to create payment intent' })
    };
  }
};