import { useEffect, useState } from "react";
import IssuesTable from "@/components/IssuesTable";
import { apiClient } from "@/lib/axios";
import { GET_ASSIGNED_BUGS_ROUTE } from "@/lib/routes";
import { useAppStore } from "@/store/store";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Eye,
  ExternalLink,
  User,
  Calendar,
  AlertTriangle,
  CheckCircle,
  Clock,
  X,
  Filter,
  Search,
  RefreshCw,
} from "lucide-react";
import { Link } from "react-router-dom";
import { getUserName } from "@/lib/api";

function formatDate(dateString) {
  return new Date(dateString).toLocaleString("en-IN", {
    dateStyle: "medium",
    timeStyle: "short",
  });
}

function getSeverityColor(severity) {
  const map = {
    low: "bg-green-100 text-green-800",
    medium: "bg-yellow-100 text-yellow-800",
    high: "bg-orange-100 text-orange-800",
    critical: "bg-red-100 text-red-800",
  };
  return map[severity.toLowerCase()] || "bg-gray-100 text-gray-800";
}

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
              <Card className="flex items-center gap-4 p-4">
                <AlertTriangle className="size-5" />
                <span> No issues Assigned to You.</span>
              </Card>
            ) : (
              assignedBugs.map((issue) => (
                <Card
                  key={issue.id}
                  className="hover:shadow-md transition-shadow"
                >
                  <CardContent className="p-6">
                    <div className="flex justify-between items-start mb-4">
                      <div className="flex items-center gap-3">
                        <div>
                          <h3 className="text-lg font-semibold">
                            {issue.issueId} {issue.title}
                          </h3>
                          <p className="text-sm text-muted-foreground mt-1">
                            {issue.description}
                          </p>
                        </div>
                      </div>
                      <div className="flex gap-2 ">
                        <Badge
                          className={`${getSeverityColor(
                            issue.severity
                          )} text-xs`}
                        >
                          {issue.severity.toUpperCase()}
                        </Badge>
                        <Badge variant="outline" className="text-xs">
                          {issue.state.toUpperCase()}
                        </Badge>
                      </div>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <User className="w-4 h-4" />
                        <span>
                          Created by:{userMap[issue.createdBy] || "Loading..."}
                        </span>
                      </div>
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <Calendar className="w-4 h-4" />
                        <span>Created: {formatDate(issue.createdAt)}</span>
                      </div>
                      {issue.closedAt && (
                        <>
                          <div className="flex items-center gap-2 text-sm text-muted-foreground">
                            <User className="w-4 h-4" />
                            <span>
                              Closed by:{" "}
                              {userMap[issue.closedBy] || "Loading..."}
                            </span>
                          </div>
                          <div className="flex items-center gap-2 text-sm text-muted-foreground">
                            <Calendar className="w-4 h-4" />
                            <span>Closed: {formatDate(issue.closedAt)}</span>
                          </div>
                        </>
                      )}
                    </div>

                    <div className="flex gap-2 pt-2">
                      <Link to={`/bugs/${issue.id}`}>
                        <Button size="sm" variant="outline">
                          <Eye className="w-4 h-4 mr-1" />
                          View Details
                        </Button>
                      </Link>
                    </div>
                  </CardContent>
                </Card>
              ))
            )}
          </div>
        )}
      </div>
    </main>
  );
}

export default AssignedMe;
