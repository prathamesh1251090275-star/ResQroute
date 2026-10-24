import React from 'react';
import { useApp } from '../context/AppContext';
import { House, HandHeart, Building2, User, Briefcase, Wallet, ListChecks, HeartHandshake } from 'lucide-react';

function StatusBar() {
  return (
    <div className="h-9 px-5 flex items-center justify-between text-ink text-[12px] font-semibold bg-transparent shrink-0 select-none">
      <span>9:41</span>
      <div className="flex items-center gap-1.5 opacity-80">
        <svg width="17" height="11" viewBox="0 0 17 11" fill="currentColor" aria-hidden>
          <rect x="0" y="7" width="3" height="4" rx="1" />
          <rect x="4.5" y="5" width="3" height="6" rx="1" />
          <rect x="9" y="2.5" width="3" height="8.5" rx="1" />
          <rect x="13.5" y="0" width="3" height="11" rx="1" />
        </svg>
        <svg width="15" height="11" viewBox="0 0 15 11" fill="currentColor" aria-hidden>
          <path d="M7.5 10.5 5 8a3.5 3.5 0 0 1 5 0l-2.5 2.5ZM7.5 1C4.6 1 2 2.1 0 4l1.4 1.4A8.4 8.4 0 0 1 7.5 3c2.1 0 4.1.8 5.6 2.1L14.5 4C12.6 2.1 10.4 1 7.5 1Z" />
        </svg>
        <svg width="24" height="11" viewBox="0 0 24 11" aria-hidden>
          <rect x="0.5" y="0.5" width="20" height="10" rx="3" fill="none" stroke="currentColor" opacity="0.5" />
          <rect x="2" y="2" width="15" height="7" rx="1.6" fill="currentColor" />
          <rect x="22" y="3.5" width="1.6" height="4" rx="0.8" fill="currentColor" opacity="0.5" />
        </svg>
      </div>
    </div>
  );
}

const TAB_SETS = {
  donor: [
    { id: 'home', label: 'Home', icon: House, route: 'donor-home' },
    { id: 'donations', label: 'Donations', icon: HandHeart, route: 'donor-donations' },
    { id: 'shelters', label: 'Shelters', icon: Building2, route: 'shelters' },
    { id: 'profile', label: 'Profile', icon: User, route: 'profile' },
  ],
  shelter: [
    { id: 'home', label: 'Home', icon: House, route: 'shelter-home' },
    { id: 'donations', label: 'Donations', icon: ListChecks, route: 'shelter-donations' },
    { id: 'shelters', label: 'Shelters', icon: Building2, route: 'shelters' },
    { id: 'profile', label: 'Profile', icon: User, route: 'profile' },
  ],
  rider: [
    { id: 'home', label: 'Home', icon: House, route: 'rider-home' },
    { id: 'jobs', label: 'Jobs', icon: Briefcase, route: 'rider-jobs' },
    { id: 'earnings', label: 'Earnings', icon: Wallet, route: 'rider-earnings' },
    { id: 'profile', label: 'Profile', icon: User, route: 'profile' },
  ],
};

function BottomTabs({ role, routeName }) {
  const { navigate } = useApp();
  const tabs = TAB_SETS[role];
  if (!tabs) return null;

  const active = tabs.find(t => t.route === routeName);

  return (
    <nav className="shrink-0 bg-white border-t border-line px-2 pt-2 pb-5 flex items-stretch">
      {tabs.map(tab => {
        const Icon = tab.icon;
        const isActive = active?.id === tab.id;
        return (
          <button
            key={tab.id}
            onClick={() => navigate(tab.route)}
            className="flex-1 flex flex-col items-center gap-1 py-1 transition"
          >
            <Icon
              className={`w-[22px] h-[22px] ${isActive ? 'text-brand-600' : 'text-slate-400'}`}
              strokeWidth={isActive ? 2.4 : 1.8}
            />
            <span
              className={`text-[10px] font-bold ${isActive ? 'text-brand-700' : 'text-slate-400'}`}
            >
              {tab.label}
            </span>
          </button>
        );
      })}
    </nav>
  );
}

/**
 * Phone-width shell. Renders the iOS status bar, scrollable screen body and,
 * once signed in, the role's bottom tab bar exactly like the mockup.
 */
export default function AppShell({ children, hideTabs = false }) {
  const { route, role } = useApp();
  const showTabs = !hideTabs && role;

  return (
    <div className="min-h-screen bg-[#E9EFE4] flex justify-center">
      <div className="w-full max-w-[430px] min-h-screen bg-canvas flex flex-col relative shadow-[0_0_60px_rgba(21,60,36,0.12)]">
        <StatusBar />
        <div className={`flex-1 flex flex-col ${showTabs ? '' : 'pb-6'}`}>{children}</div>
        {showTabs && <BottomTabs role={role} routeName={route.name} />}
      </div>
    </div>
  );
}
