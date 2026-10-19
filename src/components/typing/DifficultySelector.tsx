'use client';

import React from 'react';
import { DifficultyOption } from '@/types';
import { cn } from '@/lib/utils';
import { Sparkles, Flame, ShieldAlert } from 'lucide-react';

interface DifficultySelectorProps {
  currentDifficulty: DifficultyOption;
  onChange: (diff: DifficultyOption) => void;
  disabled?: boolean;
}

export function DifficultySelector({
  currentDifficulty,
  onChange,
  disabled = false,
}: DifficultySelectorProps) {
  const options: { id: DifficultyOption; label: string; icon: React.ElementType }[] = [
    { id: 'easy', label: 'Easy', icon: Sparkles },
    { id: 'medium', label: 'Medium', icon: Flame },
    { id: 'hard', label: 'Master', icon: ShieldAlert },
  ];

  return (
    <div className="flex items-center gap-1 bg-slate-900/60 p-1 rounded-xl border border-slate-800 backdrop-blur-md">
      {options.map((opt) => {
        const Icon = opt.icon;
        const isActive = currentDifficulty === opt.id;
        return (
          <button
            key={opt.id}
            type="button"
            disabled={disabled}
            onClick={() => onChange(opt.id)}
            className={cn(
              'flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-medium transition-all cursor-pointer select-none',
              isActive
                ? 'bg-sky-500/20 text-sky-400 border border-sky-500/30 font-semibold shadow-sm'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
            )}
          >
            <Icon className="w-3.5 h-3.5" />
            <span>{opt.label}</span>
          </button>
        );
      })}
    </div>
  );
}

export default DifficultySelector;
