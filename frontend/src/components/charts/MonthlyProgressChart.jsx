import {
    AreaChart,
    Area,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
    Legend
} from "recharts";
import { useState } from "react";
import { useTheme } from "@/contexts/ThemeContext";

const monthlyData = [
    { month: "Jan", completed: 45, target: 50, pending: 12 },
    { month: "Feb", completed: 52, target: 55, pending: 8 },
    { month: "Mar", completed: 61, target: 60, pending: 15 },
    { month: "Apr", completed: 48, target: 50, pending: 18 },
    { month: "May", completed: 67, target: 65, pending: 10 },
    { month: "Jun", completed: 73, target: 70, pending: 14 },
    { month: "Jul", completed: 58, target: 60, pending: 22 },
    { month: "Aug", completed: 71, target: 75, pending: 9 },
    { month: "Sep", completed: 84, target: 80, pending: 16 },
    { month: "Oct", completed: 79, target: 85, pending: 11 },
    { month: "Nov", completed: 92, target: 90, pending: 7 },
    { month: "Dec", completed: 88, target: 95, pending: 13 }
];

export default function MonthlyProgressChart() {

    const axisColor =  "#9ca3af";

    // Calculate total and achievement rate
    const totalCompleted = monthlyData.reduce((sum, month) => sum + month.completed, 0);
    const totalTarget = monthlyData.reduce((sum, month) => sum + month.target, 0);

    return (
        <div className="w-full">

            {/* Chart */}
            <div className={`w-full h-[350px] rounded-lg`}>
                <ResponsiveContainer width="100%" height="100%">
                    <AreaChart
                        data={monthlyData}
                        margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                    >
                        <defs>
                            <linearGradient id="completedGradient" x1="0" y1="0" x2="0" y2="1">
                                <stop offset="5%" stopColor="#10b981" stopOpacity={0.3}/>
                                <stop offset="95%" stopColor="#10b981" stopOpacity={0.05}/>
                            </linearGradient>
                            <linearGradient id="targetGradient" x1="0" y1="0" x2="0" y2="1">
                                <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.2}/>
                                <stop offset="95%" stopColor="#3b82f6" stopOpacity={0.05}/>
                            </linearGradient>
                        </defs>
                        
                        <CartesianGrid 
                            strokeDasharray="4 4" 
                        />
                        
                        <XAxis
                            dataKey="month"
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
                            formatter={(value, name) => [
                                value,
                                name === 'completed' ? 'Completed' : 
                                name === 'target' ? 'Target' : 'Pending'
                            ]}
                        />
                        
                        <Legend />
                        
                        <Area
                            type="monotone"
                            dataKey="target"
                            stroke="#3b82f6"
                            fillOpacity={1}
                            fill="url(#targetGradient)"
                            strokeWidth={2}
                            strokeDasharray="5 5"
                        />
                        
                        <Area
                            type="monotone"
                            dataKey="completed"
                            stroke="#10b981"
                            fillOpacity={1}
                            fill="url(#completedGradient)"
                            strokeWidth={3}
                        />
                    </AreaChart>
                </ResponsiveContainer>
            </div>
        </div>
    );
}