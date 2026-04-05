import { Activity, Bell, Menu, Search } from "lucide-react";
import { useLocation } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

const titles = {
  "/app": "Dashboard",
  "/app/insights": "Insights",
  "/app/reports": "Reports",
  "/app/records": "Records",
  "/app/admin": "Admin Panel",
  "/app/profile": "Profile",
  "/app/unauthorized": "Unauthorized",
};

function Topbar({ onMenuClick }) {
  const location = useLocation();
  const { user } = useAuth();
  const now = new Date().toLocaleString("en-US", {
    month: "short",
    day: "numeric",
    hour: "numeric",
    minute: "2-digit",
  });

  return (
    <header className="panel flex items-center justify-between rounded-[28px] px-4 py-4 sm:px-6">
      <div className="flex items-center gap-3">
        <button
          type="button"
          onClick={onMenuClick}
          className="rounded-full border border-white/10 p-2 text-slate-300 md:hidden"
        >
          <Menu size={18} />
        </button>
        <div>
          <p className="text-sm text-slate-400">Operational finance workspace</p>
          <h2 className="text-2xl font-semibold text-white">
            {titles[location.pathname] || "Pulse Finance"}
          </h2>
        </div>
      </div>

      <div className="hidden items-center gap-3 md:flex">
        <div className="flex items-center gap-3 rounded-full border border-white/10 bg-white/5 px-4 py-2 text-sm text-slate-400">
          <Search size={16} />
          <span>Actionable finance workspace for {user.role}</span>
        </div>
        <div className="flex items-center gap-2 rounded-full border border-emerald-400/15 bg-emerald-500/10 px-4 py-2 text-sm text-emerald-100">
          <Activity size={16} />
          <span>Live sync</span>
        </div>
        <div className="rounded-full border border-white/10 bg-white/5 px-4 py-2 text-sm text-slate-300">
          {now}
        </div>
        <button type="button" className="rounded-full border border-white/10 p-2 text-slate-300">
          <Bell size={18} />
        </button>
      </div>
    </header>
  );
}

export default Topbar;
