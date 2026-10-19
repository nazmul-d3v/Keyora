'use client';

import React, { useState, useEffect } from 'react';
import { Trophy, Medal, Crown, Flame, Filter, Sparkles } from 'lucide-react';
import { LeaderboardEntry } from '@/types';

export default function LeaderboardPage() {
  const [duration, setDuration] = useState<number>(60);
  const [mode, setMode] = useState<string>('time');
  const [language, setLanguage] = useState<string>('all');
  const [entries, setEntries] = useState<LeaderboardEntry[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    const query = new URLSearchParams({
      duration: duration.toString(),
      mode,
      language,
    });

    fetch(`/api/leaderboard?${query.toString()}`)
      .then((res) => res.json())
      .then((data) => {
        setEntries(data);
        setLoading(false);
      })
      .catch(() => {
        setLoading(false);
      });
  }, [duration, mode, language]);

  return (
    <div className="flex-1 max-w-6xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-10">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
        <div>
          <div className="flex items-center gap-2.5 mb-2">
            <div className="p-2 rounded-xl bg-amber-500/15 border border-amber-500/30 text-amber-400">
              <Trophy className="w-5 h-5" />
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
              Global Hall of Fame
            </h1>
          </div>
          <p className="text-sm text-slate-400">
            Top competitive typists ranked by verified WPM and accuracy standards.
          </p>
        </div>

        {/* Global Summary Badge */}
        <div className="flex items-center gap-2 px-3.5 py-1.5 rounded-xl bg-slate-900 border border-slate-800 text-xs font-mono text-slate-300 self-start sm:self-auto">
          <Sparkles className="w-3.5 h-3.5 text-amber-400" />
          <span>Division: Top 100 World</span>
        </div>
      </div>

      {/* Filter Toolbar */}
      <div className="flex flex-wrap items-center justify-between gap-3 p-3 rounded-2xl bg-slate-900/60 border border-slate-800 backdrop-blur-md mb-8">
        <div className="flex items-center gap-2">
          <Filter className="w-4 h-4 text-slate-400" />
          <span className="text-xs font-semibold uppercase tracking-wider text-slate-400">
            Filters:
          </span>
        </div>

        {/* Duration filters */}
        <div className="flex items-center gap-1 bg-slate-950/60 p-1 rounded-xl border border-slate-800">
          {[15, 30, 60, 120].map((d) => (
            <button
              key={d}
              onClick={() => setDuration(d)}
              className={`px-3 py-1 rounded-lg text-xs font-mono font-medium transition-all cursor-pointer ${
                duration === d
                  ? 'bg-sky-500/20 text-sky-400 border border-sky-500/30 font-semibold'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              {d}s
            </button>
          ))}
        </div>

        {/* Category filters */}
        <div className="flex items-center gap-1 bg-slate-950/60 p-1 rounded-xl border border-slate-800">
          {[
            { id: 'all', label: 'All' },
            { id: 'english', label: 'English' },
            { id: 'code', label: 'Code' },
            { id: 'quotes', label: 'Quotes' },
          ].map((lang) => (
            <button
              key={lang.id}
              onClick={() => setLanguage(lang.id)}
              className={`px-3 py-1 rounded-lg text-xs font-medium transition-all cursor-pointer ${
                language === lang.id
                  ? 'bg-indigo-500/20 text-indigo-400 border border-indigo-500/30 font-semibold'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              {lang.label}
            </button>
          ))}
        </div>
      </div>

      {/* Leaderboard Table */}
      <div className="overflow-hidden rounded-3xl bg-slate-900/40 border border-slate-800/80 shadow-2xl backdrop-blur-xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-slate-800/80 bg-slate-950/50 text-[11px] font-mono uppercase tracking-wider text-slate-400">
                <th className="py-4 px-6 w-16 text-center">Rank</th>
                <th className="py-4 px-6">Typist</th>
                <th className="py-4 px-6 text-right">WPM</th>
                <th className="py-4 px-6 text-right">Accuracy</th>
                <th className="py-4 px-6 text-center">Duration</th>
                <th className="py-4 px-6 text-right hidden sm:table-cell">Date</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/50 text-sm">
              {loading ? (
                <tr>
                  <td colSpan={6} className="py-12 text-center text-slate-500 font-mono">
                    Loading standings...
                  </td>
                </tr>
              ) : entries.length === 0 ? (
                <tr>
                  <td colSpan={6} className="py-12 text-center text-slate-500">
                    No verified scores for this filter category yet. Be the first to establish a record!
                  </td>
                </tr>
              ) : (
                entries.map((entry, idx) => {
                  const rank = idx + 1;
                  const isGold = rank === 1;
                  const isSilver = rank === 2;
                  const isBronze = rank === 3;

                  return (
                    <tr
                      key={entry.id}
                      className="hover:bg-slate-800/30 transition-colors group"
                    >
                      {/* Rank Icon */}
                      <td className="py-4 px-6 text-center font-mono">
                        {isGold && (
                          <div className="inline-flex items-center justify-center w-7 h-7 rounded-xl bg-amber-500/20 text-amber-400 border border-amber-500/30 shadow-md shadow-amber-500/20">
                            <Crown className="w-4 h-4" />
                          </div>
                        )}
                        {isSilver && (
                          <div className="inline-flex items-center justify-center w-7 h-7 rounded-xl bg-slate-300/20 text-slate-200 border border-slate-300/30 shadow-md">
                            <Medal className="w-4 h-4" />
                          </div>
                        )}
                        {isBronze && (
                          <div className="inline-flex items-center justify-center w-7 h-7 rounded-xl bg-amber-700/20 text-amber-600 border border-amber-700/30 shadow-md">
                            <Medal className="w-4 h-4" />
                          </div>
                        )}
                        {!isGold && !isSilver && !isBronze && (
                          <span className="text-slate-500 font-bold">#{rank}</span>
                        )}
                      </td>

                      {/* User Info */}
                      <td className="py-4 px-6">
                        <div className="flex items-center gap-3">
                          <div className="w-9 h-9 rounded-xl bg-slate-800 border border-slate-700 flex items-center justify-center font-bold text-sky-400 text-xs shadow-inner">
                            {entry.userName.slice(0, 2).toUpperCase()}
                          </div>
                          <div className="flex flex-col">
                            <span className="font-semibold text-white group-hover:text-sky-300 transition-colors">
                              {entry.userName}
                            </span>
                            <span className="text-[11px] text-slate-500 capitalize">
                              {entry.language}
                            </span>
                          </div>
                        </div>
                      </td>

                      {/* WPM */}
                      <td className="py-4 px-6 text-right font-mono font-bold text-base text-sky-400">
                        {entry.wpm.toFixed(1)}
                      </td>

                      {/* Accuracy */}
                      <td className="py-4 px-6 text-right font-mono text-slate-300">
                        {entry.accuracy.toFixed(1)}%
                      </td>

                      {/* Duration */}
                      <td className="py-4 px-6 text-center font-mono text-xs text-slate-400">
                        {entry.duration}s
                      </td>

                      {/* Date */}
                      <td className="py-4 px-6 text-right text-xs text-slate-500 font-mono hidden sm:table-cell">
                        {new Date(entry.createdAt).toLocaleDateString([], { month: 'short', day: 'numeric' })}
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
