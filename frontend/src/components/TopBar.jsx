import { FaBug, FaBars } from "react-icons/fa";
import { UserRound, Sun, Moon, LogOut } from "lucide-react";
import { useTheme } from "@/contexts/ThemeContext";
import { useSidebar } from "./ui/sidebar";

import { useNavigate } from "react-router-dom";
import { useAppStore } from "@/store/store";

export default function TopBar() {
  const { user, logout } = useAppStore();

  const navigate = useNavigate();
  const handleLogout = () => {
    logout();
    navigate("/signin");
  };

  const { theme, toggleTheme } = useTheme();
  const { toggleSidebar } = useSidebar();
  return (
    <header className="flex items-center justify-between border-b border-border bg-sidebar px-4 py-3 shadow-sm">
      <div className="flex items-center gap-2 text-xl font-bold text-foreground">
        <span className="text-lg mr-4 cursor-pointer" onClick={toggleSidebar}>
          <FaBars />
        </span>
        <span className="text-lg p-1 bg-primary text-primary-foreground rounded-sm">
          <FaBug />
        </span>
        <span>BugBuster</span>
      </div>

      <div className="flex items-center gap-4">
        <button
          onClick={toggleTheme}
          className="w-8 h-8 rounded-full bg-muted flex items-center justify-center p-2 hover:bg-muted/80 transition cursor-pointer border"
        >
          {theme === "light" ? <Moon size={16} /> : <Sun size={16} />}
        </button>
        <div className="h-9 w-9 flex items-center justify-center bg-gradient-to-br from-primary to-primary/80 text-primary-foreground font-semibold text-sm rounded-full border-2 border-primary/20 shadow-md hover:shadow-lg transition-all duration-200">
          {user.name
            .split(" ")
            .map((n) => n[0])
            .join("")
            .toUpperCase()}
        </div>
        <button
          onClick={handleLogout}
          className="w-8 h-8 rounded-full bg-muted flex items-center justify-center p-2 hover:bg-muted/80 transition cursor-pointer border"
        >
          <LogOut />
        </button>
      </div>
    </header>
  );
}
