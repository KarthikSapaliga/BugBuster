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
          const name = await getUserName({ userId });
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

        {/* RESFRESH BUTTON  */}
        {/* <Button onClick={() => handleRefresh()} disabled={loading}>
          <RefreshCw
            className={`w-4 h-4 mr-2 ${loading ? "animate-spin" : ""}`}
          />
          Refresh
        </Button> */}
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="p-2 shadow-sm">
          <div className="grid grid-cols-7 gap-3 items-center">
            <div className="flex items-center gap-2 col-span-3">
              <Search className="size-5 text-primary" />
              <Input
                type="text"
                placeholder="Search issues..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="px-2 py-1  border border-border rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
              />
            </div>

            <div className="flex items-center gap-2">
              <Select
                value={statusFilter}
                onValueChange={(value) => setStatusFilter(value)}
              >
                <SelectTrigger className=" px-3 py-1 border border-border rounded-md focus:outline-none focus:ring-2 focus:ring-primary">
                  <SelectValue placeholder="All Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value="OPEN">Open</SelectItem>
                  <SelectItem value="IN PROGRESS">In Progress</SelectItem>
                  <SelectItem value="RESOLVED">Resolved</SelectItem>
                  <SelectItem value="CLOSED">Closed</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Select
                value={severityFilter}
                onValueChange={(value) => setSeverityFilter(value)}
              >
                <SelectTrigger className="px-3 py-1 border border-border rounded-md focus:outline-none focus:ring-2 focus:ring-primary">
                  <SelectValue placeholder="All Severity" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Severity</SelectItem>
                  <SelectItem value="LOW">Low</SelectItem>
                  <SelectItem value="MEDIUM">Medium</SelectItem>
                  <SelectItem value="HIGH">High</SelectItem>
                  <SelectItem value="CRITICAL">Critical</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Select
                value={priorityFilter}
                onValueChange={(value) => setPriorityFilter(value)}
              >
                <SelectTrigger className=" px-3 py-1 border border-border rounded-md focus:outline-none focus:ring-2 focus:ring-primary">
                  <SelectValue placeholder="All Priority" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Priority</SelectItem>
                  <SelectItem value="P1">P1</SelectItem>
                  <SelectItem value="P2">P2</SelectItem>
                  <SelectItem value="P3">P3</SelectItem>
                  <SelectItem value="P4">P4</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Select
                value={urgencyFilter}
                onValueChange={(value) => setUrgencyFilter(value)}
              >
                <SelectTrigger className=" px-3 py-1 border border-border rounded-md focus:outline-none focus:ring-2 focus:ring-primary">
                  <SelectValue placeholder="Urgency" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Urgency</SelectItem>
                  <SelectItem value="HIGH">High</SelectItem>
                  <SelectItem value="MEDIUM">Medium</SelectItem>
                  <SelectItem value="LOW">Low</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* BUG LIST  */}
      <div className="space-y-4">
        {filteredIssues.length === 0 ? (
          <Card className="flex items-center gap-4 p-4">
            <AlertTriangle className="size-5" />
            <span> No issues found matching your filters.</span>
          </Card>
        ) : (
          filteredIssues.map((issue) => (
            <Card key={issue.id} className="hover:shadow-md transition-shadow">
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
                      className={`${getSeverityColor(issue.severity)} text-xs`}
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
                        <span>Closed by: {userMap[issue.closedBy] || "Loading..."}</span>
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
    </main>
  );
}

export default ProjectBugs;
