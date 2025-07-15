import React from "react";
import {
    CheckCircle,
    AlertCircle,
    User,
    Calendar,
    Clock,
    Paperclip,
    Triangle,
} from "lucide-react";
import { cn } from "@/lib/utils";

import { bugData } from "@/lib/DummyData/bug-data";
import { comments } from "@/lib/DummyData/comments";

import CommentsContainer from "@/components/CommentsContainer";

const severityColor = {
    Critical: "bg-red-500 text-red-900",
    High: "bg-red-100 text-red-500",
    Medium: "bg-yellow-100 text-yellow-700",
    Low: "bg-emerald-100 text-emerald-700",
};

const BugReport = () => {

    const getStatusIcon = (status) => {
        switch (status) {
            case "Reported":
                return <AlertCircle className="w-4 h-4 text-yellow-600" />;
            case "Assigned":
                return <User className="w-4 h-4 text-purple-600" />;
            case "In Progress":
                return <Clock className="w-4 h-4 text-blue-600" />;
            case "Resolved":
                return <CheckCircle className="w-4 h-4 text-green-600" />;
            default:
                return <AlertCircle className="w-4 h-4 text-muted-foreground" />;
        }
    };

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
                            <span
                                className={`px-3 py-1 rounded-full text-sm font-medium`}
                            >
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
                                        className={`w-24 h-24 rounded-lg flex items-center justify-center ${attachment.fileName.includes(".png")
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
                    <div className="bg-muted text-muted-foreground rounded-lg border flex flex-col p-4 min-w-[30%] gap-2">
                        <h2 className="text-lg font-semibold">Metadata</h2>
                        <div className="mb-1">
                            <p className="text-xs mb-1">Priority</p>
                            <h2 className={cn("py-1 px-3 inline text-sm rounded-lg", severityColor[bugData.priority])}>{bugData.priority}</h2>
                        </div>
                        <div>
                            <p className="text-xs mb-1">Module/Feature</p>
                            <h2 className="text-foreground">{bugData.module}</h2>
                        </div>
                        <div>
                            <p className="text-xs mb-1">Reporter</p>
                            <h2 className="text-foreground">{bugData.reporter}</h2>
                        </div>
                        <div>
                            <p className="text-xs mb-1">Assignee</p>
                            <h2 className="text-foreground">{bugData.assignee}</h2>
                        </div>
                        <div>
                            <p className="text-xs mb-1">Date Created</p>
                            <h2 className="text-foreground">{bugData.dateCreated}</h2>
                        </div>
                        <div className="mb-2">
                            <p className="text-xs mb-1">Date Resolved</p>
                            <h2 className="text-foreground">{bugData.dateResolved || "Not resolved yet"}</h2>
                        </div>

                        {/* Activity Log */}
                        <div className="pt-4 border-t border-border">
                            <p className="text-xs mb-2">Activity Log</p>
                            <div className="flex flex-col gap-3">
                                {bugData.statusHistory.map((activity, index) => (
                                    <div key={index} className="flex items-center gap-3">
                                        {getStatusIcon(activity.status)}
                                        <div className="flex-1 min-w-0">
                                            <div className="flex items-center gap-2 mb-1">
                                                <span className="font-medium text-sm">
                                                    {activity.status}
                                                </span>
                                            </div>
                                            <p className="text-xs text-gray-600">
                                                {activity.date} by {activity.by}
                                            </p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
                <CommentsContainer comments={comments} />
            </div>
        </main>
    );
};

export default BugReport;
