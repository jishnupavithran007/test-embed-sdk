import { Settings, User, Moon, Sun } from "lucide-react";
import { useTheme } from "../context/ThemeContext";
import { useToast } from "../context/ToastContext";

interface HeaderProps {
  title?: string;
}

export const Header = ({ title = "Dashboard" }: HeaderProps) => {
  const { theme, toggleTheme } = useTheme();
  const { info } = useToast();

  const handleThemeToggle = () => {
    toggleTheme();
    info(`Switched to ${theme === "light" ? "dark" : "light"} mode`);
  };

  return (
    <header className="bg-slate-800 dark:bg-slate-900 border-b border-slate-700 dark:border-slate-800 px-4">
      <div className="flex items-center justify-between px-4 py-2 h-14">
        <h1 className="text-lg font-semibold text-white">{title}</h1>
        <div className="flex items-center gap-2">
          <button
            onClick={handleThemeToggle}
            className="flex items-center gap-1.5 px-3 py-1.5 text-sm text-white hover:bg-slate-700 dark:hover:bg-slate-800 rounded transition-colors"
            aria-label="Toggle theme"
          >
            {theme === "light" ? (
              <Moon className="w-4 h-4" />
            ) : (
              <Sun className="w-4 h-4" />
            )}
            <span className="font-medium">Light</span>
          </button>
          <button className="flex items-center gap-1.5 px-3 py-1.5 text-sm text-white hover:bg-slate-700 dark:hover:bg-slate-800 rounded transition-colors">
            <Settings className="w-4 h-4" />
            <span className="font-medium">Settings</span>
          </button>
          <button className="flex items-center gap-1.5 px-3 py-1.5 text-sm text-white hover:bg-slate-700 dark:hover:bg-slate-800 rounded transition-colors">
            <User className="w-4 h-4" />
            <span className="font-medium">Profile</span>
          </button>
        </div>
      </div>
    </header>
  );
};
