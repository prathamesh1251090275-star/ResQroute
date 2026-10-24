import React from 'react';
import { ListChecks, AlertTriangle, Users, Package, ChevronRight } from 'lucide-react';
import { useApp } from '../context/AppContext';
import FoodBridgeLogo from '../components/FoodBridgeLogo';
import PhotoTile from '../components/PhotoTile';

export default function ShelterHomeView() {
  const { user, shelters, donations, acceptDonation, rejectDonation, navigate } = useApp();

  const shelter = shelters.find(s => s.name === user?.name) || shelters[0];
  const mine = donations.filter(d => d.targetShelterId === shelter?.id);
  const incoming = mine.filter(d => ['listed', 'assigned', 'arrived'].includes(d.status));

  return (
    <div className="flex-1 flex flex-col overflow-y-auto">
      <div className="px-5 pt-2 flex items-center justify-between">
        <FoodBridgeLogo size="sm" />
      </div>

      <div className="px-5 pt-2">
        <h1 className="text-[22px] font-extrabold text-ink font-display leading-tight">{shelter?.name}</h1>
        <p className="text-[12px] text-muted font-semibold mt-0.5">
          {shelter?.area} • {shelter?.distanceKm} km
        </p>
      </div>

      {/* Stat tiles */}
      <div className="grid grid-cols-2 gap-3 px-5 mt-4">
        <div className="rounded-2xl bg-blue-50 border border-blue-100 p-3.5">
          <span className="w-8 h-8 rounded-lg bg-white flex items-center justify-center shadow-sm">
            <ListChecks className="w-4.5 h-4.5 text-blue-600" />
          </span>
          <p className="text-[19px] font-extrabold text-ink mt-2 leading-none">{incoming.length}</p>
          <p className="text-[11.5px] font-bold text-muted mt-1">Incoming Donations</p>
        </div>
        <div className="rounded-2xl bg-red-50 border border-red-100 p-3.5">
          <span className="w-8 h-8 rounded-lg bg-white flex items-center justify-center shadow-sm">
            <AlertTriangle className="w-4.5 h-4.5 text-red-500" />
          </span>
          <p className="text-[19px] font-extrabold text-ink mt-2 leading-none">{shelter?.urgentNeeds ?? 0}</p>
          <p className="text-[11.5px] font-bold text-muted mt-1">Urgent Needs</p>
        </div>
        <div className="rounded-2xl bg-brand-50 border border-brand-100 p-3.5">
          <span className="w-8 h-8 rounded-lg bg-white flex items-center justify-center shadow-sm">
            <Users className="w-4.5 h-4.5 text-brand-600" />
          </span>
          <p className="text-[19px] font-extrabold text-ink mt-2 leading-none">{shelter?.capacityPct ?? 0}%</p>
          <p className="text-[11.5px] font-bold text-muted mt-1">Overall Capacity</p>
        </div>
        <div className="rounded-2xl bg-purple-50 border border-purple-100 p-3.5">
          <span className="w-8 h-8 rounded-lg bg-white flex items-center justify-center shadow-sm">
            <Package className="w-4.5 h-4.5 text-purple-600" />
          </span>
          <p className="text-[19px] font-extrabold text-ink mt-2 leading-none">{shelter?.totalReceivedKg ?? 0} kg</p>
          <p className="text-[11.5px] font-bold text-muted mt-1">Total Received</p>
        </div>
      </div>

      {/* Incoming donations */}
      <div className="px-5 mt-6 flex items-center justify-between">
        <h3 className="text-[16px] font-extrabold text-ink">Incoming Donations</h3>
        <button className="text-[12.5px] font-bold text-brand-700" onClick={() => navigate('shelter-donations')}>
          View all
        </button>
      </div>

      <div className="px-5 mt-3 space-y-3 pb-6">
        {incoming.length === 0 && (
          <div className="fb-card text-center py-8">
            <Package className="w-8 h-8 text-muted mx-auto" />
            <p className="text-[13.5px] font-extrabold text-ink mt-2">No incoming donations</p>
            <p className="text-[12px] text-muted">New offers from donors will appear here.</p>
          </div>
        )}

        {incoming.map(d => (
          <div key={d.id} className="fb-card flex items-center gap-3 !p-3">
            <button onClick={() => navigate('shelter-donation', { donationId: d.id })} className="shrink-0">
              <PhotoTile media={d.photos?.[0]} className="w-14 h-14" size="text-2xl" />
            </button>
            <button className="flex-1 min-w-0 text-left" onClick={() => navigate('shelter-donation', { donationId: d.id })}>
              <p className="text-[14px] font-extrabold text-ink truncate">{d.itemName}</p>
              <p className="text-[11.5px] text-muted font-semibold">
                {d.quantity} {d.unit} • {d.foodType}
              </p>
              <p className="text-[11px] text-muted mt-0.5">From: {d.donorName}</p>
            </button>
            <div className="flex items-center gap-2 shrink-0">
              <button
                className="px-3.5 py-1.5 rounded-lg bg-brand-600 text-white text-[12px] font-extrabold shadow-sm"
                onClick={() => acceptDonation(d.id)}
              >
                Accept
              </button>
              <button
                className="px-3.5 py-1.5 rounded-lg bg-white border border-red-200 text-red-500 text-[12px] font-extrabold"
                onClick={() => rejectDonation(d.id)}
              >
                Reject
              </button>
            </div>
          </div>
        ))}

        {incoming.length > 0 && (
          <button className="btn-ghost" onClick={() => navigate('shelter-donations')}>
            View all donations <ChevronRight className="w-4 h-4" />
          </button>
        )}
      </div>
    </div>
  );
}
