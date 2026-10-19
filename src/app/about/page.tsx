import React from 'react';
import Link from 'next/link';
import {
  Keyboard,
  Zap,
  Activity,
  Cpu,
  ShieldCheck,
  ArrowRight,
} from 'lucide-react';
import Button from '@/components/ui/Button';

export default function AboutPage() {
  return (
    <div className="flex-1 max-w-4xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-12">
      {/* Hero Header */}
      <div className="text-center max-w-2xl mx-auto mb-16">
        <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-sky-500/10 border border-sky-500/30 text-sky-400 text-xs font-mono font-medium mb-4">
          <Keyboard className="w-3.5 h-3.5" />
          <span>About the Platform</span>
        </div>
        <h1 className="text-3xl sm:text-5xl font-extrabold text-white tracking-tight leading-tight">
          Crafted for Pure <br className="hidden sm:inline" />
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-sky-400 via-indigo-400 to-purple-400">
            Typing Velocity
          </span>
        </h1>
        <p className="text-sm sm:text-base text-slate-400 mt-4 leading-relaxed">
          Keyora is a next-generation speed typing suite designed to eliminate the friction between mind and terminal. Inspired by the golden age of mechanical keyboards and modern telemetry.
        </p>
      </div>

      {/* Philosophy Pillars */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-16">
        <div className="p-6 rounded-3xl bg-slate-900/40 border border-slate-800 shadow-xl backdrop-blur-md">
          <div className="w-10 h-10 rounded-2xl bg-sky-500/20 text-sky-400 flex items-center justify-center mb-4">
            <Zap className="w-5 h-5" />
          </div>
          <h3 className="font-bold text-white text-base mb-1.5">Zero Micro-Jitter</h3>
          <p className="text-xs text-slate-400 leading-relaxed">
            Every keystroke event is registered synchronously with microsecond resolution for instant caret positioning.
          </p>
        </div>

        <div className="p-6 rounded-3xl bg-slate-900/40 border border-slate-800 shadow-xl backdrop-blur-md">
          <div className="w-10 h-10 rounded-2xl bg-indigo-500/20 text-indigo-400 flex items-center justify-center mb-4">
            <Cpu className="w-5 h-5" />
          </div>
          <h3 className="font-bold text-white text-base mb-1.5">Synthesized Audio</h3>
          <p className="text-xs text-slate-400 leading-relaxed">
            Switch clicks and thocks are algorithmically generated on-the-fly using the HTML5 Web Audio API with zero audio file latency.
          </p>
        </div>

        <div className="p-6 rounded-3xl bg-slate-900/40 border border-slate-800 shadow-xl backdrop-blur-md">
          <div className="w-10 h-10 rounded-2xl bg-purple-500/20 text-purple-400 flex items-center justify-center mb-4">
            <Activity className="w-5 h-5" />
          </div>
          <h3 className="font-bold text-white text-base mb-1.5">Deep Telemetry</h3>
          <p className="text-xs text-slate-400 leading-relaxed">
            Track velocity variance, error burst clusters, and muscle memory progression over time.
          </p>
        </div>
      </div>

      {/* Metrics Guide */}
      <div className="p-8 rounded-3xl bg-slate-900/50 border border-slate-800 shadow-2xl backdrop-blur-xl mb-16">
        <h2 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
          <ShieldCheck className="w-5 h-5 text-emerald-400" />
          <span>Understanding Keyora Metrics</span>
        </h2>

        <div className="space-y-6 text-sm">
          <div>
            <h4 className="font-mono font-bold text-sky-400 mb-1">Net WPM (Words Per Minute)</h4>
            <p className="text-xs text-slate-300 leading-relaxed">
              Standard competitive calculation: <code>(Correct Characters / 5) / (Time in Minutes)</code>. Only correctly typed characters contribute to your official WPM score.
            </p>
          </div>

          <div>
            <h4 className="font-mono font-bold text-indigo-400 mb-1">Raw WPM (Gross Speed)</h4>
            <p className="text-xs text-slate-300 leading-relaxed">
              Total keystroke speed including uncorrected mistakes: <code>(Total Characters / 5) / (Time in Minutes)</code>. Reflects finger movement velocity before penalty.
            </p>
          </div>

          <div>
            <h4 className="font-mono font-bold text-emerald-400 mb-1">Consistency Rating (%)</h4>
            <p className="text-xs text-slate-300 leading-relaxed">
              Measures velocity stability across the test duration. A 95%+ consistency score indicates smooth, uninterrupted rhythm without pausing or panic bursts.
            </p>
          </div>
        </div>
      </div>

      {/* Hotkeys Cheat Sheet */}
      <div className="p-8 rounded-3xl bg-slate-900/30 border border-slate-800 mb-16">
        <h2 className="text-lg font-bold text-white mb-4">Command & Hotkey Reference</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs font-mono">
          <div className="flex items-center justify-between p-3 rounded-xl bg-slate-950/60 border border-slate-800">
            <span className="text-slate-400">Restart Current Test</span>
            <span className="text-sky-400">Tab + Enter</span>
          </div>
          <div className="flex items-center justify-between p-3 rounded-xl bg-slate-950/60 border border-slate-800">
            <span className="text-slate-400">Quick Pause / Reset</span>
            <span className="text-sky-400">Escape</span>
          </div>
          <div className="flex items-center justify-between p-3 rounded-xl bg-slate-950/60 border border-slate-800">
            <span className="text-slate-400">Delete Entire Word</span>
            <span className="text-sky-400">Ctrl + Backspace</span>
          </div>
          <div className="flex items-center justify-between p-3 rounded-xl bg-slate-950/60 border border-slate-800">
            <span className="text-slate-400">Toggle Audio Mute</span>
            <span className="text-sky-400">Speaker Icon</span>
          </div>
        </div>
      </div>

      {/* CTA Box */}
      <div className="text-center p-8 rounded-3xl bg-gradient-to-r from-sky-500/10 via-indigo-500/10 to-purple-500/10 border border-slate-800">
        <h3 className="text-xl font-bold text-white mb-2">Ready to test your limits?</h3>
        <p className="text-xs text-slate-400 mb-6">Experience the flow of typing with zero latency.</p>
        <Link href="/">
          <Button variant="primary" size="lg" rightIcon={<ArrowRight className="w-4 h-4" />}>
            Jump into Speed Test
          </Button>
        </Link>
      </div>
    </div>
  );
}
