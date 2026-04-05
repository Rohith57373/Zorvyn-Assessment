import { Cell, Pie, PieChart, ResponsiveContainer, Tooltip } from "recharts";
import { formatCurrency, sentenceCase } from "../../utils/formatters";

const COLORS = ["#34d399", "#38bdf8", "#f59e0b", "#a78bfa", "#fb7185", "#22d3ee"];

function flattenCategories(rows) {
  return rows.flatMap((group) =>
    group.categories.map((item) => ({
      name: `${sentenceCase(group._id)}: ${item.category}`,
      value: item.total,
    })),
  );
}

function CategoryPieChart({ data }) {
  const flattened = flattenCategories(data);

  return (
    <div className="panel rounded-[28px] p-5">
      <div className="mb-5">
        <p className="text-sm text-slate-400">Category mix</p>
        <h3 className="text-xl font-semibold text-white">Breakdown by type and category</h3>
      </div>
      <div className="grid gap-4 lg:grid-cols-[minmax(0,1.1fr)_minmax(220px,0.9fr)]">
        <div className="h-[240px] sm:h-[320px]">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={flattened}
                dataKey="value"
                nameKey="name"
                innerRadius="60%"
                outerRadius="85%"
                paddingAngle={4}
              >
                {flattened.map((entry, index) => (
                  <Cell key={entry.name} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip
                contentStyle={{
                  backgroundColor: "#020617",
                  border: "1px solid rgba(148, 163, 184, 0.16)",
                  borderRadius: 16,
                }}
                formatter={(value) => formatCurrency(value)}
              />
            </PieChart>
          </ResponsiveContainer>
        </div>
        <div className="max-h-[280px] space-y-3 overflow-auto pr-1 sm:max-h-[320px]">
          {flattened.map((entry, index) => (
            <div key={entry.name} className="flex flex-col gap-2 rounded-2xl bg-white/5 px-4 py-3 sm:flex-row sm:items-center sm:justify-between">
              <div className="flex min-w-0 items-center gap-3">
                <span
                  className="h-3 w-3 shrink-0 rounded-full"
                  style={{ backgroundColor: COLORS[index % COLORS.length] }}
                />
                <span className="truncate text-sm text-slate-200">{entry.name}</span>
              </div>
              <span className="text-sm font-medium text-white sm:text-right">{formatCurrency(entry.value)}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default CategoryPieChart;
