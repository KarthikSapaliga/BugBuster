import { useState, useEffect } from "react";
import {
	Card,
	CardContent,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
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
} from "lucide-react";
import {
	fetchIssues,
	initOctokit,
} from "@/lib/VersionControl-Integration/versioncontrol";
import { Link, useParams } from "react-router-dom";
import { useAppStore } from "@/store/store";
import { apiClient } from "@/lib/axios";
import { GET_PROJECT_BY_ID_ROUTE } from "@/lib/routes";

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

	// Fetch project details by ID
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

	// Utility: Extract owner from GitHub URL
	function extractGithubOwner(url) {
		try {
			const parsed = new URL(url);
			const parts = parsed.pathname.split("/").filter(Boolean);
			return parts[0] || null;
		} catch (error) {
			console.error("Invalid GitHub URL (owner):", url);
			return null;
		}
	}

	// Utility: Extract repo from GitHub URL
	function extractGithubRepo(url) {
		try {
			const parsed = new URL(url);
			const parts = parsed.pathname.split("/").filter(Boolean);
			return parts[1]?.replace(/\.git$/, "") || null;
		} catch (error) {
			console.error("Invalid GitHub URL (repo):", url);
			return null;
		}
	}

	// Fetch GitHub issues
	const loadIssues = async () => {
		try {
			if (!project.githubToken || !project.githubLink) {
				console.warn("Missing GitHub token or link");
				return;
			}
			const owner = extractGithubOwner(project.githubLink);
			const repo = extractGithubRepo(project.githubLink);

			const octokit = initOctokit(project.githubToken);
			const data = await fetchIssues(octokit, owner, repo);
			const parsedIssues = JSON.parse(data);
			setIssues(parsedIssues);
		} catch (err) {
			console.error("Error loading issues:", err);
		}
	};

	// Load issues when project is ready
	useEffect(() => {
		if (project?.githubToken && project?.githubLink) {
			loadIssues();
		}
	}, [project]);

	// Filtering logic
	useEffect(() => {
		filterIssues();
	}, [searchTerm, statusFilter, severityFilter, priorityFilter, urgencyFilter, issues]);

	const filterIssues = () => {
		let filtered = [...issues];

		if (searchTerm) {
			filtered = filtered.filter(
				(issue) =>
					issue.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
					issue.description?.toLowerCase().includes(searchTerm.toLowerCase()) ||
					issue.createdBy?.toLowerCase().includes(searchTerm.toLowerCase())
			);
		}

		if (statusFilter !== "all") {
			filtered = filtered.filter(
				(issue) => issue.state?.toUpperCase() === statusFilter
			);
		}

		if (severityFilter !== "all") {
			filtered = filtered.filter(
				(issue) => issue.severity?.toUpperCase() === severityFilter
			);
		}

		if (priorityFilter !== "all") {
			filtered = filtered.filter(
				(issue) => issue.priority?.toUpperCase() === priorityFilter
			);
		}

		if (urgencyFilter !== "all") {
			filtered = filtered.filter(
				(issue) => issue.urgency?.toUpperCase() === urgencyFilter
			);
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
					<Button onClick={handleRefresh} disabled={loading}>
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
							<Select value={statusFilter} onValueChange={setStatusFilter}>
								<SelectTrigger className="px-3 py-1 border border-border rounded-md">
									<SelectValue placeholder="All Status" />
								</SelectTrigger>
								<SelectContent>
									<SelectItem value="all">All Status</SelectItem>
									<SelectItem value="OPEN">Open</SelectItem>
									<SelectItem value="CLOSED">Closed</SelectItem>
								</SelectContent>
							</Select>

							<Select value={severityFilter} onValueChange={setSeverityFilter}>
								<SelectTrigger className="px-3 py-1 border border-border rounded-md">
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

							<Select value={priorityFilter} onValueChange={setPriorityFilter}>
								<SelectTrigger className="px-3 py-1 border border-border rounded-md">
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

							<Select value={urgencyFilter} onValueChange={setUrgencyFilter}>
								<SelectTrigger className="px-3 py-1 border border-border rounded-md">
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
					</CardContent>
				</Card>

				{/* Issues List */}
				<div className="space-y-4">
					{filteredIssues.length === 0 ? (
						<Card className="flex items-center gap-4 p-4">
							<AlertTriangle className="size-5" />
							<span>No issues found matching your filters.</span>
						</Card>
					) : (
						filteredIssues.map((issue) => (
							<Card key={issue.issueId} className="hover:shadow-md transition-shadow">
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
										<div className="flex gap-2">
											<Badge className={`${getSeverityColor(issue.severity)} text-xs`}>
												{issue.severity?.toUpperCase()}
											</Badge>
											<Badge variant="outline" className="text-xs">
												{issue.state?.toUpperCase()}
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
										<Link to={`/bugs/${issue.issueId.toString().toLowerCase()}`}>
											<Button size="sm" variant="outline">
												<Eye className="w-4 h-4 mr-1" />
												View Details
											</Button>
										</Link>
										<Button size="sm" variant="outline" asChild>
											<a
												href={issue.issue_url}
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
