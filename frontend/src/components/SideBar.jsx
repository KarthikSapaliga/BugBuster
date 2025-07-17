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
import { useAppStore } from "@/store/store";

export const overviewMenu = [
  {
    title: "Dashboard",
    url: "/dashboard",
    icon: LayoutDashboard,
    roles: ["Manager", "Tester", "Developer"],
  },
  {
    title: "Analytics & Reports",
    url: "/analytics-reports",
    icon: BarChart3,
    roles: ["Manager", "Tester", "Developer"],
  },
];

export const bugManagementMenu = [
  {
    title: "All Issues",
    url: "/all-issues",
    icon: Bug,
    roles: ["Manager", "Tester", "Developer"],
  },
  {
    title: "In Progress",
    url: "/in-progress",
    icon: PlayCircle,
    roles: ["Manager", "Tester", "Developer"],
  },
  {
    title: "High Priority",
    url: "/high-priority",
    icon: Flame,
    roles: ["Manager", "Tester", "Developer"],
  },
  {
    title: "Assigned to Me",
    url: "/assigned-me",
    icon: User,
    roles: ["Developer"],
  },
  {
    title: "Report New Bug",
    url: "/report-bug",
    icon: PlusCircle,
    roles: ["Tester"],
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
        roles: ["Manager", "Tester", "Developer"],
      },
      {
        title: "Version Control Integration",
        url: "/project/1/vci",
        roles: ["Manager", "Tester", "Developer"],
      },
      {
        title: "Team Members",
        url: "/project/1/team",
        roles: ["Manager", "Tester", "Developer"],
      },
      {
        title: "Project Settings",
        url: "/project/1/settings",
        roles: ["Manager"],
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
        roles: ["Manager", "Tester", "Developer"],
      },
      {
        title: "Version Control Integration",
        url: "/project/1/vci",
        roles: ["Manager", "Tester", "Developer"],
      },
      {
        title: "Team Members",
        url: "/project/1/team",
        roles: ["Manager", "Tester", "Developer"],
      },
      {
        title: "Project Settings",
        url: "/project/1/settings",
        roles: ["Manager"],
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
        roles: ["Manager", "Tester", "Developer"],
      },
      {
        title: "Version Control Integration",
        url: "/project/1/vci",
        roles: ["Manager", "Tester", "Developer"],
      },
      {
        title: "Team Members",
        url: "/project/1/team",
        roles: ["Manager", "Tester", "Developer"],
      },
      {
        title: "Project Settings",
        url: "/project/1/settings",
        roles: ["Manager"],
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
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        )}
      </SidebarContent>
    </Sidebar>
  );
};

export default SideBar;
