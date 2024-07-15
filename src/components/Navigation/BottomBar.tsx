// BottomBar.tsx
import React from "react";
import { Link, useLocation } from "react-router-dom";
import {
  Home01Icon,
  TrendingIcon,
  LibraryIcon,
  Folder02Icon,
  Clock02Icon,
  Menu11Icon,
  MultiplicationSignIcon,
} from "../ui/Icons";

const menuItems = [
  { icon: Home01Icon, path: "/" },
  { icon: TrendingIcon, path: "/trending" },
  { icon: LibraryIcon, path: "/subscriptions" },
  { icon: Folder02Icon, path: "/playlists" },
  { icon: Clock02Icon, path: "/history" },
];

interface BottomBarProps {
  onToggleSidebar: () => void;
  isSidebarOpen: boolean;
}

const BottomBar: React.FC<BottomBarProps> = ({
  onToggleSidebar,
  isSidebarOpen,
}) => {
  const location = useLocation();

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-background dark:bg-background border-t border-solid z-50 md:hidden">
      <div className="flex justify-around items-center h-12">
        {menuItems.map((item) => (
          <Link to={item.path} key={item.path}>
            <button
              className={`p-1.5 rounded-lg hover:bg-primary/5 hover:text-primary group ${
                location.pathname === item.path
                  ? "text-primary bg-primary/10 "
                  : "text-muted-foreground"
              }`}
            >
              <item.icon
                className={`h-[18px] w-[18px] group-hover:text-primary ${
                  location.pathname === item.path
                    ? "text-primary "
                    : "text-muted-foreground"
                }`}
              />
            </button>
          </Link>
        ))}
        <button
          onClick={onToggleSidebar}
          className={`p-1.5 rounded-lg hover:bg-primary/5 hover:text-primary text-muted-foreground`}
        >
          {isSidebarOpen ? (
            <MultiplicationSignIcon className="h-[18px] w-[18px]" />
          ) : (
            <Menu11Icon className="h-[18px] w-[18px]" />
          )}
        </button>
      </div>
    </div>
  );
};

export default BottomBar;
