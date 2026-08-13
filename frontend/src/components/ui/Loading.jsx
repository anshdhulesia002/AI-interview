import { cn } from '../../utils/cn';

export const Loading = ({ type = 'spinner', size = 'md', className }) => {
  const spinnerSizes = {
    sm: 'w-4 h-4 border-2',
    md: 'w-8 h-8 border-3',
    lg: 'w-12 h-12 border-4',
  };

  const dotSizes = {
    sm: 'w-1.5 h-1.5',
    md: 'w-2.5 h-2.5',
    lg: 'w-3.5 h-3.5',
  };

  if (type === 'dots') {
    return (
      <div className={cn('flex items-center gap-1.5 p-2', className)}>
        <span className={cn('rounded-full bg-sky-500 animate-bounce', dotSizes[size])} style={{ animationDelay: '0ms' }} />
        <span className={cn('rounded-full bg-sky-500 animate-bounce', dotSizes[size])} style={{ animationDelay: '150ms' }} />
        <span className={cn('rounded-full bg-sky-500 animate-bounce', dotSizes[size])} style={{ animationDelay: '300ms' }} />
      </div>
    );
  }

  if (type === 'pulse') {
    return (
      <div className={cn('flex items-center justify-center p-2', className)}>
        <div className={cn('rounded-full bg-sky-500/30 border border-sky-500 animate-ping', spinnerSizes[size])} />
      </div>
    );
  }

  return (
    <div className={cn('flex items-center justify-center p-2', className)}>
      <div
        className={cn(
          'animate-spin rounded-full border-sky-500 border-t-transparent',
          spinnerSizes[size]
        )}
      />
    </div>
  );
};
