import React, { useEffect, useState } from "react";
import WeeklyProgressChart from "@/components/charts/WeeklyProgressChart";
import BugStatusPieChart from "@/components/charts/BugStatusPieChart";
import BugStatusBarChart from "@/components/charts/BugStatusBarChart";
import MonthlyProgressChart from "@/components/charts/MonthlyProgressChart";
import Stats from "@/components/Stats";
import { useAppStore } from "@/store/store";
import {
  generateMonthlyProgressData,
  getBugAnalyticsData,
} from "@/lib/analytics";
import { apiClient } from "@/lib/axios";
import { GET_ALL_BUGS_ROUTE } from "@/lib/routes";
import IssuesTable from "@/components/IssuesTable";

function Analytics() {
  const { token } = useAppStore();
  const [bugs, setBugs] = useState([]);
  const [barData, setBarData] = useState([]);
  const [pieData, setPieData] = useState([]);
  const [weeklyData, setWeeklyData] = useState([]);
  const [monthlyData, setMonthlyData] = useState([]);
  const [closedBugs , setClosedBugs] = useState([]);

  useEffect(() => {
    async function fetchAllIssues() {
      try {
        const res = await apiClient.get(GET_ALL_BUGS_ROUTE, {
          headers: { Authorization: `Bearer ${token}` },
        });
        const bugsData = res.data;

        setBugs(bugsData);

        const { barData, pieData, weeklyProgress } =
          getBugAnalyticsData(bugsData);
        const generatedMonthly = generateMonthlyProgressData(bugsData);

        setBarData(barData);
        setPieData(pieData);
        setWeeklyData(weeklyProgress);
        setMonthlyData(generatedMonthly);

        setClosedBugs(bugsData.filter((bug)=>bug.state === "CLOSED"))
        
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
      <div className="grid grid-cols-1  gap-6">
        <div className="bg-sidebar  border border-border shadow-md rounded-xl p-6">
          <h2 className="text-lg font-semibold text-foreground mb-4">
            Weekly Progress
          </h2>
          <WeeklyProgressChart data={weeklyData} />
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className=" bg-sidebar  border border-border shadow-md rounded-xl p-6">
          <h2 className="text-lg font-semibold text-foreground mb-4">
            Bug Status
          </h2>
          <BugStatusPieChart data={pieData} />
        </div>
        <div className=" bg-sidebar  border border-border shadow-md rounded-xl p-6">
          <h2 className="text-lg font-semibold text-foreground mb-4">
            Bug Status Bar Chart
          </h2>
          <BugStatusBarChart data={barData} />
        </div>
      </div>

      <div className="grid grid-cols-1  gap-6">
        <div className="col-span-1 bg-sidebar border border-border shadow-md rounded-xl p-6">
          <h2 className="text-lg font-semibold text-foreground mb-4">
            Monthly Progress
          </h2>
          <MonthlyProgressChart monthlyData={monthlyData} />
        </div>
      </div>

      {/* History */}
      <div className="bg-sidebar border border-border shadow-md rounded-xl p-6">
        <h2 className="text-xl font-semibold text-foreground mb-4">History</h2>
        <IssuesTable  data = {closedBugs}/>
      </div>
    </main>
  );
}

export default Analytics;
