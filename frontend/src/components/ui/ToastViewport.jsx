import { CheckCircle2, CircleAlert, Info, X } from "lucide-react";

const iconMap = {
  success: CheckCircle2,
  error: CircleAlert,
  info: Info,
};

function ToastViewport({ toasts, onDismiss }) {
  return (
    <div className="pointer-events-none fixed right-4 top-4 z-[100] flex w-full max-w-sm flex-col gap-3">
      {toasts.map((toast) => {
        const Icon = iconMap[toast.type] || Info;
        return (
          <div
            key={toast.id}
            className="pointer-events-auto panel rounded-2xl border border-white/10 px-4 py-3"
          >
            <div className="flex items-start gap-3">
              <div className="mt-0.5 rounded-full bg-white/10 p-2">
                <Icon size={16} />
              </div>
              <div className="min-w-0 flex-1">
                <p className="font-medium text-white">{toast.title}</p>
                <p className="mt-1 text-sm text-slate-300">{toast.message}</p>
              </div>
              <button type="button" onClick={() => onDismiss(toast.id)} className="text-slate-400">
                <X size={16} />
              </button>
            </div>
          </div>
        );
      })}
    </div>
  );
}

export default ToastViewport;
