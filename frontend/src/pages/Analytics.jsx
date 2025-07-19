// import React, { useEffect, useState } from "react";
// import WeeklyProgressChart from "@/components/charts/WeeklyProgressChart";
// import BugStatusPieChart from "@/components/charts/BugStatusPieChart";
// import History from "@/components/History";
// import BugStatusBarChart from "@/components/charts/BugStatusBarChart";
// import MonthlyProgressChart from "@/components/charts/MonthlyProgressChart";
// import Stats from "@/components/Stats";
// import { useAppStore } from "@/store/store";
// import { getBugAnalyticsData } from "@/lib/analytics";
// import { apiClient } from "@/lib/axios";
// import { GET_ALL_BUGS_ROUTE } from "@/lib/routes";

// function Analytics() {
//   const { token } = useAppStore();
//   const [bugs, setBugs] = useState([]);
//   const [barData,setBarData] = useState([]);
//   const [pieData,setPieData] = useState([]);
//   const [weeklyData,setWeeklyData] = useState([]);


//   useEffect(() => {
//     async function fetchAllIssues() {
//       const res = await apiClient.get(GET_ALL_BUGS_ROUTE, {
//         headers: { Authorization: `Bearer ${token}` },
//       });
//       setBugs(res.data);
//     }
//     const {barData , pieData , weeklyProgress} = getBugAnalyticsData(bugs);
//     setBarData(barData);
//     setPieData(pieData);
//     setWeeklyData(weeklyProgress);
//     fetchAllIssues();
//   }, [bugs]);

//   return (
//     <main className="p-4 md:p-8 lg:p-12 flex flex-col gap-6 bg-background">
//       {/* Stats*/}
//       <Stats />

//       {/* Charts */}
//       <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
//         <div className="col-span-3 bg-white dark:bg-zinc-900 border border-border shadow-md rounded-xl p-6">
//           <h2 className="text-lg font-semibold text-foreground mb-4">
//             Weekly Progress
//           </h2>
//           <WeeklyProgressChart data={weeklyData} />
//         </div>
//         <div className="col-span-1 bg-white dark:bg-zinc-900 border border-border shadow-md rounded-xl p-6">
//           <h2 className="text-lg font-semibold text-foreground mb-4">
//             Bug Status
//           </h2>
//           <BugStatusPieChart data= {pieData} />
//         </div>
//       </div>
//       <div className="grid grid-cols-1 md:grid-cols-5 gap-6">
//         <div className="col-span-3 bg-white dark:bg-zinc-900 border border-border shadow-md rounded-xl p-6">
//           <h2 className="text-lg font-semibold text-foreground mb-4">
//             Monthly Progress
//           </h2>
//           <MonthlyProgressChart  />
//         </div>
//         <div className="col-span-2 bg-white dark:bg-zinc-900 border border-border shadow-md rounded-xl p-6">
//           <h2 className="text-lg font-semibold text-foreground mb-4">
//             Bug Status Bar Chart
//           </h2>
//           <BugStatusBarChart data = {barData} />
//         </div>
//       </div>

//       {/* History */}
//       <div className="bg-white dark:bg-zinc-900 border border-border shadow-md rounded-xl p-6">
//         <h2 className="text-xl font-semibold text-foreground mb-4">History</h2>
//         <History />
//       </div>
//     </main>
//   );
// }

// export default Analytics;

import React, { useEffect, useState } from "react";
import WeeklyProgressChart from "@/components/charts/WeeklyProgressChart";
import BugStatusPieChart from "@/components/charts/BugStatusPieChart";
import History from "@/components/History";
import BugStatusBarChart from "@/components/charts/BugStatusBarChart";
import MonthlyProgressChart from "@/components/charts/MonthlyProgressChart";
import Stats from "@/components/Stats";
import { useAppStore } from "@/store/store";
import { getBugAnalyticsData } from "@/lib/analytics";
import { apiClient } from "@/lib/axios";
import { GET_ALL_BUGS_ROUTE } from "@/lib/routes";

function Analytics() {
  const { token } = useAppStore();
  const [bugs, setBugs] = useState([]);
  const [barData, setBarData] = useState([]);
  const [pieData, setPieData] = useState([]);
  const [weeklyData, setWeeklyData] = useState([]);

  useEffect(() => {
    async function fetchAllIssues() {
      try {
        const res = await apiClient.get(GET_ALL_BUGS_ROUTE, {
          headers: { Authorization: `Bearer ${token}` },
        });
        const bugsData = res.data;

        setBugs(bugsData);

        const { barData, pieData, weeklyProgress } = getBugAnalyticsData(bugsData);
        setBarData(barData);
        setPieData(pieData);
        setWeeklyData(weeklyProgress);
      } catch (err) {
        console.error("Failed to fetch bugs:", err);
      }
    }

    fetchAllIssues();
  }, [token]);

  return (
    <main className="p-4 md:p-8 lg:p-12 flex flex-col gap-6 bg-background">
      {/* Stats */}
      <Stats />

      {/* Charts */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="col-span-3 bg-white dark:bg-zinc-900 border border-border shadow-md rounded-xl p-6">
          <h2 className="text-lg font-semibold text-foreground mb-4">
            Weekly Progress
          </h2>
          <WeeklyProgressChart data={weeklyData} />
        </div>
        <div className="col-span-1 bg-white dark:bg-zinc-900 border border-border shadow-md rounded-xl p-6">
          <h2 className="text-lg font-semibold text-foreground mb-4">
            Bug Status
          </h2>
          <BugStatusPieChart data={pieData} />
        </div>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-5 gap-6">
        <div className="col-span-3 bg-white dark:bg-zinc-900 border border-border shadow-md rounded-xl p-6">
          <h2 className="text-lg font-semibold text-foreground mb-4">
            Monthly Progress
          </h2>
          <MonthlyProgressChart />
        </div>
        <div className="col-span-2 bg-white dark:bg-zinc-900 border border-border shadow-md rounded-xl p-6">
          <h2 className="text-lg font-semibold text-foreground mb-4">
            Bug Status Bar Chart
          </h2>
          <BugStatusBarChart data={barData} />
        </div>
      </div>

      {/* History */}
      <div className="bg-white dark:bg-zinc-900 border border-border shadow-md rounded-xl p-6">
        <h2 className="text-xl font-semibold text-foreground mb-4">History</h2>
        <History />
      </div>
    </main>
  );
}

export default Analytics;
