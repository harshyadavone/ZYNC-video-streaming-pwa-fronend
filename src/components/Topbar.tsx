import React, { useCallback, useState } from "react";
import { Link } from "react-router-dom";
import { Bell, Search as SearchIcon, Clapperboard } from "lucide-react";
import SearchBar from "./SearchBar";
import MobileSearchPage from "./MobileSearchPage";
import { Menu02Icon, UserIcon } from "./ui/Icons";
import useAuth from "../hooks/useAuth";
import ZyncLogo from "./ZyncLogo";
// import LeftSidebar from "./LeftSidebar";

const IconButton: React.FC<React.ButtonHTMLAttributes<HTMLButtonElement>> = ({
  children,
  className,
  ...props
}) => (
  <button
    className={`p-1.5 mx-0.5 md:p-2 text-muted-foreground hover:bg-accent rounded-full transition-colors duration-200 ${className}`}
    {...props}
  >
    {children}
  </button>
);

interface TopBarProps {
  onToggleSidebar: () => void;
}

const TopBar: React.FC<TopBarProps> = ({ onToggleSidebar }) => {
  const [isMobileSearchOpen, setIsMobileSearchOpen] = useState<boolean>(false);
  const { user } = useAuth();

  const handleMobileSearchOpen = useCallback(() => {
    setIsMobileSearchOpen(true);
  }, []);

  const handleMobileSearchClose = useCallback(() => {
    setIsMobileSearchOpen(false);
  }, []);

  return (
    <>
      <header className="sticky top-0 z-10 w-full bg-background border-b border-border">
        <nav className="flex items-center justify-between h-14 px-4">
          <div className="flex itmes-center gap-4">
            <button
              onClick={onToggleSidebar}
              className="text-muted-foreground hover:bg-accent rounded-lg transition-colors duration-200 py-1.5 px-2"
            >
              <Menu02Icon className="h-5 w-5" />
              <span className="sr-only">Toggle Menu</span>
            </button>
            <Link to="/" className="flex items-center">
              <ZyncLogo />
            </Link>
          </div>

          <div className="hidden md:block flex-grow max-w-2xl mx-4">
            <SearchBar onMobileSearchClick={handleMobileSearchOpen} />
          </div>

          <div className="flex items-center">
            <IconButton className="md:hidden" onClick={handleMobileSearchOpen}>
              <SearchIcon size={20} />
            </IconButton>
            <IconButton className="hidden md:inline-flex">
              <Link to={"/my-channel"}>
                <Clapperboard size={20} />
              </Link>
            </IconButton>
            <IconButton className="hidden md:inline-flex">
              <Bell size={20} />
            </IconButton>
            <IconButton>
              {user && user.avatar ? (
                <Link to={"/settings"}>
                  <img src={user?.avatar} className="size-5" />
                </Link>
              ) : (
                <Link to={"/settings"}>
                  <UserIcon className="size-5" />
                </Link>
              )}
            </IconButton>
          </div>
        </nav>
      </header>

      {isMobileSearchOpen && (
        <MobileSearchPage onClose={handleMobileSearchClose} />
      )}
    </>
  );
};

export default TopBar;
