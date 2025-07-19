import React from "react";
import { Card, CardContent, CardHeader } from "./ui/card";
import { Calendar, ExternalLink, Eye, UserCheck, UserPlus, CheckCircle, PlayCircle, Clock, AlertCircle, XCircle } from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";

function formatDate(dateString) {
  return new Date(dateString).toLocaleString("en-IN", {
    dateStyle: "medium",
    timeStyle: "short",
  });
}

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

const getStatusColor = (status) => {
  switch (status.toLowerCase()) {
    case 'closed':
      return 'text-green-700 bg-green-50 border-green-200';
    case 'in_progress':
      return 'text-blue-700 bg-blue-50 border-blue-200';
    case 'assigned':
      return 'text-orange-700 bg-orange-50 border-orange-200';
    case 'open':
      return 'text-red-700 bg-red-50 border-red-200';
    case 'resolved':
      return 'text-yellow-700 bg-yellow-50 border-yellow-200';
    default:
      return 'text-gray-700 bg-gray-50 border-gray-200';
  }
};

function getSeverityColor(severity) {
  const map = {
    low: "bg-green-100 text-green-800 border-green-200",
    medium: "bg-yellow-100 text-yellow-800 border-yellow-200",
    high: "bg-orange-100 text-orange-800 border-orange-200",
    critical: "bg-red-100 text-red-800 border-red-200",
  };
  return map[severity?.toLowerCase()] || "bg-gray-100 text-gray-800 border-gray-200";
}

function getPriorityColor(priority) {
  const map = {
    P4: "bg-blue-100 text-blue-800 border-blue-200",
    P3: "bg-yellow-100 text-yellow-800 border-yellow-200",
    P2: "bg-orange-100 text-orange-800 border-orange-200",
    P1: "bg-red-100 text-red-800 border-red-200",
  };
  return map[priority?.toUpperCase()] || "bg-gray-100 text-gray-800 border-gray-200";
}

function getUrgencyColor(urgency) {
  const map = {
    low: "bg-slate-100 text-slate-800 border-slate-200",
    medium: "bg-blue-100 text-blue-800 border-blue-200",
    high: "bg-red-100 text-red-800 border-red-200",
  };
  return map[urgency?.toLowerCase()] || "bg-gray-100 text-gray-800 border-gray-200";
}

const BugCard = ({ issue }) => {
  return (
    <div>
      <Card className="hover:shadow-md bg-sidebar transition-shadow duration-200">

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
              {issue.severity && (
                <Badge variant="default" className={`${getSeverityColor(issue.severity)} text-xs font-medium pointer-events-none`}>
                  {issue.severity.toUpperCase()}
                </Badge>
              )}
              {issue.priority && (
                <Badge variant="outline" className={`${getPriorityColor(issue.priority)} text-xs font-medium `}>
                  {issue.priority.toUpperCase()}
                </Badge>
              )}
              {issue.urgency && (
                <Badge variant="default" className={`${getUrgencyColor(issue.urgency)} text-xs font-medium pointer-events-none`}>
                  {issue.urgency.toUpperCase()}
                </Badge>
              )}
              {issue.state && (
                <Badge variant="outline" className={`${getStatusColor(issue.state)} text-xs font-medium`}>
                  <span className="mr-1">{getStatusIcon(issue.state)}</span>
                  {issue.state.replace('_', ' ').toUpperCase()}
                </Badge>
              )}
            </div>
          </div>
        </CardHeader>

        <CardContent className="p-6 space-y-3">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm text-muted-foreground">
            <div className="flex items-center gap-2">
              <UserPlus className="w-4 h-4 shrink-0" />
              <span className="truncate">Created by: {issue.createdBy}</span>
            </div>
            <div className="flex items-center gap-2">
              <Calendar className="w-4 h-4 shrink-0" />
              <span>Created: {formatDate(issue.createdAt)}</span>
            </div>
            {issue.closedAt && (
              <>
                <div className="flex items-center gap-2">
                  <UserCheck className="w-4 h-4 shrink-0" />
                  <span className="truncate">Closed by: {issue.closedBy}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Calendar className="w-4 h-4 shrink-0" />
                  <span>Closed: {formatDate(issue.closedAt)}</span>
                </div>
              </>
            )}
          </div>

          <div className="flex gap-2 pt-2">
            <Link to={`/bugs/${issue.issueId}`}>
              <Button size="sm" variant="outline" className="hover:bg-accent">
                <Eye className="w-4 h-4 mr-1" />
                View Details
              </Button>
            </Link>
            {(issue.fromGithub || issue.issue_url) && (
              <Button size="sm" variant="outline" className="hover:bg-accent" asChild>
                <a
                  href={issue.issue_url}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <ExternalLink className="w-4 h-4 mr-1" />
                  GitHub
                </a>
              </Button>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default BugCard;