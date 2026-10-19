import React from 'react';
import Link from 'next/link';
import TypingTest from '@/components/typing/TypingTest';
import { Zap, Trophy, Shield, Activity, Sparkles, ArrowRight } from 'lucide-react';

export default function HomePage() {
  return (
    <div className="flex-1 flex flex-col justify-center items-center px-4 sm:px-6 lg:px-8 py-10 relative overflow-hidden">
      {/* Background Decorative Ambient Flares */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[600px] h-[350px] bg-gradient-to-tr from-sky-500/10 via-indigo-500/10 to-purple-600/10 rounded-full blur-3xl pointer-events-none -z-10" />

      {/* Main Typing Arena Container */}
      <section className="w-full max-w-5xl my-auto">
        <TypingTest initialMode="time" />
      </section>

      {/* Features Grid */}
      <section className="w-full max-w-5xl mt-20 pt-10 border-t border-slate-800/80">
        <div className="text-center max-w-xl mx-auto mb-10">
          <h2 className="text-xl sm:text-2xl font-bold text-white tracking-tight flex items-center justify-center gap-2">
            <Sparkles className="w-5 h-5 text-sky-400" />
            <span>Engineered for Peak Keystroke Precision</span>
          </h2>
          <p className="text-xs sm:text-sm text-slate-400 mt-2">
            Every millisecond of latency eliminated. Synthesized tactile soundscapes, smooth fluid carets, and real-time telemetry.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="p-6 rounded-2xl bg-slate-900/40 border border-slate-800/80 backdrop-blur-md hover:border-sky-500/30 transition-all group">
            <div className="w-10 h-10 rounded-xl bg-sky-500/15 border border-sky-500/30 flex items-center justify-center text-sky-400 mb-4 group-hover:scale-105 transition-transform">
              <Zap className="w-5 h-5" />
            </div>
            <h3 className="font-semibold text-white text-base">Zero-Lag Engine</h3>
            <p className="text-xs text-slate-400 mt-1.5 leading-relaxed">
              Instantaneous key registration with microsecond precision and zero audio delay.
            </p>
          </div>

          <div className="p-6 rounded-2xl bg-slate-900/40 border border-slate-800/80 backdrop-blur-md hover:border-indigo-500/30 transition-all group">
            <div className="w-10 h-10 rounded-xl bg-indigo-500/15 border border-indigo-500/30 flex items-center justify-center text-indigo-400 mb-4 group-hover:scale-105 transition-transform">
              <Activity className="w-5 h-5" />
            </div>
            <h3 className="font-semibold text-white text-base">Second-by-Second Telemetry</h3>
            <p className="text-xs text-slate-400 mt-1.5 leading-relaxed">
              Comprehensive velocity tracking, consistency analytics, and error progression curves.
            </p>
          </div>

          <div className="p-6 rounded-2xl bg-slate-900/40 border border-slate-800/80 backdrop-blur-md hover:border-purple-500/30 transition-all group">
            <div className="w-10 h-10 rounded-xl bg-purple-500/15 border border-purple-500/30 flex items-center justify-center text-purple-400 mb-4 group-hover:scale-105 transition-transform">
              <Trophy className="w-5 h-5" />
            </div>
            <h3 className="font-semibold text-white text-base">Global Hall of Fame</h3>
            <p className="text-xs text-slate-400 mt-1.5 leading-relaxed">
              Compete against top speed typists in 15s, 30s, and 60s competitive divisions.
            </p>
          </div>

          <div className="p-6 rounded-2xl bg-slate-900/40 border border-slate-800/80 backdrop-blur-md hover:border-emerald-500/30 transition-all group">
            <div className="w-10 h-10 rounded-xl bg-emerald-500/15 border border-emerald-500/30 flex items-center justify-center text-emerald-400 mb-4 group-hover:scale-105 transition-transform">
              <Shield className="w-5 h-5" />
            </div>
            <h3 className="font-semibold text-white text-base">Switch Soundscapes</h3>
            <p className="text-xs text-slate-400 mt-1.5 leading-relaxed">
              Authentic synthesized acoustics for Cherry MX Blue, Brown, Red, and Topre switches.
            </p>
          </div>
        </div>

        {/* Action Banner */}
        <div className="mt-12 p-6 rounded-2xl bg-gradient-to-r from-sky-500/10 via-indigo-500/10 to-purple-500/10 border border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div>
            <h4 className="font-bold text-white text-base">Ready to join the leaderboard?</h4>
            <p className="text-xs text-slate-400 mt-0.5">
              Create a free account to preserve test history and unlock custom themes.
            </p>
          </div>
          <Link
            href="/register"
            className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-sky-500 hover:bg-sky-400 text-slate-950 font-semibold text-xs tracking-wider uppercase transition-all shadow-lg shadow-sky-500/20"
          >
            <span>Create Profile</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </section>
    </div>
  );
}
