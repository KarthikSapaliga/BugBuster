import { Link } from "react-router-dom";
import { Plus, Eye, UserRound, BarChart3, AlertTriangle } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useAppStore } from "@/store/store";

const links = [
  {
    title: "Create Project",
    route: "/create-project",
    icon: <Plus className="mr-2 h-4 w-4" />,
    variant: "default",
    access: ["MANAGER"],
  },
  {
    title: "Report New Bug",
    route: "/report-bug",
    icon: <Plus className="mr-2 h-4 w-4" />,
    variant: "default",
    access: ["TESTER","DEVELOPER"],
  },
  {
    title: "View All Bugs",
    route: "/all-issues",
    icon: <Eye className="mr-2 h-4 w-4" />,
    variant: "secondary",
    access: ["all"],
  },
  {
    title: "Assigned To Me",
    route: "/assigned-me",
    icon: <UserRound className="mr-2 h-4 w-4" />,
    variant: "secondary",
    access: ["DEVELOPER"],
  },
  {
    title: "View Analytics",
    route: "/analytics-reports",
    icon: <BarChart3 className="mr-2 h-4 w-4" />,
    variant: "secondary",
    access: ["all"],
  },
  
];

export default function QuickActions() {
  const { user } = useAppStore();
  return (
    <div className="space-y-6 w-full md:max-w-[30%]">
      <Card className="bg-background">
        <CardContent className="pt-6 space-y-3">
          <h2 className="text-lg font-semibold">Quick Actions</h2>
          <div className="space-y-2">
            {links
              .filter(
                (link) =>
                  link.access.includes("all") || link.access.includes(user.role)
              )
              .map((link, idx) => (
                <Button
                  key={idx}
                  variant={link.variant}
                  className="w-full justify-start border"
                  asChild
                >
                  <Link to={link.route}>
                    {link.icon}
                    {link.title}
                  </Link>
                </Button>
              ))}
          </div>
        </CardContent>
      </Card>

      <Card className="bg-red-50 border-red-200">
        <CardContent className="pt-6 space-y-3">
          <div className="flex items-center gap-2 text-red-600 font-semibold text-sm">
            <AlertTriangle className="h-4 w-4" />
            Critical Bugs
          </div>
          <p className="text-sm text-muted-foreground">
            You have <strong>critical bugs</strong> that need immediate
            attention.
          </p>
          <Button variant="destructive" className="w-full bg-red-500" asChild>
            <Link to="/high-priority">View Critical Bugs</Link>
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
