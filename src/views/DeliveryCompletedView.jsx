import React, { useEffect } from 'react';
import confetti from 'canvas-confetti';
import { Check, BadgeCheck, Bell, MapPin } from 'lucide-react';
import { useApp } from '../context/AppContext';
import PhotoTile from '../components/PhotoTile';

function formatTime(ts) {
  if (!ts) return '';
  return new Date(ts).toLocaleTimeString([], { hour: 'numeric', minute: '2-digit' });
}

/**
 * Screen 8 — Delivery Completed: success state, receiver confirmation, proof.
 */
export default function DeliveryCompletedView({ params }) {
  const { deliveries, goHome } = useApp();
  const delivery = deliveries.find(d => d.id === params?.deliveryId) || deliveries.find(d => d.status === 'delivered');

  useEffect(() => {
    confetti({ particleCount: 90, spread: 70, origin: { y: 0.35 }, disableForReducedMotion: true });
    const t = setTimeout(() => {
      confetti({ particleCount: 55, angle: 60, spread: 60, origin: { x: 0, y: 0.45 }, disableForReducedMotion: true });
      confetti({ particleCount: 55, angle: 120, spread: 60, origin: { x: 1, y: 0.45 }, disableForReducedMotion: true });
    }, 350);
    return () => clearTimeout(t);
  }, []);

  if (!delivery) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center px-6">
        <p className="text-[14px] font-bold text-muted">No completed delivery to show.</p>
        <button className="fb-btn-primary !w-auto px-6 mt-4" onClick={goHome}>Mark as Home</button>
      </div>
    );
  }

  return (
    <div className="flex-1 flex flex-col overflow-y-auto px-5 pt-8 pb-8">
      <div className="flex flex-col items-center text-center">
        <div className="w-20 h-20 rounded-full bg-brand-600 flex items-center justify-center shadow-[0_12px_30px_rgba(26,128,77,0.4)] animate-pop">
          <Check className="w-10 h-10 text-white" strokeWidth={3} />
        </div>
        <h1 className="text-[24px] font-extrabold text-ink mt-5 font-display">Delivery Completed!</h1>
        <p className="text-[13px] text-muted mt-1.5 max-w-[280px]">
          Food has been successfully delivered to the shelter.
        </p>
      </div>

      <div className="fb-card mt-6 flex items-center gap-3 !p-3.5">
        <PhotoTile media={delivery.proof?.[0]} className="w-14 h-14 shrink-0" size="text-2xl" />
        <div className="flex-1 min-w-0">
          <p className="text-[15px] font-extrabold text-ink">{delivery.toName}</p>
          <p className="text-[11.5px] text-muted font-semibold">{delivery.toArea}</p>
          <p className="text-[11.5px] text-muted font-semibold mt-0.5">
            {delivery.distanceKm} km • {delivery.foodLabel}
          </p>
          <p className="text-[11.5px] text-brand-700 font-bold mt-0.5">
            Delivered at {formatTime(delivery.deliveredAt)}
          </p>
        </div>
      </div>

      <div className="fb-card mt-4 !p-3.5">
        <p className="text-[13px] font-extrabold text-ink mb-2.5">Receiver Confirmation</p>
        <div className="flex items-center gap-3">
          <PhotoTile media={delivery.receiverPhoto} className="w-10 h-10 shrink-0" rounded="rounded-full" size="text-lg" />
          <div className="flex-1 min-w-0">
            <p className="text-[11px] text-muted font-bold uppercase tracking-wide">Received by</p>
            <p className="text-[13px] font-extrabold text-ink truncate">{delivery.receivedBy}</p>
          </div>
          <span className="fb-badge bg-brand-50 text-brand-700 border border-brand-100">
            <BadgeCheck className="w-3.5 h-3.5" /> Confirmed
          </span>
        </div>
      </div>

      <div className="fb-card mt-4 !p-3.5">
        <p className="text-[13px] font-extrabold text-ink mb-2.5">Proof of Delivery</p>
        <div className="flex gap-2.5">
          {(delivery.proof || []).slice(0, 2).map((p, i) => (
            <PhotoTile key={i} media={p} className="flex-1 h-20" size="text-3xl" />
          ))}
          <PhotoTile media={delivery.signature} className="flex-1 h-20" size="text-2xl" />
        </div>
      </div>

      <div className="mt-4 rounded-2xl bg-brand-50 border border-brand-100 p-3.5 flex gap-2.5">
        <Bell className="w-4 h-4 text-brand-700 shrink-0 mt-0.5" />
        <div>
          <p className="text-[12px] font-extrabold text-brand-800">Notification sent to donor</p>
          <p className="text-[11.5px] text-brand-700/80 font-medium">Thank you for supporting our community!</p>
        </div>
      </div>

      <div className="flex items-center justify-center gap-1.5 text-[11.5px] text-muted font-semibold mt-5">
        <MapPin className="w-3.5 h-3.5 text-brand-600" />
        {delivery.quantity} {delivery.unit} reached {delivery.toName} safely
      </div>

      <button className="fb-btn-primary mt-5" onClick={goHome}>Mark as Home</button>
    </div>
  );
}
