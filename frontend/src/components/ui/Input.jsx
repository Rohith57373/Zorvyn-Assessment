import { cn } from "../../utils/cn";

function Input({ className, ...props }) {
  return (
    <input
      className={cn(
        "w-full rounded-2xl border border-white/10 bg-slate-950/60 px-4 py-3 text-sm text-white outline-none transition placeholder:text-slate-500 focus:border-emerald-300/60",
        className,
      )}
      {...props}
    />
  );
}

export default Input;
