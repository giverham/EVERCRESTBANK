import { forwardRef, type ButtonHTMLAttributes, type ReactNode } from 'react';
import { Link } from 'react-router-dom';

type Variant = 'primary' | 'secondary' | 'accent' | 'outline' | 'ghost' | 'danger';
type Size = 'sm' | 'md' | 'lg';

interface BaseProps {
  variant?: Variant;
  size?: Size;
  children: ReactNode;
  className?: string;
}

type ButtonProps = BaseProps & ButtonHTMLAttributes<HTMLButtonElement> & { to?: undefined };
type LinkProps = BaseProps & { to: string; onClick?: () => void };

const variantClasses: Record<Variant, string> = {
  primary:
    'bg-primary-800 hover:bg-primary-700 dark:bg-primary-700 dark:hover:bg-primary-600 text-white shadow-premium',
  secondary:
    'bg-secondary-100 hover:bg-secondary-200 dark:bg-secondary-800 dark:hover:bg-secondary-700 text-secondary-900 dark:text-white',
  accent:
    'bg-accent-500 hover:bg-accent-600 text-white shadow-premium',
  outline:
    'border-2 border-primary-700 dark:border-primary-400 text-primary-800 dark:text-primary-300 hover:bg-primary-50 dark:hover:bg-primary-900/30',
  ghost:
    'text-secondary-700 dark:text-secondary-300 hover:bg-secondary-100 dark:hover:bg-secondary-800',
  danger: 'bg-error-500 hover:bg-error-600 text-white shadow-premium',
};

const sizeClasses: Record<Size, string> = {
  sm: 'px-4 py-2 text-sm',
  md: 'px-6 py-3 text-base',
  lg: 'px-8 py-4 text-lg',
};

const baseClass =
  'inline-flex items-center justify-center gap-2 font-semibold rounded-xl transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 disabled:opacity-50 disabled:cursor-not-allowed no-tap-highlight';

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ variant = 'primary', size = 'md', className = '', children, ...props }, ref) => {
    return (
      <button
        ref={ref}
        className={`${baseClass} ${variantClasses[variant]} ${sizeClasses[size]} ${className}`}
        {...props}
      >
        {children}
      </button>
    );
  }
);
Button.displayName = 'Button';

export function LinkButton({ variant = 'primary', size = 'md', className = '', children, to, onClick }: LinkProps) {
  return (
    <Link
      to={to}
      onClick={onClick}
      className={`${baseClass} ${variantClasses[variant]} ${sizeClasses[size]} ${className}`}
    >
      {children}
    </Link>
  );
}
