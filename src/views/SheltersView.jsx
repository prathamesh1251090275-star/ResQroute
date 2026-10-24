import React, { useState } from 'react';
import { Building2, Users, ChevronRight, Map, List } from 'lucide-react';
import { useApp } from '../context/AppContext';
import ScreenHeader from '../components/ScreenHeader';
import ShelterMap from '../components/ShelterMap';

const STOCK_BADGE = {
  needs: { label: 'Needs food', cls: 'bg-red-50 text-red-600 border border-red-200' },
  low: { label: 'Low stock', cls: 'bg-amber-50 text-amber-600 border border-amber-200' },
  stocked: { label: 'Stocked', cls: 'bg-brand-50 text-brand-700 border border-brand-100' },
};

/**
 * Screen 6 — Nearby Shelters. In selection mode (from the assessment flow)
 * tapping a shelter books it for the donation; otherwise it just focuses the map.
 */
export default function SheltersView({ params }) {
  const { shelters, selectShelterFor } = useApp();
  const selectFor = params?.selectFor || null;

  const [tab, setTab] = useState('map');
  const [focusId, setFocusId] = useState(shelters[0]?.id);

  const focus = shelters.find(s => s.id === focusId);

  return (
    <div className="flex-1 flex flex-col overflow-hidden">
      <ScreenHeader title="Nearby Shelters" />
      <div className="flex-1 overflow-y-auto px-5 pt-4 pb-8">
        <div className="flex bg-white border border-line rounded-xl p-1 gap-1">
          {[
            { id: 'map', label: 'Map View', icon: Map },
            { id: 'list', label: 'List View', icon: List },
          ].map(t => {
            const Icon = t.icon;
            return (
              <button
                key={t.id}
                onClick={() => setTab(t.id)}
                className={`flex-1 flex items-center justify-center gap-1.5 py-2 rounded-lg text-[13px] font-bold transition ${
                  tab === t.id ? 'bg-brand-600 text-white shadow' : 'text-muted hover:bg-brand-50'
                }`}
              >
                <Icon className="w-4 h-4" />
                {t.label}
              </button>
            );
          })}
        </div>

        {selectFor ? (
          <p className="text-[12px] font-bold text-brand-700 bg-brand-50 border border-brand-100 rounded-xl px-3 py-2 mt-3">
            Choose a shelter to receive this donation.
          </p>
        ) : null}

        {tab === 'map' && (
          <div className="mt-4">
            <ShelterMap shelters={shelters} focus={focus?.location} height={250} zoom={13} />
            <div className="flex gap-2 overflow-x-auto scrollbar-hide mt-3 pb-1">
              {shelters.map(s => (
                <button
                  key={s.id}
                  onClick={() => setFocusId(s.id)}
                  className={`shrink-0 px-3 py-1.5 rounded-full text-[11.5px] font-bold border transition ${
                    focusId === s.id ? 'bg-brand-600 text-white border-brand-600' : 'bg-white text-muted border-line'
                  }`}
                >
                  {s.name} • {s.distanceKm} km
                </button>
              ))}
            </div>
          </div>
        )}

        <div className="space-y-3 mt-4">
          {shelters.map(s => {
            const badge = STOCK_BADGE[s.stockStatus] || STOCK_BADGE.needs;
            return (
              <button
                key={s.id}
                onClick={() => {
                  if (selectFor) {
                    selectShelterFor(selectFor, s.id);
                  } else {
                    setFocusId(s.id);
                    setTab('map');
                  }
                }}
                className="fb-card w-full flex items-center gap-3 text-left !p-3.5 hover:border-brand-300 transition"
              >
                <span className="w-10 h-10 rounded-xl bg-brand-50 border border-brand-100 flex items-center justify-center shrink-0">
                  <Building2 className="w-5 h-5 text-brand-700" />
                </span>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <p className="text-[14px] font-extrabold text-ink truncate">{s.name}</p>
                    <span className={`fb-badge ${badge.cls}`}>{badge.label}</span>
                  </div>
                  <p className="text-[11.5px] text-muted font-semibold mt-0.5">
                    {s.distanceKm} km • {s.etaMinutes} min
                  </p>
                  <p className="text-[11px] text-muted mt-0.5 flex items-center gap-1">
                    <Users className="w-3 h-3" />
                    Capacity: {s.capacityPct}% • Accepts: {s.accepts}
                  </p>
                </div>
                <ChevronRight className="w-4.5 h-4.5 text-slate-400 shrink-0" />
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
