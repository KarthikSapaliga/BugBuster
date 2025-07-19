export const getStatusColor = (status) => {
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

export function getSeverityColor(severity) {
  const map = {
    low: "bg-green-100 text-green-800 border-green-200",
    medium: "bg-yellow-100 text-yellow-800 border-yellow-200",
    high: "bg-orange-100 text-orange-800 border-orange-200",
    critical: "bg-red-100 text-red-800 border-red-200",
  };
  return map[severity?.toLowerCase()] || "bg-gray-100 text-gray-800 border-gray-200";
}

export function getPriorityColor(priority) {
  const map = {
    P4: "bg-blue-100 text-blue-800 border-blue-200",
    P3: "bg-yellow-100 text-yellow-800 border-yellow-200",
    P2: "bg-orange-100 text-orange-800 border-orange-200",
    P1: "bg-red-100 text-red-800 border-red-200",
  };
  return map[priority?.toUpperCase()] || "bg-gray-100 text-gray-800 border-gray-200";
}

export function getUrgencyColor(urgency) {
  const map = {
    low: "bg-slate-100 text-slate-800 border-slate-200",
    medium: "bg-blue-100 text-blue-800 border-blue-200",
    high: "bg-red-100 text-red-800 border-red-200",
  };
  return map[urgency?.toLowerCase()] || "bg-gray-100 text-gray-800 border-gray-200";
}