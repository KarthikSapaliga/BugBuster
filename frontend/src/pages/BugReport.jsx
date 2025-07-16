import React from "react";
import { AlertTriangle, Calendar, Paperclip, Sparkles, User } from "lucide-react";
import { cn } from "@/lib/utils";

import { bugData } from "@/lib/DummyData/bug-data";
import { comments } from "@/lib/DummyData/comments";

import CommentsContainer from "@/components/CommentsContainer";
import ActivityLog from "@/components/BugActivityLog";

const severityColor = {
  Critical: "bg-red-500 text-red-900",
  High: "bg-red-100 text-red-500",
  Medium: "bg-yellow-100 text-yellow-700",
  Low: "bg-emerald-100 text-emerald-700",
};

const BugReport = () => {
  return (
    <main className="min-h-full w-full p-4 md:p-8 lg:p-12 flex flex-col gap-6 bg-background">
      <div className="w-full bg-background dark:sidebar border border-border shadow-md rounded-xl p-6 ">
        <div className="w-full flex flex-col lg:flex-row gap-6">
          <div className="flex-1 flex flex-col gap-6">
            {/* Header */}
            <div className="flex items-center gap-3">
              <h1 className="text-2xl font-semibold tracking-tight">
                Bug ID: {bugData.bugId}
              </h1>
              <span className={`px-3 py-1 rounded-full text-sm font-medium`}>
                {bugData.status}
              </span>
            </div>

            {/* Description */}
            <div>
              <h2 className="text-lg font-semibold mb-2">Description</h2>
              <p className="text-sm text-muted-foreground leading-relaxed">
                {bugData.description}
              </p>
            </div>

            {/* Steps to Reproduce */}
            <div>
              <h2 className="text-lg font-semibold mb-2">Steps to Reproduce</h2>
              <ul className="list-decimal list-inside space-y-1 text-sm text-muted-foreground">
                {bugData.stepsToReproduce.map((step, index) => (
                  <li key={index}>{step}</li>
                ))}
              </ul>
            </div>

            {/* Expected vs Actual Result */}
            <div className="flex flex-col md:flex-row gap-4">
              <div className="flex-1">
                <h2 className="text-lg font-semibold mb-2">Expected Result</h2>
                <p className="text-sm text-muted-foreground leading-relaxed bg-muted rounded-lg p-4">
                  {bugData.expectedResult}
                </p>
              </div>
              <div className="flex-1">
                <h2 className="text-lg font-semibold mb-2">Actual Result</h2>
                <p className="text-sm text-muted-foreground leading-relaxed bg-muted rounded-lg p-4">
                  {bugData.actualResult}
                </p>
              </div>
            </div>

            {/* Attachments */}
            <div>
              <h2 className="text-lg font-semibold mb-2">Attachments</h2>
              <div className="flex gap-4 flex-wrap">
                {bugData.attachments.map((attachment, index) => (
                  <div
                    key={index}
                    className={`w-24 h-24 rounded-lg flex items-center justify-center ${
                      attachment.fileName.includes(".png")
                        ? "bg-muted"
                        : "bg-secondary"
                    }`}
                  >
                    <div className="text-xs text-center text-muted-foreground">
                      {attachment.fileName.includes(".png") ? (
                        <>
                          <div className="w-8 h-6 bg-border rounded mb-1 mx-auto" />
                          <span>Screenshot</span>
                        </>
                      ) : (
                        <>
                          <Paperclip className="w-6 h-6 mx-auto mb-1" />
                          <span>Log File</span>
                        </>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Metadata */}
          <div className="bg-sidebar rounded-xl border border-sidebar flex flex-col p-5 min-w-[30%] gap-3 shadow">
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
                  "py-2 px-3 inline-flex items-center text-sm rounded-lg font-medium border shadow-sm",
                  severityColor[bugData.priority]
                )}
              >
                {bugData.priority}
              </span>
            </div>

            <div className="space-y-3">
              <div className="bg-background rounded-lg p-3 border border-gray-200 shadow-sm">
                <p className="text-xs mb-1 font-medium text-muted-foreground">
                  Module/Feature
                </p>
                <h3 className="text-foreground font-semibold">
                  {bugData.module}
                </h3>
              </div>

              <div className="bg-background rounded-lg p-3 border border-gray-200 shadow-sm">
                <p className="text-xs mb-1 font-medium text-muted-foreground flex items-center gap-1">
                  <User className="w-3 h-3" />
                  Reporter
                </p>
                <h3 className="text-foreground font-semibold">
                  {bugData.reporter}
                </h3>
              </div>

              <div className="bg-background rounded-lg p-3 border border-gray-200 shadow-sm">
                <p className="text-xs mb-1 font-medium text-muted-foreground flex items-center gap-1">
                  <User className="w-3 h-3" />
                  Assignee
                </p>
                <h3 className="text-foreground font-semibold">
                  {bugData.assignee}
                </h3>
              </div>

              <div className="bg-background rounded-lg p-3 border border-gray-200 shadow-sm">
                <p className="text-xs mb-1 font-medium text-muted-foreground flex items-center gap-1">
                  <Calendar className="w-3 h-3" />
                  Date Created
                </p>
                <h3 className="text-foreground font-semibold">
                  {bugData.dateCreated}
                </h3>
              </div>

              <div className="bg-background rounded-lg p-3 border border-gray-200 shadow-sm">
                <p className="text-xs mb-1 font-medium text-muted-foreground flex items-center gap-1">
                  <Calendar className="w-3 h-3" />
                  Date Resolved
                </p>
                <h3 className="text-foreground font-semibold">
                  {bugData.dateResolved || "Not resolved yet"}
                </h3>
              </div>
            </div>

            {/* Activity Log */}
            <ActivityLog />
          </div>
        </div>
        <CommentsContainer comments={comments} />
      </div>
    </main>
  );
};

export default BugReport;
