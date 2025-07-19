import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { AlertCircle, Calendar, CheckCircle, Clock, Eye, PlayCircle, XCircle } from "lucide-react";
import { Link } from "react-router-dom";
import { formatDate } from "@/lib/utils";
import { useEffect, useState } from "react";
import { getSeverityColor, getStatusColor } from "@/lib/colors";
import { apiClient } from "@/lib/axios";
import { RECENT_BUGS_ROUTE } from "@/lib/routes";
import { useAppStore } from "@/store/store";


const getStatusIcon = (status) => {
  const iconProps = { size: 12, className: "flex-shrink-0" };

  switch (status.toLowerCase()) {
    case 'closed':
      return <CheckCircle {...iconProps} className="text-green-500" />;
    case 'in_progress':
      return <PlayCircle {...iconProps} className="text-blue-500" />;
    case 'assigned':
      return <Clock {...iconProps} className="text-orange-500" />;
    case 'open':
      return <AlertCircle {...iconProps} className="text-red-500" />;
    case 'resolved':
      return <XCircle {...iconProps} className="text-yellow-500" />;
    default:
      return <XCircle {...iconProps} className="text-gray-500" />;
  }
};

export default function RecentBugs() {
    const [bugs,setBugs] = useState([]);
    const {token} = useAppStore();

    useEffect(()=>{
        async function getRecentBugs() {
            const res = await apiClient.get(RECENT_BUGS_ROUTE,{
                params: {
                    n: 2 
                },
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });

            setBugs(res.data);
        }

        getRecentBugs();
    },[])

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
                                        <p className="text-base font-semibold text-foreground">
                                            {bug.title}
                                        </p>
                                    </div>
                                    <div className="flex gap-2 flex-wrap justify-end">
                                        {bug.state && (
                                            <Badge variant="outline" className={`${getStatusColor(bug.state)} text-xs font-medium`}>
                                                <span className="mr-1">{getStatusIcon(bug.state)}</span>
                                                      {bug.state.toUpperCase()}
                                            </Badge>
                                        )}
                                        {bug.severity && (
                                            <Badge variant="default" className={`${getSeverityColor(bug.severity)} text-xs font-medium pointer-events-none`}>
                                                {bug.severity.toUpperCase()}
                                            </Badge>
                                        )}
                                    </div>
                                </div>

                                <p className="text-sm text-muted-foreground line-clamp-2">
                                    {bug.description}
                                </p>

                                <div className="flex justify-between text-xs text-muted-foreground space-y-1">
                                    <p>Created At: {formatDate(bug.createdAt)}</p>
                                    {bug.closedAt && (
                                        <>
                                            <div className="flex items-center gap-2">
                                                <Calendar className="w-4 h-4 shrink-0" />
                                                <span>Closed At: {formatDate(bug.closedAt)}</span>
                                            </div>
                                        </>
                                    )}
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
