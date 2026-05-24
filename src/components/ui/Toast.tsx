"use client";

import { createContext, useCallback, useContext, useEffect, useRef, useState } from "react";

type ToastType = "success" | "error" | "warn" | "info";

interface ToastItem {
  id: string;
  type: ToastType;
  title: string;
  message?: string;
}

interface ToastContextValue {
  success: (title: string, message?: string) => void;
  error:   (title: string, message?: string) => void;
  warn:    (title: string, message?: string) => void;
  info:    (title: string, message?: string) => void;
}

const ToastContext = createContext<ToastContextValue | null>(null);

const ICONS: Record<ToastType, string> = {
  success: "check_circle",
  error:   "error",
  warn:    "warning",
  info:    "info",
};

const STYLES: Record<ToastType, { bar: string; icon: string; bg: string }> = {
  success: {
    bar:  "bg-emerald-500",
    icon: "text-emerald-500",
    bg:   "border-emerald-100",
  },
  error: {
    bar:  "bg-red-500",
    icon: "text-red-500",
    bg:   "border-red-100",
  },
  warn: {
    bar:  "bg-amber-400",
    icon: "text-amber-500",
    bg:   "border-amber-100",
  },
  info: {
    bar:  "bg-primary",
    icon: "text-primary",
    bg:   "border-primary/20",
  },
};

const DURATION = 4500;

function ToastCard({ toast, onDismiss }: { toast: ToastItem; onDismiss: (id: string) => void }) {
  const [visible, setVisible] = useState(false);
  const timerRef = useRef<ReturnType<typeof setTimeout>>();

  useEffect(() => {
    // Slide in
    requestAnimationFrame(() => setVisible(true));
    timerRef.current = setTimeout(() => dismiss(), DURATION);
    return () => clearTimeout(timerRef.current);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  function dismiss() {
    setVisible(false);
    setTimeout(() => onDismiss(toast.id), 300);
  }

  const s = STYLES[toast.type];

  return (
    <div
      className={`relative flex items-start gap-3 w-80 bg-white border ${s.bg} rounded-xl shadow-lg shadow-black/10 px-4 py-3.5 overflow-hidden transition-all duration-300 ${
        visible ? "opacity-100 translate-x-0" : "opacity-0 translate-x-6"
      }`}
    >
      {/* Color bar */}
      <div className={`absolute left-0 top-0 bottom-0 w-1 ${s.bar} rounded-l-xl`} />

      {/* Icon */}
      <span className={`material-symbols-outlined text-lg shrink-0 mt-0.5 ${s.icon}`}>
        {ICONS[toast.type]}
      </span>

      {/* Content */}
      <div className="flex-1 min-w-0 pr-1">
        <p className="text-sm font-bold text-on-surface font-headline leading-tight">
          {toast.title}
        </p>
        {toast.message && (
          <p className="text-xs text-on-surface-variant mt-0.5 leading-relaxed">
            {toast.message}
          </p>
        )}
      </div>

      {/* Dismiss */}
      <button
        onClick={dismiss}
        className="text-stone-400 hover:text-stone-600 transition-colors shrink-0 mt-0.5"
      >
        <span className="material-symbols-outlined text-sm">close</span>
      </button>

      {/* Progress bar */}
      <div
        className={`absolute bottom-0 left-1 right-0 h-0.5 ${s.bar} opacity-30 origin-left`}
        style={{ animation: `shrink ${DURATION}ms linear forwards` }}
      />

      <style jsx>{`
        @keyframes shrink {
          from { transform: scaleX(1); }
          to   { transform: scaleX(0); }
        }
      `}</style>
    </div>
  );
}

export function ToastProvider({ children }: { children: React.ReactNode }) {
  const [toasts, setToasts] = useState<ToastItem[]>([]);

  const add = useCallback((type: ToastType, title: string, message?: string) => {
    const id = `${Date.now()}-${Math.random()}`;
    setToasts((prev) => [...prev, { id, type, title, message }]);
  }, []);

  const remove = useCallback((id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  const ctx: ToastContextValue = {
    success: (t, m) => add("success", t, m),
    error:   (t, m) => add("error",   t, m),
    warn:    (t, m) => add("warn",    t, m),
    info:    (t, m) => add("info",    t, m),
  };

  return (
    <ToastContext.Provider value={ctx}>
      {children}
      {/* Toaster portal */}
      <div className="fixed top-5 right-5 z-[9999] flex flex-col gap-2.5 pointer-events-none">
        {toasts.map((t) => (
          <div key={t.id} className="pointer-events-auto">
            <ToastCard toast={t} onDismiss={remove} />
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  );
}

export function useToast(): ToastContextValue {
  const ctx = useContext(ToastContext);
  if (!ctx) throw new Error("useToast must be used inside <ToastProvider>");
  return ctx;
}
