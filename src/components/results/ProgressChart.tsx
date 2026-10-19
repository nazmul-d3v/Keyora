'use client';

import React, { useState } from 'react';
import { TimelinePoint } from '@/types';

interface ProgressChartProps {
  timeline: TimelinePoint[];
  width?: number;
  height?: number;
}

export function ProgressChart({ timeline, height = 220 }: ProgressChartProps) {
  const [hoverIndex, setHoverIndex] = useState<number | null>(null);

  if (!timeline || timeline.length === 0) {
    return (
      <div className="w-full h-44 flex items-center justify-center rounded-2xl bg-slate-900/40 border border-slate-800 text-slate-500 text-sm">
        No progression data captured for this test.
      </div>
    );
  }

  const maxWpm = Math.max(60, ...timeline.map((p) => Math.max(p.wpm, p.rawWpm))) + 15;
  const paddingX = 40;
  const paddingY = 25;
  const chartWidth = 700;
  const chartHeight = height;

  const innerWidth = chartWidth - paddingX * 2;
  const innerHeight = chartHeight - paddingY * 2;

  // Scale functions
  const getX = (index: number) => {
    if (timeline.length === 1) return paddingX + innerWidth / 2;
    return paddingX + (index / (timeline.length - 1)) * innerWidth;
  };

  const getY = (val: number) => {
    return chartHeight - paddingY - (val / maxWpm) * innerHeight;
  };

  // Build SVG path for WPM
  const wpmPoints = timeline.map((p, i) => `${getX(i)},${getY(p.wpm)}`).join(' ');
  const rawPoints = timeline.map((p, i) => `${getX(i)},${getY(p.rawWpm)}`).join(' ');

  // Gradient area path
  const areaPath = `M ${getX(0)},${getY(0)} ` +
    timeline.map((p, i) => `L ${getX(i)},${getY(p.wpm)}`).join(' ') +
    ` L ${getX(timeline.length - 1)},${getY(0)} Z`;

  // Grid lines
  const gridSteps = [0, Math.round(maxWpm * 0.33), Math.round(maxWpm * 0.66), Math.round(maxWpm)];

  return (
    <div className="w-full relative bg-slate-950/40 border border-slate-800/80 rounded-3xl p-4 sm:p-6 backdrop-blur-md">
      <div className="flex items-center justify-between mb-2">
        <h4 className="text-xs font-semibold uppercase tracking-wider text-slate-400">
          WPM & Consistency Progression
        </h4>
        <div className="flex items-center gap-4 text-xs">
          <div className="flex items-center gap-1.5">
            <span className="w-3 h-0.5 bg-sky-400 rounded-full" />
            <span className="text-slate-300">Net WPM</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-3 h-0.5 bg-purple-400/80 border-dashed rounded-full" />
            <span className="text-slate-400">Raw WPM</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-rose-500" />
            <span className="text-slate-400">Errors</span>
          </div>
        </div>
      </div>

      <div className="w-full overflow-x-auto">
        <svg
          viewBox={`0 0 ${chartWidth} ${chartHeight}`}
          className="w-full h-auto min-w-[500px] overflow-visible"
        >
          <defs>
            <linearGradient id="wpmAreaGrad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#38bdf8" stopOpacity="0.25" />
              <stop offset="100%" stopColor="#38bdf8" stopOpacity="0.0" />
            </linearGradient>
          </defs>

          {/* Grid lines */}
          {gridSteps.map((val) => (
            <g key={val}>
              <line
                x1={paddingX}
                y1={getY(val)}
                x2={chartWidth - paddingX}
                y2={getY(val)}
                stroke="#1e293b"
                strokeWidth="1"
                strokeDasharray="4 4"
              />
              <text
                x={paddingX - 8}
                y={getY(val) + 4}
                fill="#64748b"
                fontSize="10"
                fontFamily="monospace"
                textAnchor="end"
              >
                {val}
              </text>
            </g>
          ))}

          {/* Area fill under net WPM */}
          <path d={areaPath} fill="url(#wpmAreaGrad)" />

          {/* Raw WPM Line */}
          <polyline
            points={rawPoints}
            fill="none"
            stroke="#a855f7"
            strokeWidth="2"
            strokeDasharray="3 3"
            opacity="0.6"
          />

          {/* Net WPM Line */}
          <polyline
            points={wpmPoints}
            fill="none"
            stroke="#38bdf8"
            strokeWidth="3"
            strokeLinecap="round"
            strokeLinejoin="round"
          />

          {/* Error dots & interactive points */}
          {timeline.map((point, i) => {
            const cx = getX(i);
            const cy = getY(point.wpm);
            const hasError = point.errors > 0;

            return (
              <g
                key={i}
                onMouseEnter={() => setHoverIndex(i)}
                onMouseLeave={() => setHoverIndex(null)}
                className="cursor-pointer"
              >
                {hasError && (
                  <circle
                    cx={cx}
                    cy={getY(0) - 8}
                    r="3.5"
                    fill="#f43f5e"
                    className="animate-pulse"
                  />
                )}
                <circle
                  cx={cx}
                  cy={cy}
                  r={hoverIndex === i ? 5 : 3}
                  fill="#38bdf8"
                  stroke="#0f172a"
                  strokeWidth="2"
                  className="transition-all"
                />
              </g>
            );
          })}

          {/* Active tooltip on hover */}
          {hoverIndex !== null && timeline[hoverIndex] && (
            <g transform={`translate(${getX(hoverIndex)}, ${getY(timeline[hoverIndex].wpm) - 30})`}>
              <rect
                x="-40"
                y="-15"
                width="80"
                height="30"
                rx="8"
                fill="#0f172a"
                stroke="#38bdf8"
                strokeWidth="1"
                opacity="0.95"
              />
              <text
                x="0"
                y="5"
                fill="#f8fafc"
                fontSize="11"
                fontFamily="monospace"
                fontWeight="bold"
                textAnchor="middle"
              >
                {timeline[hoverIndex].wpm} WPM ({timeline[hoverIndex].second}s)
              </text>
            </g>
          )}
        </svg>
      </div>
    </div>
  );
}

export default ProgressChart;
