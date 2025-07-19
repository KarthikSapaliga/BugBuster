
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

export default function MonthlyProgressChart({monthlyData = [
    { month: 'Jan', completed: 45, target: 50 },
    { month: 'Feb', completed: 62, target: 65 },
    { month: 'Mar', completed: 38, target: 55 },
    { month: 'Apr', completed: 71, target: 70 },
    { month: 'May', completed: 89, target: 75 },
    { month: 'Jun', completed: 67, target: 80 },
]}) {

    const CustomTooltip = ({ active, payload, label }) => {
        if (active && payload && payload.length) {
            return (
                <div className="bg-background/95 backdrop-blur-sm border-0 rounded-xl p-4 shadow-2xl ring-1 ring-black/5">
                    <p className="text-primary font-semibold text-base mb-2">{label}</p>
                    {payload.map((entry, index) => (
                        <div key={index} className="flex items-center gap-3 mb-1">
                            <div 
                                className="w-3 h-3 rounded-full" 
                                style={{ backgroundColor: entry.color }}
                            />
                            <span className="text-muted-foreground text-sm font-medium">
                                {entry.name}: <span className="text-primary font-semibold">{entry.value}</span>
                            </span>
                        </div>
                    ))}
                </div>
            );
        }
        return null;
    };

    const CustomLegend = (props) => {
        const { payload } = props;
        return (
            <div className="flex justify-center gap-8 mt-4">
                {payload.map((entry, index) => (
                    <div key={index} className="flex items-center gap-2">
                        <div 
                            className="w-4 h-3 rounded-sm" 
                            style={{ backgroundColor: entry.color }}
                        />
                        <span className="text-primary font-medium text-sm capitalize">
                            {entry.value}
                        </span>
                    </div>
                ))}
            </div>
        );
    };

    return (
            <div className="w-full h-[400px] rounded-xl  backdrop-blur-sm shadow-inner">
                <ResponsiveContainer width="100%" height="100%">
                    <AreaChart
                        data={monthlyData}
                        margin={{ top: 20, right: 30, left: 20, bottom: 20 }}
                    >
                        <defs>
                            <linearGradient id="completedGradient" x1="0" y1="0" x2="0" y2="1">
                                <stop offset="0%" stopColor="#06d6a0" stopOpacity={0.8}/>
                                <stop offset="50%" stopColor="#06d6a0" stopOpacity={0.4}/>
                                <stop offset="100%" stopColor="#06d6a0" stopOpacity={0.1}/>
                            </linearGradient>
                            <linearGradient id="targetGradient" x1="0" y1="0" x2="0" y2="1">
                                <stop offset="0%" stopColor="#8b5cf6" stopOpacity={0.6}/>
                                <stop offset="50%" stopColor="#8b5cf6" stopOpacity={0.3}/>
                                <stop offset="100%" stopColor="#8b5cf6" stopOpacity={0.1}/>
                            </linearGradient>
                            
                            {/* Glow effects */}
                            <filter id="glow">
                                <feGaussianBlur stdDeviation="3" result="coloredBlur"/>
                                <feMerge> 
                                    <feMergeNode in="coloredBlur"/>
                                    <feMergeNode in="SourceGraphic"/>
                                </feMerge>
                            </filter>
                        </defs>
                        
                        <CartesianGrid 
                            strokeDasharray="2 6" 
                            stroke="#e2e8f0"
                            strokeOpacity={0.6}
                        />
                        
                        <XAxis
                            dataKey="month"
                            stroke="#64748b"
                            tickLine={false}
                            axisLine={false}
                            fontSize={13}
                            fontWeight={500}
                            dy={10}
                        />
                        
                        <YAxis
                            stroke="#64748b"
                            tickLine={false}
                            axisLine={false}
                            fontSize={13}
                            fontWeight={500}
                            dx={-10}
                        />
                        
                        <Tooltip content={<CustomTooltip />} />
                        
                        <Legend content={<CustomLegend />} />
                        
                        <Area
                            type="monotone"
                            dataKey="target"
                            stroke="#8b5cf6"
                            fill="url(#targetGradient)"
                            strokeWidth={3}
                            strokeDasharray="8 4"
                            strokeLinecap="round"
                            name="Target"
                            dot={{ fill: '#8b5cf6', r: 5, strokeWidth: 2, stroke: '#ffffff' }}
                            activeDot={{ r: 7, strokeWidth: 3, stroke: '#8b5cf6', fill: '#ffffff' }}
                        />
                        
                        <Area
                            type="monotone"
                            dataKey="completed"
                            stroke="#06d6a0"
                            fill="url(#completedGradient)"
                            strokeWidth={4}
                            strokeLinecap="round"
                            name="Completed"
                            dot={{ fill: '#06d6a0', r: 6, strokeWidth: 2, stroke: '#ffffff' }}
                            activeDot={{ r: 8, strokeWidth: 3, stroke: '#06d6a0', fill: '#ffffff', filter: 'url(#glow)' }}
                        />
                    </AreaChart>
                </ResponsiveContainer>
            </div>
    );
}