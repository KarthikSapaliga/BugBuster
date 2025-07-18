import { Eye, Pencil, CheckCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { Link } from "react-router-dom";


function ProjectBugsTable({ data }) {
    return (
        <div className="overflow-x-auto rounded-md border">
            <table className="min-w-full text-sm text-left">
                <thead className="bg-muted">
                    <tr className="text-muted-foreground">
                        <th className="px-4 py-3 font-medium">Title</th>
                        <th className="px-4 py-3 font-medium">Severity</th>
                        <th className="px-4 py-3 font-medium">Urgency</th>
                        <th className="px-4 py-3 font-medium">Priority</th>
                        <th className="px-4 py-3 font-medium">Status</th>
                        <th className="px-4 py-3 font-medium text-center">Actions</th>
                    </tr>
                </thead>
                <tbody className="divide-y">
                    {data.map((bug) => (
                        <tr key={bug.id} className="hover:bg-muted/50">
                            <td className="px-4 py-3">{bug.title}</td>
                            <td className="px-4 py-3">{bug.severity}</td>
                            <td className="px-4 py-3">{bug.urgency}</td>
                            <td className="px-4 py-3">{bug.priority || "Not set"}</td>
                            <td className="px-4 py-3">{bug.state}</td>
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

export default ProjectBugsTable