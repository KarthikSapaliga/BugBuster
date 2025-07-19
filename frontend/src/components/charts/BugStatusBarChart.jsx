// import {
//   BarChart,
//   Bar,
//   XAxis,
//   YAxis,
//   CartesianGrid,
//   Tooltip,
//   ResponsiveContainer,
//   Legend,
//   Cell
// } from "recharts";

// // ✅ Keep consistent, though colors come from your data props too
// const STATUS_COLORS = {
//   Open: "#f59e0b",
//   "In Progress": "#3b82f6",
//   Resolved: "#10b981",
//   Closed: "#6b7280"
// };

// export default function BugStatusBarChart({ data }) {
//   const axisColor = "#9ca3af";

//   return (
//     <div className="w-full">
//       <div className="w-full h-[300px] rounded-lg">
//         <ResponsiveContainer width="100%" height="100%">
//           <BarChart
//             data={data}
//             margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
//             barCategoryGap="10%" // ✅ Smaller gap → thicker bars
//           >
//             <CartesianGrid
//               stroke="#e5e7eb"
//               strokeDasharray="4 4"
//             />
//             <XAxis
//               dataKey="status"
//               stroke={axisColor}
//               tickLine={false}
//               axisLine={{ stroke: axisColor }}
//               fontSize={12}
//             />
//             <YAxis
//               stroke={axisColor}
//               tickLine={false}
//               axisLine={{ stroke: axisColor }}
//               fontSize={12}
//             />
//             <Tooltip
//               contentStyle={{
//                 borderRadius: "0.5rem",
//                 fontSize: "0.875rem",
//                 boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1)"
//               }}
//               labelStyle={{
//                 fontWeight: "500"
//               }}
//               cursor={{ fill: "#374151", opacity: 0.1 }}
//             />
//             <Bar
//               dataKey="count"
//               radius={[4, 4, 0, 0]}
//               stroke="none"
//             >
//               {data.map((entry, index) => (
//                 <Cell
//                   key={`cell-${index}`}
//                   fill={entry.color || STATUS_COLORS[entry.status] || "#8884d8"}
//                 />
//               ))}
//             </Bar>
//           </BarChart>
//         </ResponsiveContainer>
//       </div>
//     </div>
//   );
// }

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Cell,
} from "recharts";

// Enhanced color palette with gradients
const STATUS_COLORS = {
  Open: "#ef4444",
  "In Progress": "#3b82f6",
  Resolved: "#10b981",
  Closed: "#6b7280",
};

const STATUS_GRADIENTS = {
  Open: "url(#openGradient)",
  "In Progress": "url(#progressGradient)",
  Resolved: "url(#resolvedGradient)",
  Closed: "url(#closedGradient)",
};

export default function BugStatusBarChart({ data }) {
  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      const data = payload[0];
      return (
        <div className="bg-primary-foreground backdrop-blur-lg border-0 rounded-2xl p-5 shadow-2xl ring-1 ring-black/10">
          <div className="flex items-center gap-3 mb-2">
            <div
              className="w-4 h-4 rounded-lg shadow-sm"
              style={{
                backgroundColor: data.payload.color || STATUS_COLORS[label],
              }}
            />
            <p className=" font-bold text-lg">{label}</p>
          </div>
          <p className="text-muted-foreground text-sm">
            Bug Count:{" "}
            <span className=" font-semibold text-lg">{data.value}</span>
          </p>
        </div>
      );
    }
    return null;
  };


  return (
    <div className="w-full h-[350px] rounded-2xl backdrop-blur-sm shadow-inner ">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart
          data={data}
          margin={{ top: 20, right: 30, left: 20, bottom: 25 }}
          barCategoryGap="15%"
        >
          <defs>
            {/* Enhanced gradients for each status */}
            <linearGradient id="openGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#fca5a5" stopOpacity={1} />
              <stop offset="50%" stopColor="#ef4444" stopOpacity={1} />
              <stop offset="100%" stopColor="#dc2626" stopOpacity={1} />
            </linearGradient>

            <linearGradient id="progressGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#93c5fd" stopOpacity={1} />
              <stop offset="50%" stopColor="#3b82f6" stopOpacity={1} />
              <stop offset="100%" stopColor="#1d4ed8" stopOpacity={1} />
            </linearGradient>

            <linearGradient id="resolvedGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#6ee7b7" stopOpacity={1} />
              <stop offset="50%" stopColor="#10b981" stopOpacity={1} />
              <stop offset="100%" stopColor="#047857" stopOpacity={1} />
            </linearGradient>

            <linearGradient id="closedGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#9ca3af" stopOpacity={1} />
              <stop offset="50%" stopColor="#6b7280" stopOpacity={1} />
              <stop offset="100%" stopColor="#4b5563" stopOpacity={1} />
            </linearGradient>

            {/* Glow effect */}
            {/* <filter id="barGlow" x="-50%" y="-50%" width="200%" height="200%">
              <feGaussianBlur stdDeviation="3" result="coloredBlur" />
              <feMerge>
                <feMergeNode in="coloredBlur" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter> */}
          </defs>

          {/* <CartesianGrid
            stroke="#e2e8f0"
            strokeDasharray="3 8"
            strokeOpacity={0.4}
          /> */}

          <XAxis
            dataKey="status"
            stroke="#64748b"
            tickLine={false}
            axisLine={false}
            fontSize={13}
            fontWeight={600}
            dy={10}
            tick={{ fill: "#475569" }}
          />

          <YAxis
            stroke="#64748b"
            tickLine={false}
            axisLine={false}
            fontSize={12}
            fontWeight={500}
            dx={-10}
            tick={{ fill: "#475569" }}
          />

          <Tooltip content={<CustomTooltip />} />

          <Bar
            dataKey="count"
            radius={[8, 8, 4, 4]}
            stroke="none"
            filter="url(#barGlow)"
          >
            {data.map((entry, index) => (
              <Cell
                key={`cell-${index}`}
                fill={
                  STATUS_GRADIENTS[entry.status] ||
                  entry.color ||
                  STATUS_COLORS[entry.status] ||
                  "#8884d8"
                }
              />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
