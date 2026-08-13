import { memo } from 'react';
import { cn } from '../../utils/cn';

export const Card = memo(({ children, variant = 'default', className, ...props }) => {
  const variants = {
    default: 'bg-surface-card border border-border-default shadow-md',
    glass: 'glass-effect border border-border-default/60 shadow-xl backdrop-blur-md',
    interactive: 'bg-surface-card border border-border-default shadow-md hover:border-sky-500/50 hover:shadow-glow-sky transition-all duration-300 cursor-pointer',
    bordered: 'bg-transparent border border-border-strong',
  };

  const variantClass = variants[variant] || variants.default;

  return (
    <div
      className={cn('rounded-xl p-6 transition-colors', variantClass, className)}
      {...props}
    >
      {children}
    </div>
  );
});

Card.displayName = 'Card';

export const CardHeader = memo(({ children, className }) => (
  <div className={cn('mb-4 space-y-1', className)}>{children}</div>
));
CardHeader.displayName = 'CardHeader';

export const CardTitle = memo(({ children, className }) => (
  <h3 className={cn('text-xl font-bold text-content-primary tracking-tight', className)}>
    {children}
  </h3>
));
CardTitle.displayName = 'CardTitle';

export const CardDescription = memo(({ children, className }) => (
  <p className={cn('text-sm text-content-secondary', className)}>{children}</p>
));
CardDescription.displayName = 'CardDescription';

export const CardContent = memo(({ children, className }) => (
  <div className={cn('space-y-4', className)}>{children}</div>
));
CardContent.displayName = 'CardContent';

export const CardFooter = memo(({ children, className }) => (
  <div className={cn('mt-6 pt-4 border-t border-border-subtle flex items-center justify-between', className)}>
    {children}
  </div>
));
CardFooter.displayName = 'CardFooter';
