'use server';

import { z } from 'zod';

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

  // Simulate sending an email or saving to a database
  console.log('New contact form submission:', validatedFields.data);
  await new Promise((resolve) => setTimeout(resolve, 1000));

  return {
    success: true,
    message: 'Thank you for your message! We will get back to you shortly.',
  };
}
