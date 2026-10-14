import type { Metadata } from 'next';
import { Separator } from '@/components/ui/separator';

export const metadata: Metadata = {
  title: 'Privacy Policy',
  description: 'Privacy Policy for GN Foundation — how we collect, use, and protect your information.',
};

const sections = [
  {
    title: '1. Information We Collect',
    content: `When students use our certificate download service, we collect the following information provided by schools or uploaded by our administrators:

• Student name
• Admission number
• Father's / Guardian's name
• School name and class
• Exam type (RMTH or RSTH) and year
• Marks, rank, and grade (where applicable)

When you use our contact form, we collect your name, email address, and the content of your message.`,
  },
  {
    title: '2. How We Use Your Information',
    content: `We use the information collected solely for the following purposes:

• Generating and providing participation and achievement certificates to students
• Responding to enquiries submitted through our contact form
• Maintaining records of exam participation and awards
• Improving our services and website experience`,
  },
  {
    title: '3. Data Storage and Security',
    content: `Student records are stored securely in an encrypted database. We implement appropriate technical and organisational measures to protect your personal information against unauthorised access, alteration, disclosure, or destruction.

Access to student data is restricted to authorised administrators only and is protected by secure authentication.`,
  },
  {
    title: '4. Sharing of Information',
    content: `GN Foundation does not sell, trade, or rent your personal information to third parties. We do not share student data with any external organisations except:

• As required by law or a court order
• With service providers who assist us in operating our website (e.g., cloud storage for certificates), under strict confidentiality agreements`,
  },
  {
    title: '5. Cookies',
    content: `Our website uses session cookies solely for administrative authentication. These cookies are not used to track visitors or serve advertising. You may disable cookies in your browser settings, but doing so may affect the functionality of the admin panel.`,
  },
  {
    title: '6. Children\'s Privacy',
    content: `Our services are primarily used by school students. We do not knowingly collect personal information directly from children. All student data is submitted and managed through schools and authorised administrators, not directly by students.`,
  },
  {
    title: '7. Data Retention',
    content: `We retain student records for as long as necessary to provide certificate services and maintain accurate historical records of our talent hunt programmes. Contact form messages are retained for a reasonable period to allow us to respond to your enquiry.`,
  },
  {
    title: '8. Your Rights',
    content: `You have the right to:

• Request access to personal information we hold about you
• Request correction of inaccurate data
• Request deletion of your data, subject to our legal obligations

To exercise any of these rights, please contact us at info@gnfoundation.com.`,
  },
  {
    title: '9. Changes to This Policy',
    content: `We may update this Privacy Policy from time to time. Any changes will be posted on this page with an updated date. We encourage you to review this policy periodically.`,
  },
  {
    title: '10. Contact Us',
    content: `If you have any questions about this Privacy Policy or how we handle your data, please contact us:

GN Foundation
Hanumakonda, Telangana, India
Email: info@gnfoundation.com
Phone: +91 9866 514 516`,
  },
];

export default function PrivacyPolicyPage() {
  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16 max-w-4xl">
      <div className="mb-10">
        <h1 className="text-3xl sm:text-4xl font-bold text-primary">Privacy Policy</h1>
        <p className="mt-3 text-muted-foreground">Last updated: October 2026</p>
        <Separator className="mt-6" />
      </div>

      <p className="text-foreground/80 leading-relaxed mb-8">
        GN Foundation (&quot;we&quot;, &quot;our&quot;, or &quot;us&quot;) is committed to protecting the privacy of
        students, parents, and visitors who use our website and services. This Privacy Policy explains how we collect,
        use, and safeguard your information.
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
