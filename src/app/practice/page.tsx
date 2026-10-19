'use client';

import React, { useState } from 'react';
import { Target, Sparkles, BookOpen, Key, RefreshCw } from 'lucide-react';
import TypingArea from '@/components/typing/TypingArea';
import Button from '@/components/ui/Button';

const DRILL_PRESETS = [
  {
    id: 'symbols',
    title: 'Code Symbols & Brackets',
    description: 'Master curly braces, brackets, and logical operators for coding',
    content: '{ [ ( "key" : true ) ] } => { array[i] && (x !== y) || !status; } /* -> $.map() */',
  },
  {
    id: 'numbers',
    title: 'Top Row Numbers',
    description: 'Drill finger reach for numeric digits without looking down',
    content: '102 384 591 204 892 730 482 190 574 382 910 238 495 810 293 481 059 284 193 480',
  },
  {
    id: 'trigraphs',
    title: 'High-Frequency Trigraphs',
    description: 'Train muscle memory on the most common letter triplets in English',
    content: 'the and tha ent ion tio for nde has nce edt tis oft sth men ther form inte ting late',
  },
  {
    id: 'home-row',
    title: 'Home Row Mastery',
    description: 'Anchor muscle memory on ASDF JKL; keys',
    content: 'asdf jkl; a fad glad salad fall dash ask flask flash alfalfa half fall gas jak fads',
  },
];

export default function PracticePage() {
  const [selectedDrill, setSelectedDrill] = useState(DRILL_PRESETS[0]);
  const [customText, setCustomText] = useState('');
  const [activeText, setActiveText] = useState(DRILL_PRESETS[0].content);
  const [input, setInput] = useState('');

  const handleSelectDrill = (drill: typeof DRILL_PRESETS[0]) => {
    setSelectedDrill(drill);
    setActiveText(drill.content);
    setInput('');
  };

  const handleApplyCustom = () => {
    if (customText.trim()) {
      setActiveText(customText.trim());
      setInput('');
    }
  };

  const handleReset = () => {
    setInput('');
  };

  return (
    <div className="flex-1 max-w-5xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-10">
      <div className="mb-8">
        <div className="flex items-center gap-2.5 mb-2">
          <div className="p-2 rounded-xl bg-sky-500/15 border border-sky-500/30 text-sky-400">
            <Target className="w-5 h-5" />
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
            Targeted Practice Laboratory
          </h1>
        </div>
        <p className="text-sm text-slate-400">
          Isolate specific finger movements, code symbols, or paste your own custom passages without timer pressure.
        </p>
      </div>

      {/* Preset Drills Selection */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {DRILL_PRESETS.map((drill) => {
          const isSelected = selectedDrill.id === drill.id;
          return (
            <button
              key={drill.id}
              onClick={() => handleSelectDrill(drill)}
              className={`p-4 rounded-2xl border text-left transition-all cursor-pointer ${
                isSelected
                  ? 'bg-sky-500/15 border-sky-500/50 shadow-lg shadow-sky-500/10'
                  : 'bg-slate-900/40 border-slate-800/80 hover:bg-slate-800/60 hover:border-slate-700'
              }`}
            >
              <div className="flex items-center gap-2 mb-1.5">
                <Key className={`w-4 h-4 ${isSelected ? 'text-sky-400' : 'text-slate-400'}`} />
                <h3 className="font-semibold text-white text-sm">{drill.title}</h3>
              </div>
              <p className="text-xs text-slate-400 leading-relaxed">{drill.description}</p>
            </button>
          );
        })}
      </div>

      {/* Custom Text Accordion / Box */}
      <div className="p-4 rounded-2xl bg-slate-900/50 border border-slate-800 mb-8 backdrop-blur-md">
        <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-2 flex items-center gap-2">
          <BookOpen className="w-3.5 h-3.5 text-sky-400" />
          <span>Custom Text Practice</span>
        </label>
        <div className="flex flex-col sm:flex-row gap-3">
          <textarea
            rows={2}
            value={customText}
            onChange={(e) => setCustomText(e.target.value)}
            placeholder="Paste code snippet, literature, or custom phrase here to practice..."
            className="flex-1 px-4 py-2.5 rounded-xl bg-slate-950/80 border border-slate-800 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-sky-500 focus:ring-1 focus:ring-sky-500 font-mono"
          />
          <Button
            variant="secondary"
            size="md"
            onClick={handleApplyCustom}
            className="self-start sm:self-auto"
          >
            Load Custom
          </Button>
        </div>
      </div>

      {/* Practice Playground */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 text-xs font-mono text-slate-400">
            <Sparkles className="w-4 h-4 text-sky-400" />
            <span>
              Progress: {input.length} / {activeText.length} characters
            </span>
          </div>

          <Button
            variant="ghost"
            size="sm"
            onClick={handleReset}
            leftIcon={<RefreshCw className="w-3.5 h-3.5" />}
          >
            Clear / Restart
          </Button>
        </div>

        <TypingArea
          targetText={activeText}
          input={input}
          onInput={setInput}
          testState={input.length >= activeText.length ? 'completed' : 'running'}
        />

        {input.length >= activeText.length && (
          <div className="p-4 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-sm font-semibold flex items-center justify-between animate-in fade-in">
            <span>🎉 Drill completed perfectly!</span>
            <Button variant="primary" size="sm" onClick={handleReset}>
              Repeat Drill
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}
