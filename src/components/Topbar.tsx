import React, { useCallback, useState } from "react";
import { Link } from "react-router-dom";
import { Youtube, Bell, User, Search as SearchIcon, Clapperboard } from "lucide-react";
import SearchBar from "./SearchBar";
import MobileSearchPage from "./MobileSearchPage";
import LeftSidebar from "./LeftSidebar";

const IconButton: React.FC<React.ButtonHTMLAttributes<HTMLButtonElement>> = ({
  children,
  className,
  ...props
}) => (
  <button
    className={`p-2 text-muted-foreground hover:bg-accent rounded-full transition-colors duration-200 ${className}`}
    {...props}
  >
    {children}
  </button>
);

const TopBar: React.FC = () => {

  const [isMobileSearchOpen, setIsMobileSearchOpen] = useState<boolean>(false);

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
            <LeftSidebar />
            <Link to="/" className="flex items-center">
              <Youtube className="text-primary" size={28} />
              <h1 className="ml-2 text-xl font-bold text-foreground">MyTube</h1>
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
            <Link to={"/my-channel"}><Clapperboard size={20} /></Link>
            </IconButton>
            <IconButton className="hidden md:inline-flex">
              <Bell size={20} />
            </IconButton>
            <IconButton>
              <User size={24} />
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
