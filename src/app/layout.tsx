import type { Metadata } from 'next';
import './globals.css';
import { Toaster } from '@/components/ui/toaster';
import { Header } from '@/components/layout/header';
import { Footer } from '@/components/layout/footer';
import { PT_Sans } from 'next/font/google';

const ptSans = PT_Sans({
  subsets: ['latin'],
  weight: ['400', '700'],
  variable: '--font-pt-sans',
});


const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://gnfoundation.com';

export const metadata: Metadata = {
  title: {
    default: 'GN Foundation',
    template: '%s | GN Foundation',
  },
  description:
    'Empowering future generations through education. GN Foundation conducts the Regional Mathematics & Science Talent Hunt (RMTH & RSTH) in memory of Smt. Girrem Narayanamma.',
  metadataBase: new URL(siteUrl),
  keywords: ['GN Foundation', 'RMTH', 'RSTH', 'talent hunt', 'mathematics', 'science', 'Telangana', 'education', 'student awards'],
  authors: [{ name: 'GN Foundation' }],
  openGraph: {
    type: 'website',
    locale: 'en_IN',
    url: siteUrl,
    siteName: 'GN Foundation',
    title: 'GN Foundation — Empowering Future Generations',
    description:
      'Conducting the Regional Mathematics & Science Talent Hunt (RMTH & RSTH) to identify and celebrate talented students across Telangana.',
    images: [
      {
        url: '/og-image.png',
        width: 1200,
        height: 630,
        alt: 'GN Foundation',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'GN Foundation — Empowering Future Generations',
    description:
      'Conducting the Regional Mathematics & Science Talent Hunt (RMTH & RSTH) to identify and celebrate talented students across Telangana.',
    images: ['/og-image.png'],
  },
  icons: {
    icon: '/icon.png',
    shortcut: '/icon.png',
    apple: '/icon.png',
  },
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true },
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${ptSans.variable} h-full`}>
      <body className="font-body antialiased flex flex-col min-h-screen bg-background">
        <Header />
        <main className="flex-grow">{children}</main>
        <Footer />
        <Toaster />
      </body>
    </html>
  );
}
