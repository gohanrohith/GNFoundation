import type { Metadata } from 'next';
import { Separator } from '@/components/ui/separator';

export const metadata: Metadata = {
  title: 'Terms of Service',
  description: 'Terms of Service for GN Foundation — rules and conditions for using our website and services.',
};

const sections = [
  {
    title: '1. Acceptance of Terms',
    content: `By accessing and using the GN Foundation website (gnfoundation.co.in), you agree to be bound by these Terms of Service. If you do not agree to these terms, please discontinue use of the website.`,
  },
  {
    title: '2. About GN Foundation',
    content: `GN Foundation is a non-profit charitable foundation established in memory of Smt. Girrem Narayanamma. Our primary activity is conducting the Regional Mathematics Talent Hunt (RMTH) and Regional Science Talent Hunt (RSTH) for school students, and recognising excellence through awards and certificates.`,
  },
  {
    title: '3. Certificate Download Service',
    content: `The certificate download feature is provided exclusively for students who have participated in our RMTH or RSTH examinations. To download a certificate:

• You must provide your correct admission number as issued by your school
• Certificates are generated based on data submitted by authorised school administrators
• GN Foundation is not responsible for errors in data submitted by schools
• Certificates are for personal use only and must not be altered or misrepresented`,
  },
  {
    title: '4. Accuracy of Information',
    content: `While we make every effort to ensure that information on this website is accurate and up to date, GN Foundation makes no warranties regarding the completeness or accuracy of the content. Exam dates, eligibility criteria, and prize details are subject to change without prior notice.`,
  },
  {
    title: '5. Intellectual Property',
    content: `All content on this website — including text, images, logos, graphics, and certificates — is the property of GN Foundation and is protected by applicable intellectual property laws. You may not reproduce, distribute, or use any content for commercial purposes without prior written permission.`,
  },
  {
    title: '6. Prohibited Use',
    content: `You agree not to:

• Use this website for any unlawful purpose
• Attempt to gain unauthorised access to any part of the website or its systems
• Submit false or misleading information through any form
• Interfere with the operation or security of the website
• Use automated tools to scrape or download content`,
  },
  {
    title: '7. Limitation of Liability',
    content: `GN Foundation shall not be liable for any indirect, incidental, or consequential damages arising from the use or inability to use this website or its services. Our total liability in connection with these terms shall not exceed the amount, if any, you have paid to use our services (which in most cases is zero, as our services are free).`,
  },
  {
    title: '8. Third-Party Links',
    content: `This website may contain links to third-party websites. GN Foundation is not responsible for the content, privacy practices, or terms of those websites. Links are provided for convenience only and do not constitute endorsement.`,
  },
  {
    title: '9. Governing Law',
    content: `These Terms of Service are governed by the laws of India. Any disputes arising from these terms shall be subject to the exclusive jurisdiction of courts in Hanumakonda, Telangana, India.`,
  },
  {
    title: '10. Changes to Terms',
    content: `GN Foundation reserves the right to modify these Terms of Service at any time. Updated terms will be posted on this page. Continued use of the website after changes constitutes your acceptance of the revised terms.`,
  },
  {
    title: '11. Contact',
    content: `For questions about these Terms of Service, please contact:

GN Foundation
Hanumakonda, Telangana, India
Email: info@gnfoundation.co.in
Phone: +91 9866 514 516`,
  },
];

export default function TermsPage() {
  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16 max-w-4xl">
      <div className="mb-10">
        <h1 className="text-3xl sm:text-4xl font-bold text-primary">Terms of Service</h1>
        <p className="mt-3 text-muted-foreground">Last updated: October 2026</p>
        <Separator className="mt-6" />
      </div>

      <p className="text-foreground/80 leading-relaxed mb-8">
        Please read these Terms of Service carefully before using the GN Foundation website. These terms govern your
        use of our website and the services we provide, including the certificate download facility.
      </p>

      <div className="space-y-8">
        {sections.map((section) => (
          <div key={section.title}>
            <h2 className="text-xl font-semibold text-primary mb-3">{section.title}</h2>
            <p className="text-foreground/80 leading-relaxed whitespace-pre-line">{section.content}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
