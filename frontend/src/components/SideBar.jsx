import React from "react";
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

const projects = [
  {
    id: 1,
    name: "Project Alpha",
    url: "/project/1",
    subItems: [
      {
        title: "Issues",
        url: "/project/1/issues",
        roles: ["MANAGER", "TESTER", "DEVELOPER"],
      },
      {
        title: "Version Control Integration",
        url: "/project/1/vci",
        roles: ["MANAGER", "TESTER", "DEVELOPER"],
      },
      {
        title: "Team Members",
        url: "/project/1/team",
        roles: ["MANAGER", "TESTER", "DEVELOPER"],
      },
      {
        title: "Project Settings",
        url: "/project/1/settings",
        roles: ["MANAGER"],
      },
    ],
  },
  {
    id: 2,
    name: "Project Beta",
    url: "/project/2",
    subItems: [
      {
        title: "Issues",
        url: "/project/1/issues",
        roles: ["MANAGER", "TESTER", "DEVELOPER"],
      },
      {
        title: "Version Control Integration",
        url: "/project/1/vci",
        roles: ["MANAGER", "TESTER", "DEVELOPER"],
      },
      {
        title: "Team Members",
        url: "/project/1/team",
        roles: ["MANAGER", "TESTER", "DEVELOPER"],
      },
      {
        title: "Project Settings",
        url: "/project/1/settings",
        roles: ["MANAGER"],
      },
    ],
  },
  {
    id: 3,
    name: "Project Gamma",
    url: "/project/3",
    subItems: [
      {
        title: "Issues",
        url: "/project/1/issues",
        roles: ["MANAGER", "TESTER", "DEVELOPER"],
      },
      {
        title: "Version Control Integration",
        url: "/project/1/vci",
        roles: ["MANAGER", "TESTER", "DEVELOPER"],
      },
      {
        title: "Team Members",
        url: "/project/1/team",
        roles: ["MANAGER", "TESTER", "DEVELOPER"],
      },
      {
        title: "Project Settings",
        url: "/project/1/settings",
        roles: ["MANAGER"],
      },
    ],
  },
];

const SideBar = () => {
  const { user } = useAppStore();
  const pathname = useLocation();
  const { open: isSidebarOpen } = useSidebar();
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
                ))}
                {user.role == "MANAGER" && (
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
