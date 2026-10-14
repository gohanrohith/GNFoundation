import Link from 'next/link';

export default function Home() {
  return (
    <div>

      {/* ANNOUNCEMENT BAND */}
      <div style={{ background: '#B8920A' }} className="px-6 py-[9px]">
        <div className="max-w-[1200px] mx-auto flex items-center gap-5">
          <span
            className="text-[10px] font-bold tracking-[0.14em] uppercase px-2.5 py-[3px] text-white flex-shrink-0"
            style={{ background: '#0D2340' }}
          >
            Notice
          </span>
          <span className="text-[13px] font-semibold text-[#0D2340] tracking-[0.02em]">
            RMTH &amp; RSTH 2025 results have been published. Certificate download is now open.
          </span>
          <Link
            href="/participation"
            className="ml-auto text-[12px] font-bold text-[#0D2340] underline underline-offset-2 tracking-[0.04em] flex-shrink-0 whitespace-nowrap"
          >
            Download Certificate →
          </Link>
        </div>
      </div>

      {/* HERO BAND */}
      <div style={{ background: '#0D2340' }} className="px-6 lg:px-10">
        <div className="max-w-[1200px] mx-auto grid grid-cols-1 md:grid-cols-[1fr_280px] gap-0 items-end">

          {/* Main */}
          <div className="py-12 md:pr-12 md:border-r border-white/10">
            <div className="text-[10px] font-bold tracking-[0.2em] uppercase text-[#B8920A] mb-4 flex items-center gap-3">
              RMTH &amp; RSTH · Academic Year 2024–25
              <span className="inline-block w-10 h-px bg-[#B8920A] opacity-50" />
            </div>
            <h1
              className="font-heading text-white leading-[1.1] tracking-[-0.01em] mb-5"
              style={{ fontSize: 'clamp(40px, 5vw, 64px)', fontWeight: 600 }}
            >
              Identifying <em style={{ color: '#B8920A' }}>Extraordinary</em><br />
              Young Minds Across Telangana
            </h1>
            <p className="text-white/60 text-base leading-[1.75] max-w-[520px] mb-9 font-light">
              GN Foundation conducts the Regional Mathematics Talent Hunt and Regional Science
              Talent Hunt — annual competitive examinations for Class 6 through 10 students
              that go beyond the standard curriculum to surface genuine intellectual ability.
            </p>
            <div className="flex flex-wrap gap-3">
              <Link
                href="/talent-hunt"
                className="bg-white text-[#0D2340] px-7 py-3 text-[13px] font-bold tracking-[0.04em] hover:bg-[#F0EBE0] transition-colors"
              >
                About the Examinations
              </Link>
              <Link
                href="/awards"
                className="border border-white/30 text-white/75 px-7 py-3 text-[13px] font-medium tracking-[0.04em] hover:border-white/70 hover:text-white transition-colors"
              >
                View Awardees
              </Link>
            </div>
          </div>

          {/* Stats sidebar */}
          <div className="hidden md:flex flex-col gap-0 pl-10 pb-12">
            {[
              { n: '5,000+', label: 'Students Examined' },
              { n: '200+',   label: 'Partner Schools' },
              { n: '10+',    label: 'Years of Examination' },
            ].map(({ n, label }, i) => (
              <div
                key={label}
                className="py-6 border-b border-white/10 last:border-b-0 first:pt-12"
              >
                <div className="font-heading text-white leading-none" style={{ fontSize: 48, fontWeight: 700 }}>
                  {n.replace('+', '')}<span style={{ fontSize: 20, color: '#B8920A' }}>+</span>
                </div>
                <div className="text-[11px] font-medium tracking-[0.1em] uppercase text-white/40 mt-1">{label}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* SECTION I — THE EXAMINATIONS */}
      <div className="max-w-[1200px] mx-auto px-6 lg:px-10 mt-10">
        <div className="flex items-baseline gap-5 pb-6 border-b-2 border-[#0D2340]">
          <span className="font-heading text-[13px] text-[#8C6A1A] tracking-[0.06em]">I.</span>
          <h2 className="font-heading text-[28px] font-semibold text-[#0D2340] leading-none">The Examinations</h2>
          <span className="flex-1 h-px bg-[#C8BFA8]" />
          <Link
            href="/talent-hunt"
            className="text-[12px] font-semibold tracking-[0.08em] uppercase text-[#8C6A1A] border-b border-[#8C6A1A] pb-px"
          >
            Full Syllabus →
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 border-l border-[#C8BFA8]">
          {[
            {
              code: 'RMTH',
              subject: 'Mathematics',
              title: 'Regional Mathematics Talent Hunt',
              body: 'An annual examination that assesses quantitative reasoning, mathematical problem-solving, and logical thinking ability well beyond the standard school curriculum. Designed for students in Classes 6 through 10 who demonstrate genuine mathematical aptitude.',
            },
            {
              code: 'RSTH',
              subject: 'Science',
              title: 'Regional Science Talent Hunt',
              body: 'A rigorous annual examination covering Physics, Chemistry, and Biology at the conceptual level — designed to reward students who understand their subject rather than those who have simply memorised the textbook.',
            },
          ].map(({ code, subject, title, body }) => (
            <div
              key={code}
              className="relative p-8 border-r border-b border-[#C8BFA8]"
            >
              <div
                className="font-heading absolute right-4 top-2 leading-none pointer-events-none select-none"
                style={{ fontSize: 72, fontWeight: 800, color: 'rgba(13,35,64,0.06)', letterSpacing: '-0.02em' }}
              >
                {code}
              </div>
              <div className="text-[10px] font-bold tracking-[0.18em] uppercase text-[#8C6A1A] mb-2.5 flex items-center gap-2.5">
                <span className="w-5 h-px bg-[#8C6A1A] inline-block" />
                {subject}
              </div>
              <h3 className="font-heading text-[24px] font-semibold text-[#0D2340] mb-3 leading-[1.2]">{title}</h3>
              <p className="text-[14px] text-[#5C5040] leading-[1.7] font-light mb-6">{body}</p>
              <div className="flex gap-6 pt-5 border-t border-[#C8BFA8]">
                {[
                  { k: 'Eligibility', v: 'Classes VI – X' },
                  { k: 'Month', v: 'October' },
                  { k: 'Format', v: 'MCQ · 90 min' },
                ].map(({ k, v }) => (
                  <div key={k}>
                    <div className="text-[10px] tracking-[0.14em] uppercase text-[#C8BFA8] mb-0.5">{k}</div>
                    <div className="font-heading text-[15px] font-semibold text-[#0D2340]">{v}</div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* SECTION II — ABOUT THE FOUNDATION */}
      <div className="max-w-[1200px] mx-auto px-6 lg:px-10 mt-10">
        <div className="flex items-baseline gap-5 pb-6 border-b-2 border-[#0D2340]">
          <span className="font-heading text-[13px] text-[#8C6A1A] tracking-[0.06em]">II.</span>
          <h2 className="font-heading text-[28px] font-semibold text-[#0D2340] leading-none">About the Foundation</h2>
          <span className="flex-1 h-px bg-[#C8BFA8]" />
          <Link href="/about" className="text-[12px] font-semibold tracking-[0.08em] uppercase text-[#8C6A1A] border-b border-[#8C6A1A] pb-px">
            Our Story →
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-[1fr_300px] border-l border-[#C8BFA8]">
          <div className="p-8 border-r border-b border-[#C8BFA8]">
            <p className="font-heading text-[22px] font-normal text-[#0D2340] leading-[1.5] mb-5 italic">
              For over a decade, GN Foundation has created a credible stage for the most capable
              young minds in Telangana — students who deserve to be seen beyond their school reports.
            </p>
            <div className="space-y-3.5 text-[15px] text-[#5C5040] leading-[1.8] font-light">
              <p>
                GN Foundation is a registered charitable organisation based in Hanumakonda, Telangana,
                dedicated to identifying and celebrating exceptional ability in mathematics and science
                among school-age students across the region.
              </p>
              <p>
                Every student who participates receives a verified certificate of participation or merit,
                serving as a permanent record of their achievement. Top-ranked students are recognised
                with cash prizes, gold medals, and certificates of excellence at our annual felicitation ceremony.
              </p>
              <p>
                In loving memory of Smt. Girrem Narayanamma — whose belief in education as a force for good
                continues to guide everything we do.
              </p>
            </div>
          </div>

          <div className="p-8 bg-white border-b border-[#C8BFA8]">
            {/* Schedule */}
            <div className="mb-7">
              <div className="text-[10px] font-bold tracking-[0.18em] uppercase text-[#0D2340] mb-3 pb-2 border-b-2 border-[#0D2340]">
                Examination Schedule
              </div>
              {[
                { k: 'Registration Opens', v: '1 August' },
                { k: 'Registration Closes', v: '30 September' },
                { k: 'Examination Date', v: 'Last Sunday, October' },
                { k: 'Results', v: 'Mid November' },
              ].map(({ k, v }) => (
                <div key={k} className="py-2.5 border-b border-[#C8BFA8] last:border-b-0 flex flex-col gap-0.5">
                  <span className="text-[11px] font-semibold tracking-[0.06em] uppercase text-[#8C6A1A]">{k}</span>
                  <span className="font-heading text-[17px] text-[#0D2340]">{v}</span>
                </div>
              ))}
            </div>

            {/* Contact */}
            <div>
              <div className="text-[10px] font-bold tracking-[0.18em] uppercase text-[#0D2340] mb-3 pb-2 border-b-2 border-[#0D2340]">
                Contact
              </div>
              <div className="py-2.5 border-b border-[#C8BFA8] flex flex-col gap-0.5">
                <span className="text-[11px] font-semibold tracking-[0.06em] uppercase text-[#8C6A1A]">Email</span>
                <span className="font-heading text-[14px] text-[#0D2340]">info@gnfoundation.com</span>
              </div>
              <div className="py-2.5 border-b border-[#C8BFA8] flex flex-col gap-0.5">
                <span className="text-[11px] font-semibold tracking-[0.06em] uppercase text-[#8C6A1A]">Phone</span>
                <span className="font-heading text-[17px] text-[#0D2340]">+91 98665 14516</span>
              </div>
              <div className="py-2.5 flex flex-col gap-0.5">
                <span className="text-[11px] font-semibold tracking-[0.06em] uppercase text-[#8C6A1A]">Office Hours</span>
                <span className="text-[12px] text-[#5C5040]">Mon – Sat, 9 AM – 5 PM IST</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* SECTION III — AWARDS CTA */}
      <div className="max-w-[1200px] mx-auto px-6 lg:px-10 mt-10 mb-0">
        <div className="flex items-baseline gap-5 pb-6 border-b-2 border-[#0D2340]">
          <span className="font-heading text-[13px] text-[#8C6A1A] tracking-[0.06em]">III.</span>
          <h2 className="font-heading text-[28px] font-semibold text-[#0D2340] leading-none">Honours &amp; Awards</h2>
          <span className="flex-1 h-px bg-[#C8BFA8]" />
          <Link href="/awards" className="text-[12px] font-semibold tracking-[0.08em] uppercase text-[#8C6A1A] border-b border-[#8C6A1A] pb-px">
            Full Honours List →
          </Link>
        </div>

        <div className="border-l border-[#C8BFA8] grid grid-cols-1 md:grid-cols-2">
          {[
            {
              exam: 'RMTH — Mathematics',
              title: 'Gold, Silver &amp; Bronze Medals',
              body: 'Top three performers in each class group receive gold, silver, and bronze medals at the annual felicitation ceremony along with cash prizes.',
            },
            {
              exam: 'RSTH — Science',
              title: 'Certificates of Excellence',
              body: 'All merit-rank students receive printed Certificates of Excellence. Every participant receives a Certificate of Participation — a permanent academic record.',
            },
          ].map(({ exam, title, body }) => (
            <div key={exam} className="p-8 border-r border-b border-[#C8BFA8] bg-white">
              <div className="text-[10px] font-bold tracking-[0.14em] uppercase text-[#8C6A1A] mb-3">{exam}</div>
              <h3 className="font-heading text-[20px] font-semibold text-[#0D2340] mb-3 leading-[1.2]" dangerouslySetInnerHTML={{ __html: title }} />
              <p className="text-[14px] text-[#5C5040] leading-[1.7] font-light">{body}</p>
            </div>
          ))}
        </div>
      </div>

      {/* SECTION IV — CERTIFICATE / RECORDS OFFICE */}
      <div className="mt-10" style={{ background: '#0D2340' }}>
        <div className="max-w-[1200px] mx-auto px-6 lg:px-10 py-12 grid grid-cols-1 md:grid-cols-2 gap-16 items-center">
          <div>
            <div className="text-[10px] font-bold tracking-[0.18em] uppercase text-[#B8920A] mb-3.5">
              IV. Records Office
            </div>
            <h2
              className="font-heading text-white leading-[1.15] mb-4"
              style={{ fontSize: 'clamp(28px, 3.5vw, 42px)', fontWeight: 600 }}
            >
              Certificate Download
            </h2>
            <p className="text-[15px] text-white/55 leading-[1.75] font-light">
              Participants in RMTH or RSTH may retrieve their certificate of participation or merit
              at any time using their Admission Number. Certificates are issued digitally and carry
              the GN Foundation seal.
            </p>
          </div>

          <div className="border border-white/12 p-8" style={{ background: 'rgba(255,255,255,0.04)' }}>
            <div className="text-[11px] font-semibold tracking-[0.1em] uppercase text-white/40 mb-2">
              Admission Number
            </div>
            <div className="bg-white/7 border border-white/15 text-white/50 px-4 py-3 text-[15px] mb-4 font-light">
              e.g. RMTH2025001
            </div>
            <Link
              href="/participation"
              className="block w-full text-center py-3 text-[13px] font-bold tracking-[0.08em] uppercase transition-colors"
              style={{ background: '#B8920A', color: '#0D2340' }}
            >
              Retrieve Certificate
            </Link>
            <p className="text-[11px] text-white/30 mt-3 leading-[1.5]">
              Visit the Certificate Download page and enter your admission number to
              retrieve your certificate.
            </p>
          </div>
        </div>
      </div>

    </div>
  );
}
