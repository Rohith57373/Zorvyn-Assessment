import { formatCompactCurrency, formatCurrency, formatMonthLabel } from "./formatters";

export function getMonthlySeries(rows = []) {
  const grouped = rows.reduce((acc, item) => {
    const key = `${item._id.year}-${String(item._id.month).padStart(2, "0")}`;
    const current = acc[key] || {
      key,
      label: formatMonthLabel(item._id.year, item._id.month),
      income: 0,
      expense: 0,
      net: 0,
    };

    current[item._id.type] = item.totalAmount;
    current.net = current.income - current.expense;
    acc[key] = current;
    return acc;
  }, {});

  return Object.values(grouped).sort((a, b) => a.key.localeCompare(b.key));
}

export function getCategoryTotals(rows = []) {
  return rows
    .flatMap((group) =>
      group.categories.map((item) => ({
        type: group._id,
        category: item.category,
        total: item.total,
      })),
    )
    .sort((a, b) => b.total - a.total);
}

export function getPosture(summary, series) {
  const latest = series.at(-1);
  if (!summary) {
    return {
      label: "Loading",
      tone: "sky",
      message: "Pulling the latest financial state from the API.",
    };
  }

  if (summary.netBalance > 0 && latest?.net >= 0) {
    return {
      label: "Healthy runway",
      tone: "emerald",
      message: "Net position is positive and the latest monthly movement is still above zero.",
    };
  }

  if (summary.netBalance < 0 || latest?.net < 0) {
    return {
      label: "Pressure building",
      tone: "rose",
      message: "Expenses are outpacing income in at least one key view and need attention.",
    };
  }

  return {
    label: "Balanced",
    tone: "sky",
    message: "The business is near breakeven. Watch upcoming expenses closely.",
  };
}

export function getAlerts({ summary, series, categories, role }) {
  const alerts = [];
  const latest = series.at(-1);
  const previous = series.at(-2);
  const totalCategories = getCategoryTotals(categories);
  const largestCategory = totalCategories[0];
  const totalCategorySpend = totalCategories.reduce((sum, item) => sum + item.total, 0);

  if (summary?.netBalance < 0) {
    alerts.push({
      title: "Net balance is negative",
      tone: "rose",
      body: `Overall balance is ${formatCurrency(summary.netBalance)}. Review expense-heavy categories first.`,
    });
  }

  if (latest && previous && latest.expense > previous.expense * 1.2) {
    alerts.push({
      title: "Expenses jumped month-over-month",
      tone: "amber",
      body: `${latest.label} expenses rose sharply versus ${previous.label}. Check operational spend and unusual entries.`,
    });
  }

  if (largestCategory && totalCategorySpend > 0 && largestCategory.total / totalCategorySpend > 0.35) {
    alerts.push({
      title: "Category concentration is high",
      tone: "sky",
      body: `${largestCategory.category} accounts for a large share of tracked volume. Diversify or monitor that line closely.`,
    });
  }

  if (role === "viewer") {
    alerts.push({
      title: "Viewer access is overview-only",
      tone: "slate",
      body: "For transaction-level analysis or exports, an admin can upgrade this account to analyst or admin.",
    });
  }

  if (!alerts.length) {
    alerts.push({
      title: "No major signals detected",
      tone: "emerald",
      body: "Current KPI patterns look stable. Keep watching top categories and monthly net movement.",
    });
  }

  return alerts;
}

export function getSnapshotMetrics(summary, series, categories) {
  const latest = series.at(-1);
  const topCategories = getCategoryTotals(categories).slice(0, 3);
  const burnRate = latest?.expense || 0;
  const avgNet =
    series.length > 0 ? series.reduce((sum, item) => sum + item.net, 0) / series.length : 0;

  return [
    {
      label: "Monthly burn",
      value: formatCompactCurrency(burnRate),
      detail: latest ? `${latest.label} expense load` : "No trend data yet",
    },
    {
      label: "Average net",
      value: formatCompactCurrency(avgNet),
      detail: `${series.length || 0} months observed`,
    },
    {
      label: "Dominant category",
      value: topCategories[0]?.category || "N/A",
      detail: topCategories[0] ? formatCurrency(topCategories[0].total) : "No category data",
    },
    {
      label: "Financial posture",
      value: getPosture(summary, series).label,
      detail: getPosture(summary, series).message,
    },
  ];
}
