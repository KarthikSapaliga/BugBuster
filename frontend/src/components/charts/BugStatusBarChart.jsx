import {
    BarChart,
    Bar,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
    Legend
} from "recharts";
import { useState } from "react";

const data = [
    { status: "Completed", count: 65, color: "#10b981" },
    { status: "Pending", count: 35, color: "#f59e0b" },
    { status: "In Progress", count: 28, color: "#3b82f6" },
    { status: "Overdue", count: 12, color: "#ef4444" }
];

export default function BugStatusBarChart() {

    const axisColor = "#9ca3af";

    return (
        <div className="w-full">
            <div className={`w-full h-[300px] rounded-lg`}>
                <ResponsiveContainer width="100%" height="100%">
                    <BarChart
                        data={data}
                        margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                        barCategoryGap="20%"
                    >
                        <CartesianGrid 
                            stroke={"#e5e7eb"} 
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
                            cursor={{ fill: "#374151" , opacity: 0.1 }}
                        />
                        <Bar
                            dataKey="count"
                            fill="#8884d8"
                            radius={[4, 4, 0, 0]}
                            stroke="none"
                        />
                    </BarChart>
                </ResponsiveContainer>
            </div>
        </div>
    );
}