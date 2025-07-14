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
  SidebarProvider,
} from "./ui/sidebar";
import { Bot, Bug, LayoutDashboard, Settings } from "lucide-react";
import { cn } from "@/lib/utils";
import { NavLink, useLocation } from "react-router-dom";

const sidebarMenuItems = [
  {
    title: "DashBoard",
    url: "/dashboard",
    icon: LayoutDashboard,
  },
  {
    title: "Issues",
    url: "/issues",
    icon: LayoutDashboard,
  },
  {
    title: "Settings",
    url: "/project-settings",
    icon: Settings,
  },
];

const projects = [
  { id: 1, name: "project1", url: "/project/1" },
  { id: 2, name: "project 2", url: "/project/2" },
  { id: 3, name: "project 3", url: "/project/3" },
];

const SideBar = () => {
  const pathname = useLocation();
  return (
    <Sidebar collapsible="icon">
      <SidebarHeader>
        <Bug />
      </SidebarHeader>

      <SidebarContent>
        {/* group 1 */}
        <SidebarGroup>
          <SidebarGroupLabel>General</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {sidebarMenuItems.map((item) => (
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
        {/* group2 */}
        <SidebarGroup>
          <SidebarGroupLabel>Projects</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {projects.map((project) => (
                <SidebarMenuItem key={project.id}>
                  <SidebarMenuButton asChild>
                    <NavLink to={project.url} className="flex items-center">
                      <div
                        className={cn(
                          "font-bold rounded-sm border size-6 flex justify-center items-center text-primary bg-primary-foreground text-sm",
                          {
                            "bg-primary text-primary-foreground ": location.pathname === project.url,
                            
                          }
                        )}
                      >
                        {project.name.slice(0, 1).toUpperCase()}
                      </div>
                      {project.name}
                    </NavLink>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  );
};

export default SideBar;
