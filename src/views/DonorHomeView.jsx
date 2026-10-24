import React from 'react';
import { Bell, Truck, ChevronRight, MapPin } from 'lucide-react';
import { useApp } from '../context/AppContext';
import FoodBridgeLogo from '../components/FoodBridgeLogo';
import PhotoTile from '../components/PhotoTile';

const STOCK_BADGE = {
  needs: { label: 'Needs food', cls: 'bg-red-50 text-red-600 border border-red-200' },
  low: { label: 'Low stock', cls: 'bg-amber-50 text-amber-600 border border-amber-200' },
  stocked: { label: 'Stocked', cls: 'bg-brand-50 text-brand-700 border border-brand-100' },
};

export default function DonorHomeView() {
  const { user, shelters, donations, deliveries, navigate } = useApp();

  const myDonationIds = new Set(donations.filter(d => d.donorId === 'me').map(d => d.id));
  const activeDelivery = deliveries.find(
    del => del.status !== 'delivered' && myDonationIds.has(del.donationId)
  );

  return (
    <div className="flex-1 flex flex-col overflow-y-auto">
      {/* Header */}
      <div className="px-5 pt-2 pb-1 flex items-center justify-between">
        <FoodBridgeLogo size="sm" />
        <button className="w-9 h-9 rounded-full bg-white border border-line flex items-center justify-center relative shadow-sm">
          <Bell className="w-4.5 h-4.5 text-ink" />
          <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-red-500" />
        </button>
      </div>

      <div className="px-5 pt-3">
        <h1 className="text-[24px] font-extrabold text-ink font-display leading-tight">
          Hello, {user?.name || 'Prathamesh'}
        </h1>
        <p className="text-[13px] text-muted mt-0.5">Together we can reduce food waste</p>
      </div>

      {/* Surplus Food Pickup card */}
      <div className="mx-5 mt-4 rounded-2xl bg-brand-50 border border-brand-100 p-4">
        <div className="flex items-start gap-3">
          <span className="w-11 h-11 rounded-full bg-brand-600 flex items-center justify-center shadow-[0_6px_14px_rgba(26,128,77,0.3)] shrink-0">
            <Truck className="w-5 h-5 text-white" strokeWidth={2.2} />
          </span>
          <div className="flex-1 min-w-0">
            <h2 className="text-[15.5px] font-extrabold text-brand-800">Surplus Food Pickup</h2>
            <p className="text-[12.5px] text-brand-700/80 leading-snug">
              Schedule a pickup for your excess food
            </p>
          </div>
          <ChevronRight className="w-5 h-5 text-brand-600 mt-1" />
        </div>
        <button className="fb-btn-primary !py-2.5 mt-3 !text-[14px] !shadow-none" onClick={() => navigate('add-donation')}>
          Add Donation
        </button>
      </div>

      {/* Nearby Shelters */}
      <div className="px-5 mt-6 flex items-center justify-between">
        <h3 className="text-[16px] font-extrabold text-ink">Nearby Shelters</h3>
        <button className="text-[12.5px] font-bold text-brand-700" onClick={() => navigate('shelters')}>
          View all
        </button>
      </div>

      <div className="mt-3 flex gap-3 overflow-x-auto scrollbar-hide px-5 pb-1">
        {shelters.slice(0, 4).map(s => {
          const badge = STOCK_BADGE[s.stockStatus] || STOCK_BADGE.needs;
          return (
            <button
              key={s.id}
              onClick={() => navigate('shelters')}
              className="w-[150px] shrink-0 bg-white rounded-2xl border border-line overflow-hidden text-left shadow-[0_1px_3px_rgba(21,60,36,0.06)]"
            >
              <PhotoTile media={s.image} rounded="rounded-none" className="h-[74px] w-full" size="text-3xl" />
              <div className="p-2.5">
                <p className="text-[12.5px] font-extrabold text-ink leading-tight line-clamp-2 min-h-[32px]">
                  {s.name}
                </p>
                <p className="text-[11px] text-muted font-semibold mt-1">{s.distanceKm} km</p>
                <span className={`fb-badge mt-1.5 ${badge.cls}`}>{badge.label}</span>
              </div>
            </button>
          );
        })}
      </div>

      {/* Active Delivery */}
      {activeDelivery ? (
        <button
          className="mx-5 mt-5 w-[calc(100%-40px)] text-left rounded-2xl bg-brand-50 border border-brand-100 p-4 flex items-center gap-3"
          onClick={() => navigate('book-rider', { donationId: activeDelivery.donationId, deliveryId: activeDelivery.id, tracking: true })}
        >
          <span className="w-10 h-10 rounded-xl bg-white border border-brand-100 flex items-center justify-center shrink-0">
            <Truck className="w-5 h-5 text-brand-700" />
          </span>
          <span className="flex-1 min-w-0">
            <span className="block text-[13.5px] font-extrabold text-brand-800">Active Delivery</span>
            <span className="block text-[12px] text-muted font-medium truncate">
              Food going to: {activeDelivery.toName}, {activeDelivery.toArea}
            </span>
            <span className="block text-[11.5px] text-brand-700 font-bold mt-0.5">
              Arriving in {activeDelivery.etaMinutes} min
            </span>
          </span>
          <ChevronRight className="w-5 h-5 text-brand-600 shrink-0" />
        </button>
      ) : (
        <div className="mx-5 mt-5 rounded-2xl bg-white border border-dashed border-line p-4 flex items-center gap-3">
          <span className="w-10 h-10 rounded-xl bg-brand-50 flex items-center justify-center shrink-0">
            <MapPin className="w-5 h-5 text-brand-600" />
          </span>
          <div className="flex-1">
            <p className="text-[13px] font-extrabold text-ink">No active deliveries</p>
            <p className="text-[12px] text-muted">Your pickups will appear here in real time.</p>
          </div>
        </div>
      )}

      <div className="h-6" />
    </div>
  );
}
