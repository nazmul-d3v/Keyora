'use client';

import React from 'react';
import { Zap, Target, Gauge } from 'lucide-react';
import { cn } from '@/lib/utils';

interface StatsBarProps {
  wpm: number;
  rawWpm: number;
  accuracy: number;
  correctChars: number;
  incorrectChars: number;
  className?: string;
  showDetails?: boolean;
}

export function StatsBar({
  wpm,
  rawWpm,
  accuracy,
  correctChars,
  incorrectChars,
  className,
  showDetails = true,
}: StatsBarProps) {
  return (
    <div
      className={cn(
        'flex items-center gap-4 sm:gap-6 px-4 py-2 rounded-2xl bg-slate-900/60 border border-slate-800/80 backdrop-blur-md text-sm',
        className
      )}
    >
      {/* Live WPM */}
      <div className="flex items-center gap-2">
        <Zap className="w-4 h-4 text-sky-400" />
        <div className="flex items-baseline gap-1">
          <span className="font-mono font-bold text-xl text-white tracking-tight">
            {Math.round(wpm)}
          </span>
          <span className="text-[11px] text-slate-400 font-medium uppercase">wpm</span>
        </div>
      </div>

      {/* Live Accuracy */}
      <div className="flex items-center gap-2">
        <Target className="w-4 h-4 text-indigo-400" />
        <div className="flex items-baseline gap-1">
          <span className="font-mono font-bold text-xl text-white tracking-tight">
            {Math.round(accuracy)}%
          </span>
          <span className="text-[11px] text-slate-400 font-medium uppercase">acc</span>
        </div>
      </div>

      {showDetails && (
        <>
          {/* Live Raw WPM */}
          <div className="hidden sm:flex items-center gap-2 border-l border-slate-800 pl-4 sm:pl-6">
            <Gauge className="w-4 h-4 text-slate-400" />
            <div className="flex items-baseline gap-1">
              <span className="font-mono font-semibold text-slate-300">
                {Math.round(rawWpm)}
              </span>
              <span className="text-[11px] text-slate-500 uppercase">raw</span>
            </div>
          </div>

          {/* Keystroke counter */}
          <div className="hidden md:flex items-center gap-2 text-xs font-mono border-l border-slate-800 pl-4 sm:pl-6">
            <span className="text-sky-400" title="Correct characters">{correctChars}</span>
            <span className="text-slate-600">/</span>
            <span className="text-rose-400" title="Incorrect characters">{incorrectChars}</span>
          </div>
        </>
      )}
    </div>
  );
}

export default StatsBar;
