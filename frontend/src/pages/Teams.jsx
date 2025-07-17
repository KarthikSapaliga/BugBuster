import React, { useEffect, useState } from "react";
import { useAppStore } from "@/store/store";
import { apiClient } from "@/lib/axios";
import { GET_USER_ROUTE } from "@/lib/routes";
import { useParams } from "react-router-dom";
import { Users } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { UserCog, Bug, Code, Mail, Loader2 } from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
function Teams() {
  const { projectId } = useParams();
  const { token } = useAppStore();
  const [projectData, setProjectData] = useState([]);
  const [teamMembers, setTeamMembers] = useState([]);
  const [memberDetails, setMemberDetails] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchTeam = async () => {
      try {
        const res = await apiClient.get(
          `/api/projects/get-by-id/${projectId}`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        setProjectData(res.data || []);
        setTeamMembers(res.data.teamMembers || []);
      } catch (err) {
        console.error("Failed to fetch project", err);
      }
    };
    fetchTeam();
  }, [projectId, token]);

  useEffect(() => {
    if (teamMembers.length === 0) return;

    const fetchMemberDetails = async () => {
      try {
        const data = await Promise.all(
          teamMembers.map((id) =>
            apiClient.get(`${GET_USER_ROUTE}${id}`).then((res) => res.data)
          )
        );
        setMemberDetails(data);
      } catch (err) {
        console.error("Failed to fetch member details", err);
      }
    };

    fetchMemberDetails();
  }, [teamMembers]);

  const getRoleIcon = (role) => {
    switch (role) {
      case "MANAGER":
        return <UserCog className="w-5 h-5" />;
      case "TESTER":
        return <Bug className="w-5 h-5" />;
      case "DEVELOPER":
        return <Code className="w-5 h-5" />;
      default:
        return <Users className="w-5 h-5" />;
    }
  };

  const getRoleColor = (role) => {
    switch (role) {
      case "MANAGER":
        return "bg-purple-100 text-purple-800 border-purple-200";
      case "TESTER":
        return "bg-orange-100 text-orange-800 border-orange-200";
      case "DEVELOPER":
        return "bg-blue-100 text-blue-800 border-blue-200";
      default:
        return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };

  const getInitials = (name) => {
    return name
      .split(" ")
      .map((word) => word.charAt(0).toUpperCase())
      .join("");
  };

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="text-center">
            <Loader2 className="w-8 h-8 animate-spin mx-auto mb-4 text-primary" />
            <p className="text-muted-foreground">Loading team members...</p>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center text-red-600">
          <p>{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6 md:p-8 lg:p-12">
      {/* Header */}
      <div className="mb-8 space-y-4">
        <h1 className="text-3xl font-bold text-foreground mb-2">
          Team Members
        </h1>
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
          <p className="text-muted-foreground">
            Project:{" "}
            <span className="font-semibold text-foreground bg-muted px-2 py-1 rounded-md">
              {projectData.name}
            </span>
          </p>
          <div className="flex items-center gap-2">
            <div className="bg-accent/20 text-accent-foreground px-3 py-1 rounded-full text-sm font-medium border border-accent/30">
              {memberDetails.length} member
              {memberDetails.length !== 1 ? "s" : ""}
            </div>
          </div>
        </div>
      </div>

      {/* Team Members Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {memberDetails.map((member) => (
          <Card
            key={member.id}
            className="bg-card border hover:shadow-lg transition-all duration-300 group"
          >
            <CardHeader className="pb-4 pt-6 px-6 bg-gradient-to-r from-muted/50 to-muted/30">
              <div className="flex flex-col items-center text-center">
                <Avatar className="w-16 h-16 mb-3 border-2 border-border shadow-md group-hover:shadow-lg transition-shadow">
                  <AvatarFallback className="bg-gradient-to-br from-primary/90 via-primary to-primary/80 text-primary-foreground font-semibold text-lg">
                    {getInitials(member.name)}
                  </AvatarFallback>
                </Avatar>
                <CardTitle className="text-xl font-semibold mb-2 text-foreground">
                  {member.name}
                </CardTitle>
                <CardDescription className="mb-0">
                  <Badge
                    variant="secondary"
                    className={`text-sm font-medium px-3 py-1 ${getRoleColor(
                      member.role
                    )}`}
                  >
                    <span className="flex items-center gap-2">
                      {getRoleIcon(member.role)}
                      {member.role}
                    </span>
                  </Badge>
                </CardDescription>
              </div>
            </CardHeader>
            <CardContent className="pt-4 px-6 pb-6">
              <div className="space-y-3">
                <div className="flex items-center justify-center gap-2 text-sm text-muted-foreground bg-muted/50 border border-border rounded-md p-3 hover:bg-muted/70 transition-colors">
                  <Mail className="w-4 h-4 text-primary" />
                  <span className="truncate font-medium">{member.email}</span>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
      {/* Empty State */}
      {memberDetails.length === 0 && (
        <div className="text-center py-12">
          <Users className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
          <h3 className="text-lg font-semibold mb-2">No Team Members</h3>
          <p className="text-muted-foreground">
            This project doesn't have any team members yet.
          </p>
        </div>
      )}
    </div>
  );
}

export default Teams;
