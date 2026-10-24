import React, { useState } from 'react';
import { ChevronRight, UserRound, House, Bike, ShieldCheck } from 'lucide-react';
import { useApp } from '../context/AppContext';
import FoodBridgeLogo from '../components/FoodBridgeLogo';

const ROLES = [
  {
    id: 'donor',
    title: 'I am a Donor',
    desc: 'Donate surplus food',
    icon: UserRound,
    card: 'bg-[#E9F6EE] border-[#CBE9D7]',
    iconBg: 'bg-brand-600',
    text: 'text-brand-800',
  },
  {
    id: 'shelter',
    title: 'I am a Shelter',
    desc: 'Receive food donations',
    icon: House,
    card: 'bg-[#FFF3E7] border-[#FBDCC0]',
    iconBg: 'bg-orange-500',
    text: 'text-orange-700',
  },
  {
    id: 'rider',
    title: 'I am a Rider',
    desc: 'Deliver food & earn',
    icon: Bike,
    card: 'bg-[#E9F1FE] border-[#CFE0FA]',
    iconBg: 'bg-blue-600',
    text: 'text-blue-700',
  },
];

function Leaf({ className, rotate = 0 }) {
  return (
    <div
      className={`absolute w-24 h-14 bg-brand-200/50 rounded-[100%_0_100%_0] ${className}`}
      style={{ transform: `rotate(${rotate}deg)` }}
      aria-hidden
    />
  );
}

export default function WelcomeView() {
  const { selectRole } = useApp();
  const [selected, setSelected] = useState('donor');

  const go = mode => {
    selectRole(selected, { mode });
  };

  return (
    <div className="flex-1 flex flex-col px-6 pt-4 pb-8 relative overflow-hidden">
      <Leaf className="-left-10 top-24 opacity-70" rotate={-20} />
      <Leaf className="-right-12 top-56 opacity-60" rotate={140} />
      <Leaf className="-left-8 bottom-24 opacity-60" rotate={30} />
      <Leaf className="-right-10 bottom-40 opacity-70" rotate={200} />

      <div className="flex flex-col items-center text-center pt-6 relative z-10">
        <FoodBridgeLogo size="lg" />
        <p className="text-[11px] font-bold text-brand-600 mt-3 tracking-wide">
          Save Food • Feed People • Build a Kinder Tomorrow
        </p>

        <h1 className="text-[34px] leading-[1.05] font-extrabold text-ink mt-7 font-display">
          Good Food.
          <br />
          <span className="text-brand-700">Greater Impact.</span>
        </h1>
        <p className="text-[14px] text-muted mt-3 max-w-[300px] leading-relaxed">
          Connects donors, shelters and riders to reduce food waste and fight hunger.
        </p>
      </div>

      <div className="space-y-3 mt-8 relative z-10">
        {ROLES.map(role => {
          const Icon = role.icon;
          const isActive = selected === role.id;
          return (
            <button
              key={role.id}
              onClick={() => setSelected(role.id)}
              className={`w-full flex items-center gap-3 p-3.5 rounded-2xl border-2 text-left transition ${role.card} ${
                isActive ? 'ring-2 ring-offset-2 ring-brand-400/70' : 'ring-0'
              }`}
            >
              <span className={`w-10 h-10 rounded-xl ${role.iconBg} flex items-center justify-center shadow-sm`}>
                <Icon className="w-5 h-5 text-white" strokeWidth={2.2} />
              </span>
              <span className="flex-1 min-w-0">
                <span className={`block text-[15px] font-extrabold ${role.text}`}>{role.title}</span>
                <span className="block text-[12px] text-muted font-medium">{role.desc}</span>
              </span>
              <ChevronRight className={`w-5 h-5 ${isActive ? role.text : 'text-slate-400'}`} />
            </button>
          );
        })}
      </div>

      <div className="mt-auto pt-8 space-y-3 relative z-10">
        <button className="fb-btn-primary" onClick={() => go('signin')}>
          Sign In
        </button>
        <button className="fb-btn-outline" onClick={() => go('create')}>
          Create Account
        </button>
        <p className="flex items-center justify-center gap-1.5 text-[11px] text-muted font-medium pt-1">
          <ShieldCheck className="w-3.5 h-3.5 text-brand-600" />
          Your food data is safe and secure with us.
        </p>
      </div>
    </div>
  );
}
