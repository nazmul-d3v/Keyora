'use client';

import React, { useState, useEffect } from 'react';
import {
  Settings as SettingsIcon,
  Palette,
  Volume2,
  Sliders,
  Type,
  Check,
  Play,
  Sparkles,
  Lock,
  KeyRound,
} from 'lucide-react';
import Link from 'next/link';
import { useTheme } from '@/hooks/useTheme';
import { soundEngine } from '@/lib/utils';
import Button from '@/components/ui/Button';

export default function SettingsPage() {
  const { theme, changeTheme, themes } = useTheme();

  const [soundEnabled, setSoundEnabled] = useState(true);
  const [soundType, setSoundType] = useState('cherry-blue');
  const [soundVolume, setSoundVolume] = useState(0.5);
  const [caretStyle, setCaretStyle] = useState<'smooth-line' | 'block' | 'underline' | 'pulse'>('smooth-line');
  const [layout, setLayout] = useState('qwerty');
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    const savedSound = localStorage.getItem('keyora-sound');
    if (savedSound !== null) setSoundEnabled(savedSound === 'true');

    const savedType = localStorage.getItem('keyora-sound-type');
    if (savedType) setSoundType(savedType);

    const savedVol = localStorage.getItem('keyora-sound-volume');
    if (savedVol) setSoundVolume(parseFloat(savedVol));

    const savedCaret = localStorage.getItem('keyora-caret') as 'smooth-line' | 'block' | 'underline' | 'pulse' | null;
    if (savedCaret) setCaretStyle(savedCaret);

    const savedLayout = localStorage.getItem('keyora-layout');
    if (savedLayout) setLayout(savedLayout);
  }, []);

  const handleSave = () => {
    localStorage.setItem('keyora-sound', String(soundEnabled));
    localStorage.setItem('keyora-sound-type', soundType);
    localStorage.setItem('keyora-sound-volume', String(soundVolume));
    localStorage.setItem('keyora-caret', caretStyle);
    localStorage.setItem('keyora-layout', layout);

    setSaved(true);
    setTimeout(() => setSaved(false), 2500);
  };

  const testAudio = () => {
    soundEngine.playKeySound(soundType, soundVolume);
  };

  return (
    <div className="flex-1 max-w-4xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-10">
      <div className="mb-8">
        <div className="flex items-center gap-2.5 mb-2">
          <div className="p-2 rounded-xl bg-sky-500/15 border border-sky-500/30 text-sky-400">
            <SettingsIcon className="w-5 h-5" />
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
            Preferences & Rig Settings
          </h1>
        </div>
        <p className="text-sm text-slate-400">
          Tailor acoustic feedback, visual themes, caret dynamics, and layout ergonomics.
        </p>
      </div>

      <div className="space-y-6">
        {/* Visual Themes Section */}
        <div className="p-6 rounded-3xl bg-slate-900/40 border border-slate-800 shadow-xl backdrop-blur-xl">
          <div className="flex items-center gap-2 mb-4">
            <Palette className="w-4 h-4 text-sky-400" />
            <h2 className="text-base font-bold text-white">Visual Themes</h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {themes.map((t) => (
              <button
                key={t.id}
                onClick={() => changeTheme(t.id)}
                className={`p-4 rounded-2xl border text-left transition-all cursor-pointer ${
                  theme === t.id
                    ? 'bg-sky-500/15 border-sky-500/60 shadow-lg shadow-sky-500/15 ring-1 ring-sky-500/50'
                    : 'bg-slate-950/40 border-slate-800 hover:border-slate-700 hover:bg-slate-800/40'
                }`}
              >
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <span
                      className="w-4 h-4 rounded-full border border-white/20 shadow-sm"
                      style={{ backgroundColor: t.colors.primary }}
                    />
                    <span className="font-semibold text-white text-sm">{t.name}</span>
                  </div>
                  {theme === t.id && <Check className="w-4 h-4 text-sky-400" />}
                </div>
                <p className="text-xs text-slate-400">{t.description}</p>
              </button>
            ))}
          </div>
        </div>

        {/* Acoustic Feedback Section */}
        <div className="p-6 rounded-3xl bg-slate-900/40 border border-slate-800 shadow-xl backdrop-blur-xl">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <Volume2 className="w-4 h-4 text-indigo-400" />
              <h2 className="text-base font-bold text-white">Synthesized Switch Audio</h2>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={soundEnabled}
                onChange={(e) => setSoundEnabled(e.target.checked)}
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-slate-800 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-sky-500" />
            </label>
          </div>

          <div className="space-y-4">
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-2">
                Mechanical Switch Profile
              </label>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                {[
                  { id: 'cherry-blue', label: 'Cherry MX Blue (Clicky)' },
                  { id: 'cherry-brown', label: 'Cherry MX Brown (Tactile)' },
                  { id: 'cherry-red', label: 'Cherry MX Red (Linear)' },
                  { id: 'typewriter', label: 'Vintage Typewriter' },
                ].map((sw) => (
                  <button
                    key={sw.id}
                    disabled={!soundEnabled}
                    onClick={() => {
                      setSoundType(sw.id);
                      soundEngine.playKeySound(sw.id, soundVolume);
                    }}
                    className={`p-3 rounded-xl border text-xs font-medium transition-all text-left cursor-pointer disabled:opacity-40 ${
                      soundType === sw.id
                        ? 'bg-indigo-500/20 border-indigo-500/50 text-indigo-300 font-semibold'
                        : 'bg-slate-950/60 border-slate-800 text-slate-400 hover:text-white'
                    }`}
                  >
                    {sw.label}
                  </button>
                ))}
              </div>
            </div>

            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pt-2">
              <div className="flex items-center gap-3 w-full sm:w-72">
                <span className="text-xs text-slate-400 font-medium">Volume</span>
                <input
                  type="range"
                  min="0.1"
                  max="1.0"
                  step="0.05"
                  value={soundVolume}
                  onChange={(e) => setSoundVolume(parseFloat(e.target.value))}
                  disabled={!soundEnabled}
                  className="flex-1 accent-sky-400 cursor-pointer disabled:opacity-40"
                />
                <span className="text-xs font-mono text-slate-300 w-8">
                  {Math.round(soundVolume * 100)}%
                </span>
              </div>

              <Button
                variant="secondary"
                size="sm"
                onClick={testAudio}
                disabled={!soundEnabled}
                leftIcon={<Play className="w-3.5 h-3.5" />}
              >
                Sample Switch
              </Button>
            </div>
          </div>
        </div>

        {/* Visual Dynamics Section */}
        <div className="p-6 rounded-3xl bg-slate-900/40 border border-slate-800 shadow-xl backdrop-blur-xl">
          <div className="flex items-center gap-2 mb-4">
            <Sliders className="w-4 h-4 text-purple-400" />
            <h2 className="text-base font-bold text-white">Caret & Input Dynamics</h2>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {[
              { id: 'smooth-line', label: 'Smooth Line' },
              { id: 'block', label: 'Terminal Block' },
              { id: 'underline', label: 'Underline' },
              { id: 'pulse', label: 'Neon Pulse' },
            ].map((caret) => (
              <button
                key={caret.id}
                onClick={() => setCaretStyle(caret.id as 'smooth-line' | 'block' | 'underline' | 'pulse')}
                className={`p-3.5 rounded-xl border text-xs font-medium transition-all text-center cursor-pointer ${
                  caretStyle === caret.id
                    ? 'bg-purple-500/20 border-purple-500/50 text-purple-300 font-semibold'
                    : 'bg-slate-950/60 border-slate-800 text-slate-400 hover:text-white'
                }`}
              >
                {caret.label}
              </button>
            ))}
          </div>
        </div>

        {/* Keyboard Layout Section */}
        <div className="p-6 rounded-3xl bg-slate-900/40 border border-slate-800 shadow-xl backdrop-blur-xl">
          <div className="flex items-center gap-2 mb-4">
            <Type className="w-4 h-4 text-emerald-400" />
            <h2 className="text-base font-bold text-white">Keyboard Layout</h2>
          </div>

          <div className="grid grid-cols-3 gap-3">
            {[
              { id: 'qwerty', label: 'QWERTY (Standard)' },
              { id: 'dvorak', label: 'Dvorak Simplified' },
              { id: 'colemak', label: 'Colemak Mod-DH' },
            ].map((item) => (
              <button
                key={item.id}
                onClick={() => setLayout(item.id)}
                className={`p-3.5 rounded-xl border text-xs font-medium transition-all text-center cursor-pointer ${
                  layout === item.id
                    ? 'bg-emerald-500/20 border-emerald-500/50 text-emerald-300 font-semibold'
                    : 'bg-slate-950/60 border-slate-800 text-slate-400 hover:text-white'
                }`}
              >
                {item.label}
              </button>
            ))}
          </div>
        </div>

        {/* Security & Password Section */}
        <div className="p-6 rounded-3xl bg-slate-900/40 border border-slate-800 shadow-xl backdrop-blur-xl">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Lock className="w-4 h-4 text-rose-400" />
              <div>
                <h2 className="text-base font-bold text-white">Security & Password</h2>
                <p className="text-xs text-slate-400 mt-0.5">
                  Update your credentials or generate a secure reset link
                </p>
              </div>
            </div>

            <Link href="/forgot-password">
              <Button
                variant="outline"
                size="sm"
                leftIcon={<KeyRound className="w-3.5 h-3.5" />}
              >
                Reset Password
              </Button>
            </Link>
          </div>
        </div>

        {/* Save Bar */}
        <div className="flex items-center justify-between p-4 rounded-2xl bg-slate-900 border border-slate-800">
          <span className="text-xs text-slate-400 flex items-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5 text-sky-400" />
            Settings apply automatically and sync to local device.
          </span>

          <Button
            variant="primary"
            size="md"
            onClick={handleSave}
            leftIcon={<Check className="w-4 h-4" />}
          >
            {saved ? 'Saved!' : 'Save Preferences'}
          </Button>
        </div>
      </div>
    </div>
  );
}
