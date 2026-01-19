import { ReactNode } from 'react';

interface CardProps {
  children: ReactNode;
  className?: string;
  hover?: boolean;
  padding?: 'none' | 'sm' | 'md' | 'lg';
}

export function Card({
  children,
  className = '',
  hover = true,
  padding = 'md'
}: CardProps) {
  const paddingClasses = {
    none: '',
    sm: 'p-4',
    md: 'p-6',
    lg: 'p-8',
  };

  return (
    <div
      className={`
        bg-white rounded-[--radius-card] shadow-honey
        ${paddingClasses[padding]}
        ${hover ? 'transition-shadow duration-200 hover:shadow-honey-lg' : ''}
        ${className}
      `.trim()}
    >
      {children}
    </div>
  );
}

export function CardImage({
  src,
  alt,
  aspectRatio = '4/5'
}: {
  src: string;
  alt: string;
  aspectRatio?: string;
}) {
  return (
    <div
      className="overflow-hidden rounded-t-[--radius-card] -mx-6 -mt-6 mb-4"
      style={{ aspectRatio }}
    >
      <img
        src={src}
        alt={alt}
        className="w-full h-full object-cover"
        loading="lazy"
      />
    </div>
  );
}

export function CardTitle({ children, className = '' }: { children: ReactNode; className?: string }) {
  return (
    <h3 className={`font-display text-xl text-comb-900 mb-2 ${className}`}>
      {children}
    </h3>
  );
}

export function CardDescription({ children, className = '' }: { children: ReactNode; className?: string }) {
  return (
    <p className={`text-comb-600 text-sm leading-relaxed ${className}`}>
      {children}
    </p>
  );
}
