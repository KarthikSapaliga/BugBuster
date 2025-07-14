import React from "react";
import { SidebarProvider } from "./ui/sidebar";
import SideBar from "./SideBar";
import TopBar from "./TopBar";

const Layout = ({ children }) => {
  return (
    <SidebarProvider>
      <div className="w-screen h-screen flex flex-col overflow-hidden">
        <TopBar />
        <div className="flex flex-1">
          <SideBar />
          <main className="flex-1 overflow-auto bg-background">
            {children}
          </main>
        </div>
      </div>
    </SidebarProvider>
  );
};

export default Layout;
