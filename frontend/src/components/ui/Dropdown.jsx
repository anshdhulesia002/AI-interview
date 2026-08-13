import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown } from 'lucide-react';
import { cn } from '../../utils/cn';

export const Dropdown = ({
  trigger,
  children,
  align = 'left',
  className,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);

  // Light dismiss backdrop click handler
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const alignStyles = {
    left: 'left-0 origin-top-left',
    right: 'right-0 origin-top-right',
    center: 'left-1/2 -translate-x-1/2 origin-top',
  };

  return (
    <div className="relative inline-block text-left" ref={dropdownRef}>
      <div onClick={() => setIsOpen((prev) => !prev)}>
        {trigger || (
          <button className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium bg-surface-card border border-border-default rounded-lg text-content-primary hover:bg-surface-hover transition-colors">
            <span>Select Option</span>
            <ChevronDown className={cn('w-4 h-4 transition-transform duration-200', isOpen && 'rotate-180')} />
          </button>
        )}
      </div>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: -8 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: -8 }}
            transition={{ duration: 0.15, ease: 'easeOut' }}
            className={cn(
              'absolute z-50 mt-2 w-56 rounded-xl bg-surface-card border border-border-default shadow-xl py-1 backdrop-blur-md',
              alignStyles[align],
              className
            )}
            onClick={() => setIsOpen(false)}
          >
            {children}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export const DropdownItem = ({ children, icon, onClick, active, danger, className }) => (
  <button
    type="button"
    onClick={onClick}
    className={cn(
      'w-full flex items-center gap-2.5 px-3.5 py-2 text-sm transition-colors text-left font-medium',
      danger
        ? 'text-red-500 hover:bg-red-500/10'
        : active
        ? 'bg-sky-500/10 text-sky-500'
        : 'text-content-primary hover:bg-surface-hover',
      className
    )}
  >
    {icon && <span className="w-4 h-4 shrink-0 text-current">{icon}</span>}
    <span className="flex-1 truncate">{children}</span>
  </button>
);

export const DropdownDivider = () => (
  <div className="my-1 border-t border-border-subtle" />
);
