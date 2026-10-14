import type { Metadata } from 'next';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';

export const metadata: Metadata = {
  title: 'RMTH & RSTH Talent Hunts',
  description:
    'Everything about the Regional Mathematics Talent Hunt (RMTH) and Regional Science Talent Hunt (RSTH) — eligibility, syllabus, exam pattern, awards, and key dates.',
};

const sections = [
  {
    value: 'about',
    num: '1',
    title: 'About the Examinations',
    content: (
      <p>
        The Regional Mathematics Talent Hunt (RMTH) and Regional Science Talent Hunt (RSTH) are our flagship annual
        events. These competitive examinations are designed to identify, encourage, and nurture talented students in the
        fields of mathematics and science. They provide a platform for students to test their knowledge against their
        peers and gain valuable competitive experience beyond the standard curriculum.
      </p>
    ),
  },
  {
    value: 'eligibility',
    num: '2',
    title: 'Eligibility Criteria',
    content: (
      <p>
        The examinations are open to students from Class 6 to Class 10 studying in recognised schools within the region.
        Specific eligibility details and group categories based on class level will be announced with the official
        notification. All enthusiastic learners are encouraged to participate.
      </p>
    ),
  },
  {
    value: 'syllabus',
    num: '3',
    title: 'Syllabus &amp; Examination Pattern',
    content: (
      <p>
        The syllabus is primarily based on the curriculum of the respective classes but includes advanced concepts
        to challenge the participants. The examination consists of multiple-choice questions designed to test conceptual
        understanding, problem-solving skills, and logical reasoning. Detailed syllabus documents will be available
        prior to the examination date.
      </p>
    ),
  },
  {
    value: 'awards',
    num: '4',
    title: 'Awards &amp; Recognition',
    content: (
      <p>
        Top performers in each category will be honoured with cash prizes, medals, and certificates of excellence.
        All participants will receive a certificate of participation. We believe in celebrating every student&apos;s
        effort and courage to compete.
      </p>
    ),
  },
  {
    value: 'dates',
    num: '5',
    title: 'Important Dates',
    content: (
      <div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-0 border-l border-[#C8BFA8]">
          {[
            { k: 'Registration Opens',    v: '1 August' },
            { k: 'Registration Closes',   v: '30 September' },
            { k: 'Examination Date',      v: 'Last Sunday of October' },
            { k: 'Results Announcement',  v: 'Mid-November' },
          ].map(({ k, v }) => (
            <div key={k} className="px-5 py-4 border-r border-b border-[#C8BFA8]">
              <div className="text-[10px] font-bold tracking-[0.14em] uppercase text-[#8C6A1A] mb-1">{k}</div>
              <div className="font-heading text-[18px] font-semibold text-[#0D2340]">{v}</div>
            </div>
          ))}
        </div>
        <p className="mt-4 text-[13px] text-[#5C5040]">
          These dates are indicative and subject to change. Check our website for official announcements.
        </p>
      </div>
    ),
  },
];

export default function TalentHuntPage() {
  return (
    <div>
      {/* Page header */}
      <div style={{ background: '#0D2340' }} className="px-6 lg:px-10 py-10">
        <div className="max-w-[1200px] mx-auto">
          <div className="text-[10px] font-bold tracking-[0.2em] uppercase text-[#B8920A] mb-3">Annual Examinations</div>
          <h1 className="font-heading text-white text-[clamp(32px,4vw,52px)] font-semibold leading-[1.1]">
            RMTH &amp; RSTH Talent Hunts
          </h1>
          <p className="text-white/50 text-[15px] mt-3 font-light max-w-xl">
            Everything you need to know about our Regional Mathematics and Science Talent Hunt examinations.
          </p>
        </div>
      </div>

      <div className="max-w-[1200px] mx-auto px-6 lg:px-10 py-10">

        {/* Exam cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 border-l border-t border-[#C8BFA8] mb-10">
          {[
            {
              code: 'RMTH',
              full: 'Regional Mathematics Talent Hunt',
              desc: 'Tests quantitative reasoning, problem-solving, and mathematical logic well beyond the school curriculum.',
            },
            {
              code: 'RSTH',
              full: 'Regional Science Talent Hunt',
              desc: 'Covers Physics, Chemistry, and Biology at a conceptual depth that rewards genuine understanding over memorisation.',
            },
          ].map(({ code, full, desc }) => (
            <div key={code} className="relative p-8 border-r border-b border-[#C8BFA8] bg-white">
              <div
                className="font-heading absolute right-4 top-2 pointer-events-none select-none leading-none"
                style={{ fontSize: 72, fontWeight: 800, color: 'rgba(13,35,64,0.05)' }}
              >
                {code}
              </div>
              <div className="text-[10px] font-bold tracking-[0.18em] uppercase text-[#8C6A1A] mb-2 flex items-center gap-2.5">
                <span className="w-5 h-px bg-[#8C6A1A] inline-block" />
                Classes VI – X
              </div>
              <h2 className="font-heading text-[22px] font-semibold text-[#0D2340] leading-[1.2] mb-2">{full}</h2>
              <p className="text-[14px] text-[#5C5040] font-light leading-[1.7]">{desc}</p>
            </div>
          ))}
        </div>

        {/* FAQ Accordion */}
        <div className="flex items-baseline gap-5 pb-5 border-b-2 border-[#0D2340] mb-0">
          <span className="font-heading text-[13px] text-[#8C6A1A] tracking-[0.06em]">—</span>
          <h2 className="font-heading text-[28px] font-semibold text-[#0D2340] leading-none">Examination Details</h2>
          <span className="flex-1 h-px bg-[#C8BFA8]" />
        </div>

        <div className="border-l border-r border-b border-[#C8BFA8]">
          <Accordion type="single" collapsible className="w-full">
            {sections.map(({ value, num, title, content }) => (
              <AccordionItem
                key={value}
                value={value}
                className="border-b border-[#C8BFA8] last:border-b-0"
              >
                <AccordionTrigger className="px-6 py-5 hover:no-underline hover:bg-[#F8F5EF] transition-colors text-left">
                  <div className="flex items-center gap-4">
                    <span className="font-heading text-[13px] text-[#8C6A1A] tracking-[0.06em] flex-shrink-0">{num}.</span>
                    <span
                      className="font-heading text-[18px] font-semibold text-[#0D2340]"
                      dangerouslySetInnerHTML={{ __html: title }}
                    />
                  </div>
                </AccordionTrigger>
                <AccordionContent className="px-6 pb-6 pt-0 text-[15px] text-[#5C5040] leading-[1.8] font-light pl-16 bg-white">
                  {content}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>

      </div>
    </div>
  );
}
