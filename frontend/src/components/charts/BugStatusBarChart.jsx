import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
  Cell
} from "recharts";

// ✅ Keep consistent, though colors come from your data props too
const STATUS_COLORS = {
  Open: "#f59e0b",
  "In Progress": "#3b82f6",
  Resolved: "#10b981",
  Closed: "#6b7280"
};

export default function BugStatusBarChart({ data }) {
  const axisColor = "#9ca3af";

  return (
    <div className="w-full">
      <div className="w-full h-[300px] rounded-lg">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            data={data}
            margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
            barCategoryGap="10%" // ✅ Smaller gap → thicker bars
          >
            <CartesianGrid
              stroke="#e5e7eb"
              strokeDasharray="4 4"
            />
            <XAxis
              dataKey="status"
              stroke={axisColor}
              tickLine={false}
              axisLine={{ stroke: axisColor }}
              fontSize={12}
            />
            <YAxis
              stroke={axisColor}
              tickLine={false}
              axisLine={{ stroke: axisColor }}
              fontSize={12}
            />
            <Tooltip
              contentStyle={{
                borderRadius: "0.5rem",
                fontSize: "0.875rem",
                boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1)"
              }}
              labelStyle={{
                fontWeight: "500"
              }}
              cursor={{ fill: "#374151", opacity: 0.1 }}
            />
            <Bar
              dataKey="count"
              radius={[4, 4, 0, 0]}
              stroke="none"
            >
              {data.map((entry, index) => (
                <Cell
                  key={`cell-${index}`}
                  fill={entry.color || STATUS_COLORS[entry.status] || "#8884d8"}
                />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
