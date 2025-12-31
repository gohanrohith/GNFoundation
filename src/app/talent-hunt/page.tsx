import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { Calendar, TestTube, Book, Award, FileText } from 'lucide-react';

export default function TalentHuntPage() {
  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-16">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold tracking-tight text-primary">RMTH & RSTH Talent Hunts</h1>
        <p className="mt-4 max-w-3xl mx-auto text-lg text-muted-foreground">
          Everything you need to know about our Regional Mathematics and Science Talent Hunt exams.
        </p>
      </div>

      <div className="max-w-4xl mx-auto">
        <Accordion type="single" collapsible className="w-full">
          <AccordionItem value="item-1">
            <AccordionTrigger className="text-lg font-semibold hover:no-underline">
              <div className="flex items-center gap-3">
                <Book className="h-5 w-5 text-primary" />
                About the Exams
              </div>
            </AccordionTrigger>
            <AccordionContent className="text-base text-foreground/80 pl-8 leading-relaxed">
              The Regional Mathematics Talent Hunt (RMTH) and Regional Science Talent Hunt (RSTH) are our flagship annual
              events. These competitive exams are designed to identify, encourage, and nurture talented students in the
              fields of mathematics and science. They provide a platform for students to test their knowledge against
              their peers and gain valuable competitive experience.
            </AccordionContent>
          </AccordionItem>

          <AccordionItem value="item-2">
            <AccordionTrigger className="text-lg font-semibold hover:no-underline">
              <div className="flex items-center gap-3">
                <FileText className="h-5 w-5 text-primary" />
                Eligibility Criteria
              </div>
            </AccordionTrigger>
            <AccordionContent className="text-base text-foreground/80 pl-8 leading-relaxed">
              The exams are open to students from Class 6 to Class 10 studying in recognized schools within the region.
              Specific eligibility details and group categories based on class level will be announced with the official
              notification. All enthusiastic learners are encouraged to participate.
            </AccordionContent>
          </AccordionItem>

          <AccordionItem value="item-3">
            <AccordionTrigger className="text-lg font-semibold hover:no-underline">
              <div className="flex items-center gap-3">
                <TestTube className="h-5 w-5 text-primary" />
                Syllabus & Exam Pattern
              </div>
            </AccordionTrigger>
            <AccordionContent className="text-base text-foreground/80 pl-8 leading-relaxed">
              The syllabus is primarily based on the curriculum of the respective classes but includes advanced concepts
              to challenge the participants. The exam consists of multiple-choice questions designed to test conceptual
              understanding, problem-solving skills, and logical reasoning. Detailed syllabus documents will be available
              for download from our website prior to the exam.
            </AccordionContent>
          </AccordionItem>

          <AccordionItem value="item-4">
            <AccordionTrigger className="text-lg font-semibold hover:no-underline">
              <div className="flex items-center gap-3">
                <Award className="h-5 w-5 text-primary" />
                Awards and Recognition
              </div>
            </AccordionTrigger>
            <AccordionContent className="text-base text-foreground/80 pl-8 leading-relaxed">
              Top performers in each category will be honored with cash prizes, medals, and certificates of excellence.
              All participants will receive a certificate of participation. We believe in celebrating every student's
              effort and courage to compete.
            </AccordionContent>
          </AccordionItem>

          <AccordionItem value="item-5">
            <AccordionTrigger className="text-lg font-semibold hover:no-underline">
              <div className="flex items-center gap-3">
                <Calendar className="h-5 w-5 text-primary" />
                Important Dates
              </div>
            </AccordionTrigger>
            <AccordionContent className="text-base text-foreground/80 pl-8 leading-relaxed">
              <ul className="list-disc pl-5 space-y-2">
                <li>
                  <span className="font-semibold">Registration Opens:</span> August 1st
                </li>
                <li>
                  <span className="font-semibold">Registration Closes:</span> September 30th
                </li>
                <li>
                  <span className="font-semibold">Exam Date:</span> Last Sunday of October
                </li>
                <li>
                  <span className="font-semibold">Results Announcement:</span> Mid-November
                </li>
              </ul>
              <p className="mt-4">
                Please note that these dates are tentative and subject to change. Keep an eye on our website for
                official announcements.
              </p>
            </AccordionContent>
          </AccordionItem>
        </Accordion>
      </div>
    </div>
  );
}
