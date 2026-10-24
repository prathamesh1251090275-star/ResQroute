import React, { useEffect, useMemo, useRef, useState } from 'react';
import { Check, Camera, Package, HandHeart, ShieldCheck } from 'lucide-react';
import { useApp } from '../context/AppContext';
import ScreenHeader from '../components/ScreenHeader';
import ShelterMap from '../components/ShelterMap';

function lerp(a, b, t) {
  return a + (b - a) * Math.max(0, Math.min(1, t));
}

/**
 * Screen 12 — Rider Active Delivery: stepper, live map, pickup checklist,
 * OTP verification and proof submission.
 */
export default function RiderDeliveryView({ params }) {
  const { deliveries, riders, tickDelivery, markDelivered, addToast } = useApp();
  const delivery = deliveries.find(d => d.id === params?.deliveryId);

  const [checklist, setChecklist] = useState({ package: true, photo: false, received: true });
  const [otp, setOtp] = useState(['', '', '', '']);
  const refs = [useRef(), useRef(), useRef(), useRef()];

  const initialEtaRef = useRef(null);
  useEffect(() => {
    if (!delivery || delivery.status === 'delivered') return undefined;
    if (!initialEtaRef.current) initialEtaRef.current = delivery.etaMinutes || 12;
    const timer = setInterval(() => tickDelivery(delivery.id), 3000);
    return () => clearInterval(timer);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [delivery?.id, delivery?.status]);

  const rider = riders.find(r => r.id === delivery?.riderId) || riders[0];

  const initialEta = initialEtaRef.current || delivery?.etaMinutes || 12;
  const progress = delivery
    ? Math.max(0, Math.min(1, 1 - (delivery.etaMinutes || 0) / initialEta))
    : 0;

  const { riderPos, routeLine } = useMemo(() => {
    if (!delivery || !rider?.location) return { riderPos: null, routeLine: [] };
    // Synthetic route from rider start toward the shelter target
    const from = rider.location;
    const to = { lat: from.lat + 0.012, lng: from.lng - 0.008 };
    return {
      riderPos: { lat: lerp(from.lat, to.lat, progress), lng: lerp(from.lng, to.lng, progress) },
      routeLine: [from, { lat: from.lat + 0.006, lng: from.lng - 0.003 }, to],
    };
  }, [delivery, rider, progress]);

  if (!delivery) {
    return (
      <div className="flex-1 flex flex-col overflow-hidden">
        <ScreenHeader title="Active Delivery" />
        <p className="text-[13px] text-muted text-center mt-10">No active delivery.</p>
      </div>
    );
  }

  const setDigit = (idx, value) => {
    const digit = value.replace(/\D/g, '').slice(-1);
    const next = [...otp];
    next[idx] = digit;
    setOtp(next);
    if (digit && idx < 3) refs[idx + 1].current?.focus();
  };

  const onKey = (idx, e) => {
    if (e.key === 'Backspace' && !otp[idx] && idx > 0) refs[idx - 1].current?.focus();
  };

  const steps = [
    { id: 'picked', label: 'Picked Up', done: true },
    { id: 'route', label: 'On Route', done: false, active: delivery.status !== 'delivered' },
    { id: 'delivered', label: 'Delivered', done: delivery.status === 'delivered' },
  ];

  const submit = () => {
    const code = otp.join('');
    if (code.length < 4) {
      addToast('Enter the OTP', 'Ask the shelter for the 4-digit handover OTP.', 'error');
      return;
    }
    if (code !== delivery.otp) {
      addToast('Wrong OTP', `Demo OTP for this handover is ${delivery.otp}.`, 'error');
      return;
    }
    markDelivered(delivery.id);
  };

  return (
    <div className="flex-1 flex flex-col overflow-hidden">
      <ScreenHeader title="Active Delivery" />
      <div className="flex-1 overflow-y-auto px-5 pt-4 pb-8">
        {/* Stepper */}
        <div className="flex items-center">
          {steps.map((s, i) => (
            <React.Fragment key={s.id}>
              <div className="flex flex-col items-center gap-1.5">
                <span
                  className={`w-7 h-7 rounded-full flex items-center justify-center border-2 ${
                    s.done
                      ? 'bg-brand-600 border-brand-600'
                      : s.active
                        ? 'bg-white border-brand-600'
                        : 'bg-white border-line'
                  }`}
                >
                  {s.done ? (
                    <Check className="w-4 h-4 text-white" strokeWidth={3} />
                  ) : s.active ? (
                    <span className="w-2.5 h-2.5 rounded-full bg-brand-600 animate-pulse" />
                  ) : null}
                </span>
                <span className={`text-[10.5px] font-bold ${s.done || s.active ? 'text-ink' : 'text-muted'}`}>
                  {s.label}
                </span>
              </div>
              {i < steps.length - 1 && (
                <span className={`flex-1 h-0.5 -mt-5 mx-1 ${s.done ? 'bg-brand-600' : 'bg-line'}`} />
              )}
            </React.Fragment>
          ))}
        </div>

        {/* Map */}
        <div className="mt-4">
          <ShelterMap
            shelters={[{ id: 'target', location: routeLine[routeLine.length - 1] || rider?.location }]}
            rider={riderPos ? { location: riderPos } : null}
            routeLine={routeLine}
            focus={riderPos}
            height={210}
            zoom={14}
          />
        </div>

        {/* Destination */}
        <div className="fb-card mt-4 flex items-center gap-3 !p-3.5">
          <span className="w-10 h-10 rounded-full bg-blue-50 border border-blue-100 flex items-center justify-center shrink-0">
            <span className="text-[15px]">📍</span>
          </span>
          <div className="flex-1 min-w-0">
            <p className="text-[11.5px] font-bold text-muted">Delivering to</p>
            <p className="text-[13.5px] font-extrabold text-ink truncate">
              {delivery.toName}, {delivery.toArea}
            </p>
            <p className="text-[11.5px] font-bold text-brand-700">
              ETA: {delivery.etaMinutes} min • {delivery.distanceKm} km
            </p>
          </div>
        </div>

        {/* Checklist */}
        <div className="fb-card mt-4 !p-3.5">
          <p className="text-[13px] font-extrabold text-ink mb-2.5">Pickup Checklist</p>
          {[
            { id: 'package', label: 'Proof of package (optional)', icon: Package },
            { id: 'photo', label: 'Proof of delivery (optional)', icon: Camera },
            { id: 'received', label: 'Delivered to receiver', icon: HandHeart },
          ].map(row => {
            const Icon = row.icon;
            const on = checklist[row.id];
            return (
              <button
                key={row.id}
                onClick={() => setChecklist(c => ({ ...c, [row.id]: !c[row.id] }))}
                className="flex items-center gap-2.5 py-1.5 w-full text-left"
              >
                <span
                  className={`w-5 h-5 rounded-md border-2 flex items-center justify-center shrink-0 ${
                    on ? 'bg-brand-600 border-brand-600' : 'bg-white border-line'
                  }`}
                >
                  {on && <Check className="w-3.5 h-3.5 text-white" strokeWidth={3} />}
                </span>
                <Icon className={`w-4 h-4 ${on ? 'text-brand-600' : 'text-muted'}`} />
                <span className={`text-[13px] font-semibold ${on ? 'text-ink' : 'text-muted'}`}>{row.label}</span>
              </button>
            );
          })}
        </div>

        {/* OTP */}
        <div className="fb-card mt-4 !p-3.5">
          <div className="flex items-center justify-between mb-2.5">
            <p className="text-[13px] font-extrabold text-ink">OTP Verification</p>
            <span className="fb-badge bg-brand-50 text-brand-700 border border-brand-100">
              <ShieldCheck className="w-3.5 h-3.5" /> OTP: {delivery.otp}
            </span>
          </div>
          <div className="flex items-center gap-3">
            <div className="flex gap-2 flex-1">
              {otp.map((d, i) => (
                <input
                  key={i}
                  ref={refs[i]}
                  className="fb-field !w-full text-center !text-lg font-extrabold !py-2"
                  type="tel"
                  inputMode="numeric"
                  maxLength={1}
                  value={d}
                  onChange={e => setDigit(i, e.target.value)}
                  onKeyDown={e => onKey(i, e)}
                />
              ))}
            </div>
            <button className="shrink-0 flex items-center gap-1.5 px-3 py-2.5 rounded-xl border border-line bg-white text-[12px] font-bold text-ink">
              <Camera className="w-4 h-4 text-brand-600" /> Attach Photo
            </button>
          </div>
        </div>

        <button className="fb-btn-primary mt-5" onClick={submit} disabled={delivery.status === 'delivered'}>
          {delivery.status === 'delivered' ? 'Delivered ✓' : 'Mark as Delivered'}
        </button>
      </div>
    </div>
  );
}
