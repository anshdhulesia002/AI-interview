import { cn } from '../../utils/cn';

export const Card = ({ children, className, ...props }) => {
  return (
    <div
      className={cn(
        'bg-gray-900 border border-gray-800 rounded-xl p-6 shadow-lg shadow-black/20',
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
};
