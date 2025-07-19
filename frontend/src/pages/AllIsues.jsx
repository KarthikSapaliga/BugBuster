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
import IssueFilter from "@/components/IssueFilter";

function AllIsues() {
  const { token } = useAppStore();

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
        headers: { Authorization: `Bearer ${token}` },
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
        <IssuesTable data={filteredIssues} />
      </div>
    </main>
  );
}

export default AllIsues;
