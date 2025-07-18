import { useEffect, useState } from "react";
import { apiClient } from "@/lib/axios";
import { GET_ALL_BUGS_ROUTE } from "@/lib/routes";
import IssuesTable from "@/components/IssuesTable";

function HighPriority() {
  const [issues, setIssues] = useState([]);
  const [highPriorityIssues, setHighPriorityIssues] = useState([]);

  useEffect(() => {
    async function fetchAllIssues() {
      try {
        const res = await apiClient.get(GET_ALL_BUGS_ROUTE);
        const allIssues = res.data || [];

        setIssues(allIssues);

        const filtered = allIssues.filter((issue) => {
          const priority = issue?.priority?.toUpperCase();
          return priority === "P1";
        });

        setHighPriorityIssues(filtered);
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
          High Priority
        </h2>
        <IssuesTable data={highPriorityIssues} />
      </div>
    </main>
  );
}

export default HighPriority;
