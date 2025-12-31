import { Mail, Phone, MapPin } from 'lucide-react';
import { ContactForm } from './_components/contact-form';

export default function ContactPage() {
  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-16">
      <div className="text-center mb-8 sm:mb-12">
        <h1 className="text-3xl sm:text-4xl font-bold tracking-tight text-primary">Get In Touch</h1>
        <p className="mt-2 sm:mt-4 max-w-2xl mx-auto text-md sm:text-lg text-muted-foreground">
          We'd love to hear from you. Whether you have a question, feedback, or need assistance, feel free to reach
          out.
        </p>
      </div>

      <div className="grid md:grid-cols-2 gap-12">
        <div className="space-y-8">
          <div>
            <h2 className="text-2xl font-semibold text-primary mb-4">Contact Information</h2>
            <div className="space-y-4 text-base sm:text-lg text-foreground/90">
              <div className="flex items-start gap-4">
                <MapPin className="h-6 w-6 text-primary mt-1 flex-shrink-0" />
                <span>GN Foundation, Hanumakonda, Telangana, India</span>
              </div>
              <div className="flex items-center gap-4">
                <Mail className="h-6 w-6 text-primary" />
                <a href="mailto:info@gnfoundation.org" className="hover:text-primary transition-colors break-all">
                  info@gnfoundation.org
                </a>
              </div>
              <div className="flex items-center gap-4">
                <Phone className="h-6 w-6 text-primary" />
                <a href="tel:+919866514516" className="hover:text-primary transition-colors">
                  +91 9866 514 516
                </a>
              </div>
            </div>
          </div>
        </div>

        <div>
          <ContactForm />
        </div>
      </div>
    </div>
  );
}
