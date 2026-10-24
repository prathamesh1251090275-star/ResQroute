import React, { useState } from 'react';
import { Settings, Star, Briefcase, Wallet, MapPin, Navigation, IndianRupee, PackageCheck } from 'lucide-react';
import { useApp } from '../context/AppContext';
import PhotoTile from '../components/PhotoTile';

function JobRow({ donation, shelter, onAccept }) {
  return (
    <div className="fb-card !p-3.5">
      <div className="flex items-start gap-2.5">
        <span className="w-5 h-5 rounded-full bg-brand-100 flex items-center justify-center shrink-0 mt-0.5">
          <MapPin className="w-3 h-3 text-brand-700" />
        </span>
        <div className="flex-1 min-w-0">
          <p className="text-[13px] font-extrabold text-ink">Pickup: {donation.donorName}</p>
          <p className="text-[11px] text-muted font-medium truncate">{donation.pickupAddress}</p>
        </div>
      </div>
      <div className="flex items-start gap-2.5 mt-2">
        <span className="w-5 h-5 rounded-full bg-blue-100 flex items-center justify-center shrink-0 mt-0.5">
          <Navigation className="w-3 h-3 text-blue-600" />
        </span>
        <div className="flex-1 min-w-0">
          <p className="text-[13px] font-extrabold text-ink">Drop-off: {shelter?.name || 'Shelter'}</p>
          <p className="text-[11px] text-muted font-medium">{shelter?.area || 'Mumbai'}</p>
        </div>
      </div>
      <div className="flex items-center justify-between mt-3 pt-3 border-t border-line">
        <p className="text-[11.5px] font-bold text-muted">
          {shelter?.distanceKm ?? '—'} km • {shelter?.etaMinutes ?? '—'} min
        </p>
        <button className="px-4 py-1.5 rounded-lg bg-brand-600 text-white text-[12.5px] font-extrabold shadow-sm" onClick={onAccept}>
          Accept Job
        </button>
      </div>
    </div>
  );
}

/**
 * Screen 11 — Rider Dashboard: online toggle, available jobs / my deliveries,
 * today's earnings stats.
 */
export default function RiderHomeView() {
  const { user, riders, riders: allRiders, donations, deliveries, shelters, acceptJob, toggleRiderOnline, navigate } = useApp();

  const rider = allRiders.find(r => r.name === user?.name) || allRiders[0];
  const [tab, setTab] = useState('jobs');

  if (!rider) return null;

  const activeDeliveryIds = new Set(
    deliveries.filter(d => d.status !== 'delivered').map(d => d.donationId)
  );
  const jobs = donations.filter(d => d.status === 'listed' && !activeDeliveryIds.has(d.id));
  const mine = deliveries.filter(d => d.riderId === rider.id);

  return (
    <div className="flex-1 flex flex-col overflow-y-auto">
      <div className="px-5 pt-2 flex items-center justify-between">
        <h1 className="text-[19px] font-extrabold text-ink font-display">Rider Dashboard</h1>
        <button className="w-9 h-9 rounded-full bg-white border border-line flex items-center justify-center shadow-sm">
          <Settings className="w-4.5 h-4.5 text-ink" />
        </button>
      </div>

      {/* Identity card */}
      <div className="mx-5 mt-3 rounded-2xl bg-white border border-line p-3.5 flex items-center gap-3 shadow-[0_1px_3px_rgba(21,60,36,0.06)]">
        <PhotoTile media={rider.photo} className="w-12 h-12 shrink-0" rounded="rounded-full" size="text-xl" />
        <div className="flex-1 min-w-0">
          <p className="text-[15px] font-extrabold text-ink">{rider.name}</p>
          <p className="text-[11.5px] text-muted font-semibold flex items-center gap-1">
            <Star className="w-3 h-3 fill-amber-400 text-amber-400" /> {rider.rating} ({rider.reviews})
          </p>
        </div>
        <button
          onClick={() => toggleRiderOnline(rider.id)}
          className="flex items-center gap-2 bg-brand-50 border border-brand-100 rounded-full pl-3 pr-1.5 py-1"
        >
          <span className={`text-[11.5px] font-extrabold ${rider.online ? 'text-brand-700' : 'text-slate-400'}`}>
            {rider.online ? 'Online' : 'Offline'}
          </span>
          <span className={`fb-toggle !w-9 !h-5 ${rider.online ? 'bg-brand-600' : 'bg-slate-300'}`}>
            <span
              className="fb-toggle-knob !w-4 !h-4"
              style={{ transform: rider.online ? 'translateX(16px)' : 'translateX(0)' }}
            />
          </span>
        </button>
      </div>

      {/* Tabs */}
      <div className="mx-5 mt-4 flex bg-white border border-line rounded-xl p-1 gap-1">
        {[
          { id: 'jobs', label: 'Available Jobs' },
          { id: 'deliveries', label: 'My Deliveries' },
        ].map(t => (
          <button
            key={t.id}
            onClick={() => setTab(t.id)}
            className={`flex-1 py-2 rounded-lg text-[13px] font-bold transition ${
              tab === t.id ? 'bg-brand-600 text-white shadow' : 'text-muted hover:bg-brand-50'
            }`}
          >
            {t.label}
          </button>
        ))}
      </div>

      <div className="px-5 mt-4 space-y-3 pb-6">
        {tab === 'jobs' && (
          <>
            {jobs.length === 0 && (
              <div className="fb-card text-center py-8">
                <Briefcase className="w-8 h-8 text-muted mx-auto" />
                <p className="text-[13.5px] font-extrabold text-ink mt-2">No jobs right now</p>
                <p className="text-[12px] text-muted">New pickup jobs will appear here.</p>
              </div>
            )}
            {jobs.map(d => (
              <JobRow
                key={d.id}
                donation={d}
                shelter={shelters.find(s => s.id === d.targetShelterId)}
                onAccept={() => acceptJob(d.id, rider.id)}
              />
            ))}
          </>
        )}

        {tab === 'deliveries' && (
          <>
            {mine.length === 0 && (
              <div className="fb-card text-center py-8">
                <PackageCheck className="w-8 h-8 text-muted mx-auto" />
                <p className="text-[13.5px] font-extrabold text-ink mt-2">No deliveries yet</p>
                <p className="text-[12px] text-muted">Accepted jobs show up here while in transit.</p>
              </div>
            )}
            {mine.map(del => (
              <button
                key={del.id}
                className="fb-card w-full flex items-center gap-3 text-left !p-3.5"
                onClick={() =>
                  del.status === 'delivered'
                    ? navigate('delivery-completed', { deliveryId: del.id })
                    : navigate('rider-delivery', { deliveryId: del.id })
                }
              >
                <PhotoTile media={del.proof?.[0]} className="w-12 h-12 shrink-0" size="text-2xl" />
                <div className="flex-1 min-w-0">
                  <p className="text-[13.5px] font-extrabold text-ink truncate">{del.toName}</p>
                  <p className="text-[11.5px] text-muted font-semibold">
                    {del.quantity} {del.unit} • {del.distanceKm} km
                  </p>
                </div>
                <span
                  className={`fb-badge ${
                    del.status === 'delivered'
                      ? 'bg-brand-600 text-white'
                      : 'bg-amber-50 text-amber-600 border border-amber-200'
                  }`}
                >
                  {del.status === 'delivered' ? 'Delivered' : 'On route'}
                </span>
              </button>
            ))}
          </>
        )}
      </div>

      {/* Stats */}
      <div className="mx-5 mb-7 grid grid-cols-3 gap-3">
        <div className="rounded-2xl bg-brand-50 border border-brand-100 p-3 text-center">
          <IndianRupee className="w-4.5 h-4.5 text-brand-700 mx-auto" />
          <p className="text-[17px] font-extrabold text-ink mt-1 leading-none">₹{rider.todayEarnings ?? 0}</p>
          <p className="text-[10.5px] font-bold text-muted mt-1">Today Earnings</p>
        </div>
        <div className="rounded-2xl bg-blue-50 border border-blue-100 p-3 text-center">
          <PackageCheck className="w-4.5 h-4.5 text-blue-600 mx-auto" />
          <p className="text-[17px] font-extrabold text-ink mt-1 leading-none">{rider.totalDeliveries ?? 0}</p>
          <p className="text-[10.5px] font-bold text-muted mt-1">Deliveries</p>
        </div>
        <div className="rounded-2xl bg-amber-50 border border-amber-100 p-3 text-center">
          <Star className="w-4.5 h-4.5 fill-amber-400 text-amber-400 mx-auto" />
          <p className="text-[17px] font-extrabold text-ink mt-1 leading-none">{rider.rating}</p>
          <p className="text-[10.5px] font-bold text-muted mt-1">Rating</p>
        </div>
      </div>
    </div>
  );
}
