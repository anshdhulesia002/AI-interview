import { Outlet, useLocation } from 'react-router-dom';
import { Navbar } from './Navbar';
import { Footer } from './Footer';
import { OfflineBanner } from '../ui/OfflineBanner';
import { ROUTES } from '../../utils/constants';

export const RootLayout = () => {
  const location = useLocation();
  const isLandingPage = location.pathname === ROUTES.HOME;

  return (
    <div className="flex flex-col min-h-screen bg-surface-base text-content-primary">
      {/* Skip to Main Content Link for Keyboard Navigation */}
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 focus:z-50 focus:px-4 focus:py-2 focus:bg-sky-500 focus:text-white focus:font-bold focus:rounded-xl focus:shadow-2xl focus:outline-none focus:ring-2 focus:ring-sky-400 transition-all"
      >
        Skip to main content
      </a>

      <OfflineBanner />
      <Navbar />

      <main id="main-content" tabIndex="-1" className="flex-1 focus:outline-none">
        <Outlet />
      </main>

      {!isLandingPage && <Footer />}
    </div>
  );
};
