/**
 * PageNest Email Infrastructure Mock
 * Prepares system templates for Resend / SendGrid / Postmark integrations.
 */

interface SendEmailParams {
  to: string;
  subject: string;
  html: string;
}

export class EmailService {
  private static async sendRaw({ to, subject, html }: SendEmailParams): Promise<boolean> {
    // In production, integrate resend:
    // const resend = new Resend(process.env.RESEND_API_KEY);
    // await resend.emails.send({ ... });
    
    console.log(`[Email Dispatched] To: ${to} | Subject: ${subject} | Length: ${html.length} chars`);
    if (process.env.NODE_ENV !== "production") {
      // Simulate successful dispatch
      return true;
    }
    
    return true;
  }

  // Welcome Email for signups
  static async sendWelcomeEmail(to: string, userName: string): Promise<boolean> {
    const subject = "Welcome to PageNest! Let's build your first Ebook 📚";
    const html = `
      <div style="font-family: sans-serif; background-color: #070b14; color: #ffffff; padding: 40px; border-radius: 20px;">
        <h1 style="color: #7c3aed;">Welcome to PageNest, ${userName}!</h1>
        <p style="color: #94a3b8; font-size: 14px;">We are excited to help you generate and publish professional eBooks in minutes.</p>
        <p style="color: #94a3b8; font-size: 14px;">Log in to your workspace dashboard to generate your first eBook outline or design lead magnets.</p>
        <a href="https://pagenest.ai/dashboard" style="display: inline-block; background-color: #7c3aed; color: #ffffff; padding: 12px 24px; border-radius: 9999px; text-decoration: none; font-weight: bold; margin-top: 20px;">Go to Dashboard</a>
      </div>
    `;
    return this.sendRaw({ to, subject, html });
  }

  // Billing Success Invoices
  static async sendBillingInvoice(to: string, userName: string, planName: string, amount: number): Promise<boolean> {
    const subject = `PageNest Payment Invoice - ${planName} Plan`;
    const html = `
      <div style="font-family: sans-serif; background-color: #070b14; color: #ffffff; padding: 40px; border-radius: 20px;">
        <h1 style="color: #7c3aed;">Thank you for your purchase, ${userName}!</h1>
        <p style="color: #94a3b8; font-size: 14px;">Your payment of <strong>$${amount.toFixed(2)}</strong> for the PageNest <strong>${planName}</strong> plan has been processed successfully.</p>
        <p style="color: #94a3b8; font-size: 14px;">Your limits and template levels have been upgraded in your dashboard immediately.</p>
      </div>
    `;
    return this.sendRaw({ to, subject, html });
  }

  // Export Download Links
  static async sendExportNotification(to: string, ebookTitle: string, format: string, downloadUrl: string): Promise<boolean> {
    const subject = `Your eBook "${ebookTitle}" is ready for download! 🎉`;
    const html = `
      <div style="font-family: sans-serif; background-color: #070b14; color: #ffffff; padding: 40px; border-radius: 20px;">
        <h1 style="color: #7c3aed;">Your file is compiled!</h1>
        <p style="color: #94a3b8; font-size: 14px;">We have successfully compiled <strong>${ebookTitle}</strong> to <strong>${format.toUpperCase()}</strong> format.</p>
        <p style="color: #94a3b8; font-size: 14px;">You can download your document directly from the link below:</p>
        <a href="${downloadUrl}" style="display: inline-block; background-color: #7c3aed; color: #ffffff; padding: 12px 24px; border-radius: 9999px; text-decoration: none; font-weight: bold; margin-top: 20px;">Download File</a>
      </div>
    `;
    return this.sendRaw({ to, subject, html });
  }
}
