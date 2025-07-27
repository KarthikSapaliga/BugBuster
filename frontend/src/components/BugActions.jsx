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
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";

import { Edit, X, Trash2, Play, CheckCircle, UserPlus } from "lucide-react";

import { useAppStore } from "@/store/store";
import { apiClient } from "@/lib/axios";

import {
  GET_DEVS_IN_TEAM_ROUTE,
  GET_TESTERS_IN_TEAM_ROUTE,
  START_WORKING_ROUTE,
  ASSIGN_BUG_ROUTE,
  RESOLVE_BUG_ROUTE,
  CLOSE_BUG_ROUTE,
  DELETE_BUG_ROUTE,
  GET_PROJECT_BY_ID_ROUTE,
} from "@/lib/routes";

import {
  extractGithubOwner,
  extractGithubRepo,
  closeGithubIssue,
  initOctokit,
} from "@/lib/VersionControl-Integration/versioncontrol.js";

function BugActions({ bug }) {
  const { user, token } = useAppStore();
  const navigate = useNavigate();

  const [developers, setDevelopers] = useState([]);
  const [selectedDev, setSelectedDev] = useState("");
  const [testers, setTesters] = useState([]);
  const [selectedTester, setSelectedTester] = useState("");
  const [estimatedHours, setEstimatedHours] = useState("");
  const [assignMessage, setAssignMessage] = useState("");
  const [startEstimatedHours, setStartEstimatedHours] = useState("");
  const [resolveMessage, setResolveMessage] = useState("");
  const [spentHours, setSpentHours] = useState("");
  const [closeMessage, setCloseMessage] = useState("");

  useEffect(() => {
    if (!bug.projectId) return;

    const fetchDevelopers = async () => {
      const res = await apiClient.get(
        `${GET_DEVS_IN_TEAM_ROUTE}/${bug.projectId}`
      );
      setDevelopers(res.data);
    };

    const fetchTesters = async () => {
      const res = await apiClient.get(
        `${GET_TESTERS_IN_TEAM_ROUTE}/${bug.projectId}`
      );
      setTesters(res.data);
    };

    fetchTesters();
    fetchDevelopers();
  }, [bug.projectId]);

  const updateBugDetails = () => {
    navigate(`/bugs/update-bug/${bug.id}`);
  };

  const assignUser = async () => {
    if (!token) return toast.error("Unauthorized");
    if (!selectedDev || !estimatedHours || !assignMessage)
      return toast.error("All fields are required");

    try {
      await apiClient.patch(`${ASSIGN_BUG_ROUTE}/${bug.id}`, null, {
        params: {
          developerId: selectedDev,
          estimatedHours,
          assignMessage,
        },
        headers: { Authorization: `Bearer ${token}` },
      });

      toast.success("Developer assigned successfully!");
    } catch (err) {
      toast.error(
        err?.response?.data?.message || "Failed to assign developer."
      );
    }
  };

  const startWork = async () => {
    if (!token) return toast.error("Unauthorized");
    if (!startEstimatedHours)
      return toast.error("Estimated hours are required");

    try {
      await apiClient.patch(`${START_WORKING_ROUTE}/${bug.id}`, null, {
        params: { estimatedHours: startEstimatedHours },
        headers: { Authorization: `Bearer ${token}` },
      });

      toast.success("Bug marked as In Progress!");
    } catch (err) {
      toast.error(err?.response?.data?.message || "Failed to start work.");
    }
  };

  const resolveBug = async () => {
    if (!token) return toast.error("Unauthorized");
    if (!selectedTester || !resolveMessage || !spentHours)
      return toast.error("All fields are required");

    try {
      await apiClient.patch(`${RESOLVE_BUG_ROUTE}/${bug.id}`, null, {
        params: {
          resolveMessage,
          spentHours,
          testerId: selectedTester,
        },
        headers: { Authorization: `Bearer ${token}` },
      });

      toast.success("Bug marked as resolved!");
    } catch (err) {
      toast.error(err?.response?.data?.message || "Failed to resolve bug.");
    }
  };

  const closeBug = async () => {
    if (!token) return toast.error("Unauthorized");
    if (!closeMessage) return toast.error("Close message is required");

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
        params: {
          closedBy: user.id,
          closeMessage,
        },
        headers: { Authorization: `Bearer ${token}` },
      });

      toast.success("Bug closed successfully!");
    } catch (err) {
      toast.error(err?.response?.data || "Failed to close bug.");
    }
  };

  const deleteBug = async () => {
    if (!token) return toast.error("Unauthorized");

    try {
      await apiClient.delete(`${DELETE_BUG_ROUTE}/${bug.id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      toast.success("Bug deleted successfully!");
      navigate("/dashboard");
    } catch (err) {
      toast.error(err?.response?.data?.message || "Failed to delete bug.");
    }
  };

  return (
    <div className="flex flex-col gap-6">
      {user && user.role === "TESTER" && (
        <>
          <div>
            <h2 className="text-lg font-semibold mb-2">Actions</h2>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              <Button
                onClick={updateBugDetails}
                className="bg-blue-100 text-blue-800 hover:bg-blue-200 dark:bg-blue-900 dark:text-blue-100 dark:hover:bg-blue-800 flex items-center gap-2"
              >
                <Edit size={16} />
                Update Details
              </Button>

              <Button
                onClick={deleteBug}
                className="bg-rose-100 text-rose-800 hover:bg-rose-200 dark:bg-rose-900 dark:text-rose-100 dark:hover:bg-rose-800 flex items-center gap-2"
              >
                <Trash2 size={16} />
                Delete
              </Button>
              {bug?.state === "RESOLVED" && (
                <div className="flex flex-col gap-2 col-span-2">
                  <Textarea
                    placeholder="Close message"
                    value={closeMessage}
                    onChange={(e) => setCloseMessage(e.target.value)}
                  />
                  <Button
                    onClick={closeBug}
                    disabled={!closeMessage}
                    className="bg-amber-100 text-amber-800 hover:bg-amber-200 dark:bg-amber-900 dark:text-amber-100 dark:hover:bg-amber-800 flex items-center gap-2"
                  >
                    <X size={16} />
                    Close Issue
                  </Button>
                </div>
              )}
            </div>
          </div>

          {bug.state === "OPEN" ||
            (bug.state === "RESOLVED" && (
              <div className="space-y-3">
                <h2 className="text-lg font-semibold">Assign To</h2>
                <div className="grid grid-cols-1 items-center lg:grid-cols-3 gap-4">
                  <Textarea
                    placeholder="Assignment message"
                    value={assignMessage}
                    onChange={(e) => setAssignMessage(e.target.value)}
                    className="col-span-3"
                  />
                    <Select onValueChange={setSelectedDev}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select developer" />
                      </SelectTrigger>
                      <SelectContent>
                        {developers.map((dev) => (
                          <SelectItem key={dev.id} value={dev.id}>
                            {dev.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>

                    <Input
                      type="number"
                      placeholder="Estimated hours"
                      value={estimatedHours}
                      onChange={(e) => setEstimatedHours(e.target.value)}
                    />
                    <Button
                      disabled={
                        !selectedDev || !estimatedHours || !assignMessage
                      }
                      onClick={assignUser}
                      className="bg-primary disabled:bg-gray-400 text-primary-foreground flex items-center gap-2"
                    >
                      <UserPlus size={16} />
                      Assign
                    </Button>
                  
                </div>
              </div>
            ))}
        </>
      )}

      {user && user.role === "DEVELOPER" && (
        <div className="space-y-4">
          <h2 className="text-lg font-semibold mb-2">Actions</h2>

          {bug.state === "OPEN" && (
            <div className="flex flex-col gap-2">
              <Input
                type="number"
                placeholder="Estimated hours"
                value={startEstimatedHours}
                onChange={(e) => setStartEstimatedHours(e.target.value)}
              />
              <Button
                onClick={startWork}
                disabled={!startEstimatedHours}
                className="bg-primary/90 hover:bg-primary text-white flex items-center gap-2"
              >
                <Play size={16} />
                Start Work
              </Button>
            </div>
          )}

          {bug.assignedTo === user.id && bug.state === "IN_PROGRESS" && (
            <div className="flex flex-col gap-2">
              <Textarea
                placeholder="Resolve message"
                value={resolveMessage}
                onChange={(e) => setResolveMessage(e.target.value)}
              />
              <Input
                type="number"
                placeholder="Spent hours"
                value={spentHours}
                onChange={(e) => setSpentHours(e.target.value)}
              />
              <Select onValueChange={setSelectedTester}>
                <SelectTrigger>
                  <SelectValue placeholder="Assign a tester" />
                </SelectTrigger>
                <SelectContent>
                  {testers.map((tester) => (
                    <SelectItem key={tester.id} value={tester.id}>
                      {tester.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <Button
                onClick={resolveBug}
                disabled={!resolveMessage || !spentHours || !selectedTester}
                className="bg-primary/90 hover:bg-primary text-white flex items-center gap-2"
              >
                <CheckCircle size={16} />
                Mark as Resolved
              </Button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default BugActions;
