import React from 'react';
import { IndianRupee, PackageCheck, Star, TrendingUp } from 'lucide-react';
import { useApp } from '../context/AppContext';
import PhotoTile from '../components/PhotoTile';

function formatDay(ts) {
  if (!ts) return '';
  const d = new Date(ts);
  const today = new Date();
  const sameDay = d.toDateString() === today.toDateString();
  return sameDay
    ? `Today, ${d.toLocaleTimeString([], { hour: 'numeric', minute: '2-digit' })}`
    : d.toLocaleDateString([], { day: 'numeric', month: 'short' });
}

/**
 * Rider "Earnings" tab — today's payout, totals and per-delivery history.
 */
export default function RiderEarningsView() {
  const { riders, user, deliveries } = useApp();
  const rider = riders.find(r => r.name === user?.name) || riders[0];

  const mine = deliveries.filter(d => d.riderId === rider?.id);
  const done = mine.filter(d => d.status === 'delivered');
  const perDrop = id => {
    const del = mine.find(d => d.id === id);
    return Math.max(30, Math.round((del?.distanceKm || 2) * 15));
  };
  const totalEarned = done.reduce((sum, d) => sum + perDrop(d.id), 0);

  return (
    <div className="flex-1 flex flex-col overflow-y-auto">
      <div className="px-5 pt-4 pb-2">
        <h1 className="text-[22px] font-extrabold text-ink font-display">Earnings</h1>
        <p className="text-[12.5px] text-muted mt-0.5">Your payouts and delivery history</p>
      </div>

      <div className="mx-5 mt-2 rounded-2xl bg-brand-600 p-5 text-white shadow-[0_10px_24px_rgba(26,128,77,0.3)]">
        <p className="text-[12px] font-bold text-brand-100 flex items-center gap-1.5">
          <TrendingUp className="w-4 h-4" /> Today's Earnings
        </p>
        <p className="text-[34px] font-extrabold leading-tight mt-1">₹{rider?.todayEarnings ?? 0}</p>
        <div className="flex items-center gap-5 mt-3 text-[12px] font-semibold text-brand-100">
          <span className="flex items-center gap-1.5">
            <PackageCheck className="w-4 h-4" /> {done.length} completed drops
          </span>
          <span className="flex items-center gap-1.5">
            <Star className="w-4 h-4 fill-white text-white" /> {rider?.rating ?? '—'} rating
          </span>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-3 px-5 mt-4">
        <div className="fb-card !p-3.5 text-center">
          <IndianRupee className="w-5 h-5 text-brand-600 mx-auto" />
          <p className="text-[18px] font-extrabold text-ink mt-1 leading-none">₹{totalEarned}</p>
          <p className="text-[11px] font-bold text-muted mt-1">From completed trips</p>
        </div>
        <div className="fb-card !p-3.5 text-center">
          <PackageCheck className="w-5 h-5 text-blue-500 mx-auto" />
          <p className="text-[18px] font-extrabold text-ink mt-1 leading-none">{rider?.totalDeliveries ?? 0}</p>
          <p className="text-[11px] font-bold text-muted mt-1">Total Deliveries</p>
        </div>
      </div>

      <h3 className="text-[15px] font-extrabold text-ink px-5 mt-6 mb-3">Payout History</h3>
      <div className="px-5 space-y-3 pb-6">
        {mine.length === 0 && (
          <div className="fb-card text-center py-8">
            <IndianRupee className="w-8 h-8 text-muted mx-auto" />
            <p className="text-[13.5px] font-extrabold text-ink mt-2">No payouts yet</p>
            <p className="text-[12px] text-muted">Complete a delivery to earn your first payout.</p>
          </div>
        )}
        {mine.map(del => (
          <div key={del.id} className="fb-card flex items-center gap-3 !p-3.5">
            <PhotoTile media={del.proof?.[0]} className="w-11 h-11 shrink-0" size="text-xl" />
            <div className="flex-1 min-w-0">
              <p className="text-[13.5px] font-extrabold text-ink truncate">{del.toName}</p>
              <p className="text-[11px] text-muted font-semibold">
                {formatDay(del.deliveredAt || del.startedAt)} • {del.distanceKm} km
              </p>
            </div>
            <span
              className={`fb-badge ${del.status === 'delivered' ? 'bg-brand-50 text-brand-700 border border-brand-100' : 'bg-amber-50 text-amber-600 border border-amber-200'}`}
            >
              {del.status === 'delivered' ? `+₹${perDrop(del.id)}` : 'Pending'}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
