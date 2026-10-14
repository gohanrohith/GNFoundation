import Image from 'next/image';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ArrowRight, BookOpen, Award, Sparkles, Users, CalendarCheck, GraduationCap } from 'lucide-react';
import { PlaceHolderImages } from '@/lib/placeholder-images';

export default function Home() {
  const heroImage = PlaceHolderImages.find((p) => p.id === 'hero');

  const stats = [
    { icon: Users, value: '5,000+', label: 'Students Reached' },
    { icon: CalendarCheck, value: '10+', label: 'Years Running' },
    { icon: GraduationCap, value: '2', label: 'Talent Hunt Exams' },
    { icon: Award, value: '500+', label: 'Awards Given' },
  ];

  return (
    <div className="flex flex-col">

      {/* HERO — deep blue banner, white text, gold CTA */}
      <section className="bg-primary text-primary-foreground">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-16 md:py-24">
          <div className="grid md:grid-cols-2 gap-8 md:gap-12 items-center">
            <div className="space-y-6 text-center md:text-left">
              <p className="text-sm uppercase tracking-widest text-primary-foreground/70 font-semibold">
                GN Foundation · Telangana
              </p>
              <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold tracking-tight leading-tight">
                Empowering<br className="hidden sm:block" /> Future<br className="hidden sm:block" /> Generations
              </h1>
              <p className="max-w-xl mx-auto md:mx-0 text-lg sm:text-xl text-primary-foreground/80">
                In loving memory of Smt. Girrem Narayanamma — nurturing talent and
                promoting education for every student in Telangana.
              </p>
              <div className="flex flex-col sm:flex-row justify-center md:justify-start gap-4">
                <Button
                  asChild
                  size="lg"
                  className="bg-accent text-accent-foreground hover:bg-accent/90 font-bold shadow-lg"
                >
                  <Link href="/talent-hunt">
                    Explore Talent Hunts <ArrowRight className="ml-2 h-5 w-5" />
                  </Link>
                </Button>
                <Button
                  asChild
                  size="lg"
                  variant="outline"
                  className="border-primary-foreground/40 text-primary-foreground hover:bg-primary-foreground/10"
                >
                  <Link href="/about">Our Story</Link>
                </Button>
              </div>
            </div>
            <div className="flex justify-center">
              {heroImage && (
                <Image
                  src={heroImage.imageUrl}
                  alt={heroImage.description}
                  width={550}
                  height={550}
                  className="rounded-2xl shadow-2xl w-full max-w-md h-auto ring-4 ring-primary-foreground/10"
                  priority
                  data-ai-hint={heroImage.imageHint}
                />
              )}
            </div>
          </div>
        </div>
      </section>

      {/* STATS ROW */}
      <section className="bg-card border-b">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-10">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 md:gap-8">
            {stats.map(({ icon: Icon, value, label }) => (
              <div key={label} className="flex flex-col items-center text-center gap-2">
                <div className="bg-accent/15 p-3 rounded-xl">
                  <Icon className="h-7 w-7 text-primary" />
                </div>
                <p className="text-3xl font-bold text-primary">{value}</p>
                <p className="text-sm text-muted-foreground font-medium">{label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* MISSION */}
      <section className="container mx-auto px-4 sm:px-6 lg:px-8 py-16 md:py-24">
        <div className="text-center max-w-3xl mx-auto">
          <h2 className="text-3xl sm:text-4xl font-bold text-primary">Our Mission</h2>
          <p className="mt-4 text-lg sm:text-xl text-muted-foreground">
            To provide a platform for students to showcase their talents, receive motivation, and get the support they
            need to achieve their dreams.
          </p>
        </div>
        <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-8">
          {[
            {
              icon: BookOpen,
              title: 'Promote Education',
              body: 'We believe in the power of education to transform lives and communities.',
            },
            {
              icon: Sparkles,
              title: 'Nurture Talent',
              body: 'We conduct talent hunt exams to identify and encourage promising students.',
            },
            {
              icon: Award,
              title: 'Recognize Excellence',
              body: 'We award prizes and certificates to celebrate achievement and motivate participants.',
            },
          ].map(({ icon: Icon, title, body }) => (
            <Card key={title} className="text-center border shadow-sm hover:shadow-md transition-shadow">
              <CardHeader className="flex justify-center items-center pb-3">
                <div className="bg-accent/20 p-4 rounded-full mb-2">
                  <Icon className="h-10 w-10 text-primary" />
                </div>
              </CardHeader>
              <CardContent className="space-y-2">
                <h3 className="text-xl font-semibold">{title}</h3>
                <p className="text-muted-foreground">{body}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      {/* TALENT HUNTS */}
      <section className="w-full bg-primary/5 py-16 md:py-24">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-12">
            <h2 className="text-3xl sm:text-4xl font-bold text-primary">Annual Talent Hunts</h2>
            <p className="mt-4 text-lg text-muted-foreground">
              Join thousands of students in our prestigious Regional Mathematics &amp; Science Talent Hunt exams.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            {[
              {
                title: 'RMTH — Maths Talent Hunt',
                body: 'The Regional Mathematics Talent Hunt (RMTH) fosters a love for mathematics and identifies young prodigies across Telangana.',
                accent: 'border-t-primary',
              },
              {
                title: 'RSTH — Science Talent Hunt',
                body: 'The Regional Science Talent Hunt (RSTH) encourages curiosity and innovation, providing a stage for aspiring scientists to shine.',
                accent: 'border-t-accent',
              },
            ].map(({ title, body, accent }) => (
              <Card key={title} className={`hover:shadow-xl transition-shadow duration-300 border-t-4 ${accent}`}>
                <CardHeader>
                  <CardTitle className="text-primary text-xl">{title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">{body}</p>
                  <Button asChild variant="link" className="px-0 mt-4 text-primary font-bold">
                    <Link href="/talent-hunt">
                      Learn More <ArrowRight className="ml-2 h-4 w-4" />
                    </Link>
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA STRIP */}
      <section className="bg-accent">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-14 text-center">
          <h2 className="text-2xl sm:text-3xl font-bold text-accent-foreground">
            Ready to participate?
          </h2>
          <p className="mt-2 text-accent-foreground/80 max-w-xl mx-auto">
            Check if your school is registered or download your certificate of participation.
          </p>
          <Button
            asChild
            size="lg"
            className="mt-6 bg-primary text-primary-foreground hover:bg-primary/90 font-bold shadow-md"
          >
            <Link href="/participation">
              Download Certificate <ArrowRight className="ml-2 h-5 w-5" />
            </Link>
          </Button>
        </div>
      </section>

    </div>
  );
}
