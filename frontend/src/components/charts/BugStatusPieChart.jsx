// import {
//     PieChart,
//     Pie,
//     Cell,
//     Tooltip,
//     Legend,
//     ResponsiveContainer
// } from "recharts";


// const COLORS = ["#00C49F", "#FFBB28", "#FF8042"];

// export default function BugStatusPieChart({data}) {
//     return (
//         <div className="w-full h-64">
//             <ResponsiveContainer width="100%" height="100%">
//                 <PieChart>
//                     <Pie
//                         data={data}
//                         dataKey="value"
//                         nameKey="status"
//                         cx="50%"
//                         cy="50%"
//                         outerRadius={75}
//                     >
//                         {data.map((entry, index) => (
//                             <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
//                         ))}
//                     </Pie>
//                     <Tooltip />
//                     <Legend />
//                 </PieChart>
//             </ResponsiveContainer>
//         </div>
//     );
// }

import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  Legend,
  ResponsiveContainer
} from "recharts";

// ✅ Match your backend & analytics keys
const STATUS_COLORS = {
  Open: "#f59e0b",          // amber
  "In Progress": "#3b82f6", // blue
  Resolved: "#10b981",      // green
  Closed: "#6b7280"         // gray
};

export default function BugStatusPieChart({ data }) {
  return (
    <div className="w-full h-64">
      <ResponsiveContainer width="100%" height="100%">
        <PieChart>
          <Pie
            data={data}
            dataKey="value"
            nameKey="status"
            cx="50%"
            cy="50%"
            outerRadius={75}
          >
            {data.map((entry, index) => (
              <Cell
                key={`cell-${index}`}
                fill={STATUS_COLORS[entry.status] || "#8884d8"} // fallback
              />
            ))}
          </Pie>
          <Tooltip />
          <Legend />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
}
