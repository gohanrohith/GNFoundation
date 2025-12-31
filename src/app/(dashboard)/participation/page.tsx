import { CertificateForm } from './_components/certificate-form';

export default function ParticipationPage() {
  return (
    <div className="bg-card border rounded-lg shadow-sm">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-16 md:py-24">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-4xl font-bold tracking-tight text-primary">Download Your Certificate</h1>
          <p className="mt-4 text-lg text-muted-foreground">
            Select your exam type and enter your admission number to download your certificate of participation or
            achievement.
          </p>
        </div>

        <div className="mt-12 max-w-5xl mx-auto grid md:grid-cols-2 gap-8">
          <div>
            <h2 className="text-2xl font-semibold text-center mb-6 text-primary">RMTH Certificate</h2>
            <CertificateForm examType="RMTH" />
          </div>
          <div>
            <h2 className="text-2xl font-semibold text-center mb-6 text-primary">RSTH Certificate</h2>
            <CertificateForm examType="RSTH" />
          </div>
        </div>
      </div>
    </div>
  );
}
