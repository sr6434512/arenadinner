import React from 'react';

interface CardProps {
  children: React.ReactNode;
  className?: string;
  hover?: boolean;
  glow?: 'gold' | 'cyan' | 'none';
  onClick?: () => void;
}

interface CardHeaderProps {
  children: React.ReactNode;
  className?: string;
}

interface CardBodyProps {
  children: React.ReactNode;
  className?: string;
}

export function Card({ children, className = '', hover = false, glow = 'none', onClick }: CardProps) {
  const glowClass = glow === 'gold' ? 'shadow-glow-gold' : glow === 'cyan' ? 'shadow-glow-cyan' : '';

  return (
    <div
      onClick={onClick}
      className={`
        arena-card
        ${hover ? 'hover:border-gold-500/40 hover:bg-arena-hover transition-all duration-200 cursor-pointer' : ''}
        ${glowClass}
        ${className}
      `}
    >
      {children}
    </div>
  );
}

export function CardHeader({ children, className = '' }: CardHeaderProps) {
  return (
    <div className={`px-5 py-4 border-b border-arena-border ${className}`}>
      {children}
    </div>
  );
}

export function CardBody({ children, className = '' }: CardBodyProps) {
  return (
    <div className={`px-5 py-4 ${className}`}>
      {children}
    </div>
  );
}
