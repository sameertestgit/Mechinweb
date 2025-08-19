const nodemailer = require('nodemailer');

exports.handler = async (event, context) => {
  if (event.httpMethod !== 'POST') {
    return { statusCode: 405, body: 'Method Not Allowed' };
  }

  try {
    const { clientId, orderId, invoiceId } = JSON.parse(event.body);

    const emailTransporter = nodemailer.createTransporter({
      host: 'smtp.zoho.in',
      port: 465,
      secure: true,
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASSWORD
      }
    });

    // Get client details from Supabase (you'll need to implement this)
    // For now, using placeholder data
    const clientEmail = 'client@example.com';
    const clientName = 'Client Name';

    const emailOptions = {
      from: process.env.EMAIL_USER,
      to: clientEmail,
      subject: 'Payment Confirmation - Mechinweb Services',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <div style="background: linear-gradient(135deg, #10B981, #059669); padding: 30px; text-align: center;">
            <h1 style="color: white; margin: 0;">Payment Successful!</h1>
          </div>
          
          <div style="padding: 30px; background: #f8f9fa;">
            <p>Dear ${clientName},</p>
            
            <p>Thank you for your payment! Your order has been confirmed and we'll begin working on your service immediately.</p>
            
            <div style="background: white; padding: 20px; border-radius: 8px; margin: 20px 0;">
              <h3 style="color: #10B981; margin-top: 0;">Order Details:</h3>
              <p><strong>Order ID:</strong> ${orderId}</p>
              <p><strong>Invoice ID:</strong> ${invoiceId}</p>
              <p><strong>Payment Date:</strong> ${new Date().toLocaleDateString()}</p>
            </div>
            
            <div style="text-align: center; margin: 30px 0;">
              <a href="${process.env.CLIENT_PORTAL_URL || 'https://mechinweb.com'}/client/dashboard" 
                 style="background: linear-gradient(135deg, #10B981, #059669); color: white; padding: 15px 30px; text-decoration: none; border-radius: 8px; font-weight: bold;">
                View Dashboard
              </a>
            </div>
            
            <p>Best regards,<br>
            The Mechinweb Team</p>
          </div>
        </div>
      `
    };

    await emailTransporter.sendMail(emailOptions);

    return {
      statusCode: 200,
      body: JSON.stringify({ message: 'Confirmation email sent successfully!' })
    };

  } catch (error) {
    console.error('Email sending error:', error);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: 'Failed to send confirmation email' })
    };
  }
};