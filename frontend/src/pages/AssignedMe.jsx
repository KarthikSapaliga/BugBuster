import { useEffect, useState } from "react";
import { apiClient } from "@/lib/axios";
import { GET_ASSIGNED_BUGS_ROUTE } from "@/lib/routes";
import { useAppStore } from "@/store/store";

import { Card} from "@/components/ui/card";

import {
  AlertTriangle,

} from "lucide-react";

import { getUserName } from "@/lib/api";
import BugCard from "@/components/BugCard";


function AssignedMe() {
  const [assignedBugs, setAssignedBugs] = useState([]);
  const [loading, setLoading] = useState(true);
  const { token } = useAppStore();
  useEffect(() => {
    async function fetchAssignedBugs() {
      try {
        const res = await apiClient.get(GET_ASSIGNED_BUGS_ROUTE, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setAssignedBugs(res.data || []);
      } catch (error) {
        console.error("Failed to fetch assigned bugs:", error);
      } finally {
        setLoading(false);
      }
    }

    fetchAssignedBugs();
  }, []);

  const uniqueUserIds = Array.from(
    new Set(
      assignedBugs
        .flatMap((issue) => [
          issue.createdBy,
          issue.assignedTo,
          issue.resolvedBy,
          issue.closedBy,
        ])
        .filter(Boolean) // remove null or undefined
    )
  );

  const [userMap, setUserMap] = useState({});


  useEffect(() => {
    async function fetchUserNames() {
      const newUserMap = {};

      await Promise.all(
        uniqueUserIds.map(async (userId) => {
          const name = await getUserName(userId);
          newUserMap[userId] = name || "Unknown User";
        })
      );

      setUserMap(newUserMap);
    }

    fetchUserNames();
  }, [assignedBugs]);

  return (
    <main className="p-4 md:p-8 lg:p-12 flex flex-col gap-6 bg-background">
      <div className="bg-background dark:sidebar border border-border shadow-md rounded-xl p-6">
        <h2 className="text-xl font-semibold text-foreground mb-4">
          Assigned to Me
        </h2>

        {loading ? (
          <p className="text-muted-foreground">Loading assigned bugs...</p>
        ) : (
          <div className="space-y-4">
            {assignedBugs.length === 0 ? (
              <Card className="flex items-center gap-4 p-4 bg-sidebar">
                <AlertTriangle className="size-5" />
                <span> No issues Assigned to You.</span>
              </Card>
            ) : (
              assignedBugs.map((issue) => (
                <BugCard key={issue.issueId} issue = {issue} userMap={userMap}/>
              ))
            )}
          </div>
        )}
      </div>
    </main>
  );
}

export default AssignedMe;
