import { cn } from '../../utils/cn';

export const LoadingSkeleton = ({ className }) => {
  return (
    <div
      className={cn(
        'animate-pulse bg-gray-800/60 rounded-md',
        className
      )}
    />
  );
};
