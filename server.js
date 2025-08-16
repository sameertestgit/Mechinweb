// Express server setup for API endpoints
// Deploy this to your hosting provider (Vercel, Netlify Functions, etc.)

const express = require('express');
const cors = require('cors');
const { handleQuoteRequest } = require('./api/create-quote');
const { handleContactForm } = require('./api/contact');
const { handleNotifications } = require('./api/send-notifications');
const { registerClient, loginClient, getClientProfile } = require('./api/client-auth');
const { createPaymentIntent, handlePaymentSuccess, handleStripeWebhook } = require('./api/payment');

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(cors());
app.use(express.json());

// API Routes
app.post('/api/create-quote', handleQuoteRequest);
app.post('/api/contact', handleContactForm);
app.post('/api/send-notifications', handleNotifications);

// Client Authentication Routes
app.post('/api/client/register', registerClient);
app.post('/api/client/login', loginClient);
app.get('/api/client/profile', getClientProfile);

// Payment Routes
app.post('/api/create-payment-intent', createPaymentIntent);
app.post('/api/payment-success', handlePaymentSuccess);
app.post('/api/stripe-webhook', express.raw({type: 'application/json'}), handleStripeWebhook);

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'OK', message: 'Mechinweb API is running' });
});

app.listen(PORT, () => {
  console.log(`Mechinweb API server running on port ${PORT}`);
});

module.exports = app;