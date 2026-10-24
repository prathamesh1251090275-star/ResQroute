import React from 'react';
import { Package } from 'lucide-react';
import { useApp } from '../context/AppContext';
import PhotoTile from '../components/PhotoTile';

const STATUS_BADGE = {
  listed: { label: 'Awaiting action', cls: 'bg-blue-50 text-blue-600 border border-blue-200' },
  assigned: { label: 'Rider en route', cls: 'bg-amber-50 text-amber-600 border border-amber-200' },
  arrived: { label: 'At shelter', cls: 'bg-brand-50 text-brand-700 border border-brand-100' },
  delivered: { label: 'In stock', cls: 'bg-brand-600 text-white' },
  rejected: { label: 'Declined', cls: 'bg-red-50 text-red-600 border border-red-200' },
};

/**
 * Shelter "Donations" tab — every donation targeted at this shelter.
 */
export default function ShelterDonationsListView() {
  const { user, shelters, donations, navigate } = useApp();
  const shelter = shelters.find(s => s.name === user?.name) || shelters[0];

  const mine = donations.filter(d => d.targetShelterId === shelter?.id);
  const openable = ['listed', 'arrived', 'delivered'];

  return (
    <div className="flex-1 flex flex-col overflow-y-auto">
      <div className="px-5 pt-4 pb-2">
        <h1 className="text-[22px] font-extrabold text-ink font-display">Donations</h1>
        <p className="text-[12.5px] text-muted mt-0.5">
          {mine.length} donation{mine.length === 1 ? '' : 's'} for {shelter?.name}
        </p>
      </div>

      <div className="px-5 space-y-3 pb-6">
        {mine.length === 0 && (
          <div className="fb-card text-center py-10">
            <Package className="w-9 h-9 text-muted mx-auto" />
            <p className="text-[14px] font-extrabold text-ink mt-3">No donations yet</p>
            <p className="text-[12.5px] text-muted mt-1">Offers from donors will show up here.</p>
          </div>
        )}

        {mine.map(d => {
          const badge = STATUS_BADGE[d.status] || STATUS_BADGE.listed;
          return (
            <button
              key={d.id}
              className="fb-card w-full flex items-center gap-3 text-left !p-3"
              onClick={() => openable.includes(d.status) && navigate('shelter-donation', { donationId: d.id })}
            >
              <PhotoTile media={d.photos?.[0]} className="w-14 h-14 shrink-0" size="text-2xl" />
              <div className="flex-1 min-w-0">
                <p className="text-[14px] font-extrabold text-ink truncate">{d.itemName}</p>
                <p className="text-[11.5px] text-muted font-semibold">
                  {d.quantity} {d.unit} • {d.foodType} • From: {d.donorName}
                </p>
                <p className="text-[11px] text-muted mt-0.5">{d.category}</p>
              </div>
              <span className={`fb-badge shrink-0 ${badge.cls}`}>{badge.label}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
