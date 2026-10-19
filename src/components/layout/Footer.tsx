'use client';

import React from 'react';
import Link from 'next/link';
import { ShieldCheck, Heart } from 'lucide-react';

export function Footer() {
  return (
    <footer className="w-full border-t border-slate-800/80 bg-slate-950/60 backdrop-blur-md py-8 mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Hotkeys Quick Bar */}
        <div className="flex flex-wrap items-center justify-center gap-4 sm:gap-6 pb-6 border-b border-slate-800/60 text-xs text-slate-400">
          <div className="flex items-center gap-1.5">
            <kbd className="px-2 py-0.5 rounded bg-slate-800 border border-slate-700 text-slate-200 font-mono text-[11px] shadow-sm">tab</kbd>
            <span>+</span>
            <kbd className="px-2 py-0.5 rounded bg-slate-800 border border-slate-700 text-slate-200 font-mono text-[11px] shadow-sm">enter</kbd>
            <span className="text-slate-400">- restart test</span>
          </div>

          <div className="flex items-center gap-1.5">
            <kbd className="px-2 py-0.5 rounded bg-slate-800 border border-slate-700 text-slate-200 font-mono text-[11px] shadow-sm">esc</kbd>
            <span className="text-slate-400">- pause / menu</span>
          </div>

          <div className="flex items-center gap-1.5">
            <kbd className="px-2 py-0.5 rounded bg-slate-800 border border-slate-700 text-slate-200 font-mono text-[11px] shadow-sm">ctrl</kbd>
            <span>+</span>
            <kbd className="px-2 py-0.5 rounded bg-slate-800 border border-slate-700 text-slate-200 font-mono text-[11px] shadow-sm">backspace</kbd>
            <span className="text-slate-400">- delete word</span>
          </div>
        </div>

        {/* Brand & Links */}
        <div className="pt-6 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500">
          <div className="flex items-center gap-2">
            <span className="font-semibold text-slate-300 font-mono">KEYORA</span>
            <span>&copy; {new Date().getFullYear()}</span>
            <span>&bull;</span>
            <span className="flex items-center gap-1">
              Crafted for pure typing flow <Heart className="w-3 h-3 text-rose-500 inline fill-rose-500" />
            </span>
          </div>

          <div className="flex items-center gap-6">
            <Link href="/about" className="hover:text-slate-300 transition-colors">
              About
            </Link>
            <Link href="/leaderboard" className="hover:text-slate-300 transition-colors">
              Leaderboard
            </Link>
            <Link href="/settings" className="hover:text-slate-300 transition-colors">
              Settings
            </Link>
            <div className="flex items-center gap-1 text-emerald-400">
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>v1.0.0 Ready</span>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
