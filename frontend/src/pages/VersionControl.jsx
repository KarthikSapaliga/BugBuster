import { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import {
	Eye,
	ExternalLink,
	User,
	Calendar,
	AlertTriangle,
	Search,
	RefreshCw,
	UserCheck,
	UserPlus,
} from "lucide-react";
import {
	fetchIssues,
	initOctokit,
} from "@/lib/VersionControl-Integration/versioncontrol";
import { Link, useParams } from "react-router-dom";
import { useAppStore } from "@/store/store";
import { apiClient } from "@/lib/axios";
import { GET_PROJECT_BY_ID_ROUTE } from "@/lib/routes";
import BugCard from "@/components/BugCard";
import IssueFilter from "@/components/IssueFilter";

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
	return map[severity?.toUpperCase()] || "bg-gray-100 text-gray-800";
}

export default function VersionControl() {
	const [issues, setIssues] = useState([]);
	const [filteredIssues, setFilteredIssues] = useState([]);
	const [loading, setLoading] = useState(false);
	const [searchTerm, setSearchTerm] = useState("");
	const [statusFilter, setStatusFilter] = useState("all");
	const [severityFilter, setSeverityFilter] = useState("all");
	const [priorityFilter, setPriorityFilter] = useState("all");
	const [urgencyFilter, setUrgencyFilter] = useState("all");

	const params = useParams();
	const projectId = params.projectId;
	const { token } = useAppStore();
	const [project, setProject] = useState({});

	useEffect(() => {
		const fetchProjectInfo = async () => {
			try {
				const res = await apiClient.get(
					`${GET_PROJECT_BY_ID_ROUTE}/${projectId}`,
					{
						headers: { Authorization: `Bearer ${token}` },
					}
				);
				setProject(res.data);
			} catch (error) {
				console.error("Failed to fetch project:", error);
			}
		};

		fetchProjectInfo();
	}, [projectId, token]);

	function extractGithubOwner(url) {
		try {
			const parsed = new URL(url);
			const parts = parsed.pathname.split("/").filter(Boolean);
			return parts[0] || null;
		} catch {
			return null;
		}
	}

	function extractGithubRepo(url) {
		try {
			const parsed = new URL(url);
			const parts = parsed.pathname.split("/").filter(Boolean);
			return parts[1]?.replace(/\.git$/, "") || null;
		} catch {
			return null;
		}
	}

	const handleRefresh = async () => {
		if (!project.githubToken || !project.githubLink) return;

		setLoading(true);
		try {
			const owner = extractGithubOwner(project.githubLink);
			const repo = extractGithubRepo(project.githubLink);

			const octokit = initOctokit(project.githubToken);
			const data = await fetchIssues(octokit, owner, repo);
			const parsedIssues = JSON.parse(data);
			setIssues(parsedIssues);
		} catch (err) {
			console.error("Error fetching GitHub issues:", err);
		}
		setLoading(false);
	};

	useEffect(() => {
		let filtered = [...issues];

		if (searchTerm)
			filtered = filtered.filter(
				(issue) =>
					issue.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
					issue.description?.toLowerCase().includes(searchTerm.toLowerCase()) ||
					issue.createdBy?.toLowerCase().includes(searchTerm.toLowerCase())
			);

		if (statusFilter !== "all")
			filtered = filtered.filter(
				(issue) => issue.state?.toUpperCase() === statusFilter
			);

		if (severityFilter !== "all")
			filtered = filtered.filter(
				(issue) => issue.severity?.toUpperCase() === severityFilter
			);

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

		setFilteredIssues(filtered);
	}, [searchTerm, statusFilter, severityFilter, issues]);

	console.log(issues);

	return (
		<div className="min-h-screen bg-background p-4 md:p-8 lg:p-12">
			<div className="max-w-7xl mx-auto space-y-6">
				{/* Header */}
				<div className="flex justify-between items-center">
					<div>
						<h1 className="text-3xl font-bold">GitHub Issues</h1>
						<p className="text-muted-foreground mt-1">
							Track and manage all repository issues
						</p>
					</div>
					<Button onClick={handleRefresh} disabled={loading}>
						<RefreshCw
							className={`w-4 h-4 mr-2 ${loading ? "animate-spin" : ""}`}
						/>
						Refresh
					</Button>
				</div>

				{/* Filters */}
				<Card className="bg-sidebar">
					<CardContent className="p-2">
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

				{/* Issues List */}
				<div className="space-y-4">
					{filteredIssues.length === 0 ? (
						<Card className="flex items-center gap-4 p-4 bg-sidebar">
							<AlertTriangle className="size-5" />
							<span>No issues found matching your filters.</span>
						</Card>
					) : (
						filteredIssues.map((issue) => (
							<BugCard key={issue.issueId} issue={issue} />
						))
					)}
				</div>
			</div>
		</div>
	);
}
