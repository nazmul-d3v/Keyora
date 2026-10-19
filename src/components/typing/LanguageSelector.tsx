'use client';

import React from 'react';
import { Globe, Code2, Quote, Hash, Languages } from 'lucide-react';
import { LanguageOption } from '@/types';
import { cn } from '@/lib/utils';

interface LanguageSelectorProps {
  currentLanguage: LanguageOption;
  onChange: (language: LanguageOption) => void;
  disabled?: boolean;
}

export function LanguageSelector({
  currentLanguage,
  onChange,
  disabled = false,
}: LanguageSelectorProps) {
  const options: { id: LanguageOption; label: string; icon: React.ElementType }[] = [
    { id: 'english', label: 'English', icon: Globe },
    { id: 'code', label: 'Code', icon: Code2 },
    { id: 'quotes', label: 'Quotes', icon: Quote },
    { id: 'numbers', label: 'Numbers', icon: Hash },
    { id: 'spanish', label: 'Spanish', icon: Languages },
  ];

  return (
    <div className="flex items-center gap-1 bg-slate-900/60 p-1 rounded-xl border border-slate-800 backdrop-blur-md overflow-x-auto max-w-full">
      {options.map((opt) => {
        const Icon = opt.icon;
        const isActive = currentLanguage === opt.id;
        return (
          <button
            key={opt.id}
            type="button"
            disabled={disabled}
            onClick={() => onChange(opt.id)}
            className={cn(
              'flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-medium transition-all whitespace-nowrap cursor-pointer select-none',
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

export default LanguageSelector;
