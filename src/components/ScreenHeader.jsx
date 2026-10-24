import React from 'react';
import { ArrowLeft } from 'lucide-react';
import { useApp } from '../context/AppContext';
import FoodBridgeLogo from './FoodBridgeLogo';

/**
 * Header for sub screens: back arrow + centred title (or the FoodBridge logo).
 */
export default function ScreenHeader({ title, logo = false, right = null }) {
  const { goBack } = useApp();

  return (
    <header className="h-14 px-3 flex items-center gap-2 shrink-0 sticky top-0 z-20 bg-canvas/95 backdrop-blur border-b border-line/70">
      <button
        onClick={goBack}
        aria-label="Go back"
        className="w-9 h-9 rounded-full flex items-center justify-center text-ink hover:bg-white transition"
      >
        <ArrowLeft className="w-5 h-5" strokeWidth={2.2} />
      </button>
      <div className="flex-1 min-w-0 flex items-center">
        {logo ? <FoodBridgeLogo size="sm" /> : (
          <h1 className="text-[17px] font-extrabold text-ink truncate">{title}</h1>
        )}
      </div>
      {right}
    </header>
  );
}
