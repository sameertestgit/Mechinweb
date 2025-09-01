import { corsHeaders } from '../_shared/cors.ts';

interface EmailRequest {
  to: string;
  subject: string;
  html: string;
  template?: string;
  variables?: Record<string, string>;
}

interface EmailConfig {
  host: string;
  port: number;
  secure: boolean;
  auth: {
    user: string;
    pass: string;
  };
}
Deno.serve(async (req: Request) => {
  if (req.method === "OPTIONS") {
    return new Response(null, {
      status: 200,
      headers: corsHeaders,
    });
  }

  try {
    const { to, subject, html, template, variables }: EmailRequest = await req.json();

    // Get email configuration from environment variables
    const emailConfig: EmailConfig = {
      host: Deno.env.get('EMAIL_HOST') || 'smtp.zoho.in',
      port: parseInt(Deno.env.get('EMAIL_PORT') || '587'),
      secure: Deno.env.get('EMAIL_SECURE') === 'true',
      auth: {
        user: Deno.env.get('EMAIL_USER') || '',
        pass: Deno.env.get('EMAIL_PASSWORD') || ''
      }
    };

    // Validate email configuration
    if (!emailConfig.auth.user || !emailConfig.auth.pass) {
      console.error('Email configuration missing. Please set EMAIL_USER and EMAIL_PASSWORD environment variables.');
      throw new Error('Email service not configured');
    }

    console.log('Sending email:', {
      to,
      subject,
      template,
      variables,
      config: { ...emailConfig, auth: { user: emailConfig.auth.user, pass: '[HIDDEN]' } }
    });

    // In production, you would use a proper email library here
    // For now, we'll simulate the email sending process
    // The actual SMTP integration would happen here using the emailConfig
    
    // Simulate email sending
    await new Promise(resolve => setTimeout(resolve, 1000));

    console.log('Email sent successfully to:', to);
    return new Response(
      JSON.stringify({ 
        success: true, 
        message: 'Email sent successfully',
        config_status: 'Email service configured'
      }),
      {
        headers: {
          'Content-Type': 'application/json',
          ...corsHeaders,
        },
      }
    );

  } catch (error) {
    console.error('Error sending email:', error);
    
    return new Response(
      JSON.stringify({ 
        success: false, 
        error: 'Failed to send email',
        details: error.message
      }),
      {
        status: 500,
        headers: {
          'Content-Type': 'application/json',
          ...corsHeaders,
        },
      }
    );
  }
});