import { forwardRef, type InputHTMLAttributes, type ReactNode } from 'react';

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  icon?: ReactNode;
  hint?: string;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ label, error, icon, hint, className = '', id, ...props }, ref) => {
    const inputId = id || props.name;
    return (
      <div className="w-full">
        {label && (
          <label htmlFor={inputId} className="block text-sm font-medium text-secondary-700 dark:text-secondary-300 mb-1.5">
            {label}
          </label>
        )}
        <div className="relative">
          {icon && (
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-secondary-400 dark:text-secondary-500">
              {icon}
            </span>
          )}
          <input
            ref={ref}
            id={inputId}
            className={`input-premium ${icon ? 'pl-11' : ''} ${error ? 'border-error-500 focus:ring-error-500' : ''} ${className}`}
            {...props}
          />
        </div>
        {error && <p className="mt-1.5 text-sm text-error-600 dark:text-error-400">{error}</p>}
        {hint && !error && <p className="mt-1.5 text-sm text-secondary-400 dark:text-secondary-500">{hint}</p>}
      </div>
    );
  }
);
Input.displayName = 'Input';
