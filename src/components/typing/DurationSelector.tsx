'use client';

import React from 'react';
import { DurationOption } from '@/types';
import { cn } from '@/lib/utils';

interface DurationSelectorProps {
  currentDuration: DurationOption;
  onChange: (duration: DurationOption) => void;
  disabled?: boolean;
}

export function DurationSelector({
  currentDuration,
  onChange,
  disabled = false,
}: DurationSelectorProps) {
  const options: DurationOption[] = [15, 30, 60, 120];

  return (
    <div className="flex items-center gap-1 bg-slate-900/60 p-1 rounded-xl border border-slate-800 backdrop-blur-md">
      {options.map((option) => (
        <button
          key={option}
          type="button"
          disabled={disabled}
          onClick={() => onChange(option)}
          className={cn(
            'px-3 py-1 rounded-lg text-xs font-mono font-medium transition-all cursor-pointer select-none',
            currentDuration === option
              ? 'bg-sky-500/20 text-sky-400 border border-sky-500/30 font-semibold shadow-sm shadow-sky-500/20'
              : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
          )}
        >
          {option}s
        </button>
      ))}
    </div>
  );
}

export default DurationSelector;
