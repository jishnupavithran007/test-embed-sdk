import { useState } from "react";
import {
  LayoutDashboard,
  ChevronLeft,
  ChevronRight,
  HelpCircle,
  Settings,
  Code2,
} from "lucide-react";

interface SidebarProps {
  onNavigate?: (page: string) => void;
  activePage?: string;
}

export const Sidebar = ({
  onNavigate,
  activePage = "dashboard",
}: SidebarProps) => {
  const [isCollapsed, setIsCollapsed] = useState(false);

  const menuItems = [
    { id: "full-app", label: "Full App", icon: LayoutDashboard },
    { id: "configurable-app", label: "Configurable App", icon: Settings },
    { id: "full-app-editor", label: "Full App + Editor", icon: Code2 },
    { id: "help", label: "Help", icon: HelpCircle },
  ];

  return (
    <aside
      className={`bg-slate-900 dark:bg-slate-950 text-white transition-all duration-300 ${
        isCollapsed ? "w-12" : "w-44"
      } flex flex-col border-r border-slate-800 dark:border-slate-900`}
    >
      <div className="flex items-center justify-between px-2 py-3 h-14">
        {!isCollapsed && (
          <h2 className="text-xs font-semibold text-gray-400">Menu</h2>
        )}
        <button
          className="p-1 hover:bg-slate-800 dark:hover:bg-slate-900 rounded transition-colors ml-auto"
          onClick={() => setIsCollapsed(!isCollapsed)}
          aria-label={isCollapsed ? "Expand sidebar" : "Collapse sidebar"}
        >
          {isCollapsed ? (
            <ChevronRight className="w-3.5 h-3.5 text-gray-400" />
          ) : (
            <ChevronLeft className="w-3.5 h-3.5 text-gray-400" />
          )}
        </button>
      </div>
      <nav className="flex-1">
        <ul className="px-2 space-y-0.5">
          {menuItems.map((item) => {
            const Icon = item.icon;
            const isActive = activePage === item.id;
            return (
              <li key={item.id}>
                <button
                  className={`w-full flex items-center gap-2 px-2 py-2 rounded transition-colors text-sm ${
                    isActive
                      ? "bg-blue-600 dark:bg-blue-700 text-white"
                      : "text-gray-300 dark:text-gray-400 hover:bg-slate-800 dark:hover:bg-slate-900 hover:text-white"
                  }`}
                  onClick={() => onNavigate?.(item.id)}
                  title={isCollapsed ? item.label : undefined}
                >
                  <Icon className="w-4 h-4 flex-shrink-0" />
                  {!isCollapsed && <span>{item.label}</span>}
                </button>
              </li>
            );
          })}
        </ul>
      </nav>
    </aside>
  );
};
