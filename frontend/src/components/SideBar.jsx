import { useState, useEffect } from "react";
import { apiClient } from "@/lib/axios";
import { GET_MY_PROJECTS_ROUTE } from "@/lib/routes";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "./ui/sidebar";
import {
  BarChart3,
  Bot,
  LayoutDashboard,
  Settings,
  Bug,
  PlusCircle,
  User,
  PlayCircle,
  Flame,
  Plus,
} from "lucide-react";

import {
  Collapsible,
  CollapsibleTrigger,
  CollapsibleContent,
} from "@/components/ui/collapsible";
import { ChevronRight, ChevronDown, Folder } from "lucide-react";

import { cn } from "@/lib/utils";
import { NavLink, useLocation } from "react-router-dom";
import SideBarProjectMenuItem from "./SideBarProjectMenuItem";
import { useAppStore } from "@/store/store";
import { Button } from "./ui/button";

export const overviewMenu = [
  {
    title: "Dashboard",
    url: "/dashboard",
    icon: LayoutDashboard,
    roles: ["MANAGER", "TESTER", "DEVELOPER"],
  },
  {
    title: "Analytics & Reports",
    url: "/analytics-reports",
    icon: BarChart3,
    roles: ["MANAGER", "TESTER", "DEVELOPER"],
  },
];

export const bugManagementMenu = [
  {
    title: "All Issues",
    url: "/all-issues",
    icon: Bug,
    roles: ["MANAGER", "TESTER", "DEVELOPER"],
  },
  {
    title: "In Progress",
    url: "/in-progress",
    icon: PlayCircle,
    roles: ["MANAGER", "TESTER", "DEVELOPER"],
  },
  {
    title: "High Priority",
    url: "/high-priority",
    icon: Flame,
    roles: ["MANAGER", "TESTER", "DEVELOPER"],
  },
  {
    title: "Assigned to Me",
    url: "/assigned-me",
    icon: User,
    roles: ["DEVELOPER"],
  },
  {
    title: "Report New Bug",
    url: "/report-bug",
    icon: PlusCircle,
    roles: ["TESTER"],
  },
];

const SideBar = () => {
  const { user, token } = useAppStore();
  const pathname = useLocation();
  const { open: isSidebarOpen } = useSidebar();

  const location = useLocation();
  const [projects, setProjects] = useState([]);

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const res = await apiClient.get(GET_MY_PROJECTS_ROUTE, {
          headers: { Authorization: `Bearer ${token}` }
        });
        setProjects(res.data || []);
      } catch (err) {
        console.error("Failed to fetch projects", err);
      }
    };
    if (user) {
      fetchProjects();
    }
  }, [user]);

  return (
    <Sidebar
      collapsible="icon"
      className="fixed left-0 h-[calc(100vh-4rem)] top-[3.6rem]"
    >
      <SidebarContent>
        {/* group 1 */}
        <SidebarGroup>
          <SidebarGroupLabel>Overview</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {overviewMenu
                .filter((item) =>
                  item.roles.some((role) => user?.role.includes(role))
                )
                .map((item) => (
                  <SidebarMenuItem key={item.title}>
                    <SidebarMenuButton asChild>
                      <NavLink
                        to={item.url}
                        className={cn(
                          {
                            "!bg-primary !text-primary-foreground":
                              location.pathname === item.url,
                          },
                          "list-none"
                        )}
                      >
                        <item.icon />
                        <span>{item.title}</span>
                      </NavLink>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
        {/* group 2 */}
        <SidebarGroup>
          <SidebarGroupLabel>Bug Management</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {bugManagementMenu
                .filter((item) =>
                  item.roles.some((role) => user?.role.includes(role))
                )
                .map((item) => (
                  <SidebarMenuItem key={item.title}>
                    <SidebarMenuButton asChild>
                      <NavLink
                        to={item.url}
                        className={cn(
                          {
                            "!bg-primary !text-primary-foreground":
                              location.pathname === item.url,
                          },
                          "list-none"
                        )}
                      >
                        <item.icon />
                        <span>{item.title}</span>
                      </NavLink>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        {/* group3 */}
        {isSidebarOpen && (
          <SidebarGroup>
            <SidebarGroupLabel>Projects</SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu>
                {projects.map((project) => (
                  <SideBarProjectMenuItem key={project.id} project={project} />
                  // <p>hello</p>
                ))}
                {user?.role == "MANAGER" && (
                  <SidebarMenuItem>
                    <NavLink to="/create-project">
                      <Button variant="outline" className="w-fit mt-3">
                        <Plus />
                        Create Project
                      </Button>
                    </NavLink>
                  </SidebarMenuItem>
                )}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        )}
      </SidebarContent>
    </Sidebar>
  );
};

export default SideBar;
