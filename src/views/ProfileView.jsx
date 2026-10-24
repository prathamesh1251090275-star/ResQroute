import React from 'react';
import { LogOut, RotateCcw, ChevronRight, ShieldCheck, Phone } from 'lucide-react';
import { useApp } from '../context/AppContext';
import PhotoTile from '../components/PhotoTile';
import { MEDIA } from '../data/initialData';

const ROLE_LABEL = {
  donor: { title: 'Donor', desc: 'Donate surplus food', emoji: '🧑🏻' },
  shelter: { title: 'Shelter Partner', desc: 'Receive food donations', emoji: '🏢' },
  rider: { title: 'Delivery Rider', desc: 'Deliver food & earn', emoji: '🧑🏻' },
};

export default function ProfileView() {
  const { user, role, donations, deliveries, shelters, riders, signOut, resetDemo, addToast } = useApp();

  const info = ROLE_LABEL[role] || ROLE_LABEL.donor;
  const meShelter = shelters.find(s => s.name === user?.name);
  const meRider = riders.find(r => r.name === user?.name);

  const stats =
    role === 'shelter'
      ? [
          { label: 'Total Received', value: `${meShelter?.totalReceivedKg ?? 0} kg` },
          { label: 'Capacity Used', value: `${meShelter?.capacityPct ?? 0}%` },
        ]
      : role === 'rider'
        ? [
            { label: 'Deliveries', value: meRider?.totalDeliveries ?? 0 },
            { label: 'Rating', value: meRider?.rating ?? '—' },
          ]
        : [
            { label: 'Donations Made', value: donations.filter(d => d.donorId === 'me').length },
            {
              label: 'Kg Rescued',
              value: `${donations.filter(d => d.donorId === 'me' && d.status === 'delivered').reduce((s, d) => s + (d.quantity || 0), 0)} kg`,
            },
          ];

  return (
    <div className="flex-1 flex flex-col overflow-y-auto">
      <div className="px-5 pt-4 pb-2">
        <h1 className="text-[22px] font-extrabold text-ink font-display">Profile</h1>
      </div>

      <div className="mx-5 mt-2 rounded-2xl bg-white border border-line p-4 flex items-center gap-3.5 shadow-[0_1px_3px_rgba(21,60,36,0.06)]">
        <PhotoTile
          media={role === 'shelter' ? MEDIA.buildingA : MEDIA.man}
          className="w-16 h-16 shrink-0"
          rounded="rounded-full"
          size="text-2xl"
        />
        <div className="flex-1 min-w-0">
          <p className="text-[17px] font-extrabold text-ink truncate">{user?.name || info.title}</p>
          <p className="text-[12px] font-bold text-brand-700">{info.title}</p>
          <p className="text-[11.5px] text-muted font-medium">{info.desc}</p>
          {user?.phone ? (
            <p className="text-[11.5px] text-muted font-semibold flex items-center gap-1 mt-1">
              <Phone className="w-3 h-3" /> {user.phone}
            </p>
          ) : null}
        </div>
      </div>

      <div className="grid grid-cols-2 gap-3 px-5 mt-4">
        {stats.map(s => (
          <div key={s.label} className="fb-card !p-3.5 text-center">
            <p className="text-[19px] font-extrabold text-ink leading-none">{s.value}</p>
            <p className="text-[11px] font-bold text-muted mt-1.5">{s.label}</p>
          </div>
        ))}
      </div>

      <div className="px-5 mt-5 space-y-3 pb-8">
        <div className="rounded-2xl bg-brand-50 border border-brand-100 p-3.5 flex gap-2.5">
          <ShieldCheck className="w-4 h-4 text-brand-700 shrink-0 mt-0.5" />
          <p className="text-[11.5px] text-brand-800/80 font-medium leading-relaxed">
            FoodBridge shares your number only with matched shelters and riders during an active pickup.
          </p>
        </div>

        <button
          className="fb-card w-full flex items-center justify-between !p-3.5"
          onClick={() => {
            resetDemo();
          }}
        >
          <span className="flex items-center gap-2.5">
            <RotateCcw className="w-4.5 h-4.5 text-brand-600" />
            <span className="text-[13.5px] font-extrabold text-ink">Reset Demo Data</span>
          </span>
          <ChevronRight className="w-4.5 h-4.5 text-slate-400" />
        </button>

        <button
          className="fb-card w-full flex items-center justify-between !p-3.5"
          onClick={() => {
            addToast('Signed out', 'Thanks for fighting food waste with us!', 'info');
            signOut();
          }}
        >
          <span className="flex items-center gap-2.5">
            <LogOut className="w-4.5 h-4.5 text-red-500" />
            <span className="text-[13.5px] font-extrabold text-red-500">Sign Out</span>
          </span>
          <ChevronRight className="w-4.5 h-4.5 text-slate-400" />
        </button>

        <p className="text-center text-[11px] text-muted font-semibold pt-2">FoodBridge • Demo build</p>
      </div>
    </div>
  );
}
