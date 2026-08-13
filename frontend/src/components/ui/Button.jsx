import { motion } from 'framer-motion';
import { cn } from '../../utils/cn';

export const Button = ({
  children,
  variant = 'primary',
  size = 'md',
  isLoading = false,
  leftIcon,
  rightIcon,
  className,
  disabled,
  ...props
}) => {
  const baseStyles = 'inline-flex items-center justify-center font-bold rounded-xl transition-colors focus:outline-none focus:ring-2 focus:ring-sky-500 focus:ring-offset-2 dark:focus:ring-offset-gray-950 disabled:opacity-50 disabled:cursor-not-allowed select-none cursor-pointer';

  const variants = {
    primary: 'bg-gradient-to-r from-sky-500 to-cyan-400 text-white hover:brightness-110 active:brightness-95 shadow-lg shadow-sky-500/20',
    secondary: 'bg-surface-card text-content-primary hover:bg-surface-hover active:bg-surface-muted border border-border-default',
    outline: 'border border-sky-500/50 text-sky-400 hover:bg-sky-500/10 active:bg-sky-500/20',
    ghost: 'text-content-secondary hover:bg-surface-hover hover:text-content-primary',
    danger: 'bg-gradient-to-r from-red-500 to-rose-400 text-white hover:brightness-110 active:brightness-95 shadow-lg shadow-red-500/20',
    success: 'bg-gradient-to-r from-emerald-500 to-teal-400 text-white hover:brightness-110 active:brightness-95 shadow-lg shadow-emerald-500/20',
  };

  const sizes = {
    sm: 'px-3 py-1.5 text-xs gap-1.5',
    md: 'px-4 py-2 text-xs sm:text-sm gap-2',
    lg: 'px-6 py-3 text-sm sm:text-base gap-2.5',
  };

  const variantClass = variants[variant] || variants.primary;
  const sizeClass = sizes[size] || sizes.md;

  return (
    <motion.button
      whileHover={{ scale: disabled || isLoading ? 1 : 1.03, y: disabled || isLoading ? 0 : -1 }}
      whileTap={{ scale: disabled || isLoading ? 1 : 0.96 }}
      transition={{ type: 'spring', stiffness: 400, damping: 25 }}
      disabled={disabled || isLoading}
      className={cn(baseStyles, variantClass, sizeClass, className)}
      {...props}
    >
      {isLoading ? (
        <span className="flex items-center gap-2">
          <svg className="animate-spin h-4 w-4 text-current" viewBox="0 0 24 24" fill="none">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
          </svg>
          Loading...
        </span>
      ) : (
        <>
          {leftIcon && <span className="shrink-0">{leftIcon}</span>}
          <span>{children}</span>
          {rightIcon && <span className="shrink-0">{rightIcon}</span>}
        </>
      )}
    </motion.button>
  );
};

export default Button;
