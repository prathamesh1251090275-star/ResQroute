import React from 'react';

/**
 * Circular provisional freshness score (screen 5 / screen 10).
 */
export default function ScoreRing({ score = 0, size = 108, label = 'Provisional Freshness Score' }) {
  const stroke = 10;
  const radius = (size - stroke) / 2;
  const circumference = 2 * Math.PI * radius;
  const progress = Math.max(0, Math.min(100, score)) / 100;
  const offset = circumference * (1 - progress);

  return (
    <div className="relative shrink-0" style={{ width: size, height: size }}>
      <svg width={size} height={size} className="-rotate-90">
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          strokeWidth={stroke}
          stroke="#E7EEE3"
        />
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke="#1A804D"
          strokeWidth={stroke}
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          style={{ transition: 'stroke-dashoffset 700ms cubic-bezier(0.22, 1, 0.36, 1)' }}
        />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <div className="flex items-baseline">
          <span className="text-[26px] font-extrabold text-ink leading-none">{score}</span>
          <span className="text-[12px] font-bold text-muted">/100</span>
        </div>
        <span className="text-[8px] font-bold uppercase tracking-wide text-muted mt-0.5 text-center px-2">
          {label}
        </span>
      </div>
    </div>
  );
}
