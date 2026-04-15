import React from 'react';
import { Loader2 } from 'lucide-react';

type Variant = 'primary' | 'secondary' | 'ghost' | 'danger' | 'outline' | 'cyan';
type Size = 'xs' | 'sm' | 'md' | 'lg';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: Variant;
  size?: Size;
  loading?: boolean;
  icon?: React.ReactNode;
  iconPosition?: 'left' | 'right';
  fullWidth?: boolean;
}

const variantClasses: Record<Variant, string> = {
  primary: 'bg-gold-500 hover:bg-gold-400 text-arena-bg font-bold shadow-glow-gold hover:shadow-glow-gold active:bg-gold-600',
  secondary: 'bg-arena-card hover:bg-arena-hover text-white border border-arena-border',
  ghost: 'bg-transparent hover:bg-arena-hover text-slate-300 hover:text-white',
  danger: 'bg-danger-600 hover:bg-danger-500 text-white font-semibold',
  outline: 'bg-transparent border border-gold-500 text-gold-400 hover:bg-gold-500/10',
  cyan: 'bg-cyan-500 hover:bg-cyan-400 text-arena-bg font-bold shadow-glow-cyan',
};

const sizeClasses: Record<Size, string> = {
  xs: 'px-2.5 py-1 text-xs rounded-md',
  sm: 'px-3.5 py-1.5 text-sm rounded-lg',
  md: 'px-5 py-2.5 text-sm rounded-lg',
  lg: 'px-6 py-3 text-base rounded-xl',
};

export function Button({
  variant = 'primary',
  size = 'md',
  loading = false,
  icon,
  iconPosition = 'left',
  fullWidth = false,
  children,
  disabled,
  className = '',
  ...props
}: ButtonProps) {
  return (
    <button
      {...props}
      disabled={disabled || loading}
      className={`
        inline-flex items-center justify-center gap-2 font-semibold
        transition-all duration-150 cursor-pointer select-none
        disabled:opacity-50 disabled:cursor-not-allowed
        ${variantClasses[variant]}
        ${sizeClasses[size]}
        ${fullWidth ? 'w-full' : ''}
        ${className}
      `}
    >
      {loading ? (
        <Loader2 size={16} className="animate-spin" />
      ) : (
        icon && iconPosition === 'left' && icon
      )}
      {children}
      {!loading && icon && iconPosition === 'right' && icon}
    </button>
  );
}
