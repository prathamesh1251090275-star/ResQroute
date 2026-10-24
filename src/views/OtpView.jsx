import React, { useEffect, useRef, useState } from 'react';
import { ArrowLeft, Smartphone } from 'lucide-react';
import { useApp } from '../context/AppContext';
import FoodBridgeLogo from '../components/FoodBridgeLogo';

/**
 * Screen 2b — Verify the 4-digit OTP (demo: the code is shown in a toast and hint).
 */
export default function OtpView() {
  const { goBack, verifyOtp, sendOtp, pendingPhone, otpSent } = useApp();
  const [otp, setOtp] = useState(['', '', '', '']);
  const [verifying, setVerifying] = useState(false);
  const [error, setError] = useState('');
  const [countdown, setCountdown] = useState(30);
  const refs = [useRef(), useRef(), useRef(), useRef()];

  useEffect(() => {
    refs[0].current?.focus();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (countdown <= 0) return undefined;
    const t = setTimeout(() => setCountdown(c => c - 1), 1000);
    return () => clearTimeout(t);
  }, [countdown]);

  const setDigit = (idx, value) => {
    const digit = value.replace(/\D/g, '').slice(-1);
    const next = [...otp];
    next[idx] = digit;
    setOtp(next);
    setError('');
    if (digit && idx < 3) refs[idx + 1].current?.focus();
  };

  const onKey = (idx, e) => {
    if (e.key === 'Backspace' && !otp[idx] && idx > 0) refs[idx - 1].current?.focus();
  };

  const onPaste = e => {
    const text = (e.clipboardData.getData('text') || '').replace(/\D/g, '').slice(0, 4);
    if (!text) return;
    e.preventDefault();
    const next = ['', '', '', ''];
    text.split('').forEach((d, i) => { next[i] = d; });
    setOtp(next);
    refs[Math.min(text.length, 3)].current?.focus();
  };

  const verify = () => {
    const code = otp.join('');
    if (code.length < 4 || verifying) return;
    setVerifying(true);
    setTimeout(() => {
      const ok = verifyOtp(code);
      if (!ok) {
        setError('Invalid OTP. Use the 4-digit demo code shown above.');
        setVerifying(false);
        setOtp(['', '', '', '']);
        refs[0].current?.focus();
      }
    }, 500);
  };

  const resend = () => {
    if (countdown > 0) return;
    sendOtp(pendingPhone);
    setCountdown(30);
    setOtp(['', '', '', '']);
    refs[0].current?.focus();
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
        <h1 className="text-[26px] font-extrabold text-ink text-center font-display">Verify your number</h1>
        <p className="text-[13.5px] text-muted text-center mt-2">
          Enter the 4-digit code sent to
          <br />
          <span className="font-bold text-ink">+91 {pendingPhone}</span>
        </p>

        <div className="flex justify-center gap-3 mt-8" onPaste={onPaste}>
          {otp.map((d, i) => (
            <input
              key={i}
              ref={refs[i]}
              className="fb-field !w-[58px] !h-[60px] text-center !text-2xl font-extrabold !py-0"
              type="tel"
              inputMode="numeric"
              maxLength={1}
              value={d}
              onChange={e => setDigit(i, e.target.value)}
              onKeyDown={e => onKey(i, e)}
            />
          ))}
        </div>

        {error ? <p className="text-[12px] text-red-500 font-semibold text-center mt-4">{error}</p> : null}

        {otpSent ? (
          <div className="flex justify-center mt-4">
            <span className="inline-flex items-center gap-1.5 text-[11.5px] font-bold text-brand-700 bg-brand-50 border border-brand-100 rounded-full px-3 py-1.5">
              <Smartphone className="w-3.5 h-3.5" />
              Demo OTP: {otpSent}
            </span>
          </div>
        ) : null}

        <button className="fb-btn-primary mt-6" onClick={verify} disabled={otp.join('').length < 4 || verifying}>
          {verifying ? 'Verifying…' : 'Verify & Continue'}
        </button>

        <button className="btn-ghost mt-3" disabled={countdown > 0} onClick={resend}>
          {countdown > 0 ? `Resend OTP in ${countdown}s` : 'Resend OTP'}
        </button>
      </div>
    </div>
  );
}
