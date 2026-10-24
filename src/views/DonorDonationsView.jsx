import React from 'react';
import { HandHeart, ChevronRight } from 'lucide-react';
import { useApp } from '../context/AppContext';
import PhotoTile from '../components/PhotoTile';

const STATUS_BADGE = {
  listed: { label: 'Awaiting pickup', cls: 'bg-blue-50 text-blue-600 border border-blue-200' },
  assigned: { label: 'Rider assigned', cls: 'bg-amber-50 text-amber-600 border border-amber-200' },
  arrived: { label: 'At shelter', cls: 'bg-brand-50 text-brand-700 border border-brand-100' },
  delivered: { label: 'Delivered', cls: 'bg-brand-600 text-white' },
  rejected: { label: 'Declined', cls: 'bg-red-50 text-red-600 border border-red-200' },
};

export default function DonorDonationsView() {
  const { donations, deliveries, shelters, navigate } = useApp();

  const mine = donations.filter(d => d.donorId === 'me');

  const open = id => {
    const delivery = deliveries.find(del => del.donationId === id && del.status !== 'delivered');
    if (delivery) {
      navigate('book-rider', { donationId: id, deliveryId: delivery.id, tracking: true });
      return;
    }
    const done = deliveries.find(del => del.donationId === id && del.status === 'delivered');
    if (done) {
      navigate('delivery-completed', { deliveryId: done.id });
      return;
    }
    const donation = donations.find(d => d.id === id);
    if (donation?.status === 'listed') navigate('shelters', { selectFor: id });
  };

  return (
    <div className="flex-1 flex flex-col overflow-y-auto">
      <div className="px-5 pt-4 pb-2">
        <h1 className="text-[22px] font-extrabold text-ink font-display">My Donations</h1>
        <p className="text-[12.5px] text-muted mt-0.5">
          {mine.length} donation{mine.length === 1 ? '' : 's'} •{' '}
          {mine.filter(d => d.status === 'delivered').length} delivered
        </p>
      </div>

      <div className="px-5 space-y-3 pb-6">
        {mine.length === 0 && (
          <div className="fb-card text-center py-10">
            <HandHeart className="w-9 h-9 text-brand-500 mx-auto" />
            <p className="text-[14px] font-extrabold text-ink mt-3">No donations yet</p>
            <p className="text-[12.5px] text-muted mt-1">Your surplus food pickups will show up here.</p>
            <button className="fb-btn-primary !w-auto inline-flex px-6 !py-2.5 mt-4" onClick={() => navigate('add-donation')}>
              Add Donation
            </button>
          </div>
        )}

        {mine.map(d => {
          const badge = STATUS_BADGE[d.status] || STATUS_BADGE.listed;
          const shelter = shelters.find(s => s.id === d.targetShelterId);
          return (
            <button key={d.id} className="fb-card w-full flex items-center gap-3 text-left !p-3" onClick={() => open(d.id)}>
              <PhotoTile media={d.photos?.[0]} className="w-14 h-14 shrink-0" size="text-2xl" />
              <div className="flex-1 min-w-0">
                <p className="text-[14px] font-extrabold text-ink truncate">{d.itemName}</p>
                <p className="text-[11.5px] text-muted font-semibold">
                  {d.quantity} {d.unit} • {d.category}
                </p>
                <p className="text-[11px] text-muted mt-0.5 truncate">
                  {d.status === 'delivered' ? `Delivered to ${shelter?.name || 'shelter'}` : shelter ? `For ${shelter.name}` : 'No shelter selected yet'}
                </p>
              </div>
              <div className="flex flex-col items-end gap-1.5 shrink-0">
                <span className={`fb-badge ${badge.cls}`}>{badge.label}</span>
                <ChevronRight className="w-4 h-4 text-slate-400" />
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}
