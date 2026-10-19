'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import {
  TypingMode,
  DurationOption,
  WordCountOption,
  LanguageOption,
  DifficultyOption,
  TestState,
  TypingStats,
  TimelinePoint,
} from '@/types';
import { calculateNetWPM, calculateRawWPM } from '@/utils/calculateWPM';
import { calculateAccuracy, calculateConsistency } from '@/utils/calculateAccuracy';
import { soundEngine } from '@/lib/utils';
import { PASSAGES, getRandomWords } from '@/data/passages';

interface UseTypingTestOptions {
  initialMode?: TypingMode;
  initialDuration?: DurationOption;
  initialWordCount?: WordCountOption;
  initialLanguage?: LanguageOption;
  initialDifficulty?: DifficultyOption;
  soundEnabled?: boolean;
  soundType?: string;
  soundVolume?: number;
  onComplete?: (stats: TypingStats) => void;
}

export function useTypingTest({
  initialMode = 'time',
  initialDuration = 30,
  initialWordCount = 25,
  initialLanguage = 'english',
  initialDifficulty = 'medium',
  soundEnabled = true,
  soundType = 'cherry-blue',
  soundVolume = 0.5,
  onComplete,
}: UseTypingTestOptions = {}) {
  const [mode, setMode] = useState<TypingMode>(initialMode);
  const [duration, setDuration] = useState<DurationOption>(initialDuration);
  const [wordCount, setWordCount] = useState<WordCountOption>(initialWordCount);
  const [language, setLanguage] = useState<LanguageOption>(initialLanguage);
  const [difficulty, setDifficulty] = useState<DifficultyOption>(initialDifficulty);

  const [targetText, setTargetText] = useState<string>('');
  const [passageId, setPassageId] = useState<string | null>(null);
  const [passageTitle, setPassageTitle] = useState<string>('');
  
  const [input, setInput] = useState<string>('');
  const [testState, setTestState] = useState<TestState>('idle');
  const [timeLeft, setTimeLeft] = useState<number>(duration);
  const [elapsedTime, setElapsedTime] = useState<number>(0);

  // Character counters
  const [correctChars, setCorrectChars] = useState<number>(0);
  const [incorrectChars, setIncorrectChars] = useState<number>(0);
  const [extraChars, setExtraChars] = useState<number>(0);
  const [totalTyped, setTotalTyped] = useState<number>(0);

  // Timeline tracking
  const [timeline, setTimeline] = useState<TimelinePoint[]>([]);

  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const startTimeRef = useRef<number | null>(null);
  const inputRef = useRef<HTMLInputElement | null>(null);

  // Generate or load new text
  const loadNewText = useCallback(() => {
    if (mode === 'words') {
      const words = getRandomWords(wordCount);
      setTargetText(words);
      setPassageId(null);
      setPassageTitle(`${wordCount} Words`);
    } else {
      // Find matching passage
      const pool = PASSAGES.filter((p) => {
        if (mode === 'quote') return p.category === 'quotes';
        return p.language === language && p.difficulty === difficulty;
      });

      const selected = pool.length > 0
        ? pool[Math.floor(Math.random() * pool.length)]
        : PASSAGES[0];

      setTargetText(selected.content);
      setPassageId(selected.id);
      setPassageTitle(selected.title);
    }
  }, [mode, wordCount, language, difficulty]);

  // Reset test
  const resetTest = useCallback(() => {
    if (timerRef.current) clearInterval(timerRef.current);
    timerRef.current = null;
    startTimeRef.current = null;

    setTestState('idle');
    setInput('');
    setTimeLeft(duration);
    setElapsedTime(0);
    setCorrectChars(0);
    setIncorrectChars(0);
    setExtraChars(0);
    setTotalTyped(0);
    setTimeline([]);
    loadNewText();

    if (inputRef.current) {
      inputRef.current.focus();
    }
  }, [duration, loadNewText]);

  // Initial load
  useEffect(() => {
    resetTest();
  }, [resetTest]);

  // Complete test callback
  const finishTest = useCallback(
    (finalElapsed: number, finalCorrect: number, finalTotal: number, finalTimeline: TimelinePoint[]) => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
        timerRef.current = null;
      }
      setTestState('completed');

      const elapsed = Math.max(1, finalElapsed);
      const wpm = calculateNetWPM(finalCorrect, elapsed);
      const rawWpm = calculateRawWPM(finalTotal, elapsed);
      const accuracy = calculateAccuracy(finalCorrect, finalTotal);
      const consistency = calculateConsistency(finalTimeline);

      const stats: TypingStats = {
        wpm,
        rawWpm,
        accuracy,
        consistency,
        totalChars: finalTotal,
        correctChars: finalCorrect,
        incorrectChars: finalTotal - finalCorrect,
        extraChars,
        missedChars: Math.max(0, targetText.length - finalCorrect),
        elapsedTime: elapsed,
        duration: mode === 'time' ? duration : elapsed,
        wordsCount: Math.round(finalCorrect / 5),
        timeline: finalTimeline,
      };

      if (onComplete) {
        onComplete(stats);
      }
    },
    [duration, extraChars, mode, onComplete, targetText.length]
  );

  // Handle keystroke input
  const handleInput = useCallback(
    (newVal: string) => {
      if (testState === 'completed') return;

      // Start test on first key
      if (testState === 'idle') {
        setTestState('running');
        startTimeRef.current = Date.now();
      }

      // Check for backspace or addition
      const isAddition = newVal.length > input.length;
      const charAdded = isAddition ? newVal.slice(-1) : '';

      // Play audio feedback
      if (soundEnabled && isAddition) {
        const expectedChar = targetText[newVal.length - 1];
        if (charAdded === expectedChar) {
          soundEngine.playKeySound(soundType, soundVolume);
        } else {
          soundEngine.playErrorSound(soundVolume);
        }
      }

      setInput(newVal);

      // Compute character metrics
      let correct = 0;
      let incorrect = 0;

      for (let i = 0; i < newVal.length; i++) {
        if (i < targetText.length) {
          if (newVal[i] === targetText[i]) {
            correct++;
          } else {
            incorrect++;
          }
        }
      }

      const extra = Math.max(0, newVal.length - targetText.length);
      const total = newVal.length;

      setCorrectChars(correct);
      setIncorrectChars(incorrect);
      setExtraChars(extra);
      setTotalTyped(total);

      // Check completion for words, quote, or full passage finished
      if (mode !== 'time' || newVal.length >= targetText.length) {
        if (newVal.length >= targetText.length) {
          const now = Date.now();
          const elapsed = startTimeRef.current
            ? Math.round((now - startTimeRef.current) / 1000)
            : 1;
          finishTest(elapsed, correct, total, timeline);
        }
      }
    },
    [finishTest, input.length, mode, soundEnabled, soundType, soundVolume, targetText, testState, timeline]
  );

  // Second-by-second ticker
  useEffect(() => {
    if (testState !== 'running') return;

    timerRef.current = setInterval(() => {
      setElapsedTime((prevElapsed) => {
        const newElapsed = prevElapsed + 1;

        // Current real-time WPM
        const currentWpm = calculateNetWPM(correctChars, newElapsed);
        const currentRaw = calculateRawWPM(totalTyped, newElapsed);

        setTimeline((prev) => [
          ...prev,
          {
            second: newElapsed,
            wpm: currentWpm,
            rawWpm: currentRaw,
            errors: incorrectChars,
          },
        ]);

        if (mode === 'time') {
          setTimeLeft((prevTime) => {
            if (prevTime <= 1) {
              // Timer expired!
              finishTest(duration, correctChars, totalTyped, timeline);
              return 0;
            }
            return prevTime - 1;
          });
        }

        return newElapsed;
      });
    }, 1000);

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [correctChars, duration, finishTest, incorrectChars, mode, testState, timeline, totalTyped]);

  // Current live statistics
  const currentWpm = calculateNetWPM(correctChars, Math.max(1, elapsedTime));
  const currentRawWpm = calculateRawWPM(totalTyped, Math.max(1, elapsedTime));
  const currentAccuracy = calculateAccuracy(correctChars, totalTyped);

  return {
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
    passageId,
    passageTitle,
    input,
    handleInput,
    testState,
    timeLeft,
    elapsedTime,
    correctChars,
    incorrectChars,
    extraChars,
    totalTyped,
    currentWpm,
    currentRawWpm,
    currentAccuracy,
    timeline,
    resetTest,
    inputRef,
  };
}
