'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import confetti from 'canvas-confetti';
import {
  RotateCcw,
  Volume2,
  VolumeX,
  Clock,
  Type,
  Quote,
  Sparkles,
} from 'lucide-react';
import { useTypingTest } from '@/hooks/useTypingTest';
import { TypingMode, TypingStats } from '@/types';
import TypingArea from './TypingArea';
import Timer from './Timer';
import StatsBar from './StatsBar';
import DurationSelector from './DurationSelector';
import WordCountSelector from './WordCountSelector';
import LanguageSelector from './LanguageSelector';
import DifficultySelector from './DifficultySelector';
import Button from '@/components/ui/Button';

interface TypingTestProps {
  initialMode?: TypingMode;
  onFinished?: (resultId: string) => void;
}

export function TypingTest({ initialMode = 'time' }: TypingTestProps) {
  const router = useRouter();
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [caretStyle, setCaretStyle] = useState<'smooth-line' | 'block' | 'underline' | 'pulse'>('smooth-line');

  // Load sound preferences from localStorage if set
  useEffect(() => {
    const savedSound = localStorage.getItem('keyora-sound');
    if (savedSound !== null) setSoundEnabled(savedSound === 'true');
    const savedCaret = localStorage.getItem('keyora-caret') as 'smooth-line' | 'block' | 'underline' | 'pulse' | null;
    if (savedCaret) setCaretStyle(savedCaret);
  }, []);

  const handleTestComplete = useCallback(
    async (stats: TypingStats) => {
      // Fire confetti celebration if high accuracy & speed
      if (stats.wpm >= 60 && stats.accuracy >= 90) {
        try {
          confetti({
            particleCount: 80,
            spread: 70,
            origin: { y: 0.6 },
          });
        } catch {
          // ignore
        }
      }

      // Save result to backend API
      try {
        const payload = {
          wpm: stats.wpm,
          rawWpm: stats.rawWpm,
          accuracy: stats.accuracy,
          consistency: stats.consistency,
          duration: stats.duration,
          mode: typingHook.mode,
          language: typingHook.language,
          difficulty: typingHook.difficulty,
          wordsCount: stats.wordsCount,
          errorsCount: stats.incorrectChars,
          charCount: stats.totalChars,
          passageId: typingHook.passageId,
          timelineJson: JSON.stringify(stats.timeline),
        };

        const res = await fetch('/api/tests', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload),
        });

        if (res.ok) {
          const saved = await res.json();
          // Store result in sessionStorage for instant result viewing
          sessionStorage.setItem(`test-result-${saved.id}`, JSON.stringify(saved));
          router.push(`/results/${saved.id}`);
          return;
        }
      } catch {
        // Fallback
      }

      // Offline / fallback storage
      const fallbackId = `temp-${Date.now()}`;
      const fallbackResult = {
        id: fallbackId,
        wpm: stats.wpm,
        rawWpm: stats.rawWpm,
        accuracy: stats.accuracy,
        consistency: stats.consistency,
        duration: stats.duration,
        mode: typingHook.mode,
        language: typingHook.language,
        difficulty: typingHook.difficulty,
        wordsCount: stats.wordsCount,
        errorsCount: stats.incorrectChars,
        charCount: stats.totalChars,
        timelineJson: JSON.stringify(stats.timeline),
        createdAt: new Date().toISOString(),
      };
      sessionStorage.setItem(`test-result-${fallbackId}`, JSON.stringify(fallbackResult));
      router.push(`/results/${fallbackId}`);
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [router]
  );

  const typingHook = useTypingTest({
    initialMode,
    soundEnabled,
    onComplete: handleTestComplete,
  });

  const {
    mode,
    setMode,
    duration,
    setDuration,
    wordCount,
    setWordCount,
    language,
    setLanguage,
    difficulty,
    setDifficulty,
    targetText,
    passageTitle,
    input,
    handleInput,
    testState,
    timeLeft,
    elapsedTime,
    correctChars,
    incorrectChars,
    currentWpm,
    currentRawWpm,
    currentAccuracy,
    resetTest,
    inputRef,
  } = typingHook;

  // Keyboard shortcut listener for Tab + Enter or Esc
  useEffect(() => {
    let tabPressed = false;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Tab') {
        tabPressed = true;
      }
      if (e.key === 'Enter' && tabPressed) {
        e.preventDefault();
        resetTest();
      }
      if (e.key === 'Escape') {
        resetTest();
      }
    };

    const handleKeyUp = (e: KeyboardEvent) => {
      if (e.key === 'Tab') {
        tabPressed = false;
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
    };
  }, [resetTest]);

  const toggleSound = () => {
    const nextVal = !soundEnabled;
    setSoundEnabled(nextVal);
    localStorage.setItem('keyora-sound', String(nextVal));
  };

  return (
    <div className="w-full max-w-5xl mx-auto flex flex-col gap-6">
      {/* Top Test Configuration Controls */}
      <div className="flex flex-wrap items-center justify-between gap-3 p-2 sm:p-3 rounded-2xl bg-slate-900/60 border border-slate-800/80 backdrop-blur-xl">
        {/* Mode Switcher */}
        <div className="flex items-center gap-1 bg-slate-950/60 p-1 rounded-xl border border-slate-800">
          <button
            type="button"
            disabled={testState === 'running'}
            onClick={() => setMode('time')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all cursor-pointer ${
              mode === 'time'
                ? 'bg-sky-500/20 text-sky-400 border border-sky-500/30 font-semibold shadow-sm'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Clock className="w-3.5 h-3.5" />
            <span>Time</span>
          </button>

          <button
            type="button"
            disabled={testState === 'running'}
            onClick={() => setMode('words')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all cursor-pointer ${
              mode === 'words'
                ? 'bg-sky-500/20 text-sky-400 border border-sky-500/30 font-semibold shadow-sm'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Type className="w-3.5 h-3.5" />
            <span>Words</span>
          </button>

          <button
            type="button"
            disabled={testState === 'running'}
            onClick={() => setMode('quote')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all cursor-pointer ${
              mode === 'quote'
                ? 'bg-sky-500/20 text-sky-400 border border-sky-500/30 font-semibold shadow-sm'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Quote className="w-3.5 h-3.5" />
            <span>Quotes</span>
          </button>
        </div>

        {/* Dynamic Modifiers */}
        <div className="flex flex-wrap items-center gap-2">
          {mode === 'time' && (
            <DurationSelector
              currentDuration={duration}
              onChange={setDuration}
              disabled={testState === 'running'}
            />
          )}

          {mode === 'words' && (
            <WordCountSelector
              currentWordCount={wordCount}
              onChange={setWordCount}
              disabled={testState === 'running'}
            />
          )}

          {mode !== 'words' && (
            <LanguageSelector
              currentLanguage={language}
              onChange={setLanguage}
              disabled={testState === 'running'}
            />
          )}

          <DifficultySelector
            currentDifficulty={difficulty}
            onChange={setDifficulty}
            disabled={testState === 'running'}
          />

          {/* Sound Mute Toggle */}
          <button
            type="button"
            onClick={toggleSound}
            className={`p-2 rounded-xl border transition-all cursor-pointer ${
              soundEnabled
                ? 'bg-sky-500/15 border-sky-500/30 text-sky-400'
                : 'bg-slate-900/60 border-slate-800 text-slate-500 hover:text-slate-300'
            }`}
            title={soundEnabled ? 'Mute keyboard audio' : 'Unmute keyboard audio'}
          >
            {soundEnabled ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
          </button>
        </div>
      </div>

      {/* Live HUD Bar */}
      <div className="flex items-center justify-between gap-4">
        <Timer
          timeLeft={timeLeft}
          totalDuration={duration}
          mode={mode}
          elapsedTime={elapsedTime}
        />

        <StatsBar
          wpm={currentWpm}
          rawWpm={currentRawWpm}
          accuracy={currentAccuracy}
          correctChars={correctChars}
          incorrectChars={incorrectChars}
        />
      </div>

      {/* Typing Playground */}
      <TypingArea
        targetText={targetText}
        input={input}
        onInput={handleInput}
        testState={testState}
        inputRef={inputRef}
        caretStyle={caretStyle}
      />

      {/* Bottom Action & Info Bar */}
      <div className="flex items-center justify-between gap-4 pt-2">
        <div className="flex items-center gap-2 text-xs text-slate-400">
          <Sparkles className="w-3.5 h-3.5 text-sky-400" />
          <span className="font-medium text-slate-300">{passageTitle}</span>
        </div>

        <Button
          variant="secondary"
          size="sm"
          onClick={resetTest}
          leftIcon={<RotateCcw className="w-4 h-4" />}
          className="hover:border-sky-500/40 text-slate-300 hover:text-sky-300"
        >
          Restart
        </Button>
      </div>
    </div>
  );
}

export default TypingTest;
