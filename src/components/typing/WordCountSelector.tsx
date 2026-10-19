'use client';

import React from 'react';
import { WordCountOption } from '@/types';
import { cn } from '@/lib/utils';

interface WordCountSelectorProps {
  currentWordCount: WordCountOption;
  onChange: (count: WordCountOption) => void;
  disabled?: boolean;
}

export function WordCountSelector({
  currentWordCount,
  onChange,
  disabled = false,
}: WordCountSelectorProps) {
  const options: WordCountOption[] = [10, 25, 50, 100];

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
            currentWordCount === option
              ? 'bg-sky-500/20 text-sky-400 border border-sky-500/30 font-semibold shadow-sm shadow-sky-500/20'
              : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
          )}
        >
          {option}w
        </button>
      ))}
    </div>
  );
}

export default WordCountSelector;
