import React from 'react';

/**
 * FoodBridge logo: food bowl + bike mark with the two-tone wordmark.
 * size: 'sm' | 'md' | 'lg'
 */
export default function FoodBridgeLogo({ size = 'md', showText = true, className = '' }) {
  const markSizes = {
    sm: 'w-7 h-7 text-sm',
    md: 'w-10 h-10 text-xl',
    lg: 'w-16 h-16 text-4xl',
  };
  const textSizes = {
    sm: 'text-sm',
    md: 'text-lg',
    lg: 'text-3xl',
  };

  return (
    <div className={`flex items-center gap-2 ${className}`}>
      <div
        className={`${markSizes[size]} rounded-full bg-brand-600 flex items-center justify-center relative shadow-[0_6px_14px_rgba(26,128,77,0.3)]`}
      >
        <span className="leading-none">🥘</span>
        <span className="absolute -bottom-1 -right-1 text-[11px] bg-white rounded-full px-0.5 shadow">
          🚲
        </span>
      </div>
      {showText && (
        <span className={`font-extrabold tracking-tight ${textSizes[size]} leading-none`}>
          <span className="text-brand-700">Food</span>
          <span className="text-orange-500">Bridge</span>
        </span>
      )}
    </div>
  );
}
