import {
  CartesianGrid,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { formatCurrency, formatMonthLabel } from "../../utils/formatters";

function normalizeTrends(rows) {
  const grouped = rows.reduce((acc, item) => {
    const key = `${item._id.year}-${item._id.month}`;
    const current = acc[key] || {
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

  return Object.values(grouped);
}

function TrendsChart({ data }) {
  const normalized = normalizeTrends(data);
  const isSmallScreen = typeof window !== "undefined" && window.innerWidth < 640;

  return (
    <div className="panel rounded-[28px] p-5">
      <div className="mb-5">
        <p className="text-sm text-slate-400">Monthly trends</p>
        <h3 className="text-xl font-semibold text-white">Income vs. expense trajectory</h3>
      </div>
      <div className="h-[240px] sm:h-[320px]">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={normalized} margin={{ top: 8, right: 8, left: isSmallScreen ? -24 : 0, bottom: 0 }}>
            <CartesianGrid stroke="rgba(148, 163, 184, 0.12)" vertical={false} />
            <XAxis
              dataKey="label"
              stroke="#64748b"
              tickLine={false}
              axisLine={false}
              interval="preserveStartEnd"
              minTickGap={isSmallScreen ? 28 : 18}
              tick={{ fontSize: isSmallScreen ? 11 : 12 }}
            />
            {!isSmallScreen ? (
              <YAxis
                stroke="#64748b"
                tickLine={false}
                axisLine={false}
                width={80}
                tickFormatter={(value) => formatCurrency(value)}
              />
            ) : null}
            <Tooltip
              contentStyle={{
                backgroundColor: "#020617",
                border: "1px solid rgba(148, 163, 184, 0.16)",
                borderRadius: 16,
              }}
              labelStyle={{ color: "#e2e8f0", fontSize: 12 }}
              formatter={(value) => formatCurrency(value)}
            />
            <Line type="monotone" dataKey="income" stroke="#34d399" strokeWidth={3} dot={false} />
            <Line type="monotone" dataKey="expense" stroke="#f87171" strokeWidth={3} dot={false} />
            <Line type="monotone" dataKey="net" stroke="#38bdf8" strokeWidth={2} dot={false} />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}

export default TrendsChart;
