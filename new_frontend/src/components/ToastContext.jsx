import { createContext, useContext, useMemo, useState } from "react";
import { CheckCircle2, Info, X } from "lucide-react";
const ToastContext = createContext(null);
export function ToastProvider({ children }) {
  const [toast, setToast] = useState(null);
  const showToast = (message, tone = "success") => {
    setToast({ message, tone });
    window.setTimeout(() => setToast(null), 3500);
  };
  const value = useMemo(() => ({ showToast }), []);
  const isSuccess = toast?.tone === "success";
  return (
    <ToastContext.Provider value={value}>
      {children}
      {toast && (
        <div
          role="status"
          className={`fixed right-4 bottom-4 z-50 flex max-w-sm items-start gap-3 border p-4 shadow-lg ${isSuccess ? "border-emerald-200 bg-white text-emerald-900" : "border-amber-200 bg-white text-amber-900"}`}
        >
          <span className={isSuccess ? "text-emerald-600" : "text-amber-600"}>
            {isSuccess ? <CheckCircle2 size={20} /> : <Info size={20} />}
          </span>
          <p className="flex-1 text-sm font-semibold">{toast.message}</p>
          <button
            type="button"
            onClick={() => setToast(null)}
            className="text-slate-500 hover:text-slate-800"
            aria-label="Dismiss notification"
            title="Dismiss notification"
          >
            <X size={18} />
          </button>
        </div>
      )}
    </ToastContext.Provider>
  );
}
// eslint-disable-next-line react-refresh/only-export-components
export function useToast() {
  const context = useContext(ToastContext);
  if (!context) throw new Error("useToast must be used within ToastProvider");
  return context;
}
