import { Eye, Pencil, CheckCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { Link } from "react-router-dom";

const severityColor = {
    Critical: "bg-red-500 text-red-900",
    High: "bg-red-100 text-red-500",
    Medium: "bg-yellow-100 text-yellow-700",
    Low: "bg-emerald-100 text-emerald-700",
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
                        <th className="px-4 py-3 font-medium text-center">Resolved On</th>
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
                            <td className="px-4 py-3 text-center">{bug.resolvedOn}</td>
                            <td className="px-4 py-3 text-center">
                                <span className="inline-flex items-center gap-1 text-green-600 bg-green-100 px-2 py-1 text-xs rounded font-medium">
                                    <CheckCircle size={14} /> {bug.status}
                                </span>
                            </td>
                            <td className="flex gap-2 py-3 justify-center items-center">
                                <Link to={`/bugs/${bug.id}`}>
                                    <Button variant="ghost" size="sm" className="text-primary">
                                        <Eye size={16} />
                                        View
                                    </Button>
                                </Link>
                                <Button variant="ghost" size="sm" className="text-primary">
                                    <Pencil size={16} />
                                    Edit
                                </Button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    )
}

export default IssuesTable