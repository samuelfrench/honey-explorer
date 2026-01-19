import { ReactNode } from 'react';

type BadgeVariant = 'honey' | 'success' | 'warning' | 'info' | 'neutral';

interface BadgeProps {
  children: ReactNode;
  variant?: BadgeVariant;
  size?: 'sm' | 'md';
  className?: string;
}

const variantClasses: Record<BadgeVariant, string> = {
  honey: 'bg-honey-100 text-honey-800',
  success: 'bg-green-100 text-green-800',
  warning: 'bg-orange-100 text-orange-800',
  info: 'bg-blue-100 text-blue-800',
  neutral: 'bg-comb-100 text-comb-700',
};

export function Badge({
  children,
  variant = 'honey',
  size = 'md',
  className = ''
}: BadgeProps) {
  const sizeClasses = size === 'sm' ? 'px-2 py-0.5 text-xs' : 'px-3 py-1 text-sm';

  return (
    <span
      className={`
        inline-flex items-center font-medium rounded-[--radius-badge]
        ${variantClasses[variant]}
        ${sizeClasses}
        ${className}
      `.trim()}
    >
      {children}
    </span>
  );
}
