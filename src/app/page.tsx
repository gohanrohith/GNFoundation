import Image from 'next/image';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ArrowRight, BookOpen, Award, Sparkles } from 'lucide-react';
import { PlaceHolderImages } from '@/lib/placeholder-images';

export default function Home() {
  const heroImage = PlaceHolderImages.find((p) => p.id === 'hero');

  return (
    <div className="flex flex-col gap-12 md:gap-20">
      <section className="bg-card">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-16 md:py-24">
          <div className="grid md:grid-cols-2 gap-8 md:gap-12 items-center">
            <div className="space-y-6 text-center md:text-left">
              <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold tracking-tight text-primary">
                Empowering Future Generations
              </h1>
              <p className="max-w-xl mx-auto md:mx-0 text-lg sm:text-xl text-muted-foreground">
                In loving memory of Smt. Girrem Narayanamma, we are dedicated to nurturing talent and promoting education for
                all.
              </p>
              <div className="flex flex-col sm:flex-row justify-center md:justify-start gap-4">
                <Button asChild size="lg">
                  <Link href="/talent-hunt">
                    Explore Talent Hunts <ArrowRight className="ml-2" />
                  </Link>
                </Button>
                <Button asChild size="lg" variant="outline">
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
                  className="rounded-xl shadow-lg w-full max-w-md h-auto"
                  priority
                  data-ai-hint={heroImage.imageHint}
                />
              )}
            </div>
          </div>
        </div>
      </section>

      <section className="container mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="text-center max-w-3xl mx-auto">
          <h2 className="text-3xl sm:text-4xl font-bold text-primary">Our Mission</h2>
          <p className="mt-4 text-lg sm:text-xl text-muted-foreground">
            To provide a platform for students to showcase their talents, receive motivation, and get the support they need
            to achieve their dreams.
          </p>
        </div>
        <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-12">
          <Card className="text-center border-0 shadow-none bg-transparent">
             <CardHeader className="flex justify-center items-center">
               <div className="bg-primary/10 p-4 rounded-full">
                 <BookOpen className="h-10 w-10 sm:h-12 sm:w-12 text-primary" />
               </div>
             </CardHeader>
             <CardContent className="space-y-2">
              <h3 className="text-xl sm:text-2xl font-semibold">Promote Education</h3>
              <p className="text-muted-foreground sm:text-lg">
                We believe in the power of education to transform lives and communities.
              </p>
             </CardContent>
          </Card>
          <Card className="text-center border-0 shadow-none bg-transparent">
            <CardHeader className="flex justify-center items-center">
              <div className="bg-primary/10 p-4 rounded-full">
                <Sparkles className="h-10 w-10 sm:h-12 sm:w-12 text-primary" />
              </div>
            </CardHeader>
            <CardContent className="space-y-2">
              <h3 className="text-xl sm:text-2xl font-semibold">Nurture Talent</h3>
              <p className="text-muted-foreground sm:text-lg">
                We conduct talent hunt exams to identify and encourage promising students.
              </p>
            </CardContent>
          </Card>
          <Card className="text-center border-0 shadow-none bg-transparent">
            <CardHeader className="flex justify-center items-center">
              <div className="bg-primary/10 p-4 rounded-full">
                <Award className="h-10 w-10 sm:h-12 sm:w-12 text-primary" />
              </div>
            </CardHeader>
            <CardContent className="space-y-2">
              <h3 className="text-xl sm:text-2xl font-semibold">Recognize Excellence</h3>
              <p className="text-muted-foreground sm:text-lg">
                We award prizes and certificates to celebrate achievement and motivate participants.
              </p>
            </CardContent>
          </Card>
        </div>
      </section>

      <section className="w-full bg-card py-16 md:py-24">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto">
            <h2 className="text-3xl sm:text-4xl font-bold text-primary">Annual Talent Hunts</h2>
            <p className="mt-4 text-lg sm:text-xl text-muted-foreground">
              Join thousands of students in our prestigious Regional Mathematics & Science Talent Hunt exams.
            </p>
          </div>
          <div className="mt-12 grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            <Card className="hover:shadow-xl transition-shadow duration-300">
              <CardHeader>
                <CardTitle className="text-primary text-xl sm:text-2xl">RMTH - Maths Talent Hunt</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground text-base sm:text-lg">
                  The Regional Mathematics Talent Hunt (RMTH) is designed to foster a love for mathematics and identify
                  young prodigies in the field.
                </p>
                <Button asChild variant="link" className="px-0 mt-4 text-primary font-bold text-base">
                  <Link href="/talent-hunt">
                    Learn More <ArrowRight className="ml-2" />
                  </Link>
                </Button>
              </CardContent>
            </Card>
            <Card className="hover:shadow-xl transition-shadow duration-300">
              <CardHeader>
                <CardTitle className="text-primary text-xl sm:text-2xl">RSTH - Science Talent Hunt</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground text-base sm:text-lg">
                  The Regional Science Talent Hunt (RSTH) encourages curiosity and innovation, providing a stage for
                  aspiring scientists to shine.
                </p>
                <Button asChild variant="link" className="px-0 mt-4 text-primary font-bold text-base">
                  <Link href="/talent-hunt">
                    Learn More <ArrowRight className="ml-2" />
                  </Link>
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>
    </div>
  );
}
