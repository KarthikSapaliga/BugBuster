import {
  Eye,
  Pencil,
  CheckCircle,
  PlayCircle,
  Clock,
  AlertCircle,
  XCircle,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { Link } from "react-router-dom";
import { useEffect, useState } from "react";
import { apiClient } from "@/lib/axios";
import { GET_PROJECT_BY_ID_ROUTE } from "@/lib/routes";
import { useAppStore } from "@/store/store";

function getSeverityColor(severity) {
  const map = {
    low: "bg-green-100 text-green-800",
    medium: "bg-yellow-100 text-yellow-800",
    high: "bg-orange-100 text-orange-800",
    critical: "bg-red-100 text-red-800",
  };
  return map[severity.toLowerCase()] || "bg-gray-100 text-gray-800";
}

function getStatusColor(status) {
  const statusMap = {
    RESOLVED: "bg-green-100 text-green-800",
    CLOSED: "bg-yellow-100 text-yellow-800",
    INPROGRESS: "bg-blue-100 text-blue-800",
    OPEN: "bg-red-100 text-red-800",
  };

  return statusMap[status] || "bg-gray-100 text-gray-800";
}

const getStatusIcon = (status) => {
  const iconProps = { size: 12, className: "flex-shrink-0" };

  const statusMap = {
    RESOLVED: <CheckCircle {...iconProps} className="text-green-500" />,
    INPROGRESS: <PlayCircle {...iconProps} className="text-blue-500" />,
    CLOSED: <Clock {...iconProps} className="text-orange-500" />,
    OPEN: <AlertCircle {...iconProps} className="text-red-500" />,
  };

  return (
    statusMap[status] || <XCircle {...iconProps} className="text-gray-500" />
  );
};

function IssuesTable({ data }) {
  const [projectMap, setProjectMap] = useState({});
  const { token } = useAppStore();
  //console.log(data);

  useEffect(() => {
    if (!data || data.length === 0) {
      return;
    }

    const uniqueProjectIds = [
      ...new Set(data.map((issue) => issue.projectId).filter(Boolean)),
    ];

    async function fetchProjects() {
      const newProjectMap = { ...projectMap };

      await Promise.all(
        uniqueProjectIds.map(async (projectId) => {
          if (!newProjectMap[projectId]) {
            try {
              const res = await apiClient.get(
                `${GET_PROJECT_BY_ID_ROUTE}/${projectId}`,{
                  headers: { Authorization: `Bearer ${token}` }
                }
              );
              newProjectMap[projectId] = res.data;
            } catch (err) {
              console.error(`Failed to fetch project ${projectId}:`, err);
            }
          }
        })
      );

      setProjectMap(newProjectMap);
    }

    fetchProjects();
  }, [data]); 

  return (
    <div className="overflow-x-auto rounded-md border">
      <table className="min-w-full text-sm text-left">
        <thead className="bg-muted">
          <tr className="text-muted-foreground">
            <th className="px-4 py-3 font-medium">Title</th>
            <th className="px-4 py-3 font-medium">Project</th>
            <th className="px-4 py-3 font-medium">Severity</th>
            <th className="px-4 py-3 font-medium">Priority</th>
            <th className="px-4 py-3 font-medium text-center">Status</th>
            <th className="px-4 py-3 font-medium text-center">Actions</th>
          </tr>
        </thead>
        <tbody className="divide-y">
          {data.map((bug) => (
            <tr key={bug.id} className="hover:bg-muted/50">
              <td className="px-4 py-3">{bug.title}</td>
              <td className="px-4 py-3">{projectMap[bug.projectId]?.name || "Loading..."}</td>
              <td className="px-4 py-3">
                <span
                  className={cn(
                    "px-2 py-1 text-xs font-medium rounded-md",
                    getSeverityColor(bug.severity)
                  )}
                >
                  {bug.severity}
                </span>
              </td>
              <td className="px-4 py-3 text-center">{bug.priority}</td>
              <td className="px-4 py-3 text-center">
                <span
                  className={`inline-flex items-center gap-1 px-2 py-1 text-xs rounded font-medium ${getStatusColor(
                    bug?.state.toUpperCase()
                  )}`}
                >
                  {getStatusIcon(bug.state.toUpperCase())} {bug.state}
                </span>
              </td>
              <td className="flex gap-2 py-3 justify-center items-center">
                <Link to={`/bugs/${bug.id}`}>
                  <Button variant="ghost" size="sm" className="text-primary">
                    <Eye size={16} />
                    View
                  </Button>
                </Link>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default IssuesTable;
