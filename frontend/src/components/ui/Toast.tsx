import React, { useCallback, createContext, useContext, useState, useEffect } from 'react';
import { CheckCircle, XCircle, Info, AlertTriangle, X } from 'lucide-react';
import { setToastImpl } from '../../utils/toast';

type ToastType = 'success' | 'error' | 'info' | 'warning';

interface ToastItem {
  id: string;
  type: ToastType;
  message: string;
}

interface ToastContextValue {
  showToast: (message: string, type?: ToastType) => void;
}

const ToastContext = createContext<ToastContextValue | null>(null);

const ICONS: Record<ToastType, React.ReactNode> = {
  success: <CheckCircle className="w-4 h-4 text-emerald-500 shrink-0" />,
  error:   <XCircle    className="w-4 h-4 text-red-500    shrink-0" />,
  info:    <Info       className="w-4 h-4 text-blue-500   shrink-0" />,
  warning: <AlertTriangle className="w-4 h-4 text-amber-500 shrink-0" />,
};

const LEFT_BORDER: Record<ToastType, string> = {
  success: 'border-l-emerald-400',
  error:   'border-l-red-400',
  info:    'border-l-blue-400',
  warning: 'border-l-amber-400',
};

export function ToastProvider({ children }: { children: React.ReactNode }) {
  const [toasts, setToasts] = useState<ToastItem[]>([]);

  const showToast = useCallback((message: string, type: ToastType = 'info') => {
    const id = `toast-${Date.now()}-${Math.random().toString(36).slice(2)}`;
    setToasts((prev) => [...prev.slice(-4), { id, type, message }]);
    setTimeout(() => setToasts((prev) => prev.filter((t) => t.id !== id)), 4000);
  }, []);

  // Wire up the global imperative toast helper
  useEffect(() => {
    setToastImpl({
      success: (m) => showToast(m, 'success'),
      error:   (m) => showToast(m, 'error'),
      info:    (m) => showToast(m, 'info'),
      warning: (m) => showToast(m, 'warning'),
    });
  }, [showToast]);

  const dismiss = (id: string) => setToasts((prev) => prev.filter((t) => t.id !== id));

  return (
    <ToastContext.Provider value={{ showToast }}>
      {children}
      {/* Toast container — top-right */}
      <div
        className="fixed top-4 right-4 z-[9999] flex flex-col gap-2 max-w-[320px] w-full pointer-events-none"
        aria-live="polite"
        aria-atomic="false"
      >
        {toasts.map((t) => (
          <div
            key={t.id}
            className={`flex items-start gap-3 bg-white border border-l-4 ${LEFT_BORDER[t.type]}
              border-surface-border rounded-md p-3.5 shadow-lg pointer-events-auto
              animate-slide-in-right`}
            role={t.type === 'error' ? 'alert' : 'status'}
          >
            {ICONS[t.type]}
            <p className="text-sm text-gray-800 flex-1 leading-snug">{t.message}</p>
            <button
              onClick={() => dismiss(t.id)}
              className="text-gray-400 hover:text-gray-600 transition-colors shrink-0 mt-0.5"
              aria-label="Dismiss"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  );
}

export function useToast(): ToastContextValue {
  const ctx = useContext(ToastContext);
  if (!ctx) throw new Error('useToast must be used inside ToastProvider');
  return ctx;
}
