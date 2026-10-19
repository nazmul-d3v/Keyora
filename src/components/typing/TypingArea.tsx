'use client';

import React, { useRef, useEffect, useState, useMemo } from 'react';
import { MousePointerClick } from 'lucide-react';
import { cn } from '@/lib/utils';
import { TestState } from '@/types';

interface TypingAreaProps {
  targetText: string;
  input: string;
  onInput: (val: string) => void;
  testState: TestState;
  inputRef?: React.RefObject<HTMLInputElement>;
  caretStyle?: 'smooth-line' | 'block' | 'underline' | 'pulse';
  className?: string;
}

export function TypingArea({
  targetText,
  input,
  onInput,
  testState,
  inputRef,
  caretStyle = 'smooth-line',
  className,
}: TypingAreaProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const internalInputRef = useRef<HTMLInputElement>(null);
  const activeInputRef = inputRef || internalInputRef;
  const [isFocused, setIsFocused] = useState(true);

  // Focus input automatically on mount
  useEffect(() => {
    if (activeInputRef.current) {
      activeInputRef.current.focus();
    }
  }, [activeInputRef]);

  const handleContainerClick = () => {
    if (activeInputRef.current) {
      activeInputRef.current.focus();
      setIsFocused(true);
    }
  };

  // Build character render list
  const renderedChars = useMemo(() => {
    const chars: {
      char: string;
      state: 'idle' | 'correct' | 'incorrect' | 'extra';
      isCurrent: boolean;
      index: number;
    }[] = [];

    const targetLength = targetText.length;
    const inputLength = input.length;
    const maxLength = Math.max(targetLength, inputLength);

    for (let i = 0; i < maxLength; i++) {
      const isCurrent = i === inputLength;

      if (i < targetLength) {
        const expected = targetText[i];
        if (i < inputLength) {
          const typed = input[i];
          chars.push({
            char: expected,
            state: typed === expected ? 'correct' : 'incorrect',
            isCurrent,
            index: i,
          });
        } else {
          chars.push({
            char: expected,
            state: 'idle',
            isCurrent,
            index: i,
          });
        }
      } else {
        // Extra characters typed past target text
        chars.push({
          char: input[i],
          state: 'extra',
          isCurrent,
          index: i,
        });
      }
    }

    return chars;
  }, [targetText, input]);

  // Caret style classes
  const caretClasses = {
    'smooth-line': 'border-l-2 border-sky-400 animate-pulse',
    block: 'bg-sky-400/50 text-white animate-pulse rounded-sm',
    underline: 'border-b-2 border-sky-400 animate-pulse',
    pulse: 'border-l-2 border-sky-400 shadow-[0_0_8px_#38bdf8] animate-ping',
  };

  return (
    <div
      ref={containerRef}
      onClick={handleContainerClick}
      className={cn(
        'relative w-full min-h-[180px] p-6 sm:p-8 rounded-3xl bg-slate-900/40 border border-slate-800/80 backdrop-blur-xl transition-all cursor-text select-none overflow-hidden group',
        !isFocused && 'border-slate-800 opacity-70',
        isFocused && 'ring-1 ring-sky-500/20 border-slate-700/80 shadow-2xl shadow-sky-500/5',
        className
      )}
    >
      {/* Hidden native input */}
      <input
        ref={activeInputRef}
        type="text"
        value={input}
        onChange={(e) => onInput(e.target.value)}
        onFocus={() => setIsFocused(true)}
        onBlur={() => setIsFocused(false)}
        disabled={testState === 'completed'}
        className="absolute opacity-0 pointer-events-none inset-0 w-full h-full cursor-default"
        autoCapitalize="none"
        autoComplete="off"
        autoCorrect="off"
        spellCheck="false"
      />

      {/* Focus overlay alert if user clicked outside */}
      {!isFocused && testState !== 'completed' && (
        <div className="absolute inset-0 z-20 flex items-center justify-center bg-slate-950/60 backdrop-blur-sm transition-all">
          <div className="flex items-center gap-2 px-4 py-2 rounded-xl bg-slate-900 border border-sky-500/40 shadow-xl shadow-sky-500/10 text-sky-400 text-sm font-medium animate-pulse">
            <MousePointerClick className="w-4 h-4" />
            <span>Click or press any key to focus</span>
          </div>
        </div>
      )}

      {/* Characters Flow */}
      <div className="font-mono text-xl sm:text-2xl leading-relaxed tracking-normal break-words whitespace-pre-wrap select-none">
        {renderedChars.map((item, idx) => {
          let charStyle = 'text-slate-500'; // idle
          if (item.state === 'correct') {
            charStyle = 'text-sky-300 drop-shadow-[0_0_8px_rgba(56,189,248,0.35)]';
          } else if (item.state === 'incorrect') {
            charStyle = 'text-rose-400 bg-rose-500/20 rounded px-0.5 underline decoration-rose-500 decoration-2';
          } else if (item.state === 'extra') {
            charStyle = 'text-rose-300 bg-rose-900/50 rounded px-0.5';
          }

          const isCurrentCaret = item.isCurrent && isFocused && testState !== 'completed';

          return (
            <span
              key={idx}
              className={cn(
                'relative transition-colors duration-75',
                charStyle,
                isCurrentCaret && caretClasses[caretStyle]
              )}
            >
              {item.char}
            </span>
          );
        })}

        {/* Caret at very end if input has reached or passed target */}
        {input.length >= targetText.length && isFocused && testState !== 'completed' && (
          <span className={cn('inline-block w-0.5 h-6 align-middle', caretClasses[caretStyle])} />
        )}
      </div>
    </div>
  );
}

export default TypingArea;
