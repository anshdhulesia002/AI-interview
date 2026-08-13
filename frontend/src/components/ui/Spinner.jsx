import { motion } from 'framer-motion';

export const Spinner = ({ size = 'md', color = 'sky', className = '' }) => {
  const sizes = {
    sm: 'w-4 h-4 border-2',
    md: 'w-6 h-6 border-2',
    lg: 'w-8 h-8 border-3',
    xl: 'w-12 h-12 border-4',
  };

  const colors = {
    sky: 'border-sky-500/20 border-t-sky-500',
    emerald: 'border-emerald-500/20 border-t-emerald-500',
    amber: 'border-amber-500/20 border-t-amber-500',
    purple: 'border-purple-500/20 border-t-purple-500',
    white: 'border-white/20 border-t-white',
  };

  return (
    <motion.div
      animate={{ rotate: 360 }}
      transition={{ repeat: Infinity, duration: 0.8, ease: 'linear' }}
      className={`rounded-full shrink-0 ${sizes[size] || sizes.md} ${colors[color] || colors.sky} ${className}`}
    />
  );
};

export const SpinnerOverlay = ({ label = 'Loading...', isVisible = true }) => {
  if (!isVisible) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-md">
      <div className="bg-surface-card border border-border-default rounded-3xl p-6 shadow-2xl flex flex-col items-center gap-3 text-center">
        <Spinner size="xl" color="sky" />
        <span className="text-xs font-extrabold text-content-primary tracking-wide">{label}</span>
      </div>
    </div>
  );
};

export default Spinner;
