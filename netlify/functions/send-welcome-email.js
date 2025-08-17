const nodemailer = require('nodemailer');

exports.handler = async (event, context) => {
  if (event.httpMethod !== 'POST') {
    return { statusCode: 405, body: 'Method Not Allowed' };
  }

  try {
    const { name, email } = JSON.parse(event.body);

    const emailTransporter = nodemailer.createTransport({
      host: 'smtppro.zoho.in', // Zoho SMTP server host
      port: 465, // Zoho SMTP port for SSL
      secure: true, // Use SSL/TLS
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASSWORD
      }
    });

    const emailOptions = {
      from: process.env.EMAIL_USER,
      to: email,
      subject: 'Welcome to Mechinweb - Your Account is Ready!',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h1 style="color: white;">Welcome to Mechinweb!</h1>
          <p>Dear ${name},</p>
          <p>Welcome to Mechinweb! Your client account has been successfully created and you can now access our services.</p>
          <a href="${process.env.CLIENT_PORTAL_URL}" style="color: white; padding: 15px; background: #007bff;">
            Access Your Dashboard
          </a>
        </div>
      `
    };

    await emailTransporter.sendMail(emailOptions);

    return {
      statusCode: 200,
      body: JSON.stringify({ message: 'Email sent successfully!' })
    };

  } catch (error) {
    console.error('Email sending error:', error);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: 'Failed to send email.' })
    };
  }
};
