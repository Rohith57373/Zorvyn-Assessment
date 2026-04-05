import { ArrowRight, ShieldCheck, Sparkles } from "lucide-react";
import { Link } from "react-router-dom";
import CategoryPieChart from "../components/charts/CategoryPieChart";
import TrendsChart from "../components/charts/TrendsChart";
import Skeleton from "../components/ui/Skeleton";
import { useAuth } from "../context/AuthContext";
import useWorkspaceData from "../hooks/useWorkspaceData";
import {
  getAlerts,
  getMonthlySeries,
  getPosture,
  getSnapshotMetrics,
} from "../utils/analytics";
import { formatCompactCurrency, formatCurrency, formatDate } from "../utils/formatters";

function DashboardPage() {
  const { user } = useAuth();
  const { summary, trends, categories, records: recentRecords, loading } = useWorkspaceData({
    role: user.role,
    includeRecords: true,
    recordParams: { limit: 5 },
  });
  const monthlySeries = getMonthlySeries(trends);
  const posture = getPosture(summary, monthlySeries);
  const alerts = getAlerts({
    summary,
    series: monthlySeries,
    categories,
    role: user.role,
  }).slice(0, 3);
  const snapshotMetrics = getSnapshotMetrics(summary, monthlySeries, categories);

  if (loading) {
    return (
      <div className="grid gap-4">
        <div className="grid gap-4 lg:grid-cols-3">
          <Skeleton className="h-36" />
          <Skeleton className="h-36" />
          <Skeleton className="h-36" />
        </div>
        <div className="grid gap-4 xl:grid-cols-[1.2fr_0.8fr]">
          <Skeleton className="h-[380px]" />
          <Skeleton className="h-[380px]" />
        </div>
        <Skeleton className="h-[260px]" />
      </div>
    );
  }

  const accentTone = {
    emerald: "from-emerald-500/25 to-emerald-200/5 text-emerald-100",
    rose: "from-rose-500/25 to-rose-200/5 text-rose-100",
    sky: "from-sky-500/25 to-sky-200/5 text-sky-100",
  };

  const cards = [
    {
      label: "Total income",
      value: formatCompactCurrency(summary?.totalIncome),
      subtext: formatCurrency(summary?.totalIncome),
      tone: "from-emerald-500/25 to-emerald-300/5",
    },
    {
      label: "Total expenses",
      value: formatCompactCurrency(summary?.totalExpenses),
      subtext: formatCurrency(summary?.totalExpenses),
      tone: "from-rose-500/25 to-rose-300/5",
    },
    {
      label: "Net balance",
      value: formatCompactCurrency(summary?.netBalance),
      subtext: formatCurrency(summary?.netBalance),
      tone: "from-sky-500/25 to-sky-300/5",
    },
  ];

  return (
    <div className="grid gap-4">
      <section className="panel overflow-hidden rounded-[28px] border border-white/10 p-4 sm:p-6 lg:rounded-[32px] lg:p-8">
        <div className="grid gap-6 xl:grid-cols-[1.25fr_0.75fr]">
          <div>
            <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3 py-2 text-xs text-slate-300 sm:px-4 sm:text-sm">
              <ShieldCheck size={16} />
              <span>{user.role} workspace</span>
            </div>
            <h3 className="mt-5 max-w-2xl text-3xl font-semibold leading-tight text-white sm:text-4xl">
              Financial control center built for fast decisions, not just passive reporting.
            </h3>
            <p className="mt-4 max-w-2xl text-sm text-slate-300 sm:text-base">
              Inspired by modern dashboard guidance that emphasizes scannable KPIs, clear alerts,
              and actionable drilldowns, this workspace surfaces status first and details second.
            </p>
            <div className="mt-6 flex flex-wrap gap-3">
              {["analyst", "admin"].includes(user.role) ? (
                <>
                  <Link
                    to="/app/insights"
                    className="inline-flex items-center gap-2 rounded-2xl bg-white px-4 py-3 text-sm font-medium text-slate-950 transition hover:bg-emerald-200"
                  >
                    Open insights
                    <ArrowRight size={16} />
                  </Link>
                  <Link
                    to="/app/reports"
                    className="inline-flex items-center gap-2 rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-sm font-medium text-white transition hover:bg-white/10"
                  >
                    Review reports
                  </Link>
                </>
              ) : null}
              {["analyst", "admin"].includes(user.role) ? (
                <Link
                  to="/app/records"
                  className="inline-flex items-center gap-2 rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-sm font-medium text-white transition hover:bg-white/10"
                >
                  Audit records
                </Link>
              ) : null}
              {user.role === "viewer" ? (
                <div className="rounded-2xl border border-dashed border-white/15 bg-white/5 px-4 py-3 text-sm text-slate-300">
                  Viewer accounts can monitor KPIs here. Ask an admin to upgrade this account for records and reporting tools.
                </div>
              ) : null}
            </div>
          </div>

          <div className={`rounded-[24px] bg-gradient-to-br p-4 sm:rounded-[28px] sm:p-5 ${accentTone[posture.tone] || accentTone.sky}`}>
            <div className="flex items-center gap-2 text-sm uppercase tracking-[0.2em] text-white/70">
              <Sparkles size={16} />
              <span>Financial posture</span>
            </div>
            <p className="mt-5 text-2xl font-semibold text-white sm:text-3xl">{posture.label}</p>
            <p className="mt-3 text-sm leading-6 text-white/80">{posture.message}</p>
            <div className="mt-6 grid gap-3 sm:grid-cols-2">
              {snapshotMetrics.map((item) => (
                <div key={item.label} className="rounded-3xl border border-white/10 bg-slate-950/25 px-4 py-4">
                  <p className="text-xs uppercase tracking-[0.18em] text-white/60">{item.label}</p>
                  <p className="mt-3 text-xl font-semibold text-white">{item.value}</p>
                  <p className="mt-2 text-sm text-white/70">{item.detail}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="grid gap-4 lg:grid-cols-3">
        {cards.map((card) => (
          <article
            key={card.label}
            className={`panel rounded-[24px] bg-gradient-to-br p-4 sm:rounded-[28px] sm:p-5 ${card.tone}`}
          >
            <p className="text-sm text-slate-300">{card.label}</p>
            <h3 className="mt-5 text-3xl font-semibold text-white sm:mt-6 sm:text-4xl">{card.value}</h3>
            <p className="mt-3 text-sm text-slate-400">{card.subtext}</p>
          </article>
        ))}
      </section>

      <section className="grid gap-4 xl:grid-cols-[1.2fr_0.8fr]">
        <TrendsChart data={trends} />
        <div className="grid gap-4">
          <CategoryPieChart data={categories} />
          <div className="panel rounded-[28px] p-5">
            <div className="mb-5">
              <p className="text-sm text-slate-400">Action center</p>
              <h3 className="text-xl font-semibold text-white">What needs attention now</h3>
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
        </div>
      </section>

      <section className="grid gap-4 xl:grid-cols-[1fr_0.95fr]">
        <div className="panel rounded-[28px] p-5">
          <div className="mb-5 flex items-center justify-between">
            <div>
              <p className="text-sm text-slate-400">Monthly pulse</p>
              <h3 className="text-xl font-semibold text-white">Recent operating windows</h3>
            </div>
          </div>
          <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
            {monthlySeries.slice(-6).map((month) => (
              <div key={month.key} className="rounded-3xl border border-white/10 bg-white/5 px-4 py-4">
                <p className="text-sm text-slate-400">{month.label}</p>
                <p className="mt-3 text-2xl font-semibold text-white">{formatCompactCurrency(month.net)}</p>
                <div className="mt-4 flex flex-col gap-1 text-sm text-slate-300 sm:flex-row sm:items-center sm:justify-between">
                  <span>In {formatCompactCurrency(month.income)}</span>
                  <span>Out {formatCompactCurrency(month.expense)}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        <section className="panel rounded-[28px] p-5">
          <div className="mb-5 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className="text-sm text-slate-400">Recent activity</p>
              <h3 className="text-xl font-semibold text-white">Latest transactions</h3>
            </div>
            <span className="w-fit rounded-full border border-white/10 px-3 py-1 text-xs uppercase tracking-[0.2em] text-slate-400">
              {user.role}
            </span>
          </div>

          {["analyst", "admin"].includes(user.role) ? (
            <div className="space-y-3">
              {recentRecords.map((record) => (
                <div
                  key={record._id}
                  className="flex flex-col gap-3 rounded-3xl border border-white/10 bg-white/5 px-4 py-4 sm:flex-row sm:items-center sm:justify-between"
                >
                  <div className="min-w-0">
                    <p className="font-medium text-white">{record.category}</p>
                    <p className="mt-1 line-clamp-2 text-sm text-slate-400">{record.notes || "No notes added"}</p>
                  </div>
                  <div className="text-left sm:text-right">
                    <p className="font-medium text-white">{formatCurrency(record.amount)}</p>
                    <p className="mt-1 text-sm text-slate-400">{formatDate(record.date)}</p>
                  </div>
                </div>
              ))}
              {!recentRecords.length ? <p className="text-sm text-slate-400">No recent records found.</p> : null}
            </div>
          ) : (
            <div className="rounded-3xl border border-dashed border-white/15 bg-white/5 px-5 py-8 text-sm text-slate-300">
              Recent transactions are not available for viewers because the backend restricts the records endpoint to analyst and admin roles.
            </div>
          )}
        </section>
      </section>
    </div>
  );
}

export default DashboardPage;
