import React from 'react';
import { AppProvider, useApp } from './context/AppContext';
import AppShell from './components/AppShell';
import ToastContainer from './components/ToastContainer';

import WelcomeView from './views/WelcomeView';
import AuthView from './views/AuthView';
import OtpView from './views/OtpView';
import DonorHomeView from './views/DonorHomeView';
import DonorDonationsView from './views/DonorDonationsView';
import AddDonationView from './views/AddDonationView';
import AssessmentView from './views/AssessmentView';
import SheltersView from './views/SheltersView';
import BookRiderView from './views/BookRiderView';
import DeliveryCompletedView from './views/DeliveryCompletedView';
import ShelterHomeView from './views/ShelterHomeView';
import ShelterDonationsListView from './views/ShelterDonationsListView';
import ShelterDonationView from './views/ShelterDonationView';
import RiderHomeView from './views/RiderHomeView';
import RiderJobsView from './views/RiderJobsView';
import RiderEarningsView from './views/RiderEarningsView';
import RiderDeliveryView from './views/RiderDeliveryView';
import ProfileView from './views/ProfileView';

const SCREENS = {
  welcome: WelcomeView,
  auth: AuthView,
  otp: OtpView,
  'donor-home': DonorHomeView,
  'donor-donations': DonorDonationsView,
  'add-donation': AddDonationView,
  assessment: AssessmentView,
  shelters: SheltersView,
  'book-rider': BookRiderView,
  'delivery-completed': DeliveryCompletedView,
  'shelter-home': ShelterHomeView,
  'shelter-donations': ShelterDonationsListView,
  'shelter-donation': ShelterDonationView,
  'rider-home': RiderHomeView,
  'rider-jobs': RiderJobsView,
  'rider-earnings': RiderEarningsView,
  'rider-delivery': RiderDeliveryView,
  profile: ProfileView,
};

/** Keeps one broken screen from blanking the whole app. */
class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { error: null };
  }

  static getDerivedStateFromError(error) {
    return { error };
  }

  componentDidCatch(error) {
    // eslint-disable-next-line no-console
    console.error('FoodBridge screen error:', error);
  }

  render() {
    if (this.state.error) {
      return (
        <div className="flex-1 flex flex-col items-center justify-center px-8 text-center">
          <span className="text-4xl">🧺</span>
          <p className="text-[15px] font-extrabold text-ink mt-3">This screen hit a snag</p>
          <p className="text-[12.5px] text-muted mt-1">{String(this.state.error.message || this.state.error)}</p>
          <button
            className="fb-btn-primary !w-auto px-6 mt-5"
            onClick={() => this.setState({ error: null })}
          >
            Try again
          </button>
        </div>
      );
    }
    return this.props.children;
  }
}

function Screen() {
  const { route } = useApp();
  const View = SCREENS[route.name] || WelcomeView;
  return (
    <ErrorBoundary key={route.name}>
      <View params={route.params} />
    </ErrorBoundary>
  );
}

function FoodBridgeApp() {
  return (
    <AppShell>
      <Screen />
      <ToastContainer />
    </AppShell>
  );
}

export default function App() {
  return (
    <AppProvider>
      <FoodBridgeApp />
    </AppProvider>
  );
}
