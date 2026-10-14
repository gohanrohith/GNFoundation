import type { Metadata } from 'next';
import { ContactForm } from './_components/contact-form';

export const metadata: Metadata = {
  title: 'Contact Us',
  description: "Get in touch with GN Foundation. Reach out with questions, feedback, or for assistance with the RMTH & RSTH talent hunt examinations.",
};

export default function ContactPage() {
  return (
    <div>
      {/* Page header */}
      <div style={{ background: '#0D2340' }} className="px-6 lg:px-10 py-10">
        <div className="max-w-[1200px] mx-auto">
          <div className="text-[10px] font-bold tracking-[0.2em] uppercase text-[#B8920A] mb-3">Correspondence</div>
          <h1 className="font-heading text-white text-[clamp(32px,4vw,52px)] font-semibold leading-[1.1]">
            Contact GN Foundation
          </h1>
          <p className="text-white/50 text-[15px] mt-3 font-light">
            Reach us with questions, school registration enquiries, or for assistance with certificates.
          </p>
        </div>
      </div>

      <div className="max-w-[1200px] mx-auto px-6 lg:px-10 py-10">

        {/* Section header */}
        <div className="flex items-baseline gap-5 pb-5 border-b-2 border-[#0D2340] mb-0">
          <span className="font-heading text-[13px] text-[#8C6A1A] tracking-[0.06em]">I.</span>
          <h2 className="font-heading text-[28px] font-semibold text-[#0D2340] leading-none">Get In Touch</h2>
          <span className="flex-1 h-px bg-[#C8BFA8]" />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-[300px_1fr] border-l border-[#C8BFA8]">

          {/* Contact info sidebar */}
          <div className="p-8 border-r border-b border-[#C8BFA8] bg-white">
            <div className="space-y-0">
              {/* Contact heading */}
              <div className="text-[10px] font-bold tracking-[0.18em] uppercase text-[#0D2340] pb-2 border-b-2 border-[#0D2340] mb-0">
                Contact Information
              </div>

              {[
                { k: 'Address',     v: 'GN Foundation, Hanumakonda,\nTelangana, India' },
                { k: 'Email',       v: 'info@gnfoundation.co.in', href: 'mailto:info@gnfoundation.co.in' },
                { k: 'Phone',       v: '+91 9866 514 516',       href: 'tel:+919866514516' },
                { k: 'Office Hours', v: 'Mon – Sat: 9:00 AM – 5:00 PM IST\nUsually responds within one business day.' },
              ].map(({ k, v, href }) => (
                <div key={k} className="py-4 border-b border-[#C8BFA8] last:border-b-0">
                  <div className="text-[11px] font-semibold tracking-[0.06em] uppercase text-[#8C6A1A] mb-1.5">{k}</div>
                  {href ? (
                    <a href={href} className="font-heading text-[16px] text-[#0D2340] hover:text-[#16325C] transition-colors break-all">
                      {v}
                    </a>
                  ) : (
                    <p className="text-[14px] text-[#5C5040] font-light leading-[1.6] whitespace-pre-line">{v}</p>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Contact form */}
          <div className="p-8 border-b border-[#C8BFA8] bg-[#F8F5EF]">
            <ContactForm />
          </div>

        </div>
      </div>
    </div>
  );
}
