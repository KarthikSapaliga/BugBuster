import {
  AlertCircle,
  AlertTriangle,
  Calendar,
  CheckCircle,
  Clock,
  PlayCircle,
  User,
  XCircle,
  ChevronRight,
  ChevronDown
} from "lucide-react";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible"
import { cn, formatDate } from "@/lib/utils";

import BugActions from "@/components/BugActions";
import MessageHistory from "@/components/MessageHistory";

import CommentsContainer from "@/components/CommentsContainer";
import ActivityLog from "@/components/BugActivityLog";
import { useParams } from "react-router-dom";
import AttachmentList from "@/components/AttachmentList";
import { useState, useEffect } from "react";
import { apiClient } from "@/lib/axios";
import { GET_BUG_BY_ID_ROUTE, GET_COMMENTS_ROUTE } from "@/lib/routes";
import toast from "react-hot-toast";
import { getUserName } from "@/lib/api";
import { useAppStore } from "@/store/store";
import { getStatusColor } from "@/lib/colors";
import { Badge } from "@/components/ui/badge";

const getStatusIcon = (status) => {
  const iconProps = { size: 12, className: "flex-shrink-0" };

  switch (status.toLowerCase()) {
    case "closed":
      return <CheckCircle {...iconProps} className="text-green-500" />;
    case "in_progress":
      return <PlayCircle {...iconProps} className="text-blue-500" />;
    case "assigned":
      return <Clock {...iconProps} className="text-orange-500" />;
    case "open":
      return <AlertCircle {...iconProps} className="text-red-500" />;
    case "resolved":
      return <XCircle {...iconProps} className="text-yellow-500" />; // Or pick a different icon if you prefer
    default:
      return <XCircle {...iconProps} className="text-gray-500" />;
  }
};

const BugReport = () => {
  const { token } = useAppStore();
  const params = useParams();
  const bugId = params.id;

  const [bug, setBug] = useState({});
  const [userMap, setUserMap] = useState({});
  const [bugStatusLog, setBugStatusLog] = useState([]);
  const [comments, setComments] = useState([]);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const fetchBugInfo = async () => {
      try {
        const res = await apiClient.get(`${GET_BUG_BY_ID_ROUTE}/${bugId}`);
        console.log(res.data);
        setBug(res.data);
      } catch (err) {
        //console.log(err);
        toast.error("Failed to fetch the Bug Info");
      }
    };

    const fetchComments = async () => {
      const res = await apiClient.get(`${GET_COMMENTS_ROUTE}/${bugId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setComments(res.data);
    };
    fetchComments();

    if (bugId) {
      fetchBugInfo();
      fetchComments();
    }
  }, [bugId]);

  useEffect(() => {
    if (!bug || Object.keys(bug).length === 0) return;

    const userIds = [
      bug.createdBy,
      bug.assignedBy,
      bug.assignedTo,
      bug.resolvedBy,
      bug.closedBy,
    ].filter(Boolean);

    async function fetchUserNames() {
      const newUserMap = {};

      await Promise.all(
        userIds.map(async (userId) => {
          const name = await getUserName(userId);
          newUserMap[userId] = name || "Unknown User";
        })
      );

      setUserMap(newUserMap);
    }

    fetchUserNames();
  }, [bug]);

  useEffect(() => {
    if (!bug || Object.keys(bug).length === 0) return;
    if (!userMap || Object.keys(userMap).length === 0) return;

    const statusLog = [];

    if (bug.createdBy) {
      statusLog.push({
        status: "Open",
        date: bug.createdAt,
        by: userMap[bug.createdBy],
      });
    }

    if (bug.assignedTo) {
      statusLog.push({
        status: "Assigned",
        date: bug.assignedAt,
        by: userMap[bug.assignedBy],
      });
      statusLog.push({
        status: "In_Progress",
        date: bug.assignedAt,
        by: userMap[bug.assignedTo],
      });
    }

    if (bug.resolvedBy) {
      statusLog.push({
        status: "Resolved",
        date: bug.resolvedAt,
        by: userMap[bug.resolvedBy],
      });
    }

    if (bug.closedBy) {
      statusLog.push({
        status: "Closed",
        date: bug.closedAt,
        by: userMap[bug.closedBy],
      });
    }

    setBugStatusLog(statusLog);
  }, [bug, userMap]);

  return (
    <main className="min-h-full w-full p-4 md:p-8 lg:p-12 flex flex-col gap-6 bg-background">
      <div className="w-full bg-background dark:sidebar border border-border shadow-md rounded-xl p-6 ">
        <div className="w-full flex flex-col lg:flex-row gap-6">
          <div className="flex-1 flex flex-col gap-6">
            {/* Header */}

            <div>
              <div className="flex items-center gap-3">
                <h1 className="text-2xl font-semibold tracking-tight mb-1">
                  {bug.title}
                </h1>
                {bug.state && (
                  <Badge
                    variant="outline"
                    className={`${getStatusColor(
                      bug.state
                    )} text-xs font-medium whitespace-nowrap`}
                  >
                    <span className="mr-1">{getStatusIcon(bug.state)}</span>
                    {bug.state.replace("_", " ").toUpperCase()}
                  </Badge>
                )}
              </div>
              <p className="text-sm text-muted-foreground leading-relaxed">
                Bug ID: {bug.id}
              </p>
            </div>

            <div>
              <BugActions bug={bug} />
            </div>

            {/* Messages */}
            <Collapsible open={open} onOpenChange={setOpen}>
              <CollapsibleTrigger>
                <div className="flex gap-2 items-center">
                  <h2 className="text-lg font-semibold">Activity History</h2>
                  {open ? <ChevronDown className="h-4 w-4" /> : <ChevronRight className="h-4 w-4" />}
                </div>
              </CollapsibleTrigger>
              <CollapsibleContent>
                <MessageHistory bug={bug} />
              </CollapsibleContent>
            </Collapsible>

            {/* Description */}
            <div>
              <h2 className="text-lg font-semibold mb-2">Description</h2>
              <p className="text-sm text-muted-foreground leading-relaxed">
                {bug.description}
              </p>
            </div>

            {/* Steps to Reproduce */}
            <div>
              <h2 className="text-lg font-semibold mb-2">Steps to Reproduce</h2>
              <p className="text-sm text-muted-foreground leading-relaxed">
                {bug.reproductionSteps}
              </p>
            </div>

            {/* Expected vs Actual Result */}
            <div className="grid grid-cols-1  md:grid-cols-2 gap-4">
              <div className="col-span-1">
                <h2 className="text-lg font-semibold mb-2">Expected Result</h2>
                <p className="text-sm text-muted-foreground leading-relaxed bg-muted rounded-lg p-4">
                  {bug.expectedOutcome}
                </p>
              </div>
              <div className="col-span-1">
                <h2 className="text-lg font-semibold mb-2">Actual Result</h2>
                <p className="text-sm text-muted-foreground leading-relaxed bg-muted rounded-lg p-4">
                  {bug.actualOutcome}
                </p>
              </div>
            </div>

            {/* Attachments */}
            <AttachmentList
              attachments={bug.attachments}
              fromGithub={bug.fromGithub}
            />
          </div>

          {/* Metadata */}
          <div className="bg-sidebar rounded-xl border border-border flex flex-col p-5 min-w-[35%] gap-3 shadow">
            <h2 className="text-lg text-foreground font-bold flex items-center gap-2 mb-2">
              Metadata
            </h2>

            <div className="mb-2">
              <p className="text-sm mb-2 font-medium text-muted-foreground flex items-center gap-1">
                <AlertTriangle className="size-4" />
                Priority
              </p>
              <span
                className={cn(
                  "py-2 px-3 bg-muted inline-flex items-center text-sm rounded-lg font-medium border border-border "
                )}
              >
                {bug.priority}
              </span>
            </div>

            <div className="space-y-3">
              <div className="bg-muted/50 rounded-lg p-3 border border-border ">
                <p className="text-xs mb-1 font-medium text-muted-foreground">
                  Project ID
                </p>
                <h3 className="text-foreground font-semibold">
                  {bug.projectId}
                </h3>
              </div>

              <div className="bg-muted/50 rounded-lg p-3 border border-border ">
                <p className="text-xs mb-1 font-medium text-muted-foreground flex items-center gap-1">
                  <User className="w-3 h-3" />
                  Reporter
                </p>
                <h3 className="text-foreground font-semibold">
                  {userMap[bug.createdBy] || "Loading"}
                </h3>
              </div>

              <div className="bg-muted/50 rounded-lg p-3 border border-border ">
                <p className="text-xs mb-1 font-medium text-muted-foreground flex items-center gap-1">
                  <User className="w-3 h-3" />
                  Assignee
                </p>
                <h3 className="text-foreground font-semibold">
                  {userMap[bug.assignedTo] || "Not Assigned"}
                </h3>
              </div>

              <div className="bg-muted/50 rounded-lg p-3 border border-border ">
                <p className="text-xs mb-1 font-medium text-muted-foreground flex items-center gap-1">
                  <Calendar className="w-3 h-3" />
                  Date Created
                </p>
                <h3 className="text-foreground font-semibold">
                  {formatDate(bug.createdAt)}
                </h3>
              </div>

              <div className="bg-muted/50 rounded-lg p-3 border border-border ">
                <p className="text-xs mb-1 font-medium text-muted-foreground flex items-center gap-1">
                  <Calendar className="w-3 h-3" />
                  Date Resolved
                </p>
                <h3 className="text-foreground font-semibold">
                  {formatDate(bug.resolvedAt) || "Not resolved yet"}
                </h3>
              </div>
            </div>

            {/* Activity Log */}
            <ActivityLog statusHistory={bugStatusLog} />
          </div>
        </div>
        <CommentsContainer
          bugId={bug.id}
          comments={comments}
          setComments={setComments}
        />
      </div>
    </main>
  );
};

export default BugReport;
