import { cn } from "../../utils/cn";

function Select({ className, children, ...props }) {
  return (
    <select
      className={cn(
        "w-full rounded-2xl border border-white/10 bg-slate-950/60 px-4 py-3 text-sm text-white outline-none transition focus:border-emerald-300/60",
        className,
      )}
      {...props}
    >
      {children}
    </select>
  );
}

export default Select;
