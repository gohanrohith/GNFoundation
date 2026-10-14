import nodemailer from 'nodemailer';

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST || 'smtp.gmail.com',
  port: Number(process.env.SMTP_PORT) || 587,
  secure: false, // STARTTLS
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
});

export interface ContactMailOptions {
  senderName: string;
  senderEmail: string;
  subject: string;
  message: string;
}

export async function sendContactEmail(opts: ContactMailOptions) {
  const toEmail = process.env.CONTACT_EMAIL || process.env.SMTP_USER;

  await transporter.sendMail({
    from: `"${opts.senderName}" <${process.env.SMTP_USER}>`,
    replyTo: opts.senderEmail,
    to: toEmail,
    subject: `[GN Foundation Contact] ${opts.subject}`,
    text: `From: ${opts.senderName} <${opts.senderEmail}>\n\n${opts.message}`,
    html: `
      <div style="font-family:sans-serif;max-width:600px;margin:0 auto">
        <h2 style="color:#1E3A8A">New Contact Form Submission</h2>
        <table style="width:100%;border-collapse:collapse">
          <tr><td style="padding:8px;font-weight:bold;width:120px">Name</td><td style="padding:8px">${opts.senderName}</td></tr>
          <tr style="background:#f5f5f5"><td style="padding:8px;font-weight:bold">Email</td><td style="padding:8px"><a href="mailto:${opts.senderEmail}">${opts.senderEmail}</a></td></tr>
          <tr><td style="padding:8px;font-weight:bold">Subject</td><td style="padding:8px">${opts.subject}</td></tr>
          <tr style="background:#f5f5f5"><td style="padding:8px;font-weight:bold;vertical-align:top">Message</td><td style="padding:8px;white-space:pre-wrap">${opts.message}</td></tr>
        </table>
        <p style="color:#999;font-size:12px;margin-top:24px">Sent via gnfoundation.com contact form</p>
      </div>
    `,
  });
}
