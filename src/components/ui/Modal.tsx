import React, { useEffect } from 'react';
import { X } from 'lucide-react';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  children: React.ReactNode;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  showClose?: boolean;
}

const sizeClasses = {
  sm: 'max-w-sm',
  md: 'max-w-md',
  lg: 'max-w-lg',
  xl: 'max-w-2xl',
};

export function Modal({ isOpen, onClose, title, children, size = 'md', showClose = true }: ModalProps) {
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => { document.body.style.overflow = ''; };
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      onClick={onClose}
    >
      <div className="absolute inset-0 bg-black/70 backdrop-blur-sm animate-fade-in" />
      <div
        className={`
          relative w-full ${sizeClasses[size]}
          bg-arena-card border border-arena-border rounded-2xl shadow-modal
          animate-slide-in-up
        `}
        onClick={(e) => e.stopPropagation()}
      >
        {(title || showClose) && (
          <div className="flex items-center justify-between px-6 py-4 border-b border-arena-border">
            {title && (
              <h2 className="font-display text-xl font-bold text-white">{title}</h2>
            )}
            {showClose && (
              <button
                onClick={onClose}
                className="ml-auto p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-arena-hover transition-colors"
              >
                <X size={18} />
              </button>
            )}
          </div>
        )}
        <div className="p-6">{children}</div>
      </div>
    </div>
  );
}
