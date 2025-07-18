import { AlertTriangle, Calendar, Paperclip, Sparkles, User } from "lucide-react";
import { cn } from "@/lib/utils";

import { bugData } from "@/lib/DummyData/bug-data";
import { comments } from "@/lib/DummyData/comments";

import BugActions from "@/components/BugActions";

import CommentsContainer from "@/components/CommentsContainer";
import ActivityLog from "@/components/BugActivityLog";
import { useParams } from "react-router-dom";

import { useState, useEffect } from "react";
import { apiClient } from "@/lib/axios";
import { GET_BUG_BY_ID_ROUTE } from "@/lib/routes";
import toast from "react-hot-toast";

const severityColor = {
  Critical: "bg-red-500 text-red-900",
  High: "bg-red-100 text-red-500",
  Medium: "bg-yellow-100 text-yellow-700",
  Low: "bg-emerald-100 text-emerald-700",
};

const BugReport = () => {

  const params = useParams()
  const bugId = params.id;
  const [bug, setBug] = useState({})

  useEffect(() => {
    const fetchBugInfo = async () => {
      try {
        const res = await apiClient.get(`${GET_BUG_BY_ID_ROUTE}/${bugId}`);
        setBug(res.data)
        console.log(res.data)
      } catch (err) {
        console.log(err)
        toast.error("Failed to fetch the Bug Info")
      }
    }
    if (bugId) {
      fetchBugInfo()
    }
  }, [bugId])

  return (
    <main className="min-h-full w-full p-4 md:p-8 lg:p-12 flex flex-col gap-6 bg-background">
      <div className="w-full bg-background dark:sidebar border border-border shadow-md rounded-xl p-6 ">
        <div className="w-full flex flex-col lg:flex-row gap-6">
          <div className="flex-1 flex flex-col gap-6">
            {/* Header */}

            <div>
              <div className="flex items-center gap-3">
                <h1 className="text-2xl font-semibold tracking-tight mb-1">
                  Bug: {bug.title}
                </h1>
                <p className="text-sm text-muted-foreground leading-relaxed font-medium">
                  {bug.state}
                </p>
              </div>
              <p className="text-sm text-muted-foreground leading-relaxed">
                Bug ID: {bug.id}
              </p>
            </div>

            <div>
              <BugActions />
            </div>

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
            <div className="flex flex-col md:flex-row gap-4">
              <div className="flex-1">
                <h2 className="text-lg font-semibold mb-2">Expected Result</h2>
                <p className="text-sm text-muted-foreground leading-relaxed bg-muted rounded-lg p-4">
                  {bug.expectedOutcome}
                </p>
              </div>
              <div className="flex-1">
                <h2 className="text-lg font-semibold mb-2">Actual Result</h2>
                <p className="text-sm text-muted-foreground leading-relaxed bg-muted rounded-lg p-4">
                  {bug.actualOutcome}
                </p>
              </div>
            </div>

            {/* Attachments */}


            {bug.attachments && bug.attachments.length > 0 && (
              <div>
                <h2 className="text-lg font-semibold mb-2">Attachments</h2>
                <div className="flex gap-4 flex-wrap">
                  {bug.attachments.map((attachment, index) => (
                    <div key={index} className="rounded-sm py-2 px-4 flex items-center justify-center bg-secondary">
                      {attachment.originalName}
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Metadata */}
          <div className="bg-sidebar rounded-xl border border-sidebar flex flex-col p-5 min-w-[35%] gap-3 shadow">
            <h2 className="text-lg text-foreground font-bold flex items-center gap-2 mb-2">
              Metadata
            </h2>

            <div className="mb-2">
              <p className="text-xs mb-2 font-medium text-muted-foreground flex items-center gap-1">
                <AlertTriangle className="w-3 h-3" />
                Priority
              </p>
              <span
                className={cn(
                  "py-2 px-3 inline-flex items-center text-sm rounded-lg font-medium border ",)}
              >
                {bug.priority}
              </span>
            </div>

            <div className="space-y-3">
              <div className="bg-background rounded-lg p-3 border border-gray-200 ">
                <p className="text-xs mb-1 font-medium text-muted-foreground">
                  Project ID
                </p>
                <h3 className="text-foreground font-semibold">
                  {bug.projectId}
                </h3>
              </div>

              <div className="bg-background rounded-lg p-3 border border-gray-200 ">
                <p className="text-xs mb-1 font-medium text-muted-foreground flex items-center gap-1">
                  <User className="w-3 h-3" />
                  Reporter
                </p>
                <h3 className="text-foreground font-semibold">
                  {bug.createdBy}
                </h3>
              </div>

              <div className="bg-background rounded-lg p-3 border border-gray-200 ">
                <p className="text-xs mb-1 font-medium text-muted-foreground flex items-center gap-1">
                  <User className="w-3 h-3" />
                  Assignee
                </p>
                <h3 className="text-foreground font-semibold">
                  {bug.assignedTo || "Not assigned"}
                </h3>
              </div>

              <div className="bg-background rounded-lg p-3 border border-gray-200 ">
                <p className="text-xs mb-1 font-medium text-muted-foreground flex items-center gap-1">
                  <Calendar className="w-3 h-3" />
                  Date Created
                </p>
                <h3 className="text-foreground font-semibold">
                  {bug.createdAt}
                </h3>
              </div>

              <div className="bg-background rounded-lg p-3 border border-gray-200 ">
                <p className="text-xs mb-1 font-medium text-muted-foreground flex items-center gap-1">
                  <Calendar className="w-3 h-3" />
                  Date Resolved
                </p>
                <h3 className="text-foreground font-semibold">
                  {bug.resolvedAt || "Not resolved yet"}
                </h3>
              </div>
            </div>

            {/* Activity Log */}
            <ActivityLog state={bug.state} />
          </div>
        </div>
        <CommentsContainer comments={comments} />
      </div>
    </main>
  );
};

export default BugReport;
