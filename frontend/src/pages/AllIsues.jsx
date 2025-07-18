import IssuesTable from "@/components/IssuesTable";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { apiClient } from "@/lib/axios";

import { AllIssuesTasks } from "@/lib/DummyData/all-issues";
import { GET_ALL_BUGS_ROUTE } from "@/lib/routes";
import { Search } from "lucide-react";
import { useEffect, useState } from "react";
import { useAppStore } from "@/store/store";

function AllIsues() {

  const { token } = useAppStore()

  const [issues, setIssues] = useState([]);
  const [filteredIssues, setFilteredIssues] = useState(issues);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [severityFilter, setSeverityFilter] = useState("all");
  const [priorityFilter, setPriorityFilter] = useState("all");
  const [urgencyFilter, setUrgencyFilter] = useState("all");

  useEffect(() => {
    async function fetchAllIssues() {
      const res = await apiClient.get(GET_ALL_BUGS_ROUTE, {
        headers: { Authorization: `Bearer ${token}` }
      });
      console.log(res);
      setIssues(res.data);
    }

    fetchAllIssues();
  }, []);

  useEffect(() => {
    filterIssues();
  }, [
    searchTerm,
    statusFilter,
    severityFilter,
    priorityFilter,
    urgencyFilter,
    issues,
  ]);

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

  return (
    <main className="p-4 md:p-8 lg:p-12 flex flex-col gap-6 bg-background">
      <div className="bg-background dark:sidebar border border-border shadow-md rounded-xl p-6">
        <h2 className="text-xl font-semibold text-foreground mb-4">
          All Issues
        </h2>
        {/* Filters */}
        <Card className="mb-4">
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
                    <SelectItem value="IN_PROGRESS">In Progress</SelectItem>
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
        <IssuesTable data={filteredIssues} />
      </div>
    </main>
  );
}

export default AllIsues;
