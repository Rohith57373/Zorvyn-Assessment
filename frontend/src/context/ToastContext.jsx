import { createContext, useContext, useMemo, useState } from "react";
import ToastViewport from "../components/ui/ToastViewport";

const ToastContext = createContext(null);

export function ToastProvider({ children }) {
  const [toasts, setToasts] = useState([]);

  const removeToast = (id) => {
    setToasts((current) => current.filter((toast) => toast.id !== id));
  };

  const pushToast = ({ type = "info", title, message }) => {
    const id = crypto.randomUUID();
    setToasts((current) => [...current, { id, type, title, message }]);
    window.setTimeout(() => removeToast(id), 4000);
  };

  const value = useMemo(() => ({ pushToast, removeToast }), []);

  return (
    <ToastContext.Provider value={value}>
      {children}
      <ToastViewport toasts={toasts} onDismiss={removeToast} />
    </ToastContext.Provider>
  );
}

export function useToast() {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error("useToast must be used within ToastProvider");
  }
  return context;
}
