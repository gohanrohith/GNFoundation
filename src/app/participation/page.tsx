'use client';

import { useState } from 'react';
import { CertificateForm } from './_components/certificate-form';

export default function ParticipationPage() {
  const [rmthKey, setRmthKey] = useState(0);
  const [rsthKey, setRsthKey] = useState(0);

  return (
    <div>
      {/* Page header */}
      <div style={{ background: '#0D2340' }} className="px-6 lg:px-10 py-10">
        <div className="max-w-[1200px] mx-auto">
          <div className="text-[10px] font-bold tracking-[0.2em] uppercase text-[#B8920A] mb-3">Records Office</div>
          <h1 className="font-heading text-white text-[clamp(32px,4vw,52px)] font-semibold leading-[1.1]">
            Certificate Download
          </h1>
          <p className="text-white/50 text-[15px] mt-3 font-light max-w-xl">
            Select your examination type and enter your admission number to retrieve your certificate
            of participation or merit.
          </p>
        </div>
      </div>

      <div className="max-w-[1200px] mx-auto px-6 lg:px-10 py-10">

        <div className="flex items-baseline gap-5 pb-5 border-b-2 border-[#0D2340] mb-0">
          <span className="font-heading text-[13px] text-[#8C6A1A] tracking-[0.06em]">I.</span>
          <h2 className="font-heading text-[28px] font-semibold text-[#0D2340] leading-none">Retrieve Your Certificate</h2>
          <span className="flex-1 h-px bg-[#C8BFA8]" />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 border-l border-[#C8BFA8]">

          {/* RMTH */}
          <div className="border-r border-b border-[#C8BFA8] bg-white">
            <div className="px-8 pt-7 pb-2 border-b border-[#C8BFA8]">
              <div className="text-[10px] font-bold tracking-[0.18em] uppercase text-[#8C6A1A] mb-1 flex items-center gap-2.5">
                <span className="w-5 h-px bg-[#8C6A1A] inline-block" />
                Mathematics
              </div>
              <h2 className="font-heading text-[22px] font-semibold text-[#0D2340]">RMTH Certificate</h2>
            </div>
            <div className="p-8 pt-6">
              <CertificateForm key={rmthKey} examType="RMTH" onReset={() => setRmthKey((k) => k + 1)} />
            </div>
          </div>

          {/* RSTH */}
          <div className="border-r border-b border-[#C8BFA8] bg-white">
            <div className="px-8 pt-7 pb-2 border-b border-[#C8BFA8]">
              <div className="text-[10px] font-bold tracking-[0.18em] uppercase text-[#8C6A1A] mb-1 flex items-center gap-2.5">
                <span className="w-5 h-px bg-[#8C6A1A] inline-block" />
                Science
              </div>
              <h2 className="font-heading text-[22px] font-semibold text-[#0D2340]">RSTH Certificate</h2>
            </div>
            <div className="p-8 pt-6">
              <CertificateForm key={rsthKey} examType="RSTH" onReset={() => setRsthKey((k) => k + 1)} />
            </div>
          </div>

        </div>

        {/* Help note */}
        <div className="mt-0 border border-t-0 border-[#C8BFA8] bg-[#F8F5EF] px-8 py-5">
          <span className="text-[11px] font-semibold tracking-[0.08em] uppercase text-[#8C6A1A]">Need help? </span>
          <span className="text-[13px] text-[#5C5040]">
            If you do not have your admission number, contact{' '}
            <a href="mailto:info@gnfoundation.com" className="text-[#0D2340] underline underline-offset-2">
              info@gnfoundation.com
            </a>{' '}
            with your full name, school, and class.
          </span>
        </div>

      </div>
    </div>
  );
}
