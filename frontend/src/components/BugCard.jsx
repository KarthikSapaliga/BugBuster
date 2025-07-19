import React from "react";
import { Card, CardContent } from "./ui/card";
import {
  Calendar,
  ExternalLink,
  Eye,
  UserCheck,
  UserPlus,
} from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";

function formatDate(dateString) {
	return new Date(dateString).toLocaleString("en-IN", {
		dateStyle: "medium",
		timeStyle: "short",
	});
}

function getSeverityColor(severity) {
	const map = {
		LOW: "bg-green-100 text-green-800",
		MEDIUM: "bg-yellow-100 text-yellow-800",
		HIGH: "bg-orange-100 text-orange-800",
		CRITICAL: "bg-red-100 text-red-800",
	};
	return map[severity?.toUpperCase()] || "bg-gray-100 text-gray-800";
}

const BugCard = ({issue}) => {
  return (
    <div>
      <Card  className="hover:shadow-md bg-sidebar">
        <CardContent className="p-6 space-y-3">
          <div className="flex justify-between items-start">
            <div>
              <h3 className="text-lg font-semibold">
                #{issue.issueId} {issue.title}
              </h3>
              <p className="text-sm text-muted-foreground">
                {issue.description}
              </p>
            </div>
            <div className="flex gap-2">
              <Badge className={`${getSeverityColor(issue.severity)} text-xs`}>
                {issue.severity.toUpperCase()}
              </Badge>
              <Badge variant="outline" className="text-xs">
                {issue.state?.toUpperCase()}
              </Badge>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-sm text-muted-foreground">
            <div className="flex items-center gap-2">
              <UserPlus className="w-4 h-4" />
              <span>Created by: {issue.createdBy}</span>
            </div>
            <div className="flex items-center gap-2">
              <Calendar className="w-4 h-4" />
              <span>Created: {formatDate(issue.createdAt)}</span>
            </div>
            {issue.closedAt && (
              <>
                <div className="flex items-center gap-2">
                  <UserCheck className="w-4 h-4" />
                  <span>Closed by: {issue.closedBy}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Calendar className="w-4 h-4" />
                  <span>Closed: {formatDate(issue.closedAt)}</span>
                </div>
              </>
            )}
          </div>

          <div className="flex gap-2 pt-2">
            <Link to={`/bugs/${issue.issueId}`}>
              <Button size="sm" variant="outline">
                <Eye className="w-4 h-4 mr-1" />
                View Details
              </Button>
            </Link>
            {issue.fromGithub || issue.issue_url && (
              <Button size="sm" variant="outline" asChild>
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
