import React from 'react';
import { Briefcase, MapPin, Navigation, Fuel } from 'lucide-react';
import { useApp } from '../context/AppContext';

/**
 * Rider "Jobs" tab — every open pickup job, slightly richer than the dashboard list.
 */
export default function RiderJobsView() {
  const { riders, user, donations, deliveries, shelters, acceptJob } = useApp();
  const rider = riders.find(r => r.name === user?.name) || riders[0];

  const activeDeliveryIds = new Set(
    deliveries.filter(d => d.status !== 'delivered').map(d => d.donationId)
  );
  const jobs = donations.filter(d => d.status === 'listed' && !activeDeliveryIds.has(d.id));

  return (
    <div className="flex-1 flex flex-col overflow-y-auto">
      <div className="px-5 pt-4 pb-2">
        <h1 className="text-[22px] font-extrabold text-ink font-display">Jobs</h1>
        <p className="text-[12.5px] text-muted mt-0.5">{jobs.length} pickup job{jobs.length === 1 ? '' : 's'} available near you</p>
      </div>

      <div className="px-5 space-y-3 pb-6">
        {jobs.length === 0 && (
          <div className="fb-card text-center py-10">
            <Briefcase className="w-9 h-9 text-muted mx-auto" />
            <p className="text-[14px] font-extrabold text-ink mt-3">No open jobs</p>
            <p className="text-[12.5px] text-muted mt-1">Fresh pickups from donors appear here.</p>
          </div>
        )}

        {jobs.map(d => {
          const shelter = shelters.find(s => s.id === d.targetShelterId);
          const payout = Math.max(30, Math.round((shelter?.distanceKm || 2) * 15));
          return (
            <div key={d.id} className="fb-card !p-4">
              <div className="flex items-start gap-2.5">
                <span className="w-5 h-5 rounded-full bg-brand-100 flex items-center justify-center shrink-0 mt-0.5">
                  <MapPin className="w-3 h-3 text-brand-700" />
                </span>
                <div className="flex-1 min-w-0">
                  <p className="text-[13.5px] font-extrabold text-ink">Pickup: {d.donorName}</p>
                  <p className="text-[11.5px] text-muted font-medium truncate">{d.pickupAddress}</p>
                </div>
                <span className="fb-badge bg-brand-50 text-brand-700 border border-brand-100 shrink-0">
                  ₹{payout}
                </span>
              </div>
              <div className="flex items-start gap-2.5 mt-2">
                <span className="w-5 h-5 rounded-full bg-blue-100 flex items-center justify-center shrink-0 mt-0.5">
                  <Navigation className="w-3 h-3 text-blue-600" />
                </span>
                <div className="flex-1 min-w-0">
                  <p className="text-[13.5px] font-extrabold text-ink">Drop-off: {shelter?.name || 'Shelter'}</p>
                  <p className="text-[11.5px] text-muted font-medium">{shelter?.area || 'Mumbai'}</p>
                </div>
              </div>
              <div className="flex items-center justify-between mt-3 pt-3 border-t border-line">
                <p className="text-[11.5px] font-bold text-muted flex items-center gap-2">
                  <span>{shelter?.distanceKm ?? '—'} km • {shelter?.etaMinutes ?? '—'} min</span>
                  <span className="flex items-center gap-1 text-brand-700">
                    <Fuel className="w-3 h-3" /> {d.quantity} {d.unit}
                  </span>
                </p>
                <button
                  className="px-4 py-1.5 rounded-lg bg-brand-600 text-white text-[12.5px] font-extrabold shadow-sm"
                  onClick={() => acceptJob(d.id, rider.id)}
                >
                  Accept Job
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
