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


const data = [
    { day: "Mon", pending: 3, completed: 2 },
    { day: "Tue", pending: 1, completed: 4 },
    { day: "Wed", pending: 2, completed: 3 },
    { day: "Thu", pending: 0, completed: 5 },
    { day: "Fri", pending: 4, completed: 1 },
    { day: "Sat", pending: 2, completed: 3 },
    { day: "Sun", pending: 1, completed: 4 },
];

export default function WeeklyProgressChart() {
    const { resolvedTheme } = useTheme();
    const isDark = resolvedTheme === "dark";

    const axisColor = isDark ? "#6b7280" : "#9ca3af"; // Tailwind gray-500 vs gray-400

    return (
        <div className="w-full h-[260px] flex items-center justify-center">
            <ResponsiveContainer width="95%" height="100%">
                <LineChart
                    data={data}
                    margin={{ top: 20, right: 30, left: 0, bottom: 10 }}
                >
                    <CartesianGrid stroke={isDark ? "#27272a" : "#e5e7eb"} strokeDasharray="4 4" />
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
                            backgroundColor: isDark ? "#18181b" : "#ffffff",
                            border: `1px solid ${isDark ? "#3f3f46" : "#e5e7eb"}`,
                            borderRadius: "0.5rem",
                            fontSize: "0.875rem"
                        }}
                        labelStyle={{ color: axisColor }}
                    />
                    <Legend />
                    <Line
                        type="monotone"
                        dataKey="pending"
                        stroke="#f59e0b" // amber-500
                        strokeWidth={2}
                        dot={{ r: 4 }}
                        activeDot={{ r: 6 }}
                    />
                    <Line
                        type="monotone"
                        dataKey="completed"
                        stroke="#10b981" // emerald-500
                        strokeWidth={2}
                        dot={{ r: 4 }}
                        activeDot={{ r: 6 }}
                    />
                </LineChart>
            </ResponsiveContainer>
        </div>
    );
}
