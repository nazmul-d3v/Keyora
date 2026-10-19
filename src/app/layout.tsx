import type { Metadata } from 'next';
import './globals.css';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';

import AuthProvider from '@/components/providers/AuthProvider';

export const metadata: Metadata = {
  title: 'Keyora | Precision Speed Typing & Competitive Trainer',
  description:
    'Keyora is an elite speed typing trainer and competitive leaderboard platform built for developers, typists, and keyboard enthusiasts.',
  keywords: [
    'typing test',
    'speed typing',
    'wpm test',
    'monkeytype alternative',
    'keyora',
    'keyboard accuracy',
    'mechanical keyboard sounds',
    'typing leaderboard',
  ],
  authors: [{ name: 'Keyora Team' }],
  icons: {
    icon: '/favicon.svg',
    shortcut: '/favicon.svg',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" data-theme="cyber-neon" suppressHydrationWarning>
      <body className="flex flex-col min-h-screen bg-slate-950 text-slate-100 antialiased selection:bg-sky-500/30 selection:text-sky-200">
        <AuthProvider>
          <Navbar />
          <main className="flex-1 flex flex-col">{children}</main>
          <Footer />
        </AuthProvider>
      </body>
    </html>
  );
}
