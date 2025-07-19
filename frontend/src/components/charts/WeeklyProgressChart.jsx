
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend
} from "recharts";
import { useTheme } from "@/contexts/ThemeContext";

const STATUS_COLORS = {
 pending: "#ef4444",   
 completed: "#10b981"  
};

export default function WeeklyProgressChart({ data }) {
  const { resolvedTheme } = useTheme();
  const isDark = resolvedTheme === "dark";

  const axisColor = isDark ? "#6b7280" : "#9ca3af"; 
  const gridColor = isDark ? "#27272a" : "#e5e7eb"; 
  const tooltipBg = isDark ? "#18181b" : "#ffffff";
  const tooltipBorder = isDark ? "#3f3f46" : "#e5e7eb";

  return (
    <div className="w-full h-[280px]  flex items-center justify-center rounded-xl shadow-inner">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart
          data={data}
          margin={{ top: 20, right: 30, left: 0, bottom: 10 }}
        >
          <CartesianGrid
            stroke={gridColor}
            strokeDasharray="4 4"
          />
          <XAxis
            dataKey="day"
            stroke={axisColor}
            tickLine={false}
            axisLine={{ stroke: axisColor }}
          />
          <YAxis
            stroke={axisColor}
            tickLine={false}
            axisLine={{ stroke: axisColor }}
          />
          <Tooltip
            contentStyle={{
              backgroundColor: tooltipBg,
              border: `1px solid ${tooltipBorder}`,
              borderRadius: "0.5rem",
              fontSize: "0.875rem"
            }}
            labelStyle={{ color: axisColor }}
          />
          <Legend
            wrapperStyle={{
              fontSize: "0.75rem"
            }}
          />
          <Line
            type="monotone"
            dataKey="pending"
            name="Pending"
            stroke={STATUS_COLORS.pending}
            strokeWidth={3.5}
            dot={{ r: 4, stroke: STATUS_COLORS.pending, strokeWidth: 2 }}
            activeDot={{ r: 6 }}
          />
          <Line
            type="monotone"
            dataKey="completed"
            name="Completed"
            stroke={STATUS_COLORS.completed}
            strokeWidth={3.5}
            dot={{ r: 4, stroke: STATUS_COLORS.completed, strokeWidth: 2 }}
            activeDot={{ r: 6 }}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}

