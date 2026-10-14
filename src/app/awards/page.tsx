'use client';

import { useState, useMemo, useEffect } from 'react';
import Image from 'next/image';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Loader2 } from 'lucide-react';

interface Awardee {
  _id: string;
  name: string;
  award: string;
  year: number;
  school: string;
  class: string;
  imageUrl?: string;
  examType: 'RMTH' | 'RSTH';
  rank: number;
  marks?: number;
}

function SectionHeader({ num, title, action }: { num: string; title: string; action?: React.ReactNode }) {
  return (
    <div className="flex items-baseline gap-5 pb-5 border-b-2 border-[#0D2340] mb-0">
      <span className="font-heading text-[13px] text-[#8C6A1A] tracking-[0.06em]">{num}</span>
      <h2 className="font-heading text-[28px] font-semibold text-[#0D2340] leading-none">{title}</h2>
      <span className="flex-1 h-px bg-[#C8BFA8]" />
      {action}
    </div>
  );
}

function AwardeeCard({ awardee }: { awardee: Awardee }) {
  return (
    <div className="bg-white border-r border-b border-[#C8BFA8] hover:bg-[#F8F5EF] transition-colors">
      {awardee.imageUrl && (
        <div className="relative aspect-square w-full">
          <Image src={awardee.imageUrl} alt={awardee.name} fill className="object-cover" />
        </div>
      )}
      <div className="p-6">
        <div className="text-[10px] font-bold tracking-[0.14em] uppercase text-[#8C6A1A] mb-2">
          {awardee.examType} · Rank
        </div>
        <div className="font-heading text-[32px] font-bold text-[#0D2340] leading-none mb-2">
          {String(awardee.rank).padStart(2, '0')}
        </div>
        <div className="font-heading text-[18px] text-[#0D2340] mb-1 leading-[1.2]">{awardee.name}</div>
        <div className="text-[12px] text-[#5C5040] leading-[1.4] mb-3">
          {awardee.school}<br />{awardee.class}
        </div>
        <div className="text-[10px] font-bold tracking-[0.1em] uppercase text-[#8C6A1A]">{awardee.award}</div>
        {awardee.marks !== undefined && (
          <div className="text-[11px] text-[#5C5040] mt-1">Score: {awardee.marks}</div>
        )}
      </div>
    </div>
  );
}

export default function AwardsPage() {
  const [allAwardees, setAllAwardees] = useState<Awardee[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchAwardees() {
      try {
        const response = await fetch('/api/awardees');
        const data = await response.json();
        if (data.success) setAllAwardees(data.awardees);
      } catch (error) {
        console.error('Failed to fetch awardees:', error);
      } finally {
        setLoading(false);
      }
    }
    fetchAwardees();
  }, []);

  const years    = useMemo(() => allAwardees.length ? ['all', ...Array.from(new Set(allAwardees.map((a) => a.year.toString()))).sort((a, b) => Number(b) - Number(a))] : ['all'], [allAwardees]);
  const schools  = useMemo(() => allAwardees.length ? ['all', ...Array.from(new Set(allAwardees.map((a) => a.school))).sort()] : ['all'], [allAwardees]);
  const classes  = useMemo(() => allAwardees.length ? ['all', ...Array.from(new Set(allAwardees.map((a) => a.class))).sort()] : ['all'], [allAwardees]);

  const mostRecentYear  = useMemo(() => allAwardees.length ? Math.max(...allAwardees.map((a) => a.year)) : new Date().getFullYear(), [allAwardees]);
  const currentToppers  = useMemo(() => allAwardees.filter((a) => a.year === mostRecentYear), [allAwardees, mostRecentYear]);

  const [selectedYear,     setSelectedYear]     = useState<string>('all');
  const [selectedSchool,   setSelectedSchool]   = useState<string>('all');
  const [selectedClass,    setSelectedClass]    = useState<string>('all');
  const [selectedExamType, setSelectedExamType] = useState<string>('all');
  const [hasSearched,      setHasSearched]      = useState(false);

  const filteredAwardees = useMemo(() => {
    if (!hasSearched) return [];
    return allAwardees.filter((a) => {
      const yearMatch  = selectedYear     === 'all' || a.year.toString() === selectedYear;
      const schoolMatch = selectedSchool  === 'all' || a.school === selectedSchool;
      const classMatch  = selectedClass   === 'all' || a.class  === selectedClass;
      const examMatch   = selectedExamType === 'all' || a.examType === selectedExamType;
      return yearMatch && schoolMatch && classMatch && examMatch;
    });
  }, [selectedYear, selectedSchool, selectedClass, selectedExamType, hasSearched, allAwardees]);

  const resetFilters = () => {
    setSelectedYear('all'); setSelectedSchool('all');
    setSelectedClass('all'); setSelectedExamType('all');
    setHasSearched(false);
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[50vh]">
        <Loader2 className="h-8 w-8 animate-spin text-[#0D2340]" />
      </div>
    );
  }

  return (
    <div>
      {/* Page header */}
      <div style={{ background: '#0D2340' }} className="px-6 lg:px-10 py-10">
        <div className="max-w-[1200px] mx-auto">
          <div className="text-[10px] font-bold tracking-[0.2em] uppercase text-[#B8920A] mb-3">Honours List</div>
          <h1 className="font-heading text-white text-[clamp(32px,4vw,52px)] font-semibold leading-[1.1]">
            Stars of {mostRecentYear}
          </h1>
          <p className="text-white/50 text-[15px] mt-3 font-light max-w-xl">
            Celebrating the brilliant minds who have excelled in the most recent RMTH and RSTH examinations.
          </p>
        </div>
      </div>

      <div className="max-w-[1200px] mx-auto px-6 lg:px-10 py-10 space-y-12">

        {/* Current year toppers */}
        <div>
          <SectionHeader num="I." title={`Honours List · ${mostRecentYear}`} />
          {currentToppers.length > 0 ? (
            <div className="grid grid-cols-2 md:grid-cols-4 border-l border-t border-[#C8BFA8]">
              {currentToppers.map((awardee) => (
                <AwardeeCard key={awardee._id} awardee={awardee} />
              ))}
            </div>
          ) : (
            <div className="py-16 text-center text-[#5C5040] border border-[#C8BFA8] border-t-0 bg-white">
              <p className="text-[15px]">No awardees found yet. Add some from the admin panel.</p>
            </div>
          )}
        </div>

        {/* Search section */}
        <div>
          <SectionHeader num="II." title="Explore All Awardees" />

          {/* Filter bar */}
          <div className="bg-white border border-[#C8BFA8] border-t-0 p-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4 items-end">
              <div className="space-y-1.5">
                <label className="text-[11px] font-semibold tracking-[0.08em] uppercase text-[#5C5040]">Exam Type</label>
                <Select value={selectedExamType} onValueChange={setSelectedExamType}>
                  <SelectTrigger className="border-[#C8BFA8]">
                    <SelectValue placeholder="Select Exam" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Exams</SelectItem>
                    <SelectItem value="RMTH">RMTH — Maths</SelectItem>
                    <SelectItem value="RSTH">RSTH — Science</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-1.5">
                <label className="text-[11px] font-semibold tracking-[0.08em] uppercase text-[#5C5040]">Year</label>
                <Select value={selectedYear} onValueChange={setSelectedYear}>
                  <SelectTrigger className="border-[#C8BFA8]">
                    <SelectValue placeholder="Select Year" />
                  </SelectTrigger>
                  <SelectContent>
                    {years.map((y) => (
                      <SelectItem key={y} value={y}>{y === 'all' ? 'All Years' : y}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-1.5">
                <label className="text-[11px] font-semibold tracking-[0.08em] uppercase text-[#5C5040]">School</label>
                <Select value={selectedSchool} onValueChange={setSelectedSchool}>
                  <SelectTrigger className="border-[#C8BFA8]">
                    <SelectValue placeholder="Select School" />
                  </SelectTrigger>
                  <SelectContent>
                    {schools.map((s) => (
                      <SelectItem key={s} value={s}>{s === 'all' ? 'All Schools' : s}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-1.5">
                <label className="text-[11px] font-semibold tracking-[0.08em] uppercase text-[#5C5040]">Class</label>
                <Select value={selectedClass} onValueChange={setSelectedClass}>
                  <SelectTrigger className="border-[#C8BFA8]">
                    <SelectValue placeholder="Select Class" />
                  </SelectTrigger>
                  <SelectContent>
                    {classes.map((c) => (
                      <SelectItem key={c} value={c}>{c === 'all' ? 'All Classes' : c}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="flex gap-2">
                <button
                  onClick={() => setHasSearched(true)}
                  className="flex-1 py-2.5 text-[13px] font-semibold tracking-[0.04em] text-white transition-colors"
                  style={{ background: '#0D2340' }}
                >
                  Search
                </button>
                <button
                  onClick={resetFilters}
                  disabled={!hasSearched}
                  className="flex-1 py-2.5 text-[13px] font-medium tracking-[0.04em] text-[#5C5040] border border-[#C8BFA8] hover:border-[#8C6A1A] hover:text-[#0D2340] transition-colors disabled:opacity-40"
                >
                  Reset
                </button>
              </div>
            </div>
          </div>

          {hasSearched && (
            filteredAwardees.length > 0 ? (
              <div className="grid grid-cols-2 md:grid-cols-4 border-l border-t border-[#C8BFA8] mt-0">
                {filteredAwardees.map((awardee) => (
                  <AwardeeCard key={awardee._id} awardee={awardee} />
                ))}
              </div>
            ) : (
              <div className="py-16 text-center text-[#5C5040] border border-[#C8BFA8] border-t-0 bg-white">
                <p className="text-[15px]">No awardees found for the selected filters.</p>
                <p className="mt-2 text-[13px]">Try adjusting your search criteria or resetting the filters.</p>
              </div>
            )
          )}
        </div>

      </div>
    </div>
  );
}
