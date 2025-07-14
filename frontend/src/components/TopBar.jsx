import { FaBug, FaBars } from "react-icons/fa";
import { UserRound, Sun, Moon } from "lucide-react";
import { useTheme } from "@/contexts/ThemeContext";
import { useSidebar } from "./ui/sidebar";

export default function TopBar() {
    const { theme, toggleTheme } = useTheme();
    const { toggleSidebar } = useSidebar(); 


    return (
        <header className="flex items-center justify-between border-b border-border bg-background px-4 py-3 shadow-sm">
            <div className="flex items-center gap-2 text-xl font-bold text-foreground">
                <span className="text-lg mr-4 cursor-pointer" onClick={toggleSidebar}>
                    <FaBars  />
                </span>
                <span className="text-lg p-1 bg-primary text-primary-foreground rounded-sm">
                    <FaBug />
                </span>
                <span>BugBuster</span>
            </div>

            <div className="flex items-center gap-4">
                <button
                    onClick={toggleTheme}
                    className="w-8 h-8 rounded-full bg-muted flex items-center justify-center p-2 hover:bg-muted/80 transition cursor-pointer"
                >
                    {theme === "light" ? <Moon size={16} /> : <Sun size={16} />}
                </button>
                <div className="w-8 h-8 rounded-full bg-muted flex items-center justify-center p-2 cursor-pointer">
                    <UserRound size={16} />
                </div>
            </div>
        </header>
    );
}
