'use client';

import Link from 'next/link';
import Image from 'next/image';
import { Mail, MapPin, ExternalLink, ShieldCheck } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useEffect, useState } from 'react';
import { isUserAuthenticated } from '@/hooks/use-auth';

const footerNav = [
  { href: '/about', label: 'About Us' },
  { href: '/talent-hunt', label: 'Talent Hunts' },
  { href: '/awards', label: 'Awards' },
  { href: '/contact', label: 'Contact' },
  { href: '/participation', label: 'Participation' },
];

export function Footer() {
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    setIsAdmin(isUserAuthenticated());

    const handleVisibilityChange = () => {
      if (!document.hidden) setIsAdmin(isUserAuthenticated());
    };
    document.addEventListener('visibilitychange', handleVisibilityChange);
    return () => document.removeEventListener('visibilitychange', handleVisibilityChange);
  }, []);

  const adminLink = isAdmin ? '/admin' : '/login';
  const adminLabel = isAdmin ? 'ADMIN PANEL' : 'ADMIN LOGIN';

  return (
    <footer className="relative bg-card border-t overflow-hidden">
      <div className="absolute top-0 right-0 -translate-y-1/2 translate-x-1/4 w-96 h-96 bg-primary/5 blur-[120px] rounded-full pointer-events-none" />

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-12 lg:gap-16">

          {/* Brand */}
          <div className="md:col-span-5 space-y-6">
            <Link href="/" className="inline-block transition-opacity hover:opacity-85 duration-300">
              <Image
                src="/docs/Logo.png"
                alt="GN Foundation Logo"
                width={240}
                height={72}
                className="h-16 w-auto object-contain"
              />
            </Link>
            <p className="text-muted-foreground text-base leading-relaxed max-w-sm">
              Empowering future generations through excellence in education,
              innovative talent recognition, and sustainable community support.
            </p>
            <div className="space-y-3 pt-2">
              <div className="flex items-center gap-3 text-sm text-muted-foreground cursor-default">
                <MapPin className="h-4 w-4 text-primary flex-shrink-0" />
                <span>Head Office: Telangana, India</span>
              </div>
              <div className="flex items-center gap-3 text-sm text-muted-foreground hover:text-primary transition-colors">
                <Mail className="h-4 w-4 text-primary flex-shrink-0" />
                <a href="mailto:info@gnfoundation.com">info@gnfoundation.com</a>
              </div>
            </div>
          </div>

          {/* Links Grid */}
          <div className="md:col-span-7 grid grid-cols-2 sm:grid-cols-3 gap-8">
            <div>
              <h3 className="text-sm font-bold tracking-widest uppercase mb-6 bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
                Navigation
              </h3>
              <ul className="space-y-4">
                {footerNav.slice(0, 3).map((item) => (
                  <li key={item.href}>
                    <Link href={item.href} className="text-muted-foreground hover:text-primary transition-all flex items-center group">
                      <span className="w-0 h-0.5 bg-primary mr-0 transition-all group-hover:w-3 group-hover:mr-2 rounded-full" />
                      {item.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <h3 className="text-sm font-bold tracking-widest uppercase mb-6 bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
                Resources
              </h3>
              <ul className="space-y-4">
                {footerNav.slice(3).map((item) => (
                  <li key={item.href}>
                    <Link href={item.href} className="text-muted-foreground hover:text-primary transition-all flex items-center group">
                      <span className="w-0 h-0.5 bg-primary mr-0 transition-all group-hover:w-3 group-hover:mr-2 rounded-full" />
                      {item.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <h3 className="text-sm font-bold tracking-widest uppercase mb-6 bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
                Legal
              </h3>
              <ul className="space-y-4">
                <li>
                  <Link href="/privacy-policy" className="text-muted-foreground hover:text-primary transition-all flex items-center group">
                    <span className="w-0 h-0.5 bg-primary mr-0 transition-all group-hover:w-3 group-hover:mr-2 rounded-full" />
                    Privacy Policy
                  </Link>
                </li>
                <li>
                  <Link href="/terms" className="text-muted-foreground hover:text-primary transition-all flex items-center group">
                    <span className="w-0 h-0.5 bg-primary mr-0 transition-all group-hover:w-3 group-hover:mr-2 rounded-full" />
                    Terms of Service
                  </Link>
                </li>
              </ul>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-16 pt-8 border-t border-border/60 flex flex-col sm:flex-row justify-between items-center gap-4">
          <p className="text-sm text-muted-foreground font-medium">
            &copy; {new Date().getFullYear()} <span className="text-primary font-bold">GN Foundation</span>. All rights reserved.
          </p>

          <div className="flex items-center gap-6">
            <Link
              href={adminLink}
              className={cn(
                'group flex items-center gap-2 text-xs font-bold transition-all px-4 py-2 rounded-full border',
                isAdmin
                  ? 'bg-primary/10 text-primary border-primary/30 hover:border-primary/50 shadow-sm'
                  : 'text-muted-foreground hover:text-primary bg-muted/50 border-border/50'
              )}
            >
              {isAdmin && <ShieldCheck className="h-3 w-3" />}
              {adminLabel}
              <ExternalLink className="h-3 w-3 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
