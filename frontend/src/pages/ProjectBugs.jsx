import React, { useEffect, useState } from "react";
import { apiClient } from "@/lib/axios.js";
import { useAppStore } from "@/store/store.js";
import { useParams, Link } from "react-router-dom";

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
  UserCheck,
  UserPlus,
} from "lucide-react";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
  SelectGroup,
} from "@/components/ui/select";
import {
  GET_BUGS_BY_PROJECT_ROUTE,
  GET_PROJECT_BY_ID_ROUTE,
} from "@/lib/routes.js";
import { getUserName } from "@/lib/api";
import BugCard from "@/components/BugCard";
import IssueFilter from "@/components/IssueFilter";
import { formatDate } from "@/lib/utils";

function getSeverityColor(severity) {
  const map = {
    low: "bg-green-100 text-green-800",
    medium: "bg-yellow-100 text-yellow-800",
    high: "bg-orange-100 text-orange-800",
    critical: "bg-red-100 text-red-800",
  };
  return map[severity.toLowerCase()] || "bg-gray-100 text-gray-800";
}

function ProjectBugs() {
  const { projectId } = useParams();
  const { token } = useAppStore();
  const [project, setProject] = useState({});
  const [bugs, setBugs] = useState([]);
  const [filteredIssues, setFilteredIssues] = useState(bugs);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [severityFilter, setSeverityFilter] = useState("all");
  const [priorityFilter, setPriorityFilter] = useState("all");
  const [urgencyFilter, setUrgencyFilter] = useState("all");

  const [loading, setLoading] = useState(true);

  //Caching the Users ID's so it will not be fetched again and again
  const uniqueUserIds = Array.from(
    new Set(
      filteredIssues
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
    const fetchProjectInfo = async () => {
      try {
        const res = await apiClient.get(
          `${GET_PROJECT_BY_ID_ROUTE}/${projectId}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        setProject(res.data);
      } catch (error) {
        console.error("Failed to fetch bugs:", error);
      }
    };

    const fetchBugs = async () => {
      try {
        const res = await apiClient.get(
          `${GET_BUGS_BY_PROJECT_ROUTE}/${projectId}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        setBugs(res.data);
        console.log(res.data);
      } catch (error) {
        console.error("Failed to fetch bugs:", error);
      } finally {
        setLoading(false);
      }
    };

    if (projectId) fetchProjectInfo();
    if (projectId) fetchBugs();
  }, [projectId, token]);

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
  }, [filteredIssues]);

  useEffect(() => {
    filterIssues();
  }, [
    searchTerm,
    statusFilter,
    severityFilter,
    priorityFilter,
    urgencyFilter,
    bugs,
  ]);

  const filterIssues = () => {
    let filtered = bugs;

    // Filter by search term
    if (searchTerm) {
      filtered = filtered.filter(
        (issue) =>
          issue.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
          issue.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
          issue.createdBy.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Filter by status
    if (statusFilter !== "all") {
      filtered = filtered.filter(
        (issue) => issue.state.toUpperCase() === statusFilter
      );
    }

    //Filter by Priority
    if (priorityFilter != "all") {
      filtered = filtered.filter(
        (issue) => issue.priority.toUpperCase() === priorityFilter
      );
    }

    //Filter by Urgency
    if (urgencyFilter != "all") {
      filtered = filtered.filter(
        (issue) => issue.urgency.toUpperCase() === urgencyFilter
      );
    }

    // Filter by severity
    if (severityFilter !== "all") {
      filtered = filtered.filter(
        (issue) => issue.severity.toUpperCase() === severityFilter
      );
    }

    setFilteredIssues(filtered);
  };

  function getUser(userId) {
    const user = getUserName(userId);
    console.log(user);
    return user.name;
  }

  if (loading) return <p>Loading bugs...</p>;

  return (
    <main className="p-4 md:p-8 lg:p-12 flex flex-col gap-6 bg-background">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold ">All Issues</h1>
          <p className="text-muted-foreground mt-1">
            Track and manage all Issues
          </p>
        </div>
      </div>

      {/* Filters */}
      <Card className="bg-sidebar">
        <CardContent className="p-2 shadow-sm">
          <IssueFilter
            searchTerm={searchTerm}
            setSearchTerm={setSearchTerm}
            statusFilter={statusFilter}
            setStatusFilter={setStatusFilter}
            severityFilter={severityFilter}
            setSeverityFilter={setSeverityFilter}
            priorityFilter={priorityFilter}
            setPriorityFilter={setPriorityFilter}
            urgencyFilter={urgencyFilter}
            setUrgencyFilter={setUrgencyFilter}
          />
        </CardContent>
      </Card>

      {/* BUG LIST  */}
      <div className="space-y-4">
        {filteredIssues.length === 0 ? (
          <Card className="flex items-center gap-4 p-4 bg-sidebar">
            <AlertTriangle className="size-5" />
            <span> No issues found matching your filters.</span>
          </Card>
        ) : (
          filteredIssues.map((issue) => (
            <BugCard key={issue.issueId || issue.id} issue={issue} />
          ))
        )}
      </div>
    </main>
  );
}

export default ProjectBugs;
