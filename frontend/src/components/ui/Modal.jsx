import { useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X } from 'lucide-react';
import { cn } from '../../utils/cn';

export const Modal = ({
  isOpen,
  onClose,
  title,
  description,
  children,
  footer,
  maxWidth = 'max-w-lg',
}) => {
  const modalRef = useRef(null);

  // Esc key & light-dismiss click outside handling
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    if (isOpen) {
      document.body.style.overflow = 'hidden';
      window.addEventListener('keydown', handleKeyDown);
    }
    return () => {
      document.body.style.overflow = 'unset';
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen, onClose]);

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          {/* Backdrop Blur Overlay */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm"
          />

          {/* Modal Container */}
          <motion.div
            ref={modalRef}
            initial={{ opacity: 0, scale: 0.95, y: 16 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 16 }}
            transition={{ type: 'spring', duration: 0.3, bounce: 0.1 }}
            className={cn(
              'relative z-10 w-full rounded-2xl bg-surface-card border border-border-default shadow-2xl p-6 overflow-hidden flex flex-col max-h-[90vh]',
              maxWidth
            )}
          >
            {/* Header */}
            <div className="flex items-start justify-between pb-4 border-b border-border-subtle">
              <div>
                {title && <h3 className="text-lg font-bold text-content-primary tracking-tight">{title}</h3>}
                {description && <p className="text-xs text-content-secondary mt-1">{description}</p>}
              </div>
              <button
                type="button"
                onClick={onClose}
                className="p-1 rounded-lg text-content-muted hover:text-content-primary hover:bg-surface-hover transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Content Body */}
            <div className="py-4 overflow-y-auto text-content-primary flex-1">{children}</div>

            {/* Sticky Action Footer */}
            {footer && (
              <div className="pt-4 border-t border-border-subtle flex items-center justify-end gap-3">
                {footer}
              </div>
            )}
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};
