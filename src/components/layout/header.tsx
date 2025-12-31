'use client';

import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import { Home, Info, Trophy, Star, BookUser, Mails, Menu, ShieldCheck, LogIn } from 'lucide-react';
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
    // Check admin status on mount and when pathname changes
    setIsAdmin(isUserAuthenticated());
  }, [pathname]);

  if (pathname === '/login') return null;

  const mainNavLinks = navLinks.filter(link => link.href !== '/admin');

  // Add admin link dynamically based on auth status
  const allNavLinks = isAdmin
    ? [...mainNavLinks, { href: '/admin', label: 'Admin Panel', icon: ShieldCheck }]
    : mainNavLinks;

  // Brand Colors (Logo derived: Green to Orange)
  const brandGradient = "from-[#008000] via-[#4d9900] to-[#FF8C00]";
  const brandGradientHover = "hover:from-[#008000]/10 hover:to-[#FF8C00]/10";

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/90 backdrop-blur-md">
      <div className="container mx-auto px-4">
        {/* Desktop Header - Ultra Prominent Logo */}
        <div className="hidden md:flex flex-col items-center py-8">
          <Link href="/" className="mb-8 transition-all duration-500 hover:scale-[1.03] active:scale-95">
            <Image
              src="/docs/Logo.png"
              alt="GN Foundation Logo"
              width={400} // Increased width
              height={120} // Increased height
              className="h-32 w-auto object-contain" // Even bigger height (128px)
              priority
            />
          </Link>

          <nav className="flex items-center justify-center p-2 bg-muted/30 rounded-full border border-border/40 shadow-inner backdrop-blur-sm">
            {allNavLinks.map((link) => {
              const isActive = pathname === link.href || (link.href === '/admin' && pathname.startsWith('/admin'));
              const Icon = link.icon;

              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={cn(
                    'group relative flex items-center gap-2.5 px-7 py-3 rounded-full text-sm font-bold transition-all duration-500',
                    isActive
                      ? `bg-gradient-to-r ${brandGradient} text-white shadow-lg shadow-green-900/30`
                      : `text-muted-foreground ${brandGradientHover} hover:text-[#008000]`
                  )}
                >
                  <Icon className={cn(
                    "h-4 w-4 transition-transform duration-300",
                    isActive ? "scale-110" : "group-hover:scale-110 group-hover:rotate-6"
                  )} />
                  
                  <span className={cn(
                    "transition-colors duration-300",
                    !isActive && "group-hover:text-[#008000]"
                  )}>
                    {link.label}
                  </span>

                  {/* Animated Gradient Underline */}
                  {mounted && !isActive && (
                    <span className={cn(
                      "absolute bottom-1.5 left-1/2 -translate-x-1/2 w-0 h-0.5 bg-gradient-to-r transition-all duration-500 group-hover:w-1/2 rounded-full",
                      brandGradient
                    )} />
                  )}
                </Link>
              );
            })}
          </nav>
        </div>

        {/* Mobile Header - Increased for visibility */}
        <div className="md:hidden flex h-24 items-center justify-between">
          <Link href="/" className="transition-transform active:scale-95">
            <Image 
              src="/docs/Logo.png" 
              alt="Logo" 
              width={200} 
              height={60} 
              className="h-16 w-auto object-contain" 
            />
          </Link>

          <Sheet open={isOpen} onOpenChange={setIsOpen}>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon" className="hover:bg-green-50 h-12 w-12">
                <Menu className="h-8 w-8 text-[#008000]" />
                <span className="sr-only">Toggle navigation menu</span>
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-[300px] border-l-[#008000]/20 bg-background/95 backdrop-blur-xl">
              <VisuallyHidden>
                <SheetTitle>Navigation Menu</SheetTitle>
              </VisuallyHidden>
              <div className="flex flex-col h-full py-8">
                <div className="flex justify-center mb-10">
                   <Image 
                    src="/docs/Logo.png" 
                    alt="Logo" 
                    width={180} 
                    height={54} 
                    className="h-14 w-auto object-contain" 
                  />
                </div>
                <nav className="space-y-4">
                  {allNavLinks.map((link) => {
                    const isActive = pathname === link.href || (link.href === '/admin' && pathname.startsWith('/admin'));
                    const Icon = link.icon;

                    return (
                      <SheetClose asChild key={link.href}>
                        <Link
                          href={link.href}
                          className={cn(
                            'flex items-center gap-4 rounded-2xl px-6 py-4.5 text-base font-bold transition-all',
                            isActive
                              ? `bg-gradient-to-br ${brandGradient} text-white shadow-xl shadow-green-900/20 translate-x-2`
                              : 'text-muted-foreground hover:bg-green-50 hover:text-[#008000] active:scale-95'
                          )}
                        >
                          <Icon className="h-5 w-5" />
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