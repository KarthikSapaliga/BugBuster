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

const severityColor = {
  Critical: "bg-red-500 text-red-900",
  High: "bg-red-100 text-red-500",
  Medium: "bg-yellow-100 text-yellow-700",
  Low: "bg-emerald-100 text-emerald-700",
};

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
  return (
    <div className="overflow-x-auto rounded-md border">
      <table className="min-w-full text-sm text-left">
        <thead className="bg-muted">
          <tr className="text-muted-foreground">
            <th className="px-4 py-3 font-medium">ID</th>
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
              <td className="px-4 py-3 font-medium">{bug.id}</td>
              <td className="px-4 py-3">{bug.title}</td>
              <td className="px-4 py-3">{bug.project}</td>
              <td className="px-4 py-3">
                <span
                  className={cn(
                    "px-2 py-1 text-xs font-medium rounded-md",
                    severityColor[bug.severity]
                  )}
                >
                  {bug.severity}
                </span>
              </td>
              <td className="px-4 py-3 text-center">{bug.priority}</td>
              <td className="px-4 py-3 text-center">
                <span
                  className={`inline-flex items-center gap-1 px-2 py-1 text-xs rounded font-medium ${getStatusColor(
                    bug.status.toUpperCase()
                  )}`}
                >
                  {getStatusIcon(bug.status.toUpperCase())} {bug.status}
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
