import {
  BarChart3,
  CreditCard,
  FileSpreadsheet,
  ShieldCheck,
  Sparkles,
  UserCircle2,
  X,
} from "lucide-react";
import { NavLink } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { cn } from "../../utils/cn";

const navItems = [
  { label: "Dashboard", path: "/app", icon: BarChart3, roles: ["viewer", "analyst", "admin"] },
  { label: "Insights", path: "/app/insights", icon: Sparkles, roles: ["analyst", "admin"] },
  { label: "Reports", path: "/app/reports", icon: FileSpreadsheet, roles: ["analyst", "admin"] },
  { label: "Records", path: "/app/records", icon: CreditCard, roles: ["analyst", "admin"] },
  { label: "Admin Panel", path: "/app/admin", icon: ShieldCheck, roles: ["admin"] },
  { label: "Profile", path: "/app/profile", icon: UserCircle2, roles: ["viewer", "analyst", "admin"] },
];

function Sidebar({ open, onClose }) {
  const { user } = useAuth();

  return (
    <>
      <div
        className={cn(
          "fixed inset-0 z-30 bg-slate-950/70 transition md:hidden",
          open ? "opacity-100" : "pointer-events-none opacity-0",
        )}
        onClick={onClose}
      />
      <aside
        className={cn(
          "panel panel-strong fixed inset-y-4 left-4 z-40 flex w-[280px] flex-col rounded-[28px] p-5 transition md:static md:z-auto md:flex",
          open ? "translate-x-0" : "-translate-x-[120%] md:translate-x-0",
        )}
      >
        <div className="mb-8 flex items-center justify-between">
          <div>
            <p className="text-xs uppercase tracking-[0.35em] text-emerald-300/70">Pulse</p>
            <h1 className="mt-2 text-2xl font-semibold text-white">Finance Hub</h1>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="rounded-full border border-white/10 p-2 text-slate-300 md:hidden"
          >
            <X size={18} />
          </button>
        </div>

        <nav className="flex flex-1 flex-col gap-2">
          {navItems
            .filter((item) => item.roles.includes(user.role))
            .map((item) => {
              const Icon = item.icon;
              return (
                <NavLink
                  key={item.path}
                  to={item.path}
                  onClick={onClose}
                  end={item.path === "/app"}
                  className={({ isActive }) =>
                    cn(
                      "group flex items-center gap-3 rounded-2xl px-4 py-3 text-sm font-medium transition",
                      isActive
                        ? "bg-white text-slate-950 shadow-lg shadow-emerald-950/20"
                        : "text-slate-300 hover:bg-white/5 hover:text-white",
                    )
                  }
                >
                  <Icon size={18} />
                  <span>{item.label}</span>
                </NavLink>
              );
            })}
        </nav>

        <div className="rounded-3xl border border-emerald-400/20 bg-[linear-gradient(145deg,rgba(16,185,129,0.18),rgba(56,189,248,0.12))] p-4">
          <p className="text-xs uppercase tracking-[0.28em] text-emerald-200/60">Access</p>
          <p className="mt-3 text-lg font-semibold text-white">{user.name}</p>
          <p className="mt-1 text-sm text-emerald-100/70">{user.role}</p>
          <p className="mt-3 text-xs text-emerald-100/70">
            Role-aware navigation automatically exposes only the tools this account can use.
          </p>
        </div>
      </aside>
    </>
  );
}

export default Sidebar;
