import React, { useEffect } from 'react';
import { BrowserRouter, Navigate, Route, Routes, useLocation } from 'react-router-dom';
import { MotionConfig } from 'framer-motion';
import { Toaster } from 'sonner';
import { MarketplaceProvider } from './contexts/MarketplaceContext';
import { PublicLayout } from './components/layout/PublicLayout';
import { WorkspaceLayout } from './components/layout/WorkspaceLayout';
import { RequireRole } from './components/layout/RequireRole';
import { DemoSwitcher } from './components/layout/DemoSwitcher';
import { Home } from './pages/public/Home';
import { Explore } from './pages/public/Explore';
import { Destinations } from './pages/public/Destinations';
import { ExperienceDetail } from './pages/public/ExperienceDetail';
import { ProviderPublicProfile } from './pages/public/ProviderPublicProfile';
import { Login } from './pages/public/Login';
import { NotFound } from './pages/public/NotFound';
import { Checkout } from './pages/traveller/Checkout';
import { MyBookings } from './pages/traveller/MyBookings';
import { MyRequests } from './pages/traveller/MyRequests';
import { NewRequest } from './pages/traveller/NewRequest';
import { RequestDetail } from './pages/traveller/RequestDetail';
import { TravellerProfile } from './pages/traveller/TravellerProfile';
import { Notifications } from './pages/shared/Notifications';
import { ProviderDashboard } from './pages/provider/ProviderDashboard';
import { ProviderExperiences } from './pages/provider/ProviderExperiences';
import { ExperienceEditor } from './pages/provider/ExperienceEditor';
import { ProviderAvailability } from './pages/provider/ProviderAvailability';
import { ProviderBookings } from './pages/provider/ProviderBookings';
import { ProviderRequests } from './pages/provider/ProviderRequests';
import { ProviderReviews } from './pages/provider/ProviderReviews';
import { ProviderProfileSettings } from './pages/provider/ProviderProfileSettings';
import { ProviderVerification } from './pages/provider/ProviderVerification';
import { AdminDashboard } from './pages/admin/AdminDashboard';
import { AdminApplications } from './pages/admin/AdminApplications';
import { AdminProviders } from './pages/admin/AdminProviders';
import { AdminExperiences } from './pages/admin/AdminExperiences';
import { AdminBookings } from './pages/admin/AdminBookings';
import { AdminRequests } from './pages/admin/AdminRequests';
import { AdminReviews } from './pages/admin/AdminReviews';
import { AdminActivity } from './pages/admin/AdminActivity';
import { AdminSettings } from './pages/admin/AdminSettings';

function ScrollToTop() {
  const { pathname } = useLocation();
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);
  return null;
}

const traveller = (el: React.ReactNode) => <RequireRole role="traveller">{el}</RequireRole>;

export function App() {
  return (
    <MarketplaceProvider>
      <MotionConfig reducedMotion="user">
        <BrowserRouter>
          <ScrollToTop />
          <Routes>
            <Route element={<PublicLayout />}>
              <Route path="/" element={<Home />} />
              <Route path="/explore" element={<Explore />} />
              <Route path="/destinations" element={<Destinations />} />
              <Route path="/experiences/:id" element={<ExperienceDetail />} />
              <Route path="/providers/:id" element={<ProviderPublicProfile />} />
              <Route path="/login" element={<Login />} />
              <Route path="/checkout" element={traveller(<Checkout />)} />
              <Route path="/account/bookings" element={traveller(<MyBookings />)} />
              <Route path="/account/requests" element={traveller(<MyRequests />)} />
              <Route path="/account/requests/new" element={traveller(<NewRequest />)} />
              <Route path="/account/requests/:id" element={traveller(<RequestDetail />)} />
              <Route path="/account/profile" element={traveller(<TravellerProfile />)} />
              <Route path="/notifications" element={traveller(<Notifications />)} />
              <Route path="*" element={<NotFound />} />
            </Route>
            <Route path="/provider" element={<RequireRole role="provider"><WorkspaceLayout role="provider" /></RequireRole>}>
              <Route index element={<ProviderDashboard />} />
              <Route path="experiences" element={<ProviderExperiences />} />
              <Route path="experiences/new" element={<ExperienceEditor />} />
              <Route path="experiences/:id/edit" element={<ExperienceEditor />} />
              <Route path="availability" element={<ProviderAvailability />} />
              <Route path="bookings" element={<ProviderBookings />} />
              <Route path="requests" element={<ProviderRequests />} />
              <Route path="reviews" element={<ProviderReviews />} />
              <Route path="profile" element={<ProviderProfileSettings />} />
              <Route path="verification" element={<ProviderVerification />} />
              <Route path="notifications" element={<Notifications />} />
              <Route path="*" element={<Navigate to="/provider" replace />} />
            </Route>
            <Route path="/admin" element={<RequireRole role="admin"><WorkspaceLayout role="admin" /></RequireRole>}>
              <Route index element={<AdminDashboard />} />
              <Route path="applications" element={<AdminApplications />} />
              <Route path="providers" element={<AdminProviders />} />
              <Route path="experiences" element={<AdminExperiences />} />
              <Route path="bookings" element={<AdminBookings />} />
              <Route path="requests" element={<AdminRequests />} />
              <Route path="reviews" element={<AdminReviews />} />
              <Route path="activity" element={<AdminActivity />} />
              <Route path="settings" element={<AdminSettings />} />
              <Route path="notifications" element={<Notifications />} />
              <Route path="*" element={<Navigate to="/admin" replace />} />
            </Route>
          </Routes>
          <DemoSwitcher />
          <Toaster position="top-center" toastOptions={{ style: { fontFamily: 'Inter, sans-serif', borderRadius: '12px', border: '1px solid #E5DDD0' } }} />
        </BrowserRouter>
      </MotionConfig>
    </MarketplaceProvider>);

}