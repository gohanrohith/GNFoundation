import type { Metadata } from 'next';
import Image from 'next/image';
import { PlaceHolderImages } from '@/lib/placeholder-images';

export const metadata: Metadata = {
  title: 'About GN Foundation',
  description:
    'Learn about Smt. Girrem Narayanamma and the story behind the GN Foundation — dedicated to nurturing talent and promoting education for all.',
};

export default function AboutPage() {
  const founderImage = PlaceHolderImages.find((p) => p.id === 'girrem-narayanamma');

  return (
    <div>
      {/* Page header */}
      <div style={{ background: '#0D2340' }} className="px-6 lg:px-10 py-10">
        <div className="max-w-[1200px] mx-auto">
          <div className="text-[10px] font-bold tracking-[0.2em] uppercase text-[#B8920A] mb-3">Our Inspiration</div>
          <h1 className="font-heading text-white text-[clamp(32px,4vw,52px)] font-semibold leading-[1.1]">
            Smt. Girrem Narayanamma
          </h1>
          <p className="text-white/50 text-[15px] mt-3 font-light">
            A life rooted in compassion, resilience, and the belief that education can transform destinies.
          </p>
        </div>
      </div>

      <div className="max-w-[1200px] mx-auto px-6 lg:px-10 py-10">

        {/* Section header */}
        <div className="flex items-baseline gap-5 pb-5 border-b-2 border-[#0D2340] mb-0">
          <span className="font-heading text-[13px] text-[#8C6A1A] tracking-[0.06em]">I.</span>
          <h2 className="font-heading text-[28px] font-semibold text-[#0D2340] leading-none">The Foundation Story</h2>
          <span className="flex-1 h-px bg-[#C8BFA8]" />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-[240px_1fr] border-l border-[#C8BFA8]">

          {/* Portrait */}
          {founderImage && (
            <div className="border-r border-b border-[#C8BFA8] bg-white p-6 flex items-start justify-center">
              <div className="relative w-full aspect-[4/5] max-w-[200px] overflow-hidden border border-[#C8BFA8]">
                <Image
                  src={founderImage.imageUrl}
                  alt={founderImage.description}
                  fill
                  className="object-cover"
                  data-ai-hint={founderImage.imageHint}
                />
              </div>
            </div>
          )}

          {/* Text */}
          <div className="p-8 border-b border-[#C8BFA8]">
            <blockquote className="border-l-4 border-[#B8920A] pl-5 mb-7 font-heading text-[20px] font-normal italic text-[#0D2340] leading-[1.5]">
              "Education is the most meaningful gift we can offer a child —
              it shapes character, courage, and possibility."
            </blockquote>

            <div className="space-y-4 text-[15px] text-[#5C5040] leading-[1.8] font-light">
              <p>
                The GN Foundation is established in loving memory of Smt. Girrem Narayanamma,
                the beloved mother of Girrem Bharadwaja Naidu, founder of the S-Greenwood Group
                of Schools in Telangana. She was a woman whose life was defined by empathy,
                quiet strength, and an unshakeable faith in education as a force for good.
              </p>
              <p>
                Her support and guidance formed the foundation of her family&apos;s journey. She instilled
                enduring values — integrity, discipline, humility, and a deep sense of responsibility
                toward society. Her dream was simple yet powerful: that every child, regardless of
                background, should have access to quality education.
              </p>
              <p>
                The GN Foundation stands as a tribute to her ideals. Through education-driven initiatives
                and student support programmes, we strive to carry her vision forward — turning values
                into action and opportunity into lasting impact.
              </p>
            </div>
          </div>
        </div>

        {/* What we do */}
        <div className="flex items-baseline gap-5 pb-5 border-b-2 border-[#0D2340] mb-0 mt-10">
          <span className="font-heading text-[13px] text-[#8C6A1A] tracking-[0.06em]">II.</span>
          <h2 className="font-heading text-[28px] font-semibold text-[#0D2340] leading-none">What We Do</h2>
          <span className="flex-1 h-px bg-[#C8BFA8]" />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 border-l border-t border-[#C8BFA8]">
          {[
            {
              n: '01',
              title: 'Promote Education',
              body: 'We believe in the power of education to transform lives and communities across Telangana.',
            },
            {
              n: '02',
              title: 'Nurture Talent',
              body: 'We conduct the RMTH and RSTH talent hunt examinations to identify and encourage promising students.',
            },
            {
              n: '03',
              title: 'Recognise Excellence',
              body: 'We award prizes, medals, and certificates to celebrate achievement and motivate every participant.',
            },
          ].map(({ n, title, body }) => (
            <div key={n} className="bg-white p-8 border-r border-b border-[#C8BFA8]">
              <div className="font-heading text-[40px] font-bold text-[#0D2340]/10 leading-none mb-4">{n}</div>
              <h3 className="font-heading text-[20px] font-semibold text-[#0D2340] mb-3">{title}</h3>
              <p className="text-[14px] text-[#5C5040] leading-[1.7] font-light">{body}</p>
            </div>
          ))}
        </div>

      </div>

      {/* Legacy strip */}
      <div style={{ background: '#0D2340' }} className="mt-0 px-6 lg:px-10 py-12">
        <div className="max-w-[1200px] mx-auto text-center">
          <p className="font-heading text-white/80 text-[clamp(18px,2.5vw,28px)] font-normal italic leading-[1.4]">
            "Her legacy lives on — in every student empowered, every opportunity created,
            and every future transformed."
          </p>
        </div>
      </div>
    </div>
  );
}
