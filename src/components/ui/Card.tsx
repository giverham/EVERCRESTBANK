import type { ReactNode } from 'react';

interface CardProps {
  children: ReactNode;
  className?: string;
  hover?: boolean;
  glass?: boolean;
  onClick?: (e: any) => void;
}

export function Card({ children, className = '', hover = false, glass = false, onClick }: CardProps) {
  const base = glass
    ? 'glass rounded-2xl shadow-glass'
    : 'card-premium';
  const hoverClass = hover
    ? 'hover:shadow-premium hover:-translate-y-1 cursor-pointer'
    : '';
  return <div className={`${base} ${hoverClass} ${className}`} onClick={onClick}>{children}</div>;
}

interface SectionHeadingProps {
  eyebrow?: string;
  title: string;
  subtitle?: string;
  center?: boolean;
  className?: string;
}

export function SectionHeading({ eyebrow, title, subtitle, center = true, className = '' }: SectionHeadingProps) {
  return (
    <div className={`${center ? 'text-center max-w-3xl mx-auto' : 'max-w-3xl'} ${className}`}>
      {eyebrow && (
        <p className="text-accent-600 dark:text-accent-400 font-semibold text-sm uppercase tracking-wider mb-3">
          {eyebrow}
        </p>
      )}
      <h2 className="text-3xl md:text-4xl font-bold text-primary-900 dark:text-white mb-4">{title}</h2>
      {subtitle && <p className="text-secondary-600 dark:text-secondary-400 text-lg leading-relaxed">{subtitle}</p>}
    </div>
  );
}
