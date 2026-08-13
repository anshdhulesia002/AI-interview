import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { WifiOff, RefreshCw } from 'lucide-react';

export const OfflineBanner = () => {
  const [isOffline, setIsOffline] = useState(!navigator.onLine);

  useEffect(() => {
    const handleOnline = () => setIsOffline(false);
    const handleOffline = () => setIsOffline(true);

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  if (!isOffline) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, y: -50 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -50 }}
        className="fixed top-0 inset-x-0 z-50 p-3 bg-red-600/90 backdrop-blur-md text-white shadow-xl flex items-center justify-between gap-4 text-xs font-semibold"
      >
        <div className="flex items-center gap-2 max-w-4xl mx-auto w-full justify-between">
          <div className="flex items-center gap-2">
            <WifiOff className="w-4 h-4 shrink-0 animate-pulse" />
            <span>
              <strong>Network Connection Lost:</strong> You are currently offline. Live AI interview question responses will resume once internet is restored.
            </span>
          </div>

          <button
            type="button"
            onClick={() => window.location.reload()}
            className="px-3 py-1 bg-white/20 hover:bg-white/30 rounded-lg text-[11px] font-bold flex items-center gap-1 shrink-0 transition-colors"
          >
            <RefreshCw className="w-3 h-3" /> Retry Connection
          </button>
        </div>
      </motion.div>
    </AnimatePresence>
  );
};

export default OfflineBanner;
