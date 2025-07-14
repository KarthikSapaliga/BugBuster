import {
  Collapsible,
  CollapsibleTrigger,
  CollapsibleContent,
} from "@/components/ui/collapsible";
import { cn } from "@/lib/utils";
import { ChevronRight, ChevronDown, Folder } from "lucide-react";
import React from "react";
import { NavLink } from "react-router-dom";
import { SidebarMenuButton, SidebarMenuItem } from "./ui/sidebar";

const SideBarProjectMenuItem = ({ project }) => {
  const [open, setOpen] = React.useState(false);
  return (
    <Collapsible
      key={project.id}
      open={open}
      onOpenChange={setOpen}
      className="w-full"
    >
      <CollapsibleTrigger asChild>
        <SidebarMenuItem>
          <SidebarMenuButton asChild>
            <button className="flex items-center w-full justify-between">
              <span className="flex items-center gap-2">
                <Folder className="h-4 w-4" />
                {project.name}
              </span>
              {open ? (
                <ChevronDown className="h-4 w-4" />
              ) : (
                <ChevronRight className="h-4 w-4" />
              )}
            </button>
          </SidebarMenuButton>
        </SidebarMenuItem>
      </CollapsibleTrigger>

      <CollapsibleContent className="pl-6">
        {project.subItems.map((sub) => (
          <SidebarMenuItem key={sub.url}>
            <SidebarMenuButton asChild>
              <NavLink
                to={sub.url}
                className={cn(
                  {
                    "!bg-primary !text-primary-foreground":
                      location.pathname === sub.url,
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
