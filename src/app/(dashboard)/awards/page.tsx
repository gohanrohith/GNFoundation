'use client';

import { useState, useMemo, useEffect } from 'react';
import Image from 'next/image';
import { Card, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Award, FilterX, Search, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';

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

export default function AwardsPage() {
  const [allAwardees, setAllAwardees] = useState<Awardee[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchAwardees() {
      try {
        const response = await fetch('/api/awardees');
        const data = await response.json();
        if (data.success) {
          setAllAwardees(data.awardees);
        }
      } catch (error) {
        console.error('Failed to fetch awardees:', error);
      } finally {
        setLoading(false);
      }
    }
    fetchAwardees();
  }, []);

  const years = useMemo(() => allAwardees.length ? ['all', ...Array.from(new Set(allAwardees.map((a) => a.year.toString()))).sort((a,b) => Number(b) - Number(a))] : ['all'], [allAwardees]);
  const schools = useMemo(() => allAwardees.length ? ['all', ...Array.from(new Set(allAwardees.map((a) => a.school))).sort()] : ['all'], [allAwardees]);
  const classes = useMemo(() => allAwardees.length ? ['all', ...Array.from(new Set(allAwardees.map((a) => a.class))).sort()] : ['all'], [allAwardees]);

  const mostRecentYear = useMemo(() => allAwardees.length ? Math.max(...allAwardees.map(a => a.year)) : new Date().getFullYear(), [allAwardees]);

  const currentToppers = useMemo(() => allAwardees.filter(a => a.year === mostRecentYear), [allAwardees, mostRecentYear]);

  const [selectedYear, setSelectedYear] = useState<string>('all');
  const [selectedSchool, setSelectedSchool] = useState<string>('all');
  const [selectedClass, setSelectedClass] = useState<string>('all');

  const [hasSearched, setHasSearched] = useState(false);

  const filteredAwardees = useMemo(() => {
    if (!hasSearched) return [];
    return allAwardees.filter((awardee) => {
      const yearMatch = selectedYear === 'all' || awardee.year.toString() === selectedYear;
      const schoolMatch = selectedSchool === 'all' || awardee.school === selectedSchool;
      const classMatch = selectedClass === 'all' || awardee.class === selectedClass;
      return yearMatch && schoolMatch && classMatch;
    });
  }, [selectedYear, selectedSchool, selectedClass, hasSearched]);

  const resetFilters = () => {
    setSelectedYear('all');
    setSelectedSchool('all');
    setSelectedClass('all');
    setHasSearched(false);
  }

  const handleSearch = () => {
    setHasSearched(true);
  }

  const hasActiveFilters = selectedYear !== 'all' || selectedSchool !== 'all' || selectedClass !== 'all';

  if (loading) {
    return (
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-16 flex justify-center items-center min-h-[50vh]">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-16 space-y-16">
      <div>
        <div className="text-center mb-8 sm:mb-12">
          <h1 className="text-3xl sm:text-4xl font-bold tracking-tight text-primary">Stars of {mostRecentYear}</h1>
          <p className="mt-2 sm:mt-4 max-w-3xl mx-auto text-md sm:text-lg text-muted-foreground">
            Celebrating the brilliant minds who have excelled in our most recent talent hunts.
          </p>
        </div>
        {currentToppers.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 sm:gap-8">
            {currentToppers.map((awardee) => (
              <Card key={awardee._id} className="flex flex-col text-center overflow-hidden hover:shadow-xl transition-shadow duration-300">
                {awardee.imageUrl && (
                  <div className="relative aspect-square w-full">
                    <Image
                      src={awardee.imageUrl}
                      alt={awardee.name}
                      fill
                      className="object-cover"
                    />
                  </div>
                )}
                <CardHeader className="flex-grow p-4">
                  <CardTitle className="text-lg sm:text-xl text-primary">{awardee.name}</CardTitle>
                  <CardDescription className="flex items-center justify-center gap-2 pt-1 text-accent-foreground/80 text-sm sm:text-base">
                    <Award className="h-4 w-4 text-accent" /> {awardee.award}
                  </CardDescription>
                  <CardDescription className="pt-2 text-xs text-muted-foreground">{awardee.school} - {awardee.class}</CardDescription>
                </CardHeader>
              </Card>
            ))}
          </div>
        ) : (
          <div className="text-center py-16 text-muted-foreground">
            <p className="text-lg">No awardees found yet. Add some from the admin panel!</p>
          </div>
        )}
      </div>
      
      <Separator />

      <div>
        <div className="text-center mb-8 sm:mb-12">
            <h2 className="text-3xl sm:text-4xl font-bold tracking-tight text-primary">Explore All Awardees</h2>
            <p className="mt-2 sm:mt-4 max-w-3xl mx-auto text-md sm:text-lg text-muted-foreground">
              Find past winners by filtering by year, school, or class.
            </p>
        </div>
        
        <div className="mb-8 sm:mb-12 p-4 rounded-lg bg-card border shadow-sm">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4 items-end">
            <div className="space-y-2">
              <label htmlFor="year-filter" className="text-sm font-medium text-muted-foreground">Year</label>
              <Select value={selectedYear} onValueChange={setSelectedYear}>
                <SelectTrigger id="year-filter">
                  <SelectValue placeholder="Select Year" />
                </SelectTrigger>
                <SelectContent>
                  {years.map((year) => (
                    <SelectItem key={year} value={year}>{year === 'all' ? 'All Years' : year}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <label htmlFor="school-filter" className="text-sm font-medium text-muted-foreground">School</label>
              <Select value={selectedSchool} onValueChange={setSelectedSchool}>
                <SelectTrigger id="school-filter">
                  <SelectValue placeholder="Select School" />
                </SelectTrigger>
                <SelectContent>
                  {schools.map((school) => (
                    <SelectItem key={school} value={school}>{school === 'all' ? 'All Schools' : school}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <label htmlFor="class-filter" className="text-sm font-medium text-muted-foreground">Class</label>
              <Select value={selectedClass} onValueChange={setSelectedClass}>
                <SelectTrigger id="class-filter">
                  <SelectValue placeholder="Select Class" />
                </SelectTrigger>
                <SelectContent>
                  {classes.map((c) => (
                    <SelectItem key={c} value={c}>{c === 'all' ? 'All Classes' : c}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
             <Button onClick={handleSearch} className="w-full lg:w-auto">
              <Search className="mr-2" />
              Search
            </Button>
            <Button onClick={resetFilters} variant="ghost" className="w-full lg:w-auto" disabled={!hasSearched && !hasActiveFilters}>
              <FilterX className="mr-2" />
              Reset
            </Button>
          </div>
        </div>
        
        {hasSearched && (
          filteredAwardees.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 sm:gap-8">
              {filteredAwardees.map((awardee) => (
                <Card key={awardee._id} className="flex flex-col text-center overflow-hidden hover:shadow-xl transition-shadow duration-300">
                  {awardee.imageUrl && (
                    <div className="relative aspect-square w-full">
                      <Image
                        src={awardee.imageUrl}
                        alt={awardee.name}
                        fill
                        className="object-cover"
                      />
                    </div>
                  )}
                  <CardHeader className="flex-grow p-4">
                    <CardTitle className="text-lg sm:text-xl text-primary">{awardee.name}</CardTitle>
                    <CardDescription className="flex items-center justify-center gap-2 pt-1 text-accent-foreground/80 text-sm sm:text-base">
                      <Award className="h-4 w-4 text-accent" /> {awardee.award}, {awardee.year}
                    </CardDescription>
                    <CardDescription className="pt-2 text-xs text-muted-foreground">{awardee.school} - {awardee.class}</CardDescription>
                  </CardHeader>
                </Card>
              ))}
            </div>
          ) : (
             <div className="text-center py-16 text-muted-foreground">
              <p className="text-lg">No awardees found for the selected filters.</p>
              <p className="mt-2">Try adjusting your search criteria or resetting the filters.</p>
            </div>
          )
        )}
      </div>

    </div>
  );
}
