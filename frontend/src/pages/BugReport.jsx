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

const BugReport = () => {
  const bugData = {
    bugId: 98765,
    status: "In Progress",
    priority: "Critical",
    module: "Payment Gateway",
    reporter: "Emily Carter",
    assignee: "John Doe",
    dateCreated: "2025-07-12",
    dateResolved: null,
    description: {
      stepsToReproduce: [
        "Go to the checkout page.",
        "Select credit card as payment option.",
        "Enter invalid card details and submit.",
        "Try to refresh the page during processing.",
      ],
      expectedResult:
        "User should see a clear error message and stay on the payment page.",
      actualResult:
        "Payment spinner freezes, user is charged twice, and no confirmation is shown.",
    },
    attachments: [
      {
        fileName: "payment-error.png",
        fileUrl: "/uploads/payment-error.png",
      },
      {
        fileName: "console-log.txt",
        fileUrl: "/uploads/console-log.txt",
      },
    ],
    statusHistory: [
      {
        status: "Reported",
        date: "2025-07-12",
        by: "Emily Carter",
      },
      {
        status: "Assigned",
        date: "2025-07-13",
        by: "Project Manager",
      },
      {
        status: "In Progress",
        date: "2025-07-14",
        by: "John Doe",
      },
    ],
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "Resolved":
        return "bg-green-100 text-green-800";
      case "In Progress":
        return "bg-blue-100 text-blue-800";
      case "Reported":
        return "bg-yellow-100 text-yellow-800";
      case "Assigned":
        return "bg-purple-100 text-purple-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getPriorityColor = (priority) => {
    switch (priority) {
      case "Critical":
        return "text-red-600";
      case "High":
        return "text-orange-600";
      case "Medium":
        return "text-yellow-600";
      case "Low":
        return "text-green-600";
      default:
        return "text-gray-600";
    }
  };

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
        return <AlertCircle className="w-4 h-4 text-gray-600" />;
    }
  };

  return (
    <div className="flex  overflow-auto">
      {/* Main Content Area */}
      <div className="flex-1 p-6 ">
        <div className="max-w-4xl">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <h1 className="text-2xl font-bold">Bug ID: {bugData.bugId}</h1>
              <span
                className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(
                  bugData.status
                )}`}
              >
                {bugData.status}
              </span>
            </div>
          </div>

          <div className="mb-8">
            <h2 className="text-lg font-semibold mb-3">Description</h2>
            <p className="text-muted-foreground leading-relaxed">
              Payment processing issue causing double charges and frozen UI
              during checkout process.
            </p>
          </div>

          <div className="mb-8">
            <h2 className="text-lg font-semibold mb-3">Steps to Reproduce</h2>
            <ol className="list-decimal list-inside space-y-2 text-muted-foreground">
              {bugData.description.stepsToReproduce.map((step, index) => (
                <li key={index}>{step}</li>
              ))}
            </ol>
          </div>

          <div className="mb-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h3 className="font-semibold mb-3">Expected Result</h3>
                <div className="bg-gray-50 p-4 rounded-lg">
                  <p className="text-muted-foreground text-sm">
                    {bugData.description.expectedResult}
                  </p>
                </div>
              </div>
              <div>
                <h3 className="font-semibold mb-3">Actual Result</h3>
                <div className="bg-gray-50 p-4 rounded-lg">
                  <p className="text-muted-foreground text-sm">
                    {bugData.description.actualResult}
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div className="mb-8">
            <h2 className="text-lg font-semibold mb-3">Attachments</h2>
            <div className="flex gap-4">
              {bugData.attachments.map((attachment, index) => (
                <div
                  key={index}
                  className={`w-24 h-24 rounded-lg flex items-center justify-center ${
                    attachment.fileName.includes(".png")
                      ? "bg-gray-800"
                      : "bg-teal-400"
                  }`}
                >
                  <div className="text-white text-center">
                    {attachment.fileName.includes(".png") ? (
                      <div className="text-xs">
                        <div className="w-8 h-6 bg-muted-foreground rounded mb-1 mx-auto"></div>
                        <div>Screenshot</div>
                      </div>
                    ) : (
                      <>
                        <Paperclip className="w-6 h-6 mx-auto mb-1" />
                        <div className="text-xs">Log File</div>
                      </>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Metadata Sidebar */}
      <div className="w-70 flex-shrink-0 bg-sidebar border-l border-gray-200 p-6">
        <div className="space-y-3">
          <div>
            <h2 className="text-xl font-bold mb-4">Metadata</h2>
          </div>

          <div>
            <h3 className="text-sm font-medium text-muted-foreground mb-2">
              Priority
            </h3>
            <div
              className={`flex items-center gap-2 ${getPriorityColor(
                bugData.priority
              )}`}
            >
              <Triangle className="w-4 h-4 fill-current" />
              <span className="font-semibold">{bugData.priority}</span>
            </div>
          </div>

          <div>
            <p className="text-sm font-medium text-muted-foreground mb-1">
              Module/Feature
            </p>
            <p className="font-semibold">{bugData.module}</p>
          </div>

          <div>
            <h3 className="text-sm font-medium text-muted-foreground mb-1">
              Reporter
            </h3>
            <p className="font-semibold">{bugData.reporter}</p>
          </div>

          <div>
            <h3 className="text-sm font-medium text-muted-foreground mb-1">
              Assignee
            </h3>
            <p className="font-semibold">{bugData.assignee}</p>
          </div>

          <div>
            <h3 className="text-sm font-medium text-muted-foreground mb-1">
              Date Created
            </h3>
            <p className="font-semibold">{bugData.dateCreated}</p>
          </div>

          <div>
            <h3 className="text-sm font-medium text-muted-foreground mb-1">
              Date Resolved
            </h3>
            <p className="font-semibold">
              {bugData.dateResolved || "Not resolved yet"}
            </p>
          </div>
        </div>
        <div className="mt-6">
          <h3 className="text-lg font-bold mb-4">Activity Log</h3>
          <div className="space-y-6">
            {bugData.statusHistory.map((activity, index) => (
              <div key={index} className="flex items-start gap-3">
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
  );
};

export default BugReport;
