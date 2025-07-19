import { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
	AlertTriangle,
	RefreshCw,
} from "lucide-react";
import {
	fetchIssues,
	initOctokit,
	extractGithubOwner,
	extractGithubRepo
} from "@/lib/VersionControl-Integration/versioncontrol";
import { useParams } from "react-router-dom";
import { useAppStore } from "@/store/store";
import { apiClient } from "@/lib/axios";
import { GET_PROJECT_BY_ID_ROUTE, IMPORTED_ISSUE_IDS } from "@/lib/routes";
import BugCard from "@/components/BugCard";
import IssueFilter from "@/components/IssueFilter";

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
	const [importedIds, setImportedIds] = useState([]);


	useEffect(() => {
		const fetchProjectInfo = async () => {
			try {
				const res = await apiClient.get(
					`${GET_PROJECT_BY_ID_ROUTE}/${projectId}`,
					{ headers: { Authorization: `Bearer ${token}` } }
				);
				setProject(res.data);
			} catch (error) {
				console.error("Failed to fetch project:", error);
			}
		};

		const fetchImportedIssueIds = async () => {
			try {
				const res = await apiClient.get(`${IMPORTED_ISSUE_IDS}/${projectId}`);
				setImportedIds(res.data);
			} catch (error) {
				console.error("Failed to fetch imported issue IDs:", error);
			}
		};

		if (projectId) {
			fetchProjectInfo();
			fetchImportedIssueIds();
		}
	}, [projectId, token]);

	const filterOnImport = async (issueId) => {
		try {
			const res = await apiClient.get(`${IMPORTED_ISSUE_IDS}/${projectId}`);
			setImportedIds(res.data);

			setIssues((prev) => prev.filter((issue) => issue.issueId !== issueId));
			setFilteredIssues((prev) => prev.filter((issue) => issue.issueId !== issueId));
			setImportedIds((prev) => [...prev, issueId]);
		} catch (err) {
			console.error("Failed to import GitHub issue:", err);
		}
	};

	const handleRefresh = async () => {
		if (!project.githubToken || !project.githubLink) return;

		setLoading(true);
		try {
			const owner = extractGithubOwner(project.githubLink);
			const repo = extractGithubRepo(project.githubLink);

			const octokit = initOctokit(project.githubToken);
			const data = await fetchIssues(octokit, owner, repo);
			const parsedIssues = JSON.parse(data);

			const filtered = parsedIssues.filter(
				(issue) => !importedIds.includes(issue.issueId)
			);
			setIssues(filtered);
		} catch (err) {
			console.error("Error fetching GitHub issues:", err);
		}
		setLoading(false);
	};

	const refilterIssues = () => {
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

		if (priorityFilter !== "all")
			filtered = filtered.filter(
				(issue) => issue.priority?.toUpperCase() === priorityFilter
			);

		if (urgencyFilter !== "all")
			filtered = filtered.filter(
				(issue) => issue.urgency?.toUpperCase() === urgencyFilter
			);

		setFilteredIssues(filtered);
	};

	useEffect(() => {
		refilterIssues();
	}, [issues, searchTerm, statusFilter, severityFilter, priorityFilter, urgencyFilter]);

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
				<Card className="">
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
							<BugCard key={issue.issueId} issue={issue} filterOnImport={filterOnImport} />
						))
					)}
				</div>
			</div>
		</div>
	);
}
