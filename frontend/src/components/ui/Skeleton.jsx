export const Skeleton = ({ className = '', ...props }) => {
  return (
    <div
      className={`animate-pulse rounded-xl bg-surface-hover/80 border border-border-subtle ${className}`}
      {...props}
    />
  );
};

export const SkeletonText = ({ lines = 2, className = '' }) => {
  return (
    <div className={`space-y-2 ${className}`}>
      {Array.from({ length: lines }).map((_, i) => (
        <Skeleton
          key={i}
          className={`h-3.5 ${i === lines - 1 && lines > 1 ? 'w-2/3' : 'w-full'}`}
        />
      ))}
    </div>
  );
};

export const SkeletonAvatar = ({ size = 'md', className = '' }) => {
  const sizes = {
    sm: 'w-8 h-8',
    md: 'w-10 h-10',
    lg: 'w-12 h-12',
    xl: 'w-16 h-16',
  };

  return <Skeleton className={`rounded-full shrink-0 ${sizes[size] || sizes.md} ${className}`} />;
};

export const SkeletonCard = ({ className = '' }) => {
  return (
    <div className={`p-6 rounded-3xl bg-surface-card border border-border-default space-y-4 ${className}`}>
      <div className="flex items-center justify-between">
        <Skeleton className="w-24 h-6 rounded-full" />
        <Skeleton className="w-16 h-6 rounded-full" />
      </div>
      <Skeleton className="w-3/4 h-5 rounded-lg" />
      <Skeleton className="w-1/2 h-4 rounded-lg" />
      <div className="pt-4 border-t border-border-subtle flex justify-between items-center">
        <Skeleton className="w-20 h-4 rounded-lg" />
        <Skeleton className="w-24 h-8 rounded-xl" />
      </div>
    </div>
  );
};

export const SkeletonTable = ({ rows = 4, cols = 5, className = '' }) => {
  return (
    <div className={`space-y-3 ${className}`}>
      <div className="flex items-center justify-between pb-3 border-b border-border-default">
        {Array.from({ length: cols }).map((_, i) => (
          <Skeleton key={i} className="h-4 w-20 rounded" />
        ))}
      </div>
      {Array.from({ length: rows }).map((_, r) => (
        <div key={r} className="flex items-center justify-between py-2.5">
          {Array.from({ length: cols }).map((_, c) => (
            <Skeleton key={c} className="h-4 w-16 rounded" />
          ))}
        </div>
      ))}
    </div>
  );
};

export default Skeleton;
