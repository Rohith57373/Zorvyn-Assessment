import { Download, FileSpreadsheet } from "lucide-react";
import { useState } from "react";
import Button from "../components/ui/Button";
import Skeleton from "../components/ui/Skeleton";
import { useAuth } from "../context/AuthContext";
import useWorkspaceData from "../hooks/useWorkspaceData";
import { recordsApi } from "../services/api";
import { getCategoryTotals, getMonthlySeries } from "../utils/analytics";
import { formatCurrency } from "../utils/formatters";

function toCsv(records) {
  const header = ["date", "category", "type", "amount", "notes", "user"];
  const lines = records.map((record) =>
    [
      record.date,
      record.category,
      record.type,
      record.amount,
      (record.notes || "").replace(/"/g, '""'),
      record.user?.name || "",
    ]
      .map((value) => `"${String(value ?? "")}"`)
      .join(","),
  );

  return [header.join(","), ...lines].join("\n");
}

function ReportsPage() {
  const { user } = useAuth();
  const { trends, categories, loading } = useWorkspaceData({
    role: user.role,
    includeRecords: false,
  });
  const [exporting, setExporting] = useState(false);

  const monthlySeries = getMonthlySeries(trends).slice(-12).reverse();
  const categoryTotals = getCategoryTotals(categories).slice(0, 10);

  const exportRecords = async () => {
    if (!["analyst", "admin"].includes(user.role)) return;

    setExporting(true);
    try {
      const firstPage = await recordsApi.getRecords({ page: 1, limit: 100 });
      let records = [...firstPage.data];

      for (let page = 2; page <= firstPage.meta.pages; page += 1) {
        const response = await recordsApi.getRecords({ page, limit: 100 });
        records = records.concat(response.data);
      }

      const blob = new Blob([toCsv(records)], { type: "text/csv;charset=utf-8;" });
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = "finance-records-export.csv";
      link.click();
      URL.revokeObjectURL(url);
    } finally {
      setExporting(false);
    }
  };

  if (loading) {
    return (
      <div className="grid gap-4">
        <Skeleton className="h-40" />
        <Skeleton className="h-[520px]" />
      </div>
    );
  }

  return (
    <div className="grid gap-4">
      <section className="panel rounded-[32px] p-6 lg:p-8">
        <div className="flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <p className="text-sm uppercase tracking-[0.25em] text-sky-300/70">Reports workspace</p>
            <h3 className="mt-4 text-4xl font-semibold leading-tight text-white">
              Monthly reporting and category review in one place.
            </h3>
            <p className="mt-4 max-w-3xl text-base text-slate-300">
              This page turns the raw dashboard streams into a report-style view with monthly totals,
              category rankings, and analyst/admin export support.
            </p>
          </div>
          <div className="flex flex-wrap gap-3">
            <Button
              onClick={exportRecords}
              disabled={!["analyst", "admin"].includes(user.role) || exporting}
              className="gap-2"
            >
              <Download size={16} />
              {exporting ? "Exporting..." : "Export records CSV"}
            </Button>
          </div>
        </div>
      </section>

      <section className="grid gap-4 xl:grid-cols-[1.2fr_0.8fr]">
        <div className="panel rounded-[28px] p-5">
          <div className="mb-5 flex items-center gap-2">
            <FileSpreadsheet size={18} className="text-emerald-300" />
            <div>
              <p className="text-sm text-slate-400">Monthly report</p>
              <h3 className="text-xl font-semibold text-white">Latest 12 periods</h3>
            </div>
          </div>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-white/10 text-left">
              <thead className="text-xs uppercase tracking-[0.18em] text-slate-400">
                <tr>
                  <th className="px-4 py-4">Month</th>
                  <th className="px-4 py-4">Income</th>
                  <th className="px-4 py-4">Expense</th>
                  <th className="px-4 py-4">Net</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {monthlySeries.map((month) => (
                  <tr key={month.key} className="text-sm text-slate-200">
                    <td className="px-4 py-4 font-medium text-white">{month.label}</td>
                    <td className="px-4 py-4">{formatCurrency(month.income)}</td>
                    <td className="px-4 py-4">{formatCurrency(month.expense)}</td>
                    <td className={`px-4 py-4 font-medium ${month.net >= 0 ? "text-emerald-200" : "text-rose-200"}`}>
                      {formatCurrency(month.net)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <div className="panel rounded-[28px] p-5">
          <p className="text-sm text-slate-400">Category leaderboard</p>
          <h3 className="mt-2 text-xl font-semibold text-white">Top tracked categories</h3>
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
          {!["analyst", "admin"].includes(user.role) ? (
            <div className="mt-5 rounded-3xl border border-dashed border-white/15 bg-white/5 px-4 py-4 text-sm text-slate-300">
              CSV export is limited to analyst and admin roles because the backend restricts record access for viewers.
            </div>
          ) : null}
        </div>
      </section>
    </div>
  );
}

export default ReportsPage;
