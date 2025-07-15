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

export const overviewMenu = [
  {
    title: "Dashboard",
    url: "/dashboard",
    icon: LayoutDashboard,
  },
  {
    title: "Analytics & Reports",
    url: "/analytics-reports",
    icon: BarChart3,
  },
];

export const bugManagementMenu = [
  {
    title: "All Issues",
    url: "/all-issues",
    icon: Bug,
  },
  {
    title: "In Progress",
    url: "/in-progress",
    icon: PlayCircle,
  },
  {
    title: "High Priority",
    url: "/high-priority",
    icon: Flame,
  },
  {
    title: "Assigned to Me",
    url: "/assigned-me",
    icon: User,
  },
  {
    title: "Report New Bug",
    url: "/report-bug",
    icon: PlusCircle,
  },
];

const projects = [
  {
    id: 1,
    name: "Project Alpha",
    url: "/project/1",
    subItems: [
      { title: "Dashboard", url: "/project/1/dashboard" },
      { title: "Issues", url: "/project/1/issues" },
      { title: "Team & Assignments", url: "/project/1/team" },
      { title: "Project Settings", url: "/project/1/settings" },
    ],
  },
  {
    id: 2,
    name: "Project Beta",
    url: "/project/2",
    subItems: [
      { title: "Dashboard", url: "/project/2/dashboard" },
      { title: "Issues", url: "/project/2/issues" },
      { title: "Team & Assignments", url: "/project/2/team" },
      { title: "Project Settings", url: "/project/2/settings" },
    ],
  },
  {
    id: 3,
    name: "Project Gamma",
    url: "/project/3",
    subItems: [
      { title: "Dashboard", url: "/project/3/dashboard" },
      { title: "Issues", url: "/project/3/issues" },
      { title: "Team & Assignments", url: "/project/3/team" },
      { title: "Project Settings", url: "/project/3/settings" },
    ],
  },
];

const SideBar = () => {
  const pathname = useLocation();
  const { open: isSidebarOpen } = useSidebar();
  return (
    <Sidebar collapsible="icon" className="fixed left-0 h-[calc(100vh-4rem)] top-[3.6rem]">
      <SidebarContent>
        {/* group 1 */}
        <SidebarGroup>
          <SidebarGroupLabel>Overview</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {overviewMenu.map((item) => (
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
              {bugManagementMenu.map((item) => (
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
        {isSidebarOpen && <SidebarGroup>
          <SidebarGroupLabel>Projects</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {projects.map((project) => (
                <SideBarProjectMenuItem key={project.id} project={project} />
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>}

      </SidebarContent>
    </Sidebar>
  );
};

export default SideBar;
