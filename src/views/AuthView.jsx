import React, { useState } from 'react';
import { ArrowLeft, ShieldCheck, Loader2 } from 'lucide-react';
import { useApp } from '../context/AppContext';
import FoodBridgeLogo from '../components/FoodBridgeLogo';

/**
 * Screen 2a — Login / Sign Up: enter mobile number, then request an OTP.
 */
export default function AuthView() {
  const { goBack, sendOtp, addToast } = useApp();
  const [phone, setPhone] = useState('');
  const [sending, setSending] = useState(false);

  const digits = phone.replace(/\D/g, '');
  const valid = digits.length === 10;
  const formatted = digits.replace(/(\d{5})(\d{0,5})/, (_, a, b) => (b ? `${a} ${b}` : a));

  const submit = () => {
    if (!valid || sending) return;
    setSending(true);
    setTimeout(() => {
      sendOtp(formatted);
      setSending(false);
    }, 600);
  };

  return (
    <div className="flex-1 flex flex-col px-6 pb-8 relative overflow-hidden">
      <div className="flex items-center h-12 shrink-0">
        <button onClick={goBack} aria-label="Go back" className="p-2 -ml-2 rounded-full hover:bg-white transition">
          <ArrowLeft className="w-5 h-5 text-ink" />
        </button>
      </div>

      <div className="flex flex-col items-center mt-4">
        <FoodBridgeLogo size="md" />
      </div>

      <div className="flex-1 flex flex-col mt-8">
        <h1 className="text-[26px] font-extrabold text-ink text-center font-display">Welcome Back</h1>
        <p className="text-[13.5px] text-muted text-center mt-2">
          Enter your mobile number to continue
        </p>

        <div className="flex items-stretch gap-2 mt-7">
          <div className="fb-field !w-[86px] flex items-center justify-center gap-1 font-bold text-ink !py-3.5">
            +91
            <span className="text-[9px] text-slate-400">▼</span>
          </div>
          <input
            className="fb-field flex-1 !text-lg tracking-widest font-semibold !py-3.5"
            type="tel"
            inputMode="numeric"
            placeholder="98765 43210"
            maxLength={11}
            value={formatted}
            onChange={e => setPhone(e.target.value.replace(/\D/g, '').slice(0, 10))}
            onKeyDown={e => e.key === 'Enter' && submit()}
          />
        </div>

        <button className="fb-btn-primary mt-6" onClick={submit} disabled={!valid || sending}>
          {sending ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Send OTP'}
        </button>

        <div className="flex items-center gap-3 my-6">
          <span className="h-px flex-1 bg-line" />
          <span className="text-[12px] text-muted font-semibold">or</span>
          <span className="h-px flex-1 bg-line" />
        </div>

        <button
          className="fb-btn-outline"
          onClick={() => {
            addToast('Choose your role', 'Pick Donor, Shelter or Rider on the previous screen first.', 'info');
            goBack();
          }}
        >
          Create New Account
        </button>

        <div className="mt-auto flex items-center justify-center gap-2 pt-8">
          <ShieldCheck className="w-4 h-4 text-brand-600" />
          <p className="text-[12px] text-muted font-medium">Your information is safe and secure with us.</p>
        </div>
      </div>
    </div>
  );
}
