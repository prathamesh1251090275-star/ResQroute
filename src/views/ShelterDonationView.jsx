import React from 'react';
import { CalendarDays, Snowflake, Timer } from 'lucide-react';
import { useApp } from '../context/AppContext';
import ScreenHeader from '../components/ScreenHeader';
import ScoreRing from '../components/ScoreRing';
import PhotoTile from '../components/PhotoTile';

function formatPacked(packedTime) {
  if (!packedTime) return 'Today';
  return packedTime.replace('Today, ', 'Today, ');
}

/**
 * Screen 10 — Donation Details (Receive Inventory).
 */
export default function ShelterDonationView({ params }) {
  const { donations, confirmReceived, rejectDonation, goBack, shelters, user } = useApp();
  const donation = donations.find(d => d.id === params?.donationId);

  if (!donation) {
    return (
      <div className="flex-1 flex flex-col overflow-hidden">
        <ScreenHeader title="Donation Details" />
        <p className="text-[13px] text-muted text-center mt-10">This donation is no longer available.</p>
      </div>
    );
  }

  const qualityColor =
    donation.freshnessScore >= 80 ? 'text-brand-700' : donation.freshnessScore >= 65 ? 'text-amber-600' : 'text-red-500';

  return (
    <div className="flex-1 flex flex-col overflow-hidden">
      <ScreenHeader title="Donation Details" />
      <div className="flex-1 overflow-y-auto px-5 pt-4 pb-8">
        <div className="fb-card flex items-center gap-3 !p-3.5">
          <PhotoTile media={donation.photos?.[0]} className="w-16 h-16 shrink-0" size="text-3xl" />
          <div className="flex-1 min-w-0">
            <p className="text-[15px] font-extrabold text-ink truncate">{donation.itemName}</p>
            <p className="text-[12px] text-muted font-semibold mt-0.5">From: {donation.donorName}</p>
            <p className="text-[11.5px] text-muted font-semibold mt-0.5">
              {donation.category} • {donation.quantity} {donation.unit}
            </p>
          </div>
        </div>

        <h3 className="text-[14px] font-extrabold text-ink mt-6 mb-3">Food Quality &amp; Shelf Life</h3>
        <div className="fb-card flex items-center gap-4 !p-4">
          <ScoreRing score={donation.freshnessScore || 0} size={84} label="Freshness Score" />
          <div className="flex-1">
            <p className={`text-[15px] font-extrabold ${qualityColor}`}>{donation.qualityLabel}</p>
            <div className="flex items-center gap-1.5 mt-2.5 text-[12px] font-bold text-ink">
              <CalendarDays className="w-4 h-4 text-brand-600" />
              Use by {donation.useBy || '22 Oct 2026'}
            </div>
            <p className="text-[11px] text-muted font-semibold ml-5.5">({donation.safeWindow})</p>
          </div>
        </div>

        <h3 className="text-[14px] font-extrabold text-ink mt-6 mb-3">Additional Info</h3>
        <div className="grid grid-cols-2 gap-3">
          <div className="fb-card !p-3.5">
            <Timer className="w-4.5 h-4.5 text-brand-600" />
            <p className="text-[11px] font-bold text-muted mt-2">Packed</p>
            <p className="text-[12.5px] font-extrabold text-ink">{formatPacked(donation.packedTime)}</p>
          </div>
          <div className="fb-card !p-3.5">
            <Snowflake className="w-4.5 h-4.5 text-blue-500" />
            <p className="text-[11px] font-bold text-muted mt-2">Storage</p>
            <p className="text-[12.5px] font-extrabold text-ink leading-snug">{donation.storage}</p>
          </div>
        </div>

        <button
          className="fb-btn-primary mt-7"
          onClick={() => {
            const shelter = shelters.find(s => s.name === user?.name) || shelters[0];
            confirmReceived(donation.id);
            // keep the shelter context for the toast; inventory updates in context
            void shelter;
          }}
        >
          Confirm Received
        </button>
        <button
          className="fb-btn-outline !border-red-200 !text-red-500 mt-3"
          onClick={() => {
            rejectDonation(donation.id);
            goBack();
          }}
        >
          Reject
        </button>
      </div>
    </div>
  );
}
