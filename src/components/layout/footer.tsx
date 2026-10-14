'use client';

import Link from 'next/link';
import Image from 'next/image';
import { useEffect, useState } from 'react';
import { isUserAuthenticated } from '@/hooks/use-auth';

export function Footer() {
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    setIsAdmin(isUserAuthenticated());
    const onVisibility = () => {
      if (!document.hidden) setIsAdmin(isUserAuthenticated());
    };
    document.addEventListener('visibilitychange', onVisibility);
    return () => document.removeEventListener('visibilitychange', onVisibility);
  }, []);

  const adminLink  = isAdmin ? '/admin' : '/login';
  const adminLabel = isAdmin ? 'Admin Panel' : 'Admin Login';

  return (
    <footer style={{ background: '#1A1208', borderTop: '3px solid #0D2340' }}>
      <div className="max-w-[1200px] mx-auto px-6 lg:px-10 pt-12 pb-8">

        {/* Main grid */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10 pb-8 border-b border-white/[0.06]">

          {/* Brand column */}
          <div className="md:col-span-1">
            <Link href="/" className="inline-block mb-3">
              <Image
                src="/docs/Logo.png"
                alt="GN Foundation"
                width={160}
                height={44}
                className="h-10 w-auto object-contain brightness-0 invert opacity-80"
              />
            </Link>
            <div className="text-[10px] tracking-[0.12em] uppercase text-white/25 mb-4">
              Registered · Hanumakonda, Telangana
            </div>
            <p className="text-[13px] text-white/35 leading-[1.7] max-w-[280px]">
              A charitable organisation dedicated to identifying and recognising
              excellence in mathematics and science among school-age students
              across the Telangana region.
            </p>
            <div className="mt-5 space-y-1.5">
              <a
                href="mailto:info@gnfoundation.co.in"
                className="block text-[13px] text-white/45 hover:text-white/80 transition-colors"
              >
                info@gnfoundation.co.in
              </a>
              <a
                href="tel:+919866514516"
                className="block text-[13px] text-white/45 hover:text-white/80 transition-colors"
              >
                +91 98665 14516
              </a>
            </div>
          </div>

          {/* Examinations */}
          <div>
            <h5
              className="text-[10px] font-bold tracking-[0.16em] uppercase mb-4 pb-2.5 border-b border-white/[0.08]"
              style={{ color: '#B8920A' }}
            >
              Examinations
            </h5>
            <ul className="space-y-2">
              {[
                { href: '/talent-hunt', label: 'RMTH — Mathematics' },
                { href: '/talent-hunt', label: 'RSTH — Science' },
                { href: '/talent-hunt', label: 'Eligibility' },
                { href: '/talent-hunt', label: 'Syllabus' },
              ].map((item) => (
                <li key={item.label}>
                  <Link
                    href={item.href}
                    className="text-[13px] text-white/40 hover:text-white/80 transition-colors"
                  >
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Foundation */}
          <div>
            <h5
              className="text-[10px] font-bold tracking-[0.16em] uppercase mb-4 pb-2.5 border-b border-white/[0.08]"
              style={{ color: '#B8920A' }}
            >
              Foundation
            </h5>
            <ul className="space-y-2">
              {[
                { href: '/about',       label: 'About Us' },
                { href: '/awards',      label: 'Honours List' },
                { href: '/contact',     label: 'Contact' },
                { href: adminLink,      label: adminLabel },
              ].map((item) => (
                <li key={item.label}>
                  <Link
                    href={item.href}
                    className="text-[13px] text-white/40 hover:text-white/80 transition-colors"
                  >
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Records */}
          <div>
            <h5
              className="text-[10px] font-bold tracking-[0.16em] uppercase mb-4 pb-2.5 border-b border-white/[0.08]"
              style={{ color: '#B8920A' }}
            >
              Records
            </h5>
            <ul className="space-y-2">
              {[
                { href: '/participation',  label: 'Certificate Download' },
                { href: '/talent-hunt',    label: 'Registration' },
                { href: '/privacy-policy', label: 'Privacy Policy' },
                { href: '/terms',          label: 'Terms of Service' },
              ].map((item) => (
                <li key={item.label}>
                  <Link
                    href={item.href}
                    className="text-[13px] text-white/40 hover:text-white/80 transition-colors"
                  >
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="pt-5 flex flex-col sm:flex-row justify-between items-center gap-3">
          <p className="text-[11px] text-white/20">
            &copy; {new Date().getFullYear()} GN Foundation, Hanumakonda, Telangana. All rights reserved.
          </p>
          <p className="text-[11px] text-white/15 font-heading italic">
            In memory of Smt. Girrem Narayanamma
          </p>
        </div>

      </div>
    </footer>
  );
}
