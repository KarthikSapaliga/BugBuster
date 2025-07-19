export function calculateBugStats(bugs, projects) {
  const total = bugs.length;
  const totalProjects = projects.length;

  const open = bugs.filter(bug => bug.state && bug.state.toUpperCase() === "OPEN").length;
  const inProgress = bugs.filter(bug => bug.state && bug.state.toUpperCase() === "IN_PROGRESS").length;
  const resolved = bugs.filter(bug => bug.state && bug.state.toUpperCase() === "RESOLVED").length;
  const closed = bugs.filter(bug => bug.state && bug.state.toUpperCase() === "CLOSED").length;

  return [
    { label: "Projects", value: String(totalProjects).padStart(2, "0") },
    { label: "All Issues", value: String(total).padStart(2, "0") },
    { label: "Open", value: String(open).padStart(2, "0") },
    { label: "In Progress", value: String(inProgress).padStart(2, "0") },
    { label: "Closed", value: String(closed).padStart(2, "0") },
  ];
}


export function getBugAnalyticsData(bugs) {

  const openCount = bugs.filter(b => b.state && b.state.toUpperCase() === "OPEN").length;
  const inProgressCount = bugs.filter(b => b.state && b.state.toUpperCase() === "IN_PROGRESS").length;
  const resolvedCount = bugs.filter(b => b.state && b.state.toUpperCase() === "RESOLVED").length;
  const closedCount = bugs.filter(b => b.state && b.state.toUpperCase() === "CLOSED").length;

  const barData = [
    { status: "Open", count: openCount},
    { status: "In Progress", count: inProgressCount},
    { status: "Resolved", count: resolvedCount},
    { status: "Closed", count: closedCount}
  ];

  const pieData = [
    { status: "Open", value: openCount },
    { status: "In Progress", value: inProgressCount },
    { status: "Resolved", value: resolvedCount },
    { status: "Closed", value: closedCount }
  ];

  const days = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
  const weekly = days.map(day => ({ day, pending: 0, completed: 0 }));

  bugs.forEach(bug => {
    if (bug.createdAt && (bug.state === "OPEN" || bug.state === "IN_PROGRESS")) {
      const createdDate = new Date(bug.createdAt);
      const createdDay = createdDate.toLocaleDateString("en-US", { weekday: "short" });
      const index = days.findIndex(d => d === createdDay);
      if (index !== -1) {
        weekly[index].pending += 1;
      }
    }

    if (bug.resolvedAt && bug.state === "RESOLVED") {
      const resolvedDate = new Date(bug.resolvedAt);
      const resolvedDay = resolvedDate.toLocaleDateString("en-US", { weekday: "short" });
      const index = days.findIndex(d => d === resolvedDay);
      if (index !== -1) {
        weekly[index].completed += 1;
      }
    } else if (bug.closedAt && bug.state === "CLOSED") {
      const closedDate = new Date(bug.closedAt);
      const closedDay = closedDate.toLocaleDateString("en-US", { weekday: "short" });
      const index = days.findIndex(d => d === closedDay);
      if (index !== -1) {
        weekly[index].completed += 1;
      }
    }
  });

  return {
    barData,
    pieData,
    weeklyProgress: weekly
  };
}
