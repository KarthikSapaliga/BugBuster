import {
  Collapsible,
  CollapsibleTrigger,
  CollapsibleContent,
} from "@/components/ui/collapsible";
import { cn } from "@/lib/utils";
import { ChevronRight, ChevronDown, Folder } from "lucide-react";
import React from "react";
import { NavLink, useLocation } from "react-router-dom";
import { SidebarMenuButton, SidebarMenuItem } from "./ui/sidebar";
import { useAppStore } from "@/store/store";

const SideBarProjectMenuItem = ({ project }) => {
  const { user } = useAppStore();
  const location = useLocation();
  const [open, setOpen] = React.useState(false);

  const userRoles = user?.role || "";

  const subMenus = [
    {
      title: "Issues",
      url: `/projects/bugs/${project.id}`,
      roles: ["MANAGER", "DEVELOPER", "TESTER"],
    },
    {
      title: "Version Control",
      url: `/projects/vcs/${project.id}`,
      roles: ["MANAGER", "DEVELOPER", "TESTER"],
    },
    {
      title: "Team",
      url: `/projects/team/${project.id}`,
      roles: ["MANAGER", "TESTER", "DEVELOPER"],
    },
    {
      title: "Settings",
      url: `/projects/update-project/${project.id}`,
      roles: ["MANAGER"],
    },
  ];

  const filteredSubMenus = subMenus.filter((item) =>
    item.roles.some((role) => userRoles.includes(role))
  );

  return (
    <Collapsible key={project.id} open={open} onOpenChange={setOpen} className="w-full">
      <CollapsibleTrigger asChild>
        <SidebarMenuItem>
          <SidebarMenuButton asChild>
            <button className="flex items-center w-full justify-between">
              <span className="flex items-center gap-2">
                <Folder className="h-4 w-4" />
                {project.name}
              </span>
              {open ? <ChevronDown className="h-4 w-4" /> : <ChevronRight className="h-4 w-4" />}
            </button>
          </SidebarMenuButton>
        </SidebarMenuItem>
      </CollapsibleTrigger>

      <CollapsibleContent className="pl-6">
        {filteredSubMenus.map((sub) => (
          <SidebarMenuItem key={sub.url}>
            <SidebarMenuButton asChild>
              <NavLink
                to={sub.url}
                className={cn(
                  {
                    "!bg-primary !text-primary-foreground": location.pathname === sub.url,
                  },
                  "list-none"
                )}
              >
                {sub.title}
              </NavLink>
            </SidebarMenuButton>
          </SidebarMenuItem>
        ))}
      </CollapsibleContent>
    </Collapsible>
  );
};

export default SideBarProjectMenuItem;
