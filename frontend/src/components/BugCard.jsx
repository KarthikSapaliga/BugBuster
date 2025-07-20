import React from "react";
import { Card, CardContent, CardHeader } from "./ui/card";
import {
  Calendar,
  ExternalLink,
  Eye,
  UserCheck,
  UserPlus,
  CheckCircle,
  PlayCircle,
  Clock,
  AlertCircle,
  XCircle,
  Plus,
  Github,
} from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";
import {
  getPriorityColor,
  getSeverityColor,
  getStatusColor,
  getUrgencyColor,
} from "@/lib/colors";
import { formatDate } from "@/lib/utils";

import Modal from "./Modal";
import ImportGithubIssueForm from "@/pages/ImportGithubIssueForm";
import { useState } from "react";

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
      return <XCircle {...iconProps} className="text-yellow-500" />;
    default:
      return <XCircle {...iconProps} className="text-gray-500" />;
  }
};

const BugCard = ({ issue, userMap }) => {
  const [openGitImportPage, setOpenGitImportPage] = useState(false);

  const closeGitImportPage = () => setOpenGitImportPage(false);

  console.log(issue);

  return (
    <div>
      <Card className="hover:shadow-md bg-card transition-shadow duration-200">
        <CardHeader className="pb-0">
          <div className="flex justify-between items-start">
            <div className="flex-1 min-w-0">
              <h3 className="text-lg font-semibold truncate">
                #{issue.issueId} {issue.title}
              </h3>
              <p className="text-sm text-muted-foreground line-clamp-2 mt-1">
                {issue.description}
              </p>
            </div>
            <div className="flex flex-wrap gap-2 ml-4 shrink-0">
              {issue.fromGithub && (
                <Badge variant="default">
                  <Github className="w-4 h-4 mr-1" />
                  GitHub
                </Badge>
              )}
              {issue.state && (
                <Badge
                  variant="outline"
                  className={`${getStatusColor(
                    issue.state
                  )} text-xs font-medium`}
                >
                  <span className="mr-1">{getStatusIcon(issue.state)}</span>
                  {issue.state.replace("_", " ").toUpperCase()}
                </Badge>
              )}
              {issue.severity && (
                <Badge
                  variant="default"
                  className={`${getSeverityColor(
                    issue.severity
                  )} text-xs font-medium pointer-events-none`}
                >
                  {issue.severity.toUpperCase()}
                </Badge>
              )}
              {issue.priority && (
                <Badge
                  variant="outline"
                  className={`${getPriorityColor(
                    issue.priority
                  )} text-xs font-medium `}
                >
                  {issue.priority.toUpperCase()}
                </Badge>
              )}
              {issue.urgency && (
                <Badge
                  variant="default"
                  className={`${getUrgencyColor(
                    issue.urgency
                  )} text-xs font-medium pointer-events-none`}
                >
                  {issue.urgency.toUpperCase()}
                </Badge>
              )}
            </div>
          </div>
        </CardHeader>

        <CardContent className="p-6 space-y-3">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm text-muted-foreground">
            <div className="flex items-center gap-2">
              <UserPlus className="w-4 h-4 shrink-0" />
              {issue.fromGithub && issue.issue_url ? (
                <span className="truncate">Created by: {issue.createdBy}</span>
              ) : (
                <span className="truncate">
                  Created by: {userMap[issue.createdBy] || "Loading ..."}
                </span>
              )}
            </div>
            <div className="flex items-center gap-2">
              <Calendar className="w-4 h-4 shrink-0" />
              <span>Created: {formatDate(issue.createdAt)}</span>
            </div>
            {issue.closedAt && (
              <>
                <div className="flex items-center gap-2">
                  <UserCheck className="w-4 h-4 shrink-0" />
                  {issue.fromGithub && issue.issue_url ? (
                    <span className="truncate">
                      Closed by: {issue.closedBy}
                    </span>
                  ) : (
                    <span className="truncate">
                      Closed by: {userMap[issue.closedBy] || "Loading ..."}
                    </span>
                  )}
                </div>
                <div className="flex items-center gap-2">
                  <Calendar className="w-4 h-4 shrink-0" />
                  <span>Closed: {formatDate(issue.closedAt)}</span>
                </div>
              </>
            )}
          </div>

          <div className="flex gap-2 pt-2">
            {/* TODO */}
            {issue.fromGithub && issue.issue_url ? (
              <>
                <Link>
                  <Button
                    size="sm"
                    variant="default"
                    onClick={() => setOpenGitImportPage(true)}
                  >
                    <Plus className="w-4 h-4" />
                    Create Bug
                  </Button>
                </Link>
                <Button
                  size="sm"
                  variant="outline"
                  className="hover:bg-accent"
                  asChild
                >
                  <a
                    href={issue.issue_url}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <ExternalLink className="w-4 h-4 mr-1" />
                    GitHub
                  </a>
                </Button>
              </>
            ) : (
              <Link to={`/bugs/${issue.id}`}>
                <Button size="sm" variant="outline" className="hover:bg-accent">
                  <Eye className="w-4 h-4 mr-1" />
                  View Details
                </Button>
              </Link>
            )}
          </div>
        </CardContent>
      </Card>

      {openGitImportPage && (
        <Modal>
          <div className="w-full h-full overflow-auto">
            <ImportGithubIssueForm bug={issue} closePage={closeGitImportPage} />
          </div>
        </Modal>
      )}
    </div>
  );
};

export default BugCard;
