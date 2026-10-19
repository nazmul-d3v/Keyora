'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { History, ArrowRight } from 'lucide-react';
import { TestResult } from '@/types';

export default function HistoryPage() {
  const [history, setHistory] = useState<TestResult[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/tests?limit=50')
      .then((res) => res.json())
      .then((data) => {
        if (Array.isArray(data) && data.length > 0) {
          setHistory(data);
        } else {
          // Provide sample history if user has no saved runs yet
          setHistory([
            {
              id: 'sample-1',
              wpm: 104.5,
              rawWpm: 109.2,
              accuracy: 98.2,
              consistency: 94.0,
              duration: 60,
              mode: 'time',
              language: 'english',
              difficulty: 'medium',
              wordsCount: 52,
              errorsCount: 2,
              charCount: 260,
              createdAt: new Date(Date.now() - 3600000 * 2).toISOString(),
            },
            {
              id: 'sample-2',
              wpm: 96.0,
              rawWpm: 101.4,
              accuracy: 96.5,
              consistency: 91.8,
              duration: 30,
              mode: 'time',
              language: 'code',
              difficulty: 'hard',
              wordsCount: 28,
              errorsCount: 3,
              charCount: 145,
              createdAt: new Date(Date.now() - 3600000 * 5).toISOString(),
            },
            {
              id: 'sample-3',
              wpm: 112.8,
              rawWpm: 115.0,
              accuracy: 99.1,
              consistency: 96.2,
              duration: 15,
              mode: 'time',
              language: 'english',
              difficulty: 'easy',
              wordsCount: 24,
              errorsCount: 1,
              charCount: 120,
              createdAt: new Date(Date.now() - 86400000).toISOString(),
            },
          ]);
        }
        setLoading(false);
      })
      .catch(() => {
        setLoading(false);
      });
  }, []);

  return (
    <div className="flex-1 max-w-5xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-10">
      <div className="mb-8">
        <div className="flex items-center gap-2.5 mb-2">
          <div className="p-2 rounded-xl bg-purple-500/15 border border-purple-500/30 text-purple-400">
            <History className="w-5 h-5" />
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
            Typing Session History
          </h1>
        </div>
        <p className="text-sm text-slate-400">
          Review previous tests, accuracy distribution, and speed curves.
        </p>
      </div>

      <div className="overflow-hidden rounded-3xl bg-slate-900/40 border border-slate-800 shadow-xl backdrop-blur-xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left font-mono text-xs">
            <thead>
              <tr className="border-b border-slate-800/80 bg-slate-950/60 uppercase text-slate-400 text-[10px]">
                <th className="py-4 px-6">Mode</th>
                <th className="py-4 px-6 text-right">WPM</th>
                <th className="py-4 px-6 text-right">Raw</th>
                <th className="py-4 px-6 text-right">Accuracy</th>
                <th className="py-4 px-6 text-right">Consistency</th>
                <th className="py-4 px-6 text-right">Errors</th>
                <th className="py-4 px-6 text-right">Date</th>
                <th className="py-4 px-6 text-center">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/50">
              {loading ? (
                <tr>
                  <td colSpan={8} className="py-12 text-center text-slate-500">
                    Retrieving history records...
                  </td>
                </tr>
              ) : history.length === 0 ? (
                <tr>
                  <td colSpan={8} className="py-12 text-center text-slate-500">
                    No completed tests in history yet.
                  </td>
                </tr>
              ) : (
                history.map((item) => (
                  <tr key={item.id} className="hover:bg-slate-800/40 transition-colors">
                    <td className="py-4 px-6 text-white capitalize font-sans font-medium">
                      {item.mode} ({item.duration}s)
                    </td>
                    <td className="py-4 px-6 text-right font-bold text-sky-400 text-sm">
                      {Math.round(item.wpm)}
                    </td>
                    <td className="py-4 px-6 text-right text-slate-300">
                      {Math.round(item.rawWpm)}
                    </td>
                    <td className="py-4 px-6 text-right text-emerald-400 font-semibold">
                      {Math.round(item.accuracy)}%
                    </td>
                    <td className="py-4 px-6 text-right text-slate-300">
                      {Math.round(item.consistency)}%
                    </td>
                    <td className="py-4 px-6 text-right text-rose-400">
                      {item.errorsCount}
                    </td>
                    <td className="py-4 px-6 text-right text-slate-500">
                      {new Date(item.createdAt).toLocaleDateString([], {
                        month: 'short',
                        day: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit',
                      })}
                    </td>
                    <td className="py-4 px-6 text-center">
                      <Link
                        href={`/results/${item.id}`}
                        className="inline-flex items-center gap-1 text-sky-400 hover:text-sky-300 hover:underline font-sans"
                      >
                        <span>Details</span>
                        <ArrowRight className="w-3 h-3" />
                      </Link>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
