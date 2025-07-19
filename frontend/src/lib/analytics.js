export function calculateBugStats(bugs, projects) {
  const total = bugs.length;
  const totalProjects = projects.length;

  const open = bugs.filter((bug) => bug.state.toUpperCase() === "OPEN").length;
  const inProgress = bugs.filter((bug) => bug.state.toUpperCase() === "IN_PROGRESS").length;
  const closed = bugs.filter((bug) => bug.state.toUpperCase() === "CLOSED").length;

  return [
    { label: "Projects", value: String(totalProjects).padStart(2, "0") },
    { label: "All Issues", value: String(total).padStart(2, "0") },
    { label: "Open", value: String(open).padStart(2, "0") },
    { label: "In Progress", value: String(inProgress).padStart(2, "0") },
    { label: "Closed", value: String(closed).padStart(2, "0") },
  ];
}
