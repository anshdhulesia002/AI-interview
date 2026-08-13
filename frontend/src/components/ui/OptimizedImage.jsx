import { useState, memo } from 'react';
import { Skeleton } from './Skeleton';

export const OptimizedImage = memo(({
  src,
  alt = '',
  className = '',
  aspectRatio = 'aspect-video',
  fallbackSrc = '',
  ...props
}) => {
  const [isLoaded, setIsLoaded] = useState(false);
  const [hasError, setHasError] = useState(false);

  return (
    <div className={`relative overflow-hidden ${aspectRatio} ${className}`}>
      {!isLoaded && !hasError && (
        <Skeleton className="absolute inset-0 w-full h-full rounded-2xl" />
      )}

      <img
        src={hasError && fallbackSrc ? fallbackSrc : src}
        alt={alt}
        loading="lazy"
        decoding="async"
        onLoad={() => setIsLoaded(true)}
        onError={() => setHasError(true)}
        className={`w-full h-full object-cover transition-opacity duration-500 ${
          isLoaded ? 'opacity-100' : 'opacity-0'
        }`}
        {...props}
      />
    </div>
  );
});

OptimizedImage.displayName = 'OptimizedImage';

export default OptimizedImage;
