import { motion } from 'framer-motion';

export const ProgressBar = ({
  progress = 0,
  max = 100,
  label = '',
  showPercentage = true,
  color = 'sky',
  height = 'h-2.5',
  className = '',
}) => {
  const percentage = Math.min(100, Math.max(0, Math.round((progress / max) * 100)));

  const gradients = {
    sky: 'from-sky-500 to-cyan-400',
    emerald: 'from-emerald-500 to-teal-400',
    amber: 'from-amber-500 to-yellow-400',
    purple: 'from-purple-500 to-pink-400',
    red: 'from-red-500 to-rose-400',
  };

  return (
    <div className={`space-y-1.5 ${className}`}>
      {(label || showPercentage) && (
        <div className="flex items-center justify-between text-xs font-semibold">
          {label && <span className="text-content-secondary">{label}</span>}
          {showPercentage && <span className="text-content-primary font-mono font-bold">{percentage}%</span>}
        </div>
      )}

      <div className={`w-full ${height} bg-surface-base rounded-full overflow-hidden border border-border-subtle p-0.5`}>
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: `${percentage}%` }}
          transition={{ duration: 0.6, ease: 'easeOut' }}
          className={`h-full bg-gradient-to-r ${gradients[color] || gradients.sky} rounded-full`}
        />
      </div>
    </div>
  );
};

export default ProgressBar;
