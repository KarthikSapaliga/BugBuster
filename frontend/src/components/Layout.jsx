import React from "react";
import { SidebarProvider } from "./ui/sidebar";
import SideBar from "./SideBar";
import TopBar from "./TopBar";

const Layout = ({ children }) => {
  return (
    <SidebarProvider>
      <div className="w-screen h-screen flex flex-col overflow-hidden">
        <TopBar />
        <div className="flex flex-1 min-h-0">
          <SideBar />
          <main className="flex-1 bg-background overflow-y-auto">
            {children}
          </main>
        </div>
      </div>
    </SidebarProvider>
  );
};

export default Layout;
