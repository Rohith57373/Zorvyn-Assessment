import { cn } from "../../utils/cn";

function Button({
  children,
  className,
  variant = "primary",
  type = "button",
  disabled,
  ...props
}) {
  const variants = {
    primary: "bg-white text-slate-950 hover:bg-emerald-200",
    secondary: "border border-white/10 bg-white/5 text-white hover:bg-white/10",
    danger: "bg-rose-500 text-white hover:bg-rose-400",
    ghost: "text-slate-300 hover:bg-white/5 hover:text-white",
  };

  return (
    <button
      type={type}
      disabled={disabled}
      className={cn(
        "inline-flex items-center justify-center rounded-2xl px-4 py-2.5 text-sm font-medium transition disabled:cursor-not-allowed disabled:opacity-60",
        variants[variant],
        className,
      )}
      {...props}
    >
      {children}
    </button>
  );
}

export default Button;
