import React from 'react';
import { CalendarDays, ShieldCheck, Leaf } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { assessFreshness } from '../engines/freshnessEngine';
import ScreenHeader from '../components/ScreenHeader';
import ScoreRing from '../components/ScoreRing';

export default function AssessmentView({ params }) {
  const { confirmAssessment } = useApp();
  const draft = params?.draft || {};

  const result = assessFreshness({
    prepTimeHours: draft.prepTimeHours,
    storage: draft.storage,
    hasPhotos: (draft.photos || []).length > 0,
  });

  const qualityColor =
    result.score >= 80 ? 'text-brand-700' : result.score >= 65 ? 'text-amber-600' : 'text-red-500';

  return (
    <div className="flex-1 flex flex-col overflow-hidden">
      <ScreenHeader title="Food Quality Assessment" />
      <div className="flex-1 overflow-y-auto px-5 pt-6 pb-8 flex flex-col">
        <div className="flex flex-col items-center">
          <ScoreRing score={result.score} />
          <div className="flex items-center gap-1.5 mt-3">
            <span className={`text-[17px] font-extrabold ${qualityColor}`}>{result.label}</span>
            <Leaf className="w-4 h-4 text-brand-600" />
          </div>
        </div>

        <div className="fb-card mt-6 flex items-center gap-3">
          <span className="w-10 h-10 rounded-xl bg-brand-50 flex items-center justify-center shrink-0">
            <CalendarDays className="w-5 h-5 text-brand-700" />
          </span>
          <div>
            <p className="text-[12px] font-bold text-muted">Estimated Safe-Use Window</p>
            <p className="text-[17px] font-extrabold text-ink leading-tight">{result.safeWindow}</p>
            <p className="text-[11.5px] text-muted font-semibold">({result.safeWindowNote})</p>
          </div>
        </div>

        <div className="fb-card mt-4">
          <p className="text-[13px] font-extrabold text-ink mb-2">Checklist</p>
          <ul className="space-y-2">
            {result.checklist.map(item => (
              <li key={item.label} className="flex items-center gap-2.5">
                <span className={`w-4.5 h-4.5 flex items-center justify-center ${item.ok ? 'text-brand-600' : 'text-red-500'}`}>
                  {item.ok ? '✔' : '✖'}
                </span>
                <span className={`text-[13.5px] font-semibold ${item.ok ? 'text-ink' : 'text-red-500 line-through'}`}>
                  {item.label}
                </span>
              </li>
            ))}
          </ul>
        </div>

        <div className="mt-4 rounded-2xl bg-blue-50 border border-blue-100 p-3.5 flex gap-2.5">
          <ShieldCheck className="w-4.5 h-4.5 text-blue-600 shrink-0 mt-0.5" />
          <p className="text-[11.5px] text-blue-900/80 font-medium leading-relaxed">{result.disclaimer}</p>
        </div>

        <div className="mt-auto pt-6">
          <button className="fb-btn-primary" onClick={() => confirmAssessment({ ...draft, ...result })}>
            Confirm Assessment
          </button>
        </div>
      </div>
    </div>
  );
}
