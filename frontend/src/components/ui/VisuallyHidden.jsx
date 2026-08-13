import { memo } from 'react';

export const VisuallyHidden = memo(({ children, ...props }) => {
  return (
    <span className="sr-only" {...props}>
      {children}
    </span>
  );
});

VisuallyHidden.displayName = 'VisuallyHidden';

export default VisuallyHidden;
