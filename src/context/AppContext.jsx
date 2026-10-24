import React, { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import {
  INITIAL_DELIVERIES,
  INITIAL_DONATIONS,
  INITIAL_RIDERS,
  INITIAL_SHELTERS,
  INITIAL_USER,
} from '../data/initialData';
import { assessFreshness } from '../engines/freshnessEngine';

const AppContext = createContext();

const STORAGE_KEY = 'foodbridge_state_v1';

const ROLE_HOME = {
  donor: 'donor-home',
  shelter: 'shelter-home',
  rider: 'rider-home',
};

const ROLE_PROFILE = {
  donor: { name: 'Prathamesh', title: 'Donor', emoji: '🧑🏻' },
  shelter: { name: 'Shree Krishna Caterers', title: 'Shelter Partner', emoji: '🏢' },
  rider: { name: 'Rohit S.', title: 'Delivery Rider', emoji: '🧑🏻' },
};

function loadState() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

function makeId(prefix) {
  return `${prefix}-${Date.now().toString().slice(-6)}`;
}

const randomOtp = () => String(Math.floor(1000 + Math.random() * 9000));

export function AppProvider({ children }) {
  const saved = useMemo(loadState, []);

  const [route, setRoute] = useState(saved?.route || { name: 'welcome', params: {} });
  const [stack, setStack] = useState(saved?.stack || []);
  const [role, setRole] = useState(saved?.role || null);
  const [user, setUser] = useState(saved?.user || null);
  const [pendingPhone, setPendingPhone] = useState('98765 43210');
  const [otpSent, setOtpSent] = useState(null);

  const [shelters, setShelters] = useState(saved?.shelters || INITIAL_SHELTERS);
  const [riders, setRiders] = useState(saved?.riders || INITIAL_RIDERS);
  const [donations, setDonations] = useState(saved?.donations || INITIAL_DONATIONS);
  const [deliveries, setDeliveries] = useState(saved?.deliveries || INITIAL_DELIVERIES);
  const [toasts, setToasts] = useState([]);

  /* ---------------------------------------------------------------- persist */
  useEffect(() => {
    try {
      localStorage.setItem(
        STORAGE_KEY,
        JSON.stringify({ route, stack, role, user, shelters, riders, donations, deliveries })
      );
    } catch {
      /* storage full / private mode — demo still works in memory */
    }
  }, [route, stack, role, user, shelters, riders, donations, deliveries]);

  /* ------------------------------------------------------------------ toasts */
  const removeToast = useCallback(id => {
    setToasts(prev => prev.filter(t => t.id !== id));
  }, []);

  const addToast = useCallback(
    (title, message, type = 'info') => {
      const id = makeId('toast');
      setToasts(prev => [...prev, { id, title, message, type }]);
      setTimeout(() => removeToast(id), 3800);
    },
    [removeToast]
  );

  /* --------------------------------------------------------------- navigation */
  const navigate = useCallback((name, params = {}, options = {}) => {
    setRoute(prev => {
      if (!options.replace) setStack(s => [...s, prev]);
      return { name, params };
    });
  }, []);

  const goBack = useCallback(() => {
    setStack(prev => {
      if (!prev.length) {
        setRoute(r => ({ name: ROLE_HOME[role] || 'welcome', params: {} }));
        return prev;
      }
      const next = prev.slice(0, -1);
        setRoute(prev[prev.length - 1]);
      return next;
    });
  }, [role]);

  const goHome = useCallback(() => {
    setStack([]);
    setRoute({ name: ROLE_HOME[role] || 'welcome', params: {} });
  }, [role]);

  /* --------------------------------------------------------------------- auth */
  const selectRole = nextRole => {
    setRole(nextRole);
    navigate('auth', { mode: 'signin' });
  };

  const sendOtp = phone => {
    const clean = (phone || '').replace(/\D/g, '');
    if (clean.length < 10) {
      addToast('Check your number', 'Enter a valid 10-digit mobile number.', 'error');
      return false;
    }
    const code = randomOtp();
    setPendingPhone(phone);
    setOtpSent(code);
    addToast('OTP sent', `Demo OTP is ${code} — enter it to continue.`, 'success');
    navigate('otp', {}, { replace: true });
    return true;
  };

  const verifyOtp = code => {
    if (!code || code.length < 4) {
      addToast('Invalid OTP', 'Enter the 4-digit code to continue.', 'error');
      return false;
    }
    const profile = ROLE_PROFILE[role] || ROLE_PROFILE.donor;
    setUser({ ...profile, phone: pendingPhone });
    setOtpSent(null);
    setStack([]);
    setRoute({ name: ROLE_HOME[role], params: {} });
    addToast(`Welcome, ${profile.name.split(' ')[0]}`, 'You are signed in to FoodBridge.', 'success');
    return true;
  };

  const signOut = () => {
    setUser(null);
    setOtpSent(null);
    setStack([]);
    setRoute({ name: 'welcome', params: {} });
  };

  /* ------------------------------------------------------------- donor flows */
  const confirmAssessment = draft => {
    const fresh = assessFreshness({
      prepTimeHours: draft.prepTimeHours,
      storage: draft.storage,
      hasPhotos: (draft.photos || []).length > 0,
    });

    const donation = {
      ...draft,
      id: makeId('don'),
      donorName: user?.name || 'Prathamesh',
      donorId: 'me',
      freshnessScore: fresh.score,
      qualityLabel: fresh.label,
      safeWindow: fresh.safeWindow,
      safeWindowNote: fresh.safeWindowNote,
      checklist: fresh.checklist.map(c => c.label),
      status: 'listed',
      targetShelterId: null,
      createdAt: Date.now(),
    };

    setDonations(prev => [donation, ...prev]);
    addToast('Assessment confirmed', `${donation.itemName} is now listed for pickup.`, 'success');
    navigate('shelters', { selectFor: donation.id });
    return donation;
  };

  const selectShelterFor = (donationId, shelterId) => {
    setDonations(prev =>
      prev.map(d => (d.id === donationId ? { ...d, targetShelterId: shelterId } : d))
    );
    navigate('book-rider', { donationId });
  };

  const createDelivery = (donationId, riderId, { toRiderTerminal = false } = {}) => {
    const donation = donations.find(d => d.id === donationId);
    const rider = riders.find(r => r.id === riderId);
    if (!donation || !rider) return null;
    if (deliveries.some(d => d.donationId === donationId && d.status !== 'delivered')) {
      addToast('Already booked', 'A rider is already handling this donation.', 'info');
      return null;
    }

    const shelter = shelters.find(s => s.id === donation.targetShelterId) || shelters[0];
    const delivery = {
      id: makeId('del'),
      donationId,
      riderId: rider.id,
      riderName: rider.name,
      fromName: donation.pickupAddress?.split(',')[0] || donation.donorName,
      toName: shelter.name,
      toArea: shelter.area,
      foodLabel: donation.category,
      quantity: donation.quantity,
      unit: donation.unit,
      status: 'en_route',
      distanceKm: shelter.distanceKm,
      etaMinutes: rider.etaMinutes,
      proof: donation.photos || [],
      receivedBy: 'Mrs. Patil (Shelter Manager)',
      otp: randomOtp(),
      startedAt: Date.now(),
      deliveredAt: null,
    };

    setDeliveries(prev => [delivery, ...prev]);
    setRiders(prev =>
      prev.map(r =>
        r.id === rider.id ? { ...r, status: 'busy', activeDeliveryId: delivery.id } : r
      )
    );
    setDonations(prev =>
      prev.map(d => (d.id === donationId ? { ...d, status: 'assigned' } : d))
    );

    addToast('Rider booked', `${rider.name} is heading to the pickup point.`, 'success');

    if (toRiderTerminal) {
      setStack([]);
      setRoute({ name: 'rider-delivery', params: { deliveryId: delivery.id } });
    } else {
      navigate('book-rider', { donationId, deliveryId: delivery.id, tracking: true }, { replace: true });
    }
    return delivery;
  };

  const tickDelivery = deliveryId => {
    let finished = false;
    setDeliveries(prev =>
      prev.map(d => {
        if (d.id !== deliveryId) return d;
        const eta = Math.max(0, (d.etaMinutes || 0) - 3);
        if (eta === 0 && d.status !== 'delivered') finished = true;
        return { ...d, etaMinutes: eta };
      })
    );
    if (finished) completeDelivery(deliveryId);
  };

  const completeDelivery = (deliveryId, { arrivalStatus = 'arrived' } = {}) => {
    const delivery = deliveries.find(d => d.id === deliveryId);
    if (!delivery || delivery.status === 'delivered') return null;

    const finished = {
      ...delivery,
      status: 'delivered',
      etaMinutes: 0,
      deliveredAt: Date.now(),
    };

    setDeliveries(prev => prev.map(d => (d.id === deliveryId ? finished : d)));
    setDonations(prev =>
      prev.map(d => (d.id === delivery.donationId ? { ...d, status: arrivalStatus } : d))
    );
    setRiders(prev =>
      prev.map(r =>
        r.id === delivery.riderId
          ? {
              ...r,
              status: 'available',
              activeDeliveryId: null,
              totalDeliveries: (r.totalDeliveries || 0) + 1,
              todayEarnings: (r.todayEarnings || 0) + 40,
              trips: (r.trips || 0) + 1,
            }
          : r
      )
    );

    return finished;
  };

  /* ------------------------------------------------------------- rider flows */
  const acceptJob = (donationId, riderId) => createDelivery(donationId, riderId, { toRiderTerminal: true });

  const markDelivered = deliveryId => {
    const finished = completeDelivery(deliveryId);
    if (!finished) return;
    setStack([]);
    setRoute({ name: 'rider-home', params: { tab: 'deliveries' } });
    addToast('Delivered 🎉', 'Proof submitted. Shelter notified for intake.', 'success');
  };

  const toggleRiderOnline = riderId => {
    setRiders(prev =>
      prev.map(r =>
        r.id === riderId ? { ...r, online: !r.online, status: r.online ? 'offline' : 'available' } : r
      )
    );
  };

  /* ------------------------------------------------------------ shelter flows */
  const acceptDonation = donationId => {
    setDonations(prev =>
      prev.map(d => (d.id === donationId && d.status !== 'delivered' ? { ...d, status: 'arrived' } : d))
    );
    navigate('shelter-donation', { donationId });
  };

  const rejectDonation = donationId => {
    setDonations(prev => prev.map(d => (d.id === donationId ? { ...d, status: 'rejected' } : d)));
    addToast('Donation declined', 'The donor has been notified.', 'warning');
  };

  const confirmReceived = donationId => {
    const donation = donations.find(d => d.id === donationId);
    if (!donation) return;

    setDonations(prev =>
      prev.map(d => (d.id === donationId ? { ...d, status: 'delivered' } : d))
    );
    setShelters(prev =>
      prev.map(s => {
        if (s.id !== (donation.targetShelterId || s.id)) return s;
        const capacity = s.capacity || 100;
        const occupancy = Math.min(capacity, (s.currentOccupancy || 0) + donation.quantity);
        return {
          ...s,
          currentOccupancy: occupancy,
          capacityPct: Math.round((occupancy / capacity) * 100),
          totalReceivedKg: (s.totalReceivedKg || 0) + donation.quantity,
          openDemand: Math.max(0, (s.openDemand || 0) - donation.quantity),
          urgentNeeds: Math.max(0, (s.urgentNeeds || 0) - 1),
          stockStatus: s.openDemand - donation.quantity <= 0 ? 'stocked' : s.stockStatus,
        };
      })
    );
    addToast('Inventory updated', `${donation.quantity} ${donation.unit} added to shelter stock.`, 'success');
    goHome();
  };

  /* ------------------------------------------------------------------- misc */
  const resetDemo = () => {
    localStorage.removeItem(STORAGE_KEY);
    setShelters(INITIAL_SHELTERS);
    setRiders(INITIAL_RIDERS);
    setDonations(INITIAL_DONATIONS);
    setDeliveries(INITIAL_DELIVERIES);
    setUser(null);
    setRole(null);
    setStack([]);
    setRoute({ name: 'welcome', params: {} });
    addToast('Demo reset', 'FoodBridge is back to its starting state.', 'info');
  };

  const value = useMemo(
    () => ({
      // navigation
      route,
      stack,
      navigate,
      goBack,
      goHome,
      // auth
      role,
      user,
      pendingPhone,
      otpSent,
      selectRole,
      sendOtp,
      verifyOtp,
      signOut,
      // data
      shelters,
      setShelters,
      riders,
      setRiders,
      donations,
      setDonations,
      deliveries,
      setDeliveries,
      // donor
      confirmAssessment,
      selectShelterFor,
      createDelivery,
      // rider
      acceptJob,
      markDelivered,
      toggleRiderOnline,
      tickDelivery,
      // shelter
      acceptDonation,
      rejectDonation,
      confirmReceived,
      // misc
      assessFreshness,
      resetDemo,
      toasts,
      addToast,
      removeToast,
    }),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [route, stack, role, user, pendingPhone, otpSent, shelters, riders, donations, deliveries, toasts]
  );

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
}

export function useApp() {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
}
