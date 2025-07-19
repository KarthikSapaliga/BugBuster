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

function Dashboard() {
  const { user } = useAppStore();
  const navigate = useNavigate();

  const createProject = () => {
    // alert("create project")
    navigate("/create-project");
  };

  return (
    <main className="p-4 md:p-8 lg:p-12 flex flex-col gap-6 bg-background">
      <div className="pb-5 border-b flex flex-col md:flex-row justify-between items-center">
        <div>
          <h1 className="text-4xl font-bold mb-2">{user.name}</h1>
          <div className="flex gap-2 items-center">
            <p className="text-xs px-2 py-1 bg-purple-300/30 border border-purple-400/50 rounded-full">
              {user.role}
            </p>
            <p className="text-xs px-2 py-1 bg-emerald-300/30 border border-emerald-400/50 rounded-full">
              {user.email}
            </p>
          </div>
        </div>
        {user.role === "MANAGER" ? (
          <Button onClick={createProject}>Create New Project</Button>
        ) : (
          <></>
        )}
      </div>
        <div>
            <Stats/>
        </div>
      <div className="flex flex-col md:flex-row md:gap-4 lg:gap-6">
        <RecentBugs />
        <QuickActions />
      </div>
    </main>
  );
}

export default Dashboard;
