import { Lightbulb, ShieldAlert, TrendingUp } from "lucide-react";
import Skeleton from "../components/ui/Skeleton";
import { useAuth } from "../context/AuthContext";
import useWorkspaceData from "../hooks/useWorkspaceData";
import {
  getAlerts,
  getCategoryTotals,
  getMonthlySeries,
  getPosture,
  getSnapshotMetrics,
} from "../utils/analytics";
import { formatCompactCurrency, formatCurrency } from "../utils/formatters";

function InsightsPage() {
  const { user } = useAuth();
  const { summary, trends, categories, records, loading } = useWorkspaceData({
    role: user.role,
    includeRecords: true,
    recordParams: { limit: 24 },
  });

  if (loading) {
    return (
      <div className="grid gap-4">
        <Skeleton className="h-48" />
        <Skeleton className="h-96" />
      </div>
    );
  }

  const monthlySeries = getMonthlySeries(trends);
  const posture = getPosture(summary, monthlySeries);
  const alerts = getAlerts({ summary, series: monthlySeries, categories, role: user.role });
  const snapshots = getSnapshotMetrics(summary, monthlySeries, categories);
  const categoryTotals = getCategoryTotals(categories).slice(0, 6);
  const latestMonth = monthlySeries.at(-1);

  return (
    <div className="grid gap-4">
      <section className="panel rounded-[28px] p-4 sm:p-6 lg:rounded-[32px] lg:p-8">
        <div className="grid gap-6 xl:grid-cols-[1.1fr_0.9fr]">
          <div>
            <p className="text-sm uppercase tracking-[0.25em] text-sky-300/70">Insights studio</p>
            <h3 className="mt-4 text-3xl font-semibold leading-tight text-white sm:text-4xl">
              Signals, risk cues, and next-step suggestions from your live finance data.
            </h3>
            <p className="mt-4 max-w-2xl text-sm text-slate-300 sm:text-base">
              Good dashboards do more than report totals. They highlight changes, concentration,
              and the specific actions a team should consider next.
            </p>
          </div>
          <div className="rounded-[28px] border border-white/10 bg-[linear-gradient(135deg,rgba(56,189,248,0.16),rgba(15,23,42,0.4))] p-5">
            <p className="text-sm text-slate-300">Current posture</p>
            <p className="mt-3 text-3xl font-semibold text-white">{posture.label}</p>
            <p className="mt-3 text-sm text-slate-300">{posture.message}</p>
            <div className="mt-6 grid gap-3 sm:grid-cols-2">
              {snapshots.map((item) => (
                <div key={item.label} className="rounded-3xl border border-white/10 bg-slate-950/30 px-4 py-4">
                  <p className="text-xs uppercase tracking-[0.18em] text-slate-400">{item.label}</p>
                  <p className="mt-3 text-xl font-semibold text-white">{item.value}</p>
                  <p className="mt-2 text-sm text-slate-300">{item.detail}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="grid gap-4 xl:grid-cols-[0.95fr_1.05fr]">
        <div className="panel rounded-[28px] p-5">
          <div className="mb-5 flex items-center gap-2">
            <ShieldAlert size={18} className="text-amber-300" />
            <div>
              <p className="text-sm text-slate-400">Risk and focus</p>
              <h3 className="text-xl font-semibold text-white">Alert stream</h3>
            </div>
          </div>
          <div className="space-y-3">
            {alerts.map((alert) => (
              <div key={alert.title} className="rounded-3xl border border-white/10 bg-white/5 px-4 py-4">
                <div className="flex items-center justify-between gap-3">
                  <p className="font-medium text-white">{alert.title}</p>
                  <span className="rounded-full bg-white/10 px-3 py-1 text-xs uppercase tracking-[0.18em] text-slate-300">
                    {alert.tone}
                  </span>
                </div>
                <p className="mt-2 text-sm text-slate-300">{alert.body}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="panel rounded-[28px] p-5">
          <div className="mb-5 flex items-center gap-2">
            <TrendingUp size={18} className="text-emerald-300" />
            <div>
              <p className="text-sm text-slate-400">Momentum</p>
              <h3 className="text-xl font-semibold text-white">Last 6 months</h3>
            </div>
          </div>
          <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
            {monthlySeries.slice(-6).map((month) => (
              <div key={month.key} className="rounded-3xl border border-white/10 bg-white/5 px-4 py-4">
                <p className="text-sm text-slate-400">{month.label}</p>
                <p className="mt-3 text-2xl font-semibold text-white">{formatCompactCurrency(month.net)}</p>
                <p className="mt-2 text-sm text-slate-300">
                  Income {formatCompactCurrency(month.income)} · Expense {formatCompactCurrency(month.expense)}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="grid gap-4 xl:grid-cols-[1.05fr_0.95fr]">
        <div className="panel rounded-[28px] p-5">
          <div className="mb-5 flex items-center gap-2">
            <Lightbulb size={18} className="text-sky-300" />
            <div>
              <p className="text-sm text-slate-400">Recommendations</p>
              <h3 className="text-xl font-semibold text-white">Suggested next actions</h3>
            </div>
          </div>
          <div className="space-y-3">
            <div className="rounded-3xl border border-white/10 bg-white/5 px-4 py-4 text-sm text-slate-300">
              Review the latest month against your dominant category to confirm whether the current trend is structural or temporary.
            </div>
            <div className="rounded-3xl border border-white/10 bg-white/5 px-4 py-4 text-sm text-slate-300">
              Use the Reports page to inspect month-by-month totals and export records if the finance team needs an offline handoff.
            </div>
            <div className="rounded-3xl border border-white/10 bg-white/5 px-4 py-4 text-sm text-slate-300">
              {user.role === "viewer"
                ? "If you need transaction-level access, ask an admin to promote this account to analyst."
                : "Use the Records page to validate outliers and clean up miscategorized entries before the next reporting cycle."}
            </div>
          </div>
        </div>

        <div className="panel rounded-[28px] p-5">
          <p className="text-sm text-slate-400">Category pressure</p>
          <h3 className="mt-2 text-xl font-semibold text-white">Top categories by volume</h3>
          <div className="mt-5 space-y-3">
            {categoryTotals.map((item, index) => (
              <div key={`${item.type}-${item.category}`} className="rounded-3xl border border-white/10 bg-white/5 px-4 py-4">
                <div className="flex items-center justify-between gap-3">
                  <div>
                    <p className="font-medium text-white">{item.category}</p>
                    <p className="mt-1 text-sm text-slate-400">
                      {item.type} · rank #{index + 1}
                    </p>
                  </div>
                  <p className="text-sm font-medium text-white">{formatCurrency(item.total)}</p>
                </div>
              </div>
            ))}
          </div>
          {latestMonth ? (
            <div className="mt-5 rounded-3xl border border-emerald-400/15 bg-emerald-500/10 px-4 py-4 text-sm text-emerald-100">
              Latest month snapshot: {latestMonth.label} closed at {formatCurrency(latestMonth.net)} net.
            </div>
          ) : null}
          {records.length ? (
            <div className="mt-3 rounded-3xl border border-white/10 bg-white/5 px-4 py-4 text-sm text-slate-300">
              {records.length} recent transaction records were used to enrich analyst/admin insight views.
            </div>
          ) : null}
        </div>
      </section>
    </div>
  );
}

export default InsightsPage;
