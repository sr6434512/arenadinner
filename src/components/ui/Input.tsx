import React from 'react';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  hint?: string;
  icon?: React.ReactNode;
  fullWidth?: boolean;
}

interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  label?: string;
  error?: string;
  hint?: string;
  fullWidth?: boolean;
  options: { value: string; label: string }[];
}

interface TextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
  error?: string;
  hint?: string;
  fullWidth?: boolean;
}

export function Input({ label, error, hint, icon, fullWidth = true, className = '', ...props }: InputProps) {
  return (
    <div className={fullWidth ? 'w-full' : ''}>
      {label && <label className="arena-label">{label}</label>}
      <div className="relative">
        {icon && (
          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500">
            {icon}
          </span>
        )}
        <input
          {...props}
          className={`
            arena-input
            ${icon ? 'pl-10' : ''}
            ${error ? 'border-danger-500 focus:border-danger-400 focus:ring-danger-500' : ''}
            ${className}
          `}
        />
      </div>
      {error && <p className="mt-1 text-xs text-danger-400">{error}</p>}
      {hint && !error && <p className="mt-1 text-xs text-slate-500">{hint}</p>}
    </div>
  );
}

export function Select({ label, error, hint, fullWidth = true, options, className = '', ...props }: SelectProps) {
  return (
    <div className={fullWidth ? 'w-full' : ''}>
      {label && <label className="arena-label">{label}</label>}
      <select
        {...props}
        className={`
          arena-input appearance-none
          ${error ? 'border-danger-500' : ''}
          ${className}
        `}
      >
        {options.map((opt) => (
          <option key={opt.value} value={opt.value} className="bg-arena-surface">
            {opt.label}
          </option>
        ))}
      </select>
      {error && <p className="mt-1 text-xs text-danger-400">{error}</p>}
      {hint && !error && <p className="mt-1 text-xs text-slate-500">{hint}</p>}
    </div>
  );
}

export function Textarea({ label, error, hint, fullWidth = true, className = '', ...props }: TextareaProps) {
  return (
    <div className={fullWidth ? 'w-full' : ''}>
      {label && <label className="arena-label">{label}</label>}
      <textarea
        {...props}
        className={`
          arena-input resize-none min-h-[100px]
          ${error ? 'border-danger-500' : ''}
          ${className}
        `}
      />
      {error && <p className="mt-1 text-xs text-danger-400">{error}</p>}
      {hint && !error && <p className="mt-1 text-xs text-slate-500">{hint}</p>}
    </div>
  );
}
