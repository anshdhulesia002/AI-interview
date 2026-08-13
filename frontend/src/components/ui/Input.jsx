import { forwardRef, useState } from 'react';
import { Eye, EyeOff, X } from 'lucide-react';
import { cn } from '../../utils/cn';

export const Input = forwardRef(({
  label,
  type = 'text',
  error,
  helperText,
  prefixIcon,
  suffixIcon,
  onClear,
  className,
  id,
  value,
  onChange,
  ...props
}, ref) => {
  const [showPassword, setShowPassword] = useState(false);
  const inputId = id || (label ? label.toLowerCase().replace(/\s+/g, '-') : undefined);
  const isPassword = type === 'password';
  const inputType = isPassword ? (showPassword ? 'text' : 'password') : type;

  return (
    <div className="w-full space-y-1.5">
      {label && (
        <label htmlFor={inputId} className="block text-xs font-semibold text-content-secondary">
          {label}
        </label>
      )}
      <div className="relative flex items-center">
        {prefixIcon && (
          <span className="absolute left-3 text-content-muted pointer-events-none">
            {prefixIcon}
          </span>
        )}
        <input
          ref={ref}
          id={inputId}
          type={inputType}
          value={value}
          onChange={onChange}
          className={cn(
            'w-full py-2 text-sm bg-surface-card border border-border-default rounded-lg text-content-primary placeholder:text-content-muted',
            'focus:outline-none focus:ring-2 focus:ring-sky-500 focus:border-sky-500 transition-all',
            prefixIcon ? 'pl-9' : 'pl-3.5',
            (suffixIcon || isPassword || onClear) ? 'pr-9' : 'pr-3.5',
            error && 'border-red-500 focus:ring-red-500 focus:border-red-500',
            className
          )}
          {...props}
        />
        {onClear && value && (
          <button
            type="button"
            onClick={onClear}
            className="absolute right-3 text-content-muted hover:text-content-primary focus:outline-none"
          >
            <X className="w-4 h-4" />
          </button>
        )}
        {isPassword && !onClear && (
          <button
            type="button"
            onClick={() => setShowPassword((prev) => !prev)}
            className="absolute right-3 text-content-muted hover:text-content-primary focus:outline-none"
          >
            {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
          </button>
        )}
        {suffixIcon && !isPassword && !onClear && (
          <span className="absolute right-3 text-content-muted pointer-events-none">
            {suffixIcon}
          </span>
        )}
      </div>
      {error && <p className="text-xs text-red-500 font-medium">{error}</p>}
      {!error && helperText && <p className="text-xs text-content-muted">{helperText}</p>}
    </div>
  );
});

Input.displayName = 'Input';
