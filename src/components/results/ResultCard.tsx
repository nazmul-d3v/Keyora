'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import {
  Trophy,
  Share2,
  RotateCcw,
  Check,
  Target,
  Clock,
  Sparkles,
  ArrowRight,
} from 'lucide-react';
import { TestResult, TimelinePoint } from '@/types';
import ProgressChart from './ProgressChart';
import Button from '@/components/ui/Button';

interface ResultCardProps {
  result: TestResult;
}

export function ResultCard({ result }: ResultCardProps) {
  const [copied, setCopied] = useState(false);

  // Parse timeline
  let timeline: TimelinePoint[] = [];
  try {
    if (result.timelineJson) {
      timeline = JSON.parse(result.timelineJson);
    }
  } catch {
    timeline = [];
  }

  const handleCopyShare = async () => {
    const text = `⚡ Keyora Typing Result\nWPM: ${Math.round(result.wpm)} | Acc: ${Math.round(result.accuracy)}% | Raw: ${Math.round(result.rawWpm)} WPM\nMode: ${result.mode} (${result.duration}s)\nTest your speed at: https://keyora.io`;
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    } catch {
      // ignore
    }
  };

  return (
    <div className="w-full max-w-4xl mx-auto flex flex-col gap-8">
      {/* Hero Stats Card */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-b from-slate-900/90 to-slate-950/90 border border-slate-800 p-8 sm:p-10 shadow-2xl backdrop-blur-xl">
        {/* Ambient Top Glow */}
        <div className="absolute top-0 left-1/4 right-1/4 h-32 bg-sky-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 flex flex-col gap-8">
          {/* Top Title Bar */}
          <div className="flex items-center justify-between pb-6 border-b border-slate-800/80">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-xl bg-sky-500/15 border border-sky-500/30 text-sky-400">
                <Trophy className="w-5 h-5" />
              </div>
              <div>
                <h2 className="text-xl font-bold text-white tracking-tight">Test Completed</h2>
                <p className="text-xs text-slate-400 capitalize">
                  {result.mode} mode &bull; {result.duration}s &bull; {result.language}
                </p>
              </div>
            </div>

            <Button
              variant="outline"
              size="sm"
              onClick={handleCopyShare}
              leftIcon={copied ? <Check className="w-4 h-4 text-emerald-400" /> : <Share2 className="w-4 h-4" />}
            >
              {copied ? 'Copied Link' : 'Share Result'}
            </Button>
          </div>

          {/* Primary Metric Highlights */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center md:text-left">
            <div className="flex flex-col">
              <span className="text-xs uppercase font-mono tracking-wider text-slate-400">WPM</span>
              <span className="font-extrabold text-5xl sm:text-6xl text-transparent bg-clip-text bg-gradient-to-r from-sky-400 via-indigo-400 to-purple-400 font-mono tracking-tighter mt-1">
                {Math.round(result.wpm)}
              </span>
              <span className="text-xs text-slate-500 mt-1">Words per minute</span>
            </div>

            <div className="flex flex-col">
              <span className="text-xs uppercase font-mono tracking-wider text-slate-400">Accuracy</span>
              <span className="font-extrabold text-5xl sm:text-6xl text-white font-mono tracking-tighter mt-1">
                {Math.round(result.accuracy)}%
              </span>
              <span className="text-xs text-slate-500 mt-1">Keystroke precision</span>
            </div>

            <div className="flex flex-col">
              <span className="text-xs uppercase font-mono tracking-wider text-slate-400">Raw WPM</span>
              <span className="font-bold text-3xl sm:text-4xl text-slate-200 font-mono tracking-tight mt-2">
                {Math.round(result.rawWpm)}
              </span>
              <span className="text-xs text-slate-500 mt-1">Uncorrected speed</span>
            </div>

            <div className="flex flex-col">
              <span className="text-xs uppercase font-mono tracking-wider text-slate-400">Consistency</span>
              <span className="font-bold text-3xl sm:text-4xl text-emerald-400 font-mono tracking-tight mt-2">
                {Math.round(result.consistency)}%
              </span>
              <span className="text-xs text-slate-500 mt-1">Pacing stability</span>
            </div>
          </div>

          {/* Secondary Details Breakdown */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 p-4 rounded-2xl bg-slate-950/60 border border-slate-800/80 font-mono text-xs">
            <div>
              <span className="text-slate-500 block">Characters:</span>
              <span className="text-slate-200 font-semibold text-sm">
                <span className="text-sky-400">{result.charCount - result.errorsCount}</span> /{' '}
                <span className="text-rose-400">{result.errorsCount}</span>
              </span>
            </div>
            <div>
              <span className="text-slate-500 block">Test Type:</span>
              <span className="text-slate-200 font-semibold text-sm capitalize">
                {result.mode} {result.duration}s
              </span>
            </div>
            <div>
              <span className="text-slate-500 block">Difficulty:</span>
              <span className="text-slate-200 font-semibold text-sm capitalize">
                {result.difficulty}
              </span>
            </div>
            <div>
              <span className="text-slate-500 block">Recorded:</span>
              <span className="text-slate-200 font-semibold text-sm">
                {new Date(result.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
              </span>
            </div>
          </div>

          {/* Dynamic Progress Timeline Chart */}
          <ProgressChart timeline={timeline} />

          {/* Bottom Action Buttons */}
          <div className="flex flex-wrap items-center justify-between gap-4 pt-4 border-t border-slate-800/80">
            <Link href="/">
              <Button
                variant="primary"
                size="md"
                leftIcon={<RotateCcw className="w-4 h-4" />}
              >
                Take Another Test
              </Button>
            </Link>

            <div className="flex items-center gap-3">
              <Link href="/practice">
                <Button
                  variant="secondary"
                  size="md"
                  leftIcon={<Target className="w-4 h-4" />}
                >
                  Practice Mode
                </Button>
              </Link>

              <Link href="/leaderboard">
                <Button
                  variant="outline"
                  size="md"
                  rightIcon={<ArrowRight className="w-4 h-4" />}
                >
                  View Leaderboard
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ResultCard;
