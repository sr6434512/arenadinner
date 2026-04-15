import React, { createContext, useContext, useState, useCallback } from 'react';
import { CheckCircle, AlertTriangle, Info, Skull, Trophy, X } from 'lucide-react';

type ToastType = 'info' | 'success' | 'warning' | 'elimination' | 'prize';

interface Toast {
  id: string;
  type: ToastType;
  title: string;
  message?: string;
}

interface NotificationContextValue {
  toasts: Toast[];
  notify: (type: ToastType, title: string, message?: string) => void;
  dismiss: (id: string) => void;
}

const NotificationContext = createContext<NotificationContextValue | null>(null);

const toastConfig: Record<ToastType, { icon: React.ReactNode; border: string; bg: string; title: string }> = {
  info: {
    icon: <Info size={18} />,
    border: 'border-cyan-500/40',
    bg: 'bg-cyan-500/10',
    title: 'text-cyan-300',
  },
  success: {
    icon: <CheckCircle size={18} />,
    border: 'border-success-500/40',
    bg: 'bg-success-500/10',
    title: 'text-success-400',
  },
  warning: {
    icon: <AlertTriangle size={18} />,
    border: 'border-warning-500/40',
    bg: 'bg-warning-500/10',
    title: 'text-warning-400',
  },
  elimination: {
    icon: <Skull size={18} />,
    border: 'border-danger-500/40',
    bg: 'bg-danger-500/10',
    title: 'text-danger-400',
  },
  prize: {
    icon: <Trophy size={18} />,
    border: 'border-gold-500/40',
    bg: 'bg-gold-500/10',
    title: 'text-gold-400',
  },
};

export function NotificationProvider({ children }: { children: React.ReactNode }) {
  const [toasts, setToasts] = useState<Toast[]>([]);

  const notify = useCallback((type: ToastType, title: string, message?: string) => {
    const id = crypto.randomUUID();
    setToasts((prev) => [...prev.slice(-2), { id, type, title, message }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 5000);
  }, []);

  const dismiss = useCallback((id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  return (
    <NotificationContext.Provider value={{ toasts, notify, dismiss }}>
      {children}
      <ToastContainer toasts={toasts} onDismiss={dismiss} />
    </NotificationContext.Provider>
  );
}

function ToastContainer({ toasts, onDismiss }: { toasts: Toast[]; onDismiss: (id: string) => void }) {
  return (
    <div className="fixed top-4 right-4 z-[100] flex flex-col gap-3 max-w-sm w-full pointer-events-none">
      {toasts.map((toast) => {
        const config = toastConfig[toast.type];
        return (
          <div
            key={toast.id}
            className={`
              pointer-events-auto
              flex items-start gap-3 p-4 rounded-xl
              bg-arena-card border ${config.border}
              shadow-modal animate-slide-in-right
            `}
          >
            <span className={config.title}>{config.icon}</span>
            <div className="flex-1 min-w-0">
              <p className={`text-sm font-bold ${config.title}`}>{toast.title}</p>
              {toast.message && (
                <p className="text-xs text-slate-400 mt-0.5">{toast.message}</p>
              )}
            </div>
            <button
              onClick={() => onDismiss(toast.id)}
              className="text-slate-500 hover:text-white transition-colors flex-shrink-0"
            >
              <X size={14} />
            </button>
          </div>
        );
      })}
    </div>
  );
}

export function useNotification() {
  const ctx = useContext(NotificationContext);
  if (!ctx) throw new Error('useNotification must be used within NotificationProvider');
  return ctx;
}
