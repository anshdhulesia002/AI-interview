import { cn } from '../../utils/cn';

export const Badge = ({
  children,
  variant = 'primary',
  styleType = 'soft',
  size = 'md',
  dot = false,
  className,
}) => {
  const baseStyles = 'inline-flex items-center gap-1.5 font-semibold rounded-full select-none';

  const sizes = {
    sm: 'px-2 py-0.5 text-[10px]',
    md: 'px-2.5 py-1 text-xs',
  };

  const variants = {
    default: {
      solid: 'bg-gray-700 text-white',
      soft: 'bg-gray-800/60 text-gray-300 border border-gray-700/50',
      outline: 'border border-gray-600 text-gray-400',
    },
    secondary: {
      solid: 'bg-slate-700 text-white',
      soft: 'bg-slate-500/15 text-slate-300 border border-slate-500/30',
      outline: 'border border-slate-500 text-slate-400',
    },
    primary: {
      solid: 'bg-sky-600 text-white',
      soft: 'bg-sky-500/15 text-sky-400 border border-sky-500/30',
      outline: 'border border-sky-500 text-sky-400',
    },
    success: {
      solid: 'bg-emerald-600 text-white',
      soft: 'bg-emerald-500/15 text-emerald-400 border border-emerald-500/30',
      outline: 'border border-emerald-500 text-emerald-400',
    },
    warning: {
      solid: 'bg-amber-600 text-white',
      soft: 'bg-amber-500/15 text-amber-400 border border-amber-500/30',
      outline: 'border border-amber-500 text-amber-400',
    },
    danger: {
      solid: 'bg-red-600 text-white',
      soft: 'bg-red-500/15 text-red-400 border border-red-500/30',
      outline: 'border border-red-500 text-red-400',
    },
    info: {
      solid: 'bg-cyan-600 text-white',
      soft: 'bg-cyan-500/15 text-cyan-400 border border-cyan-500/30',
      outline: 'border border-cyan-500 text-cyan-400',
    },
  };

  const dotColors = {
    default: 'bg-gray-400',
    secondary: 'bg-slate-400',
    primary: 'bg-sky-400',
    success: 'bg-emerald-400',
    warning: 'bg-amber-400',
    danger: 'bg-red-400',
    info: 'bg-cyan-400',
  };

  const selectedVariant = variants[variant] || variants.primary;
  const variantClass = selectedVariant[styleType] || selectedVariant.soft;
  const activeDotColor = dotColors[variant] || dotColors.primary;

  return (
    <span className={cn(baseStyles, sizes[size] || sizes.md, variantClass, className)}>
      {dot && <span className={cn('w-1.5 h-1.5 rounded-full shrink-0 animate-pulse', activeDotColor)} />}
      <span>{children}</span>
    </span>
  );
};
