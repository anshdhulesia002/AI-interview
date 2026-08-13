import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircle2, AlertCircle, Info, X } from 'lucide-react';
import { VisuallyHidden } from './VisuallyHidden';

export const Toast = ({ isVisible, message, title = 'Notification', type = 'info', onClose }) => {
  if (!isVisible) return null;

  const typeStyles = {
    success: 'bg-emerald-950/90 border-emerald-500/40 text-emerald-300 shadow-emerald-500/10',
    error: 'bg-red-950/90 border-red-500/40 text-red-300 shadow-red-500/10',
    warning: 'bg-amber-950/90 border-amber-500/40 text-amber-300 shadow-amber-500/10',
    info: 'bg-sky-950/90 border-sky-500/40 text-sky-300 shadow-sky-500/10',
  };

  const icons = {
    success: <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />,
    error: <AlertCircle className="w-5 h-5 text-red-400 shrink-0" />,
    warning: <AlertCircle className="w-5 h-5 text-amber-400 shrink-0" />,
    info: <Info className="w-5 h-5 text-sky-400 shrink-0" />,
  };

  return (
    <AnimatePresence>
      <motion.div
        role="status"
        aria-live="polite"
        aria-atomic="true"
        initial={{ opacity: 0, y: 20, scale: 0.95 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, y: 20, scale: 0.95 }}
        className={`fixed bottom-6 right-6 z-50 p-4 max-w-sm w-full rounded-2xl border backdrop-blur-xl shadow-2xl flex items-start justify-between gap-3 ${
          typeStyles[type] || typeStyles.info
        }`}
      >
        <div className="flex items-start gap-3">
          {icons[type] || icons.info}
          <div className="space-y-0.5">
            <h5 className="text-xs font-bold text-content-primary">{title}</h5>
            <p className="text-xs leading-relaxed text-content-secondary">{message}</p>
          </div>
        </div>

        <button
          type="button"
          onClick={onClose}
          aria-label="Dismiss notification"
          className="text-content-muted hover:text-content-primary p-0.5 rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-sky-500"
        >
          <X className="w-4 h-4" />
          <VisuallyHidden>Dismiss notification</VisuallyHidden>
        </button>
      </motion.div>
    </AnimatePresence>
  );
};
