import React, { useEffect, useMemo, useRef, useState } from 'react';
import { Star, Phone, Bike, MapPin } from 'lucide-react';
import { useApp } from '../context/AppContext';
import ScreenHeader from '../components/ScreenHeader';
import ShelterMap from '../components/ShelterMap';
import PhotoTile from '../components/PhotoTile';

function lerp(a, b, t) {
  return a + (b - a) * Math.max(0, Math.min(1, t));
}

/**
 * Screen 7 — Book Rider & Live Tracking.
 * Without a delivery: pick an available rider. With one: track it live until
 * the delivery completes, then jump to the Delivery Completed screen.
 */
export default function BookRiderView({ params }) {
  const { riders, deliveries, donations, shelters, createDelivery, tickDelivery, navigate } = useApp();
  const donationId = params?.donationId;

  const activeDelivery =
    deliveries.find(d => d.id === params?.deliveryId) ||
    deliveries.find(d => d.donationId === donationId && d.status !== 'delivered');

  const tracking = Boolean(activeDelivery);

  // Live ETA countdown while tracking
  const initialEtaRef = useRef(null);
  useEffect(() => {
    if (!tracking || !activeDelivery || activeDelivery.status === 'delivered') return undefined;
    if (!initialEtaRef.current) initialEtaRef.current = activeDelivery.etaMinutes || 12;
    const timer = setInterval(() => tickDelivery(activeDelivery.id), 3000);
    return () => clearInterval(timer);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [tracking, activeDelivery?.id, activeDelivery?.status]);

  // Jump to the completed screen the moment the delivery lands
  useEffect(() => {
    if (activeDelivery?.status === 'delivered') {
      navigate('delivery-completed', { deliveryId: activeDelivery.id }, { replace: true });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeDelivery?.status]);

  const donation = donations.find(d => d.id === (activeDelivery?.donationId || donationId));
  const shelter = shelters.find(s => s.id === (donation?.targetShelterId || activeDelivery?.toName));
  const rider = riders.find(r => r.id === activeDelivery?.riderId);

  const initialEta = initialEtaRef.current || activeDelivery?.etaMinutes || 12;
  const progress = activeDelivery
    ? Math.max(0, Math.min(1, 1 - (activeDelivery.etaMinutes || 0) / initialEta))
    : 0;

  const { riderPos, routeLine } = useMemo(() => {
    if (!rider || !shelter) return { riderPos: null, routeLine: [] };
    const from = rider.location;
    const to = shelter.location;
    return {
      riderPos: { lat: lerp(from.lat, to.lat, progress), lng: lerp(from.lng, to.lng, progress) },
      routeLine: [from, to],
    };
  }, [rider, shelter, progress]);

  if (tracking && activeDelivery) {
    return (
      <div className="flex-1 flex flex-col overflow-hidden">
        <ScreenHeader title="Book Rider" />
        <div className="flex-1 overflow-y-auto px-5 pt-4 pb-8">
          <h3 className="text-[15px] font-extrabold text-ink mb-3">Live Tracking</h3>
          <ShelterMap
            shelters={shelter ? [shelter] : []}
            rider={riderPos ? { location: riderPos } : null}
            routeLine={routeLine}
            focus={riderPos || rider?.location}
            height={240}
            zoom={14}
          />

          <div className="fb-card mt-4 flex items-center gap-3 !p-3.5">
            <PhotoTile media={rider?.photo} className="w-12 h-12 shrink-0" rounded="rounded-full" size="text-xl" />
            <div className="flex-1 min-w-0">
              <p className="text-[14px] font-extrabold text-ink">Rider En Route</p>
              <p className="text-[11.5px] text-muted font-semibold">
                {rider?.name} • ★ {rider?.rating} ({rider?.reviews})
              </p>
              <p className="text-[11.5px] text-brand-700 font-bold mt-0.5">
                ETA: {activeDelivery.etaMinutes} min • {activeDelivery.distanceKm} km
              </p>
              <div className="h-1.5 bg-line rounded-full mt-2 overflow-hidden">
                <div
                  className="h-full bg-brand-600 rounded-full transition-all duration-700"
                  style={{ width: `${Math.round(progress * 100)}%` }}
                />
              </div>
            </div>
            <button className="w-11 h-11 rounded-full bg-brand-600 flex items-center justify-center shadow-[0_6px_14px_rgba(26,128,77,0.3)] shrink-0">
              <Phone className="w-5 h-5 text-white" />
            </button>
          </div>

          <div className="fb-card mt-3 flex items-center gap-3 !p-3.5">
            <span className="w-10 h-10 rounded-xl bg-brand-50 flex items-center justify-center shrink-0">
              <MapPin className="w-5 h-5 text-brand-700" />
            </span>
            <div className="flex-1 min-w-0">
              <p className="text-[12px] font-bold text-muted">Delivering to</p>
              <p className="text-[13.5px] font-extrabold text-ink truncate">
                {activeDelivery.toName}, {activeDelivery.toArea}
              </p>
              <p className="text-[11px] text-muted font-semibold">
                {activeDelivery.quantity} {activeDelivery.unit} • {activeDelivery.foodLabel}
              </p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  const available = riders.filter(r => r.online && r.status !== 'busy').sort((a, b) => a.etaMinutes - b.etaMinutes);

  return (
    <div className="flex-1 flex flex-col overflow-hidden">
      <ScreenHeader title="Book Rider" />
      <div className="flex-1 overflow-y-auto px-5 pt-4 pb-8">
        <h3 className="text-[15px] font-extrabold text-ink mb-3">Riders Available</h3>
        <div className="space-y-3">
          {available.map(r => (
            <div key={r.id} className="fb-card flex items-center gap-3 !p-3.5">
              <PhotoTile media={r.photo} className="w-12 h-12 shrink-0" rounded="rounded-full" size="text-xl" />
              <div className="flex-1 min-w-0">
                <p className="text-[14px] font-extrabold text-ink">{r.name}</p>
                <p className="text-[11.5px] text-muted font-semibold flex items-center gap-1">
                  <Star className="w-3 h-3 fill-amber-400 text-amber-400" />
                  {r.rating} ({r.reviews})
                </p>
                <p className="text-[11.5px] text-muted font-semibold mt-0.5 flex items-center gap-1">
                  <Bike className="w-3 h-3" /> ETA {r.etaMinutes} min
                </p>
              </div>
              <button
                className="fb-btn-primary !w-auto px-5 !py-2 !text-[13px]"
                onClick={() => createDelivery(donationId, r.id)}
              >
                Book
              </button>
            </div>
          ))}
          {available.length === 0 && (
            <div className="fb-card text-center py-8">
              <Bike className="w-8 h-8 text-muted mx-auto" />
              <p className="text-[13.5px] font-extrabold text-ink mt-2">All riders are busy</p>
              <p className="text-[12px] text-muted">A rider will free up shortly — try again in a moment.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
