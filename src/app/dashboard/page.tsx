'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useSession } from 'next-auth/react';
import {
  Zap,
  Target,
  Clock,
  Award,
  Trophy,
  RotateCcw,
  Sparkles,
  CheckCircle2,
  Lock,
  Mail,
} from 'lucide-react';
import Button from '@/components/ui/Button';
import { formatDurationHuman } from '@/utils/formatTime';
import { TestResult } from '@/types';

export default function DashboardPage() {
  const { data: session } = useSession();
  const user = session?.user;
  const initials = user?.name ? user.name.slice(0, 2).toUpperCase() : 'KY';
  const [stats, setStats] = useState({
    bestWpm: 114.2,
    avgWpm: 88.5,
    avgAccuracy: 97.6,
    testsCompleted: 48,
    totalTimeTyped: 2420, // seconds
  });
  const [recentTests, setRecentTests] = useState<TestResult[]>([]);

  useEffect(() => {
    // Fetch recent tests
    fetch('/api/tests?limit=5')
      .then((res) => res.json())
      .then((data) => {
        if (Array.isArray(data) && data.length > 0) {
          setRecentTests(data);
          const best = Math.max(...data.map((d: TestResult) => d.wpm));
          const totalSecs = data.reduce((acc: number, d: TestResult) => acc + d.duration, 0);
          setStats((prev) => ({
            ...prev,
            bestWpm: Math.max(prev.bestWpm, best),
            testsCompleted: Math.max(prev.testsCompleted, data.length),
            totalTimeTyped: prev.totalTimeTyped + totalSecs,
          }));
        }
      })
      .catch(() => {
        // ignore
      });
  }, []);

  const achievements = [
    { id: '1', title: 'Century Mark', desc: 'Break past 100 WPM on a 60s test', unlocked: true, icon: Zap },
    { id: '2', title: 'Laser Precision', desc: 'Achieve 100% accuracy on 50+ words', unlocked: true, icon: Target },
    { id: '3', title: 'Code Artisan', desc: 'Complete 20 programming language tests', unlocked: true, icon: Award },
    { id: '4', title: 'Speed Demon', desc: 'Reach 140 WPM on any verified test', unlocked: false, icon: Trophy },
  ];

  return (
    <div className="flex-1 max-w-6xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-10">
      {/* Welcome Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-8 rounded-3xl bg-gradient-to-r from-slate-900 via-slate-900/80 to-slate-950 border border-slate-800 shadow-2xl backdrop-blur-xl mb-10">
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-sky-500 to-indigo-600 p-0.5 shadow-xl shadow-sky-500/20 shrink-0 overflow-hidden">
            {user?.image ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={user.image}
                alt={user.name || 'User avatar'}
                className="w-full h-full object-cover rounded-[14px]"
              />
            ) : (
              <div className="w-full h-full bg-slate-900 rounded-[14px] flex items-center justify-center font-bold text-white text-xl font-mono">
                {initials}
              </div>
            )}
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-2xl font-bold text-white tracking-tight">
                {user?.name ? `${user.name}'s Dashboard` : 'Typist Dashboard'}
              </h1>
              <span className="px-2 py-0.5 rounded-full bg-sky-500/20 text-sky-400 border border-sky-500/30 text-[10px] font-mono uppercase font-bold">
                Tier: Grandmaster
              </span>
            </div>
            {user?.email && (
              <div className="flex items-center gap-1.5 text-xs text-sky-400/90 font-mono mt-0.5">
                <Mail className="w-3.5 h-3.5 text-sky-400" />
                <span>{user.email}</span>
              </div>
            )}
            <p className="text-xs text-slate-400 mt-1">
              Active telemetry, personal milestones, and keystroke progression.
            </p>
          </div>
        </div>

        <Link href="/">
          <Button variant="primary" size="md" leftIcon={<RotateCcw className="w-4 h-4" />}>
            Start New Test
          </Button>
        </Link>
      </div>

      {/* KPI Stats Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6 mb-10">
        <div className="p-6 rounded-2xl bg-slate-900/40 border border-slate-800/80 backdrop-blur-md">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs uppercase font-mono tracking-wider text-slate-400">Personal Best</span>
            <Trophy className="w-4 h-4 text-amber-400" />
          </div>
          <div className="font-extrabold text-3xl sm:text-4xl text-sky-400 font-mono tracking-tight">
            {stats.bestWpm.toFixed(1)} <span className="text-sm font-normal text-slate-500">WPM</span>
          </div>
          <span className="text-[11px] text-slate-500 mt-1 block">All-time record</span>
        </div>

        <div className="p-6 rounded-2xl bg-slate-900/40 border border-slate-800/80 backdrop-blur-md">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs uppercase font-mono tracking-wider text-slate-400">Average Speed</span>
            <Zap className="w-4 h-4 text-indigo-400" />
          </div>
          <div className="font-extrabold text-3xl sm:text-4xl text-white font-mono tracking-tight">
            {stats.avgWpm.toFixed(1)} <span className="text-sm font-normal text-slate-500">WPM</span>
          </div>
          <span className="text-[11px] text-slate-500 mt-1 block">Across completed tests</span>
        </div>

        <div className="p-6 rounded-2xl bg-slate-900/40 border border-slate-800/80 backdrop-blur-md">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs uppercase font-mono tracking-wider text-slate-400">Accuracy</span>
            <Target className="w-4 h-4 text-emerald-400" />
          </div>
          <div className="font-extrabold text-3xl sm:text-4xl text-emerald-400 font-mono tracking-tight">
            {stats.avgAccuracy.toFixed(1)}%
          </div>
          <span className="text-[11px] text-slate-500 mt-1 block">Consistency rating</span>
        </div>

        <div className="p-6 rounded-2xl bg-slate-900/40 border border-slate-800/80 backdrop-blur-md">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs uppercase font-mono tracking-wider text-slate-400">Time Typed</span>
            <Clock className="w-4 h-4 text-purple-400" />
          </div>
          <div className="font-extrabold text-3xl sm:text-4xl text-purple-300 font-mono tracking-tight">
            {formatDurationHuman(stats.totalTimeTyped)}
          </div>
          <span className="text-[11px] text-slate-500 mt-1 block">{stats.testsCompleted} tests completed</span>
        </div>
      </div>

      {/* Achievements Badges */}
      <div className="mb-10">
        <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
          <Sparkles className="w-4 h-4 text-sky-400" />
          <span>Milestones & Badges</span>
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {achievements.map((ach) => {
            const Icon = ach.icon;
            return (
              <div
                key={ach.id}
                className={`p-4 rounded-2xl border transition-all ${
                  ach.unlocked
                    ? 'bg-slate-900/60 border-sky-500/30'
                    : 'bg-slate-950/40 border-slate-800/60 opacity-60'
                }`}
              >
                <div className="flex items-center justify-between mb-2">
                  <div
                    className={`w-8 h-8 rounded-xl flex items-center justify-center ${
                      ach.unlocked
                        ? 'bg-sky-500/20 text-sky-400'
                        : 'bg-slate-800 text-slate-600'
                    }`}
                  >
                    <Icon className="w-4 h-4" />
                  </div>
                  {ach.unlocked ? (
                    <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                  ) : (
                    <Lock className="w-4 h-4 text-slate-600" />
                  )}
                </div>
                <h4 className="font-semibold text-white text-sm">{ach.title}</h4>
                <p className="text-xs text-slate-400 mt-1">{ach.desc}</p>
              </div>
            );
          })}
        </div>
      </div>

      {/* Recent Tests Table */}
      <div className="p-6 rounded-3xl bg-slate-900/40 border border-slate-800 shadow-xl backdrop-blur-xl">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-base font-bold text-white">Recent Test Activity</h3>
          <Link href="/history" className="text-xs text-sky-400 hover:underline font-medium">
            View All History &rarr;
          </Link>
        </div>

        {recentTests.length === 0 ? (
          <div className="py-8 text-center text-slate-500 text-sm">
            No recent tests found. Take your first test on the home page!
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs font-mono">
              <thead>
                <tr className="border-b border-slate-800 text-slate-400 uppercase text-[10px]">
                  <th className="py-3 px-4">Mode</th>
                  <th className="py-3 px-4 text-right">WPM</th>
                  <th className="py-3 px-4 text-right">Accuracy</th>
                  <th className="py-3 px-4 text-right">Duration</th>
                  <th className="py-3 px-4 text-right">Date</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/50">
                {recentTests.map((test) => (
                  <tr key={test.id} className="hover:bg-slate-800/30">
                    <td className="py-3 px-4 text-white capitalize">{test.mode}</td>
                    <td className="py-3 px-4 text-right font-bold text-sky-400">
                      {Math.round(test.wpm)}
                    </td>
                    <td className="py-3 px-4 text-right text-slate-200">
                      {Math.round(test.accuracy)}%
                    </td>
                    <td className="py-3 px-4 text-right text-slate-400">{test.duration}s</td>
                    <td className="py-3 px-4 text-right text-slate-500">
                      {new Date(test.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
