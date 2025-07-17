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

// const mockIssues = [
//   {
//     issueId: 1023,
//     title: "Login fails when using Google Auth",
//     state: "open",
//     createdAt: "2025-07-15T10:32:00Z",
//     createdBy: "ananya-joshi",
//     createdByAvatar: "https://github.com/ananya-joshi.png",
//     closedAt: null,
//     closedBy: null,
//     closedByAvatar: null,
//     description:
//       "Users report a blank screen when attempting to login using Google OAuth on mobile devices. This affects iOS and Android users specifically.",
//     steps:
//       "1. Open app on mobile device\n2. Click 'Login with Google'\n3. Authenticate with Google\n4. Observe blank screen",
//     expected:
//       "User should be redirected to dashboard after successful authentication",
//     actual: "User sees blank screen and cannot proceed",
//     urgency: "high",
//     severity: "critical",
//     screenshot: "https://github.com/user-attachments/assets/screenshot1.png",
//   },
//   {
//     issueId: 1024,
//     title: "Dashboard chart not rendering",
//     state: "open",
//     createdAt: "2025-07-14T16:45:00Z",
//     createdBy: "rahul-mehta",
//     createdByAvatar: "https://github.com/rahul-mehta.png",
//     closedAt: null,
//     closedBy: null,
//     closedByAvatar: null,
//     description:
//       "The analytics chart is not visible on Safari due to a possible rendering issue with the Chart.js library.",
//     steps:
//       "1. Open dashboard in Safari\n2. Navigate to analytics section\n3. Chart area is blank",
//     expected: "Chart should display analytics data",
//     actual: "Empty chart container with no data visualization",
//     urgency: "medium",
//     severity: "high",
//     screenshot: null,
//   },
//   {
//     issueId: 1025,
//     title: "Incorrect total in invoice PDF",
//     state: "closed",
//     createdAt: "2025-07-13T09:18:00Z",
//     createdBy: "priya-sharma",
//     createdByAvatar: "https://github.com/priya-sharma.png",
//     closedAt: "2025-07-16T14:30:00Z",
//     closedBy: "dev-team",
//     closedByAvatar: "https://github.com/dev-team.png",
//     description:
//       "PDF exports show incorrect total amount when discount coupons are applied twice.",
//     steps:
//       "1. Create invoice with items\n2. Apply discount coupon\n3. Apply second discount coupon\n4. Export to PDF",
//     expected: "PDF should show correct total after all discounts",
//     actual:
//       "PDF shows incorrect calculation, appears to double-apply discounts",
//     urgency: "low",
//     severity: "medium",
//     screenshot: "https://github.com/user-attachments/assets/screenshot2.png",
//   },
//   {
//     issueId: 1026,
//     title: "Memory leak in real-time notifications",
//     state: "open",
//     createdAt: "2025-07-12T11:22:00Z",
//     createdBy: "tech-lead",
//     createdByAvatar: "https://github.com/tech-lead.png",
//     closedAt: null,
//     closedBy: null,
//     closedByAvatar: null,
//     description:
//       "WebSocket connections are not being properly cleaned up when users navigate away from pages, causing memory leaks.",
//     steps:
//       "1. Open multiple tabs with notifications\n2. Navigate between pages\n3. Close tabs\n4. Monitor memory usage",
//     expected: "Memory should be freed when connections are no longer needed",
//     actual: "Memory usage continues to increase, connections remain active",
//     urgency: "high",
//     severity: "high",
//     screenshot: null,
//   },
//   {
//     issueId: 1027,
//     title: "Search functionality not working with special characters",
//     state: "closed",
//     createdAt: "2025-07-11T08:15:00Z",
//     createdBy: "qa-tester",
//     createdByAvatar: "https://github.com/qa-tester.png",
//     closedAt: "2025-07-15T16:45:00Z",
//     closedBy: "backend-dev",
//     closedByAvatar: "https://github.com/backend-dev.png",
//     description:
//       "Search queries containing special characters like @, #, $ return no results even when matching content exists.",
//     steps:
//       "1. Go to search page\n2. Enter search term with special characters\n3. Submit search",
//     expected: "Search should return relevant results",
//     actual: "No results returned for queries with special characters",
//     urgency: "medium",
//     severity: "medium",
//     screenshot: null,
//   },
// ];

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
  return map[severity] || "bg-gray-100 text-gray-800";
}

// function getUrgencyColor(urgency) {
//     const map = {
//         low: "bg-blue-100 text-blue-800",
//         medium: "bg-purple-100 text-purple-800",
//         high: "bg-red-100 text-red-800",
//     };
//     return map[urgency] || "bg-gray-100 text-gray-800";
// }

// function getStateIcon(state) {
//   if (state === "open") {
//     return <AlertTriangle className="w-4 h-4 text-red-500" />;
//   } else if (state === "closed") {
//     return <CheckCircle className="w-4 h-4 text-green-500" />;
//   }
//   return <Clock className="w-4 h-4 text-yellow-500" />;
// }

export default function VersionControl() {
  const octokit = initOctokit(import.meta.env.VITE_GITHUB_TOKEN);

  const [issues, setIssues] = useState([]);
  const [filteredIssues, setFilteredIssues] = useState(issues);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [severityFilter, setSeverityFilter] = useState("all");

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
      filtered = filtered.filter((issue) => issue.state === statusFilter);
    }

    // Filter by severity
    if (severityFilter !== "all") {
      filtered = filtered.filter((issue) => issue.severity === severityFilter);
    }

    setFilteredIssues(filtered);
  };

    const  handleRefresh = async() => {
      setLoading(true);
      await loadIssues();
      setLoading(false);
    };

  const openIssueModal = (issue) => {
    setSelectedIssue(issue);
  };

  //   const openIssues = filteredIssues.filter((issue) => issue.state === "open");
  //   const closedIssues = filteredIssues.filter(
  //     (issue) => issue.state === "closed"
  //   );

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
            <div className="flex flex-wrap gap-4 items-center">
              <div className="flex items-center gap-2">
                <Search className="size-5 text-primary" />
                <Input
                  type="text"
                  placeholder="Search issues..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="px-2 py-1 w-96 border border-border rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                />
              </div>
              <div className="flex items-center gap-2">
                <Filter className="w-4 h-4 text-primary" />

                <Select
                  value={statusFilter}
                  onValueChange={(value) => setStatusFilter(value)}
                >
                  <SelectTrigger className="w-[180px] px-3 py-1 border border-border rounded-md focus:outline-none focus:ring-2 focus:ring-primary">
                    <SelectValue placeholder="All Status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Status</SelectItem>
                    <SelectItem value="open">Open</SelectItem>
                    <SelectItem value="closed">Closed</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="flex items-center gap-2">
                <AlertTriangle className="size-5 text-red-500" />
                <Select
                  value={severityFilter}
                  onValueChange={(value) => setSeverityFilter(value)}
                >
                  <SelectTrigger className="px-3 py-1 border border-border rounded-md focus:outline-none focus:ring-2 focus:ring-primary">
                    <SelectValue placeholder="All Severity" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Severity</SelectItem>
                    <SelectItem value="Low">Low</SelectItem>
                    <SelectItem value="Medium">Medium</SelectItem>
                    <SelectItem value="High">High</SelectItem>
                    <SelectItem value="Critical">Critical</SelectItem>
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
                      <Badge className={getSeverityColor(issue.severity)}>
                        {issue.severity.toUpperCase()}
                      </Badge>
                      <Badge
                        variant={
                          issue.state === "open" ? "destructive" : "secondary"
                        }
                      >
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
                      <Button
                        size="sm"
                        variant="outline"
                      >
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
