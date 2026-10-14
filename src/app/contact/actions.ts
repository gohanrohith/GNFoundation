'use server';

import { z } from 'zod';
import { sendContactEmail } from '@/lib/mailer';

const schema = z.object({
  name: z.string().min(1, 'Name is required.'),
  email: z.string().email('Invalid email address.'),
  subject: z.string().min(1, 'Subject is required.'),
  message: z.string().min(10, 'Message must be at least 10 characters long.'),
});

export type ContactFormState = {
  success: boolean;
  message: string;
};

export async function submitContactForm(prevState: ContactFormState, formData: FormData): Promise<ContactFormState> {
  const validatedFields = schema.safeParse({
    name: formData.get('name'),
    email: formData.get('email'),
    subject: formData.get('subject'),
    message: formData.get('message'),
  });

  if (!validatedFields.success) {
    const errorMessages = validatedFields.error.errors.map((e) => e.message).join(' ');
    return {
      success: false,
      message: `There was an error with your submission: ${errorMessages}`,
    };
  }

  if (!process.env.SMTP_USER || !process.env.SMTP_PASS) {
    console.error('SMTP credentials not configured');
    return {
      success: false,
      message: 'Email service is not configured. Please contact us directly at info@gnfoundation.com.',
    };
  }

  try {
    const { name, email, subject, message } = validatedFields.data;
    await sendContactEmail({ senderName: name, senderEmail: email, subject, message });

    return {
      success: true,
      message: 'Thank you for your message! We will get back to you shortly.',
    };
  } catch (error) {
    console.error('Failed to send contact email:', error);
    return {
      success: false,
      message: 'Failed to send your message. Please try again or email us directly at info@gnfoundation.com.',
    };
  }
}
