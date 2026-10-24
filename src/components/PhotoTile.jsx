import React from 'react';

/**
 * Photo placeholder tile: soft gradient + emoji, used for food photos,
 * shelter thumbnails and avatars (keeps the demo fully offline).
 */
export default function PhotoTile({ media, className = '', rounded = 'rounded-2xl', size = 'text-3xl' }) {
  const tile = media || { emoji: '🍽️', from: '#DCEFE2', to: '#B7DCC6' };
  return (
    <div
      className={`flex items-center justify-center overflow-hidden ${rounded} ${className}`}
      style={{ backgroundImage: `linear-gradient(135deg, ${tile.from} 0%, ${tile.to} 100%)` }}
      aria-hidden
    >
      <span className={size}>{tile.emoji}</span>
    </div>
  );
}
