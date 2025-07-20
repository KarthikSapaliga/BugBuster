import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";

import { useAppStore } from "@/store/store";
import { apiClient } from "@/lib/axios";
import {
  GET_DEVS_IN_TEAM_ROUTE,
  START_WORKING_ROUTE,
  ASSIGN_BUG_ROUTE,
  RESOLVE_BUG_ROUTE,
  CLOSE_BUG_ROUTE,
  DELETE_BUG_ROUTE,
  GET_PROJECT_BY_ID_ROUTE
} from "@/lib/routes";
import { Edit, X, Trash2, Play, CheckCircle, UserPlus } from "lucide-react";

import {
  extractGithubOwner,
  extractGithubRepo,
  closeGithubIssue,
  initOctokit
} from "@/lib/VersionControl-Integration/versioncontrol.js";

function BugActions({ bug }) {
  const { user, token } = useAppStore();
  const navigate = useNavigate();
  const [developers, setDevelopers] = useState([]);
  const [selectedDev, setSelectedDev] = useState("");
  const [project, setProject] = useState({});



  useEffect(() => {
    if (!bug.projectId) return;

    const fetchDevelopers = async () => {
      const res = await apiClient.get(
        `${GET_DEVS_IN_TEAM_ROUTE}/${bug.projectId}`
      );
      setDevelopers(res.data);
    };
    if (bug) {
      fetchDevelopers();
    }
  }, [bug.projectId]);

  const updateBugDetails = (bug) => {
    navigate(`/bugs/update-bug/${bug.id}`);
  };

  const startWork = async () => {
    if (!token) return toast.error("Unauthorized");

    try {
      const res = await apiClient.patch(
        `${START_WORKING_ROUTE}/${bug.id}`,
        null,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      toast.success("Bug marked as In Progress!");
    } catch (err) {
      toast.error(
        err?.response?.data?.message || "Failed to start working on bug."
      );
    }
  };

  const assignUser = async () => {
    if (!token) return toast.error("Unauthorized");

    if (!selectedDev) return toast.error("Please select a developer");

    try {
      const res = await apiClient.patch(`${ASSIGN_BUG_ROUTE}/${bug.id}`, null, {
        params: { developerId: selectedDev },
        headers: { Authorization: `Bearer ${token}` },
      });

      toast.success("Developer assigned successfully!");
    } catch (err) {
      toast.error(
        err?.response?.data?.message || "Failed to assign developer."
      );
    }
  };

  const resolveBug = async () => {
    if (!token) return toast.error("Unauthorized");

    try {
      const res = await apiClient.patch(
        `${RESOLVE_BUG_ROUTE}/${bug.id}`,
        null,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      toast.success("Bug marked as resolved!");
    } catch (err) {
      toast.error(err?.response?.data?.message || "Failed to resolve bug.");
    }
  };

  const closeBug = async () => {
    if (!token) return toast.error("Unauthorized");

    try {
      if (bug.fromGithub) {
        const projectRes = await apiClient.get(
          `${GET_PROJECT_BY_ID_ROUTE}/${bug.projectId}`,
          { headers: { Authorization: `Bearer ${token}` } }
        );

        const projectData = projectRes.data;

        const owner = extractGithubOwner(projectData.githubLink);
        const repo = extractGithubRepo(projectData.githubLink);

        const octokit = initOctokit(projectData.githubToken);

        await closeGithubIssue(octokit, owner, repo, bug.issueId);

      }
      await apiClient.patch(`${CLOSE_BUG_ROUTE}/${bug.id}`, null, {
        params: { closedBy: user.id },
        headers: { Authorization: `Bearer ${token}` },
      });

      toast.success("Bug closed successfully!");
    } catch (err) {
      console.log(err)
      toast.error(err?.response?.data || "Failed to close bug.");
    }
  };


  const deleteBug = async () => {
    if (!token) return toast.error("Unauthorized");

    try {
      const res = await apiClient.delete(`${DELETE_BUG_ROUTE}/${bug.id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      toast.success("Bug deleted successfully!");
      navigate("/dashboard");
    } catch (err) {
      toast.error(err?.response?.data?.message || "Failed to delete bug.");
    }
  };

  return (
    <div className="flex flex-col gap-4">
      {user && user.role === "TESTER" && (
        <>
          <div>
            <h2 className="text-lg font-semibold mb-2">Actions</h2>
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
              <Button
                onClick={() => updateBugDetails(bug)}
                className="bg-blue-100 text-blue-800 hover:bg-blue-200 
                 dark:bg-blue-900 dark:text-blue-100 dark:hover:bg-blue-800 
                 flex items-center gap-2"
              >
                <Edit size={16} />
                Update the Details
              </Button>

              {bug?.state === "RESOLVED" && (
                <Button
                  onClick={() => closeBug()}
                  className="bg-amber-100 text-amber-800 hover:bg-amber-200 
                   dark:bg-amber-900 dark:text-amber-100 dark:hover:bg-amber-800 
                   flex items-center gap-2"
                >
                  <X size={16} />
                  Close the issue
                </Button>
              )}

              <Button
                onClick={() => deleteBug()}
                className="bg-rose-100 text-rose-800 hover:bg-rose-200 
                 dark:bg-rose-900 dark:text-rose-100 dark:hover:bg-rose-800 
                 flex items-center gap-2"
              >
                <Trash2 size={16} />
                Delete
              </Button>
            </div>
          </div>


          {bug.state === "OPEN" && (
            <div className="space-y-2 w-full">
              <h2 className="text-lg font-semibold mb-2">Assign To</h2>
              <div className="flex gap-4">
                <Select onValueChange={setSelectedDev}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select member" />
                  </SelectTrigger>
                  <SelectContent>
                    {developers.map((developer) => (
                      <SelectItem key={developer.id} value={developer.id}>
                        {developer.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <Button
                  disabled={!selectedDev}
                  onClick={() => assignUser()}
                  className="bg-primary disabled:bg-gray-400 text-primary-foreground flex items-center gap-2"
                >
                  <UserPlus size={16} />
                  Assign
                </Button>
              </div>
            </div>
          )}
        </>
      )}

      {user && user.role === "DEVELOPER" && (
        <>
          <div>
            <h2 className="text-lg font-semibold mb-2">Actions</h2>
            <div className="flex flex-col lg:flex-row gap-4">
              {bug.state === "OPEN" && (
                <Button
                  onClick={startWork}
                  className="bg-primary/90 hover:bg-primary text-white flex items-center gap-2"
                >
                  <Play size={16} />
                  Start Work
                </Button>
              )}
              {bug.assignedTo === user.id && bug.state === "IN_PROGRESS" && (
                <Button
                  onClick={resolveBug}
                  className="bg-primary/90 hover:bg-primary text-white flex items-center gap-2"
                >
                  <CheckCircle size={16} />
                  Mark as Resolved
                </Button>
              )}
            </div>
          </div>
        </>
      )}
    </div>
  );
}

export default BugActions;
