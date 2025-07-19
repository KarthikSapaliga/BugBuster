import { calculateBugStats } from "@/lib/analytics";
import { apiClient } from "@/lib/axios";
import { GET_ALL_BUGS_ROUTE, GET_MY_PROJECTS_ROUTE } from "@/lib/routes";
import { useAppStore } from "@/store/store";
import React, { useEffect, useState } from "react";

const Stats = () => {
  const {token } = useAppStore();
  const [bugs, setBugs] = useState([]);
  const [stats, setStats] = useState([]);
  const [projects, setProjects] = useState([]);


  useEffect(() => {
    async function fetchAllIssues() {
      const res = await apiClient.get(GET_ALL_BUGS_ROUTE, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setBugs(res.data);
    }

    const fetchProjects = async () => {
      try {
        const res = await apiClient.get(GET_MY_PROJECTS_ROUTE, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setProjects(res.data);
      } catch (err) {
        console.error("Failed to fetch projects", err);
      }
    };

    setStats(calculateBugStats(bugs, projects));
    fetchProjects();
    fetchAllIssues();
  }, [bugs]);
  return (
    <div>
      <div className="grid grid-cols-2 md:grid-cols-5 gap-6">
        {stats.map(({ label, value }) => (
          <div
            key={label}
            className="bg-white dark:bg-zinc-900 border border-border shadow-md rounded-xl p-6 text-center"
          >
            <h2 className="text-lg font-medium text-muted-foreground mb-2">
              {label}
            </h2>
            <p className="text-5xl font-bold text-foreground">{value}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Stats;
