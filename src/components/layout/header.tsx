'use client';

import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import { Menu } from 'lucide-react';
import { Sheet, SheetContent, SheetTrigger, SheetClose, SheetTitle } from '@/components/ui/sheet';
import { cn } from '@/lib/utils';
import React, { useEffect, useState } from 'react';
import { VisuallyHidden } from '@radix-ui/react-visually-hidden';
import { isUserAuthenticated } from '@/hooks/use-auth';

const navLinks = [
  { href: '/about',        label: 'About' },
  { href: '/talent-hunt',  label: 'Talent Hunts' },
  { href: '/awards',       label: 'Awards' },
  { href: '/contact',      label: 'Contact' },
];


export function Header() {
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    setIsAdmin(isUserAuthenticated());
  }, [pathname]);

  if (pathname === '/login') return null;

  const allNavLinks = isAdmin
    ? [...navLinks, { href: '/admin', label: 'Admin' }]
    : navLinks;

  return (
    <header className="sticky top-0 z-50 w-full">

      {/* 4px navy top rule */}
      <div className="h-1 bg-[#0D2340]" />

      {/* White masthead */}
      <div className="bg-white border-b border-[#C8BFA8]">
        <div className="max-w-[1200px] mx-auto px-6 lg:px-10 flex items-stretch min-h-[72px]">

          {/* Logo */}
          <Link
            href="/"
            className="flex items-center py-3 pr-8 border-r border-[#C8BFA8] flex-shrink-0 transition-opacity hover:opacity-85"
          >
            <Image
              src="/docs/Logo.png"
              alt="GN Foundation"
              width={180}
              height={48}
              className="h-11 w-auto object-contain"
              priority
            />
          </Link>

          {/* Desktop nav */}
          <nav className="hidden md:flex items-stretch justify-end flex-1 pl-6 gap-0">
            {allNavLinks.map((link) => {
              const isActive =
                pathname === link.href ||
                (link.href === '/admin' && pathname.startsWith('/admin'));
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={cn(
                    'px-5 flex items-center text-[13px] tracking-[0.04em] transition-colors',
                    isActive
                      ? 'text-[#0D2340] font-semibold bg-[#F8F5EF]'
                      : 'text-[#5C5040] font-medium hover:text-[#0D2340] hover:bg-[#F8F5EF]'
                  )}
                >
                  {link.label}
                </Link>
              );
            })}
            <Link
              href="/participation"
              className="ml-3 flex-shrink-0 flex items-center px-6 bg-[#0D2340] text-white text-[13px] font-semibold tracking-[0.04em] hover:bg-[#16325C] transition-colors"
            >
              Certificate Download
            </Link>
          </nav>

          {/* Mobile hamburger */}
          <div className="md:hidden flex items-center justify-end flex-1">
            <Sheet open={isOpen} onOpenChange={setIsOpen}>
              <SheetTrigger asChild>
                <button className="p-2 text-[#0D2340]" aria-label="Open menu">
                  <Menu className="h-6 w-6" />
                </button>
              </SheetTrigger>
              <SheetContent side="right" className="w-[280px] bg-[#F8F5EF] border-l border-[#C8BFA8] p-0">
                <VisuallyHidden>
                  <SheetTitle>Navigation Menu</SheetTitle>
                </VisuallyHidden>
                <div className="flex flex-col h-full">
                  <div className="px-6 pt-8 pb-5 border-b border-[#C8BFA8]">
                    <div className="font-heading text-[#0D2340] text-xl font-semibold">GN Foundation</div>
                    <div className="text-[10px] font-semibold tracking-[0.18em] uppercase text-[#8C6A1A] mt-1">
                      Hanumakonda · Telangana
                    </div>
                  </div>
                  <nav className="flex-1 overflow-auto py-2">
                    {[...allNavLinks, { href: '/participation', label: 'Certificate Download' }].map((link) => {
                      const isActive = pathname === link.href;
                      return (
                        <SheetClose asChild key={`${link.href}-${link.label}`}>
                          <Link
                            href={link.href}
                            className={cn(
                              'flex items-center px-6 py-3 text-sm border-b border-[#C8BFA8] transition-colors',
                              isActive
                                ? 'text-[#0D2340] font-semibold bg-white'
                                : 'text-[#5C5040] font-medium hover:text-[#0D2340] hover:bg-white'
                            )}
                          >
                            {link.label}
                          </Link>
                        </SheetClose>
                      );
                    })}
                  </nav>
                </div>
              </SheetContent>
            </Sheet>
          </div>

        </div>
      </div>


    </header>
  );
}
