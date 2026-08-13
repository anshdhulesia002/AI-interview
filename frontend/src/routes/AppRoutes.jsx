import { lazy, Suspense } from 'react';
import { Routes, Route } from 'react-router-dom';
import { RootLayout } from '../components/layout/RootLayout';
import { SpinnerOverlay } from '../components/ui/Spinner';
import { OfflineBanner } from '../components/ui/OfflineBanner';
import { ROUTES } from '../utils/constants';

// Code-Split Dynamic Route Imports
const LandingPage = lazy(() => import('../pages/LandingPage'));
const DesignSystemPage = lazy(() => import('../pages/DesignSystemPage'));
const DashboardPage = lazy(() => import('../pages/DashboardPage'));
const ProfilePage = lazy(() => import('../pages/ProfilePage'));
const InterviewCategoryPage = lazy(() => import('../pages/InterviewCategoryPage'));
const InterviewRoomPage = lazy(() => import('../pages/InterviewRoomPage'));
const InterviewReportPage = lazy(() => import('../pages/InterviewReportPage'));
const InterviewHistoryPage = lazy(() => import('../pages/InterviewHistoryPage'));
const AnalyticsPage = lazy(() => import('../pages/AnalyticsPage'));
const AchievementsPage = lazy(() => import('../pages/AchievementsPage'));
const SettingsPage = lazy(() => import('../pages/SettingsPage'));
const AdminDashboardPage = lazy(() => import('../pages/AdminDashboardPage'));
const LoginPage = lazy(() => import('../pages/auth/LoginPage'));
const SignupPage = lazy(() => import('../pages/auth/SignupPage'));
const ForgotPasswordPage = lazy(() => import('../pages/auth/ForgotPasswordPage'));
const ResetPasswordPage = lazy(() => import('../pages/auth/ResetPasswordPage'));
const VerifyEmailPage = lazy(() => import('../pages/auth/VerifyEmailPage'));
const NotFoundPage = lazy(() => import('../pages/error/NotFoundPage'));
const ServerErrorPage = lazy(() => import('../pages/error/ServerErrorPage'));
const UnauthorizedPage = lazy(() => import('../pages/error/UnauthorizedPage'));

export const AppRoutes = () => {
  return (
    <>
      <OfflineBanner />
      <Suspense fallback={<SpinnerOverlay label="Loading module chunk..." />}>
        <Routes>
          {/* Auth Pages (Standalone Layout) */}
          <Route path={ROUTES.LOGIN} element={<LoginPage />} />
          <Route path={ROUTES.REGISTER} element={<SignupPage />} />
          <Route path="/signup" element={<SignupPage />} />
          <Route path="/forgot-password" element={<ForgotPasswordPage />} />
          <Route path="/reset-password" element={<ResetPasswordPage />} />
          <Route path="/verify-email" element={<VerifyEmailPage />} />

          {/* System Error & Resilience Routes */}
          <Route path={ROUTES.NOT_FOUND} element={<NotFoundPage />} />
          <Route path={ROUTES.SERVER_ERROR} element={<ServerErrorPage />} />
          <Route path={ROUTES.UNAUTHORIZED} element={<UnauthorizedPage />} />
          <Route path="/401" element={<UnauthorizedPage />} />
          <Route path="/403" element={<UnauthorizedPage />} />

          {/* Standalone Pages wrapped in App Container */}
          <Route path={ROUTES.DASHBOARD} element={<DashboardPage />} />
          <Route path={ROUTES.PROFILE} element={<ProfilePage />} />
          <Route path={ROUTES.ANALYTICS} element={<AnalyticsPage />} />
          <Route path="/analytics" element={<AnalyticsPage />} />
          <Route path={ROUTES.HISTORY} element={<InterviewHistoryPage />} />
          <Route path="/history" element={<InterviewHistoryPage />} />
          <Route path={ROUTES.ACHIEVEMENTS} element={<AchievementsPage />} />
          <Route path="/achievements" element={<AchievementsPage />} />
          <Route path={ROUTES.SETTINGS} element={<SettingsPage />} />
          <Route path="/settings" element={<SettingsPage />} />
          <Route path={ROUTES.ADMIN} element={<AdminDashboardPage />} />
          <Route path="/admin" element={<AdminDashboardPage />} />
          <Route path={ROUTES.INTERVIEWS} element={<InterviewCategoryPage />} />
          <Route path="/interviews/room" element={<InterviewRoomPage />} />
          <Route path="/interviews/:id/room" element={<InterviewRoomPage />} />
          <Route path="/interviews/report" element={<InterviewReportPage />} />
          <Route path="/interviews/:id/report" element={<InterviewReportPage />} />

          {/* Main Pages wrapped in RootLayout */}
          <Route path={ROUTES.HOME} element={<RootLayout />}>
            <Route index element={<LandingPage />} />
            <Route path="/design-system" element={<DesignSystemPage />} />

            {/* Catch-all Route -> 404 NotFoundPage */}
            <Route path="*" element={<NotFoundPage />} />
          </Route>
        </Routes>
      </Suspense>
    </>
  );
};

export default AppRoutes;
