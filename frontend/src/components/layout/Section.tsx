import { ReactNode } from 'react';

interface SectionProps {
  children: ReactNode;
  className?: string;
  padding?: 'none' | 'sm' | 'md' | 'lg';
  background?: 'cream' | 'white' | 'honey';
}

export function Section({
  children,
  className = '',
  padding = 'md',
  background = 'cream'
}: SectionProps) {
  const paddingClasses = {
    none: '',
    sm: 'py-8',
    md: 'py-16',
    lg: 'py-24',
  };

  const backgroundClasses = {
    cream: 'bg-cream',
    white: 'bg-white',
    honey: 'bg-honey-50',
  };

  return (
    <section className={`${paddingClasses[padding]} ${backgroundClasses[background]} ${className}`}>
      {children}
    </section>
  );
}
