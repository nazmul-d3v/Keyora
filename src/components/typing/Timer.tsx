'use client';

import React from 'react';
import { Timer as TimerIcon } from 'lucide-react';
import { cn } from '@/lib/utils';
import { formatTime } from '@/utils/formatTime';

interface TimerProps {
  timeLeft: number;
  totalDuration: number;
  mode: string;
  elapsedTime: number;
  className?: string;
}

export function Timer({
  timeLeft,
  totalDuration,
  mode,
  elapsedTime,
  className,
}: TimerProps) {
  const isTimeMode = mode === 'time';
  const displayValue = isTimeMode ? timeLeft : elapsedTime;
  const progressPercent = isTimeMode
    ? Math.max(0, Math.min(100, (timeLeft / totalDuration) * 100))
    : 100;

  const isLowTime = isTimeMode && timeLeft <= 5 && timeLeft > 0;

  return (
    <div className={cn('flex items-center gap-3', className)}>
      <div
        className={cn(
          'flex items-center gap-2 px-3.5 py-1.5 rounded-xl border backdrop-blur-md transition-all font-mono font-bold text-lg',
          isLowTime
            ? 'bg-rose-500/15 border-rose-500/40 text-rose-400 shadow-lg shadow-rose-500/20 animate-pulse'
            : 'bg-slate-900/80 border-slate-800 text-sky-400'
        )}
      >
        <TimerIcon className={cn('w-4 h-4', isLowTime ? 'text-rose-400' : 'text-sky-400')} />
        <span>{isTimeMode ? `${displayValue}s` : formatTime(displayValue)}</span>
      </div>

      {isTimeMode && (
        <div className="w-24 h-2 bg-slate-800/80 rounded-full overflow-hidden hidden sm:block border border-slate-700/50">
          <div
            className={cn(
              'h-full transition-all duration-300 rounded-full',
              isLowTime
                ? 'bg-rose-500 shadow-[0_0_8px_rgba(244,63,94,0.6)]'
                : 'bg-gradient-to-r from-sky-400 to-indigo-500 shadow-[0_0_8px_rgba(56,189,248,0.5)]'
            )}
            style={{ width: `${progressPercent}%` }}
          />
        </div>
      )}
    </div>
  );
}

export default Timer;
