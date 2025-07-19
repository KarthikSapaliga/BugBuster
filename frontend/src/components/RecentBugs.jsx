import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Eye } from "lucide-react";
import { Link } from "react-router-dom";
import { formatDate } from "@/lib/utils";

const bugs = [
    {
        id: "BUG-1023",
        title: "Login fails when using Google Auth",
        description: "Users report a blank screen when attempting to login using Google OAuth on mobile devices.",
        severity: "critical",
        status: "open",
        createdAt: "2025-07-15T10:32:00Z",
        assignedTo: "Ananya Joshi",
    },
    {
        id: "BUG-1024",
        title: "Dashboard chart not rendering",
        description: "The analytics chart is not visible on Safari due to a possible rendering issue with the Chart.js library.",
        severity: "high",
        status: "in progress",
        createdAt: "2025-07-14T16:45:00Z",
        assignedTo: "Rahul Mehta",
    },
    {
        id: "BUG-1025",
        title: "Incorrect total in invoice PDF",
        description: "PDF exports show incorrect total amount when discount coupons are applied twice.",
        severity: "medium",
        status: "open",
        createdAt: "2025-07-13T09:18:00Z",
        assignedTo: "Unassigned",
    },
];



function getSeverityColor(severity) {
    const map = {
        low: "bg-green-100 text-green-800",
        medium: "bg-yellow-100 text-yellow-800",
        high: "bg-orange-100 text-orange-800",
        critical: "bg-red-100 text-red-800",
    };
    return map[severity] || "bg-gray-100 text-gray-800";
}

export default function RecentBugs() {
    return (
        <Card className="bg-muted w-full">
            <CardContent className="pt-6 space-y-5">
                <div className="flex justify-between items-center">
                    <h2 className="text-lg font-semibold">Recent Bugs</h2>
                    <Button asChild size="sm">
                        <Link to="/">
                            <Eye className="w-4 h-4 mr-1" />
                            View All
                        </Link>
                    </Button>
                </div>

                <div className="space-y-4">
                    {bugs.map((bug) => (
                        <Card key={bug.id} className="shadow-sm border-muted">
                            <CardContent className="p-4 space-y-2">
                                <div className="flex justify-between items-start">
                                    <div>
                                        <h3 className="text-sm font-medium text-muted-foreground">
                                            {bug.id}
                                        </h3>
                                        <p className="text-base font-semibold text-foreground">
                                            {bug.title}
                                        </p>
                                    </div>
                                    <div className="flex gap-2 flex-wrap justify-end">
                                        <Badge className={`${getSeverityColor(bug.severity)} text-xs`}>
                                            {bug.severity.toUpperCase()}
                                        </Badge>
                                        <Badge variant="outline" className="text-xs">
                                            {bug.status.toUpperCase()}
                                        </Badge>
                                    </div>
                                </div>

                                <p className="text-sm text-muted-foreground line-clamp-2">
                                    {bug.description}
                                </p>

                                <div className="text-xs text-muted-foreground space-y-1">
                                    <p>
                                        Assigned To:{" "}
                                        <span className="font-medium text-foreground">
                                            {bug.assignedTo}
                                        </span>
                                    </p>
                                    <p>Created: {formatDate(bug.createdAt)}</p>
                                </div>

                                <div className="pt-2">
                                    <Button size="sm" variant="secondary" asChild>
                                        <Link to={`/bugs/${bug.id.toLowerCase()}`}>
                                            <Eye className="w-4 h-4 mr-1" />
                                            View
                                        </Link>
                                    </Button>
                                </div>
                            </CardContent>
                        </Card>
                    ))}
                </div>
            </CardContent>
        </Card>
    );
}
