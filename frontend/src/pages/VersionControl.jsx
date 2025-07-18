import React, { useState, useEffect } from "react";
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
import { Alert, AlertDescription } from "@/components/ui/alert";
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
  fetchIssues,
  initOctokit,
} from "@/lib/VersionControl-Integration/versioncontrol";
import { Link } from "react-router-dom";

function formatDate(dateString) {
  return new Date(dateString).toLocaleString("en-IN", {
    dateStyle: "medium",
    timeStyle: "short",
  });
}

function getSeverityColor(severity) {

  const map = {
    LOW: "bg-green-100 text-green-800",
    MEDIUM: "bg-yellow-100 text-yellow-800",
    HIGH: "bg-orange-100 text-orange-800",
    CRITICAL: "bg-red-100 text-red-800",
  };
  return map[severity.toUpperCase()] || "bg-gray-100 text-gray-800";
}

// function getUrgencyColor(urgency) {
//     const map = {
//         low: "bg-blue-100 text-blue-800",
//         medium: "bg-purple-100 text-purple-800",
//         high: "bg-red-100 text-red-800",
//     };
//     return map[urgency] || "bg-gray-100 text-gray-800";
// }


export default function VersionControl() {
  const [issues, setIssues] = useState([]);
  const [filteredIssues, setFilteredIssues] = useState(issues);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [severityFilter, setSeverityFilter] = useState("all");
  const [priorityFilter, setPriorityFilter] = useState("all");
  const [urgencyFilter, setUrgencyFilter] = useState("all");

  const loadIssues = async () => {
    const octokit = initOctokit(import.meta.env.VITE_GITHUB_TOKEN);
    try {
      const data = await fetchIssues(
        octokit,
        "GlenFonceca",
        "Bugbuster-Testing"
      );
      setIssues(JSON.parse(data));
    } catch (err) {
      console.error(err);
    }
  };
  console.log(issues);

  // Initial load
  useEffect(() => {
    loadIssues();
  }, []);

  useEffect(() => {
    filterIssues();
  }, [searchTerm, statusFilter, severityFilter, issues]);

  const filterIssues = () => {
    let filtered = issues;

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
      filtered = filtered.filter((issue) => issue.state.toUpperCase() === statusFilter);
    }

    // Filter by severity
    if (severityFilter !== "all") {
      filtered = filtered.filter((issue) => issue.severity.toUpperCase() === severityFilter);
    }

    //Filter by Priority
    if (priorityFilter != "all") {
      filtered = filtered.filter((issue) => issue.priority.toUpperCase() === priorityFilter);
    }

    //Filter by Urgency
    if (urgencyFilter != "all") {
      filtered = filtered.filter((issue) => issue.urgency.toUpperCase() === urgencyFilter);
    }

    setFilteredIssues(filtered);
  };

  const handleRefresh = async () => {
    setLoading(true);
    await loadIssues();
    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-background p-4 md:p-8 lg:p-12">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold ">GitHub Issues</h1>
            <p className="text-muted-foreground mt-1">
              Track and manage all repository issues
            </p>
          </div>
          <Button onClick={() => handleRefresh()} disabled={loading}>
            <RefreshCw
              className={`w-4 h-4 mr-2 ${loading ? "animate-spin" : ""}`}
            />
            Refresh
          </Button>
        </div>

        {/* Filters */}
        <Card>
          <CardContent className="p-2 shadow-sm">
            <div className="grid grid-cols-7 gap-4 items-center">
              <div className="col-span-3 flex items-center gap-2">
                <Search className="size-5 text-primary" />
                <Input
                  type="text"
                  placeholder="Search issues..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className=" px-2 py-1 border border-border rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                />
              </div>
              <div className="flex items-center gap-2">

                <Select
                  value={statusFilter}
                  onValueChange={(value) => setStatusFilter(value)}
                >
                  <SelectTrigger className="w-[180px] px-3 py-1 border border-border rounded-md focus:outline-none focus:ring-2 focus:ring-primary">
                    <SelectValue placeholder="All Status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Status</SelectItem>
                    <SelectItem value="OPEN">Open</SelectItem>
                    <SelectItem value="CLOSED">Closed</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="flex items-center gap-2">
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

        {/* Issues List */}
        <div className="space-y-4">
          {filteredIssues.length === 0 ? (
            <Card className="flex items-center gap-4 p-4">
              <AlertTriangle className="size-5" />
              <span> No issues found matching your filters.</span>
            </Card>
          ) : (
            filteredIssues.map((issue) => (
              <Card
                key={issue.issueId}
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
                      <span>Created by: {issue.createdBy}</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <Calendar className="w-4 h-4" />
                      <span>Created: {formatDate(issue.createdAt)}</span>
                    </div>
                    {issue.closedAt && (
                      <>
                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                          <User className="w-4 h-4" />
                          <span>Closed by: {issue.closedBy}</span>
                        </div>
                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                          <Calendar className="w-4 h-4" />
                          <span>Closed: {formatDate(issue.closedAt)}</span>
                        </div>
                      </>
                    )}
                  </div>

                  <div className="flex gap-2 pt-2">
                    <Link
                      to={`/bugs/${issue.issueId.toString().toLowerCase()}`}
                    >
                      <Button size="sm" variant="outline">
                        <Eye className="w-4 h-4 mr-1" />
                        View Details
                      </Button>
                    </Link>
                    {/* TODO */}
                    <Button size="sm" variant="outline" asChild>
                      <a
                        href={`https://github.com/owner/repo/issues/${issue.issueId}`}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        <ExternalLink className="w-4 h-4 mr-1" />
                        GitHub
                      </a>
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
