import Image from 'next/image';
import { PlaceHolderImages } from '@/lib/placeholder-images';
import { Card } from '@/components/ui/card';

export default function AboutPage() {
  const founderImage = PlaceHolderImages.find(
    (p) => p.id === 'girrem-narayanamma'
  );

  return (
    <section className="relative">
      {/* HERO / DEDICATION */}
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-20 text-center">
        <p className="text-sm uppercase tracking-widest text-muted-foreground">
          Our Inspiration
        </p>
        <h1 className="mt-4 text-3xl sm:text-4xl font-bold text-primary">
          Smt. Girrem Narayanamma
        </h1>
        <p className="mt-4 max-w-2xl mx-auto text-lg text-muted-foreground">
          A life rooted in compassion, resilience, and the belief that education
          can transform destinies.
        </p>
      </div>

      {/* STORY SECTION */}
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 pb-16">
        <div className="grid md:grid-cols-5 gap-10 lg:gap-16 items-start">
          {/* IMAGE */}
          <div className="md:col-span-2 flex justify-center">
            {founderImage && (
              <Card className="overflow-hidden w-full max-w-sm rounded-2xl shadow-xl">
                <div className="relative aspect-[4/5]">
                  <Image
                    src={founderImage.imageUrl}
                    alt={founderImage.description}
                    fill
                    className="object-cover"
                    data-ai-hint={founderImage.imageHint}
                  />
                </div>
              </Card>
            )}
          </div>

          {/* TEXT */}
          <div className="md:col-span-3">
            <blockquote className="border-l-4 border-primary/60 pl-6 mb-8 italic text-lg text-foreground/80">
              “Education is the most meaningful gift we can offer a child — it
              shapes character, courage, and possibility.”
            </blockquote>

            <div className="space-y-6 text-lg leading-relaxed text-foreground/90">
              <p>
                The GN Foundation is established in loving memory of Smt. Girrem
                Narayanamma, the beloved mother of Girrem Bharadwaja Naidu,
                founder of the S-Greenwood Group of Schools in Telangana. She was
                a woman whose life was defined by empathy, quiet strength, and an
                unshakeable faith in education as a force for good.
              </p>

              <p>
                Her support and guidance formed the foundation of her family’s
                journey. She instilled enduring values—integrity, discipline,
                humility, and a deep sense of responsibility toward society. Her
                dream was simple yet powerful: that every child, regardless of
                background, should have access to quality education.
              </p>

              <p>
                The GN Foundation stands as a tribute to her ideals. Through
                education-driven initiatives and student support programs, we
                strive to carry her vision forward—turning values into action
                and opportunity into lasting impact.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* LEGACY STRIP */}
      <div className="bg-muted/40">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-14 text-center">
          <p className="text-xl sm:text-2xl font-medium text-primary">
            Her legacy lives on — in every student empowered, every opportunity
            created, and every future transformed.
          </p>
        </div>
      </div>
    </section>
  );
}
