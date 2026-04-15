import React from 'react';

type BadgeVariant = 'gold' | 'cyan' | 'success' | 'warning' | 'danger' | 'neutral' | 'bgmi' | 'freefire';

interface BadgeProps {
  variant?: BadgeVariant;
  children: React.ReactNode;
  size?: 'sm' | 'md';
  dot?: boolean;
  className?: string;
}

const variantClasses: Record<BadgeVariant, string> = {
  gold: 'bg-gold-500/20 text-gold-400 border border-gold-500/30',
  cyan: 'bg-cyan-500/20 text-cyan-400 border border-cyan-500/30',
  success: 'bg-success-500/20 text-success-400 border border-success-500/30',
  warning: 'bg-warning-500/20 text-warning-400 border border-warning-500/30',
  danger: 'bg-danger-500/20 text-danger-400 border border-danger-500/30',
  neutral: 'bg-slate-700/50 text-slate-300 border border-slate-600/30',
  bgmi: 'bg-gold-500/20 text-gold-300 border border-gold-500/40',
  freefire: 'bg-orange-500/20 text-orange-300 border border-orange-500/40',
};

const dotClasses: Record<BadgeVariant, string> = {
  gold: 'bg-gold-400',
  cyan: 'bg-cyan-400',
  success: 'bg-success-400',
  warning: 'bg-warning-400',
  danger: 'bg-danger-400',
  neutral: 'bg-slate-400',
  bgmi: 'bg-gold-400',
  freefire: 'bg-orange-400',
};

export function Badge({ variant = 'neutral', children, size = 'sm', dot = false, className = '' }: BadgeProps) {
  return (
    <span
      className={`
        inline-flex items-center gap-1.5 font-semibold rounded-full
        ${size === 'sm' ? 'px-2 py-0.5 text-2xs' : 'px-3 py-1 text-xs'}
        ${variantClasses[variant]}
        ${className}
      `}
    >
      {dot && <span className={`w-1.5 h-1.5 rounded-full ${dotClasses[variant]}`} />}
      {children}
    </span>
  );
}
