import type { Metadata } from 'next';
import { Mail, Phone, MapPin } from 'lucide-react';
import { ContactForm } from './_components/contact-form';

export const metadata: Metadata = {
  title: 'Contact Us',
  description: "Get in touch with GN Foundation. We'd love to hear from you — reach out with questions, feedback, or for assistance.",
};

export default function ContactPage() {
  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-16">
      <div className="text-center mb-8 sm:mb-12">
        <h1 className="text-3xl sm:text-4xl font-bold tracking-tight text-primary">Get In Touch</h1>
        <p className="mt-2 sm:mt-4 max-w-2xl mx-auto text-lg text-muted-foreground">
          We&apos;d love to hear from you. Whether you have a question, feedback, or need assistance, feel free to reach
          out.
        </p>
      </div>

      <div className="grid md:grid-cols-2 gap-12">
        <div className="space-y-8">
          <div>
            <h2 className="text-2xl font-semibold text-primary mb-6">Contact Information</h2>
            <div className="space-y-5">
              <div className="flex items-start gap-4 text-foreground/90">
                <div className="bg-primary/10 p-2.5 rounded-lg flex-shrink-0">
                  <MapPin className="h-5 w-5 text-primary" />
                </div>
                <span className="pt-1">GN Foundation, Hanumakonda, Telangana, India</span>
              </div>
              <div className="flex items-center gap-4 text-foreground/90">
                <div className="bg-primary/10 p-2.5 rounded-lg flex-shrink-0">
                  <Mail className="h-5 w-5 text-primary" />
                </div>
                <a href="mailto:info@gnfoundation.com" className="hover:text-primary transition-colors break-all">
                  info@gnfoundation.com
                </a>
              </div>
              <div className="flex items-center gap-4 text-foreground/90">
                <div className="bg-primary/10 p-2.5 rounded-lg flex-shrink-0">
                  <Phone className="h-5 w-5 text-primary" />
                </div>
                <a href="tel:+919866514516" className="hover:text-primary transition-colors">
                  +91 9866 514 516
                </a>
              </div>
            </div>
          </div>

          <div className="bg-accent/15 rounded-xl p-6 border border-accent/30">
            <p className="text-sm font-semibold text-primary mb-1">Office Hours</p>
            <p className="text-muted-foreground text-sm">
              Monday – Saturday: 9:00 AM – 5:00 PM IST<br />
              We typically respond within one business day.
            </p>
          </div>
        </div>

        <div>
          <ContactForm />
        </div>
      </div>
    </div>
  );
}
