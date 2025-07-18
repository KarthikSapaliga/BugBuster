import IssuesTable from "@/components/IssuesTable";
import { apiClient } from "@/lib/axios";

import { InProgressTasks } from "@/lib/DummyData/in-progress";
import { GET_ALL_BUGS_ROUTE } from "@/lib/routes";
import { useEffect, useState } from "react";

function InProgress() {
  const [issues, setIssues] = useState([]);
  const [InProgressIssues, setInProgressIssues] = useState([]);

  useEffect(() => {
    async function fetchAllIssues() {
      try {
        const res = await apiClient.get(GET_ALL_BUGS_ROUTE);
        const allIssues = res.data || [];

        setIssues(allIssues);

        const filtered = allIssues.filter(
          (issue) =>
            issue?.state?.toUpperCase() === "IN_PROGRESS" ||
            issue?.state?.toUpperCase() === "INPROGRESS"
        );

        setInProgressIssues(filtered);
      } catch (error) {
        console.error("Failed to fetch issues:", error);
      }
    }

    fetchAllIssues();
  }, []);

  return (
    <main className="p-4 md:p-8 lg:p-12 flex flex-col gap-6 bg-background">
      <div className="bg-background dark:sidebar border border-border shadow-md rounded-xl p-6">
        <h2 className="text-xl font-semibold text-foreground mb-4">
          In Progress
        </h2>
        <IssuesTable data={InProgressIssues} />
      </div>
    </main>
  );
}

export default InProgress;
