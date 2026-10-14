'use client';

import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import { Home, Info, Trophy, Star, BookUser, Mails, Menu, ShieldCheck } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetTrigger, SheetClose, SheetTitle } from '@/components/ui/sheet';
import { cn } from '@/lib/utils';
import React, { useEffect, useState } from 'react';
import { VisuallyHidden } from '@radix-ui/react-visually-hidden';
import { isUserAuthenticated } from '@/hooks/use-auth';

const navLinks = [
  { href: '/', label: 'Home', icon: Home },
  { href: '/about', label: 'About GN', icon: Info },
  { href: '/talent-hunt', label: 'Talent Hunts', icon: Trophy },
  { href: '/awards', label: 'Awards', icon: Star },
  { href: '/participation', label: 'Participation', icon: BookUser },
  { href: '/contact', label: 'Contact', icon: Mails },
];

export function Header() {
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    setMounted(true);
    setIsAdmin(isUserAuthenticated());
  }, [pathname]);

  if (pathname === '/login') return null;

  const allNavLinks = isAdmin
    ? [...navLinks, { href: '/admin', label: 'Admin', icon: ShieldCheck }]
    : navLinks;

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/60 bg-background/95 backdrop-blur-md shadow-sm">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">

        {/* Desktop — single compact row */}
        <div className="hidden md:flex h-[72px] items-center justify-between gap-8">
          {/* Logo */}
          <Link href="/" className="flex-shrink-0 transition-opacity hover:opacity-85 active:opacity-70">
            <Image
              src="/docs/Logo.png"
              alt="GN Foundation"
              width={200}
              height={56}
              className="h-12 w-auto object-contain"
              priority
            />
          </Link>

          {/* Nav */}
          <nav className="flex items-center gap-1">
            {allNavLinks.map((link) => {
              const isActive =
                pathname === link.href ||
                (link.href === '/admin' && pathname.startsWith('/admin'));

              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={cn(
                    'relative px-4 py-2 rounded-md text-sm font-semibold transition-colors duration-200',
                    isActive
                      ? 'bg-primary text-primary-foreground'
                      : 'text-foreground/70 hover:text-primary hover:bg-primary/8'
                  )}
                >
                  {link.label}
                  {/* Gold accent underline on hover for inactive items */}
                  {mounted && !isActive && (
                    <span className="absolute bottom-1 left-1/2 -translate-x-1/2 h-0.5 w-0 bg-accent transition-all duration-300 group-hover:w-4 rounded-full" />
                  )}
                </Link>
              );
            })}
          </nav>
        </div>

        {/* Mobile row */}
        <div className="md:hidden flex h-16 items-center justify-between">
          <Link href="/" className="transition-opacity active:opacity-70">
            <Image
              src="/docs/Logo.png"
              alt="GN Foundation"
              width={160}
              height={44}
              className="h-11 w-auto object-contain"
            />
          </Link>

          <Sheet open={isOpen} onOpenChange={setIsOpen}>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon" className="hover:bg-primary/10">
                <Menu className="h-6 w-6 text-primary" />
                <span className="sr-only">Toggle menu</span>
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-[280px] bg-background border-l border-border">
              <VisuallyHidden>
                <SheetTitle>Navigation Menu</SheetTitle>
              </VisuallyHidden>
              <div className="flex flex-col h-full py-8">
                <div className="flex justify-center mb-8">
                  <Image
                    src="/docs/Logo.png"
                    alt="GN Foundation"
                    width={160}
                    height={44}
                    className="h-11 w-auto object-contain"
                  />
                </div>
                <nav className="space-y-1">
                  {allNavLinks.map((link) => {
                    const isActive =
                      pathname === link.href ||
                      (link.href === '/admin' && pathname.startsWith('/admin'));
                    const Icon = link.icon;

                    return (
                      <SheetClose asChild key={link.href}>
                        <Link
                          href={link.href}
                          className={cn(
                            'flex items-center gap-3 rounded-lg px-4 py-3 text-base font-semibold transition-colors',
                            isActive
                              ? 'bg-primary text-primary-foreground'
                              : 'text-foreground/70 hover:bg-primary/10 hover:text-primary'
                          )}
                        >
                          <Icon className="h-5 w-5 flex-shrink-0" />
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
    </header>
  );
}
