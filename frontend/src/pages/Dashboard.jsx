import React, { useEffect, useState } from "react";
import { useAppStore } from "@/store/store";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";

import RecentBugs from "@/components/RecentBugs";
import QuickActions from "@/components/QuickActions";
import { GET_ALL_BUGS_ROUTE, GET_MY_PROJECTS_ROUTE } from "@/lib/routes";
import { apiClient } from "@/lib/axios";
import { calculateBugStats } from "@/lib/analytics";
import Stats from "@/components/Stats";
import { Badge } from "@/components/ui/badge";
import BottomToTopReveal from "@/components/anim/BottomToTopReveal";

function Dashboard() {
  const { user } = useAppStore();
  const navigate = useNavigate();

  const createProject = () => {
    // alert("create project")
    navigate("/create-project");
  };

  return (
    <main className="p-4 md:p-8 lg:p-12 flex flex-col gap-6 bg-background">
      <div className="pb-5 border-b border-border flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div className="flex items-start gap-4">
          <div className="w-16 h-16 bg-primary text-primary-foreground rounded-full flex items-center justify-center font-bold text-3xl shadow-md">
            {user.name
              .split(" ")
              .map((n) => n[0])
              .join("")}
          </div>
          <div>
            <h1 className="text-3xl font-bold mb-2 text-foreground">
              {user.name
                .toLowerCase()
                .split(' ')
                .map(word => word.charAt(0).toUpperCase() + word.slice(1))
                .join(' ')}
            </h1>
            <div className="flex gap-2 items-center flex-wrap">
              <Badge
                variant="default"
                className="bg-primary tracking-wider"
              >
                {user.role}
              </Badge>
              <Badge variant="outline">
                <span className="tracking-wider">{user.email}</span>
              </Badge>
            </div>
          </div>
        </div>
        {user.role === "MANAGER" ? (
          <Button onClick={createProject} size="lg">
            Create New Project
          </Button>
        ) : (
          <></>
        )}
      </div>
      <div>
        <Stats />
      </div>
      <div className="flex flex-col md:flex-row md:gap-4 lg:gap-6">
        <BottomToTopReveal>
          <RecentBugs />
        </BottomToTopReveal>

        <QuickActions />

      </div>
    </main>
  );
}

export default Dashboard;
