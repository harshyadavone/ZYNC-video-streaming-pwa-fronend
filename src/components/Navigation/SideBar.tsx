// Sidebar.tsx
import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { X, CircleAlert, LogIn } from "lucide-react";
import { truncateText } from "../../lib/TruncateText";
import { Button } from "../ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { menuItems } from "../Navigation";
import { Logout02Icon, Settings02Icon } from "../ui/Icons";
import useAuth from "../../hooks/useAuth";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "../ui/tooltip";
import useLogout from "../../hooks/useLogout";
import { toast } from "sonner";

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
  // isDarkMode: boolean;
  // toggleDarkMode: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({
  isOpen,
  onClose,
  // isDarkMode,
  // toggleDarkMode,
}) => {
  const { user, isAuthenticated } = useAuth();
  const location = useLocation();
  const { logout } = useLogout();
  const navigate = useNavigate();

  const handleLogout = async () => {
    toast.loading("Logging out...");
    try {
      await logout();
      toast.dismiss();
      toast.success("Logged out successfully!");
      navigate("/login");
    } catch (error) {
      toast.dismiss();
      toast.error("Failed to log out. Please try again.");
    }
  };

  const renderUserInfo = () => {
    if (!isAuthenticated) {
      return (
        <Link to="/login">
          <Button className="w-full font-medium flex gap-2">
            <LogIn size={20} />
            <span>Sign In</span>
          </Button>
        </Link>
      );
    }

    const truncatedEmail = truncateText((user && user.email) || "", 10);



    return (
      <div className="flex w-full items-center justify-center gap-4 p-5 border border-solid rounded-md light-beam ">
        <Avatar>
          <AvatarImage src={user?.avatar} />
          <AvatarFallback className="text-2xl font-medium">
            {(user && user.username?.slice(0, 1).toUpperCase()) || ""}
          </AvatarFallback>
        </Avatar>
        <div className="flex flex-col">
          <p className="slide-in-text">
            {!user?.verified ? (
              <div className="flex items-center justify-center gap-1">
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <CircleAlert color="yellow" width={15} height={15} />
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>Check your email for verification</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
                <span className="font-normal">{truncatedEmail}</span>
              </div>
            ) : (
              <span className="font-normal">{truncatedEmail}</span>
            )}
          </p>
          <span className="text-sm font-normal text-muted-foreground dark:text-gray-400">
            {user?.username || ""}
          </span>
        </div>
      </div>
    );
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 bg-black bg-opacity-50 z-40"
            onClick={onClose}
          />
          <motion.div
            initial={{ x: "-100%" }}
            animate={{ x: 0 }}
            exit={{ x: "-100%" }}
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
            className="fixed top-0 left-0 h-full w-64 bg-background dark:bg-background z-50 overflow-y-auto pb-20 md:pb-0 "
          >
            <div className="p-4 min-h-full flex flex-col">
              <Button
                variant="ghost"
                className="absolute top-4 right-4"
                size="icon"
                onClick={onClose}
              >
                <X size={20} />
              </Button>

              <div className="pt-12 pb-3">{renderUserInfo()}</div>

              <div className="flex-grow">
                {menuItems
                  .filter((item) => !item.requiresAuth || isAuthenticated)
                  .map((item) => (
                    <Link to={item.path} key={item.path} onClick={onClose}>
                      <Button
                        className={`w-full justify-start gap-2 p-2 my-1 ${
                          location.pathname === item.path
                            ? "bg-primary/10 text-primary"
                            : "hover:bg-primary/5 hover:text-primary"
                        }`}
                        variant="ghost"
                      >
                        <item.icon
                          color={`primary`}
                          className={`h-4 w-4 hover:text-primary ${
                            location.pathname === item.path && "text-primary"
                          }`}
                        />
                        <span className="font-normal">{item.label}</span>
                      </Button>
                    </Link>
                  ))}
              </div>

              <div className="mt-4">
                {/* <Button
                  className="w-full justify-start gap-2 p-2 my-1"
                  variant="ghost"
                  onClick={toggleDarkMode}
                >
                  {isDarkMode ? <Sun size={20} /> : <Moon size={20} />}
                  <span className="font-normal">
                    {isDarkMode ? "Light Mode" : "Dark Mode"}
                  </span>
                </Button> */}

                {isAuthenticated && (
                  <>
                    <Button
                      onClick={handleLogout}
                      className="w-full font-medium flex gap-2 mt-2 bg-accent/10 hover:text-primary group"
                      variant="secondary"
                    >
                      <Logout02Icon className="group-hover:text-primary" />
                      <span>Log out</span>
                    </Button>
                    <Link to="/settings" onClick={onClose}>
                      <Button
                        className="w-full font-medium flex gap-2 mt-2"
                        variant="outline"
                      >
                        <Settings02Icon />
                        <span>Settings</span>
                      </Button>
                    </Link>
                  </>
                )}
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export default Sidebar;
