import {
  History,
  Home,
  MenuIcon,
  SubscriptIcon,
  TrendingUp,
  LucideIcon,
  CircleAlert,
  LogIn,
  SquareUser,
  Folder,
  Bookmark,
} from "lucide-react";
import { Button } from "./ui/button";
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "./ui/sheet";
import { Link } from "react-router-dom";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import useAuth from "../hooks/useAuth";
import { truncateText } from "../lib/TruncateText";
import { Settings02Icon } from "./ui/Icons";

const SHEET_SIDES = ["left"] as const;

type MenuItem = {
  icon: LucideIcon;
  label: string;
  path: string;
  requiresAuth?: boolean;
};

const menuItems: MenuItem[] = [
  { icon: Home, label: "Home", path: "/" },
  { icon: TrendingUp, label: "Trending", path: "/trending" },
  {
    icon: SubscriptIcon,
    label: "Subscriptions",
    path: "/subscriptions",
    requiresAuth: true,
  },
  { icon: Folder, label: "PlayLists", path: "/playlists", requiresAuth: true },
  { icon: History, label: "History", path: "/history", requiresAuth: true },
  //  TODO: add user's private videos
  // {
  //   icon: FileVideo,
  //   label: "Your videos",
  //   path: "/your-videos",
  //   requiresAuth: true,
  // },
  {
    icon: Bookmark,
    label: "BookMark",
    path: "/bookmark",
    requiresAuth: true,
  },
  {
    icon: SquareUser,
    label: "My Channel",
    path: "/my-channel",
    requiresAuth: true,
  },
];

const LeftSidebar = () => {
  const { user, isAuthenticated }: any = useAuth();

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

    const { email, verified, username, avatar } = user;
    const truncatedEmail = truncateText(email, 10);

    return (
      <div className="flex w-full items-center justify-center gap-4 p-5 border border-solid rounded-md light-beam">
        <div>
          <Avatar>
            <AvatarImage src={avatar} />
            <AvatarFallback className="text-2xl font-medium">
              {username?.slice(0, 1).toUpperCase()}
            </AvatarFallback>
          </Avatar>
        </div>
        <div className="flex flex-col">
          <p className="slide-in-text">
            {!verified ? (
              <div className="flex items-center justify-center gap-1">
                <CircleAlert color="yellow" width={15} height={15} />
                <span className="font-normal">{truncatedEmail}</span>
              </div>
            ) : (
              <span className="font-normal">{truncatedEmail}</span>
            )}
          </p>
          <span className="text-sm font-normal text-muted-foreground">
            {username || ""}
          </span>
        </div>
      </div>
    );
  };

  return (
    <div className="grid  gap-2">
      {SHEET_SIDES.map((side) => (
        <Sheet key={side}>
          <SheetTrigger asChild>
            <Button variant="outline" className="relative" size="icon">
              <MenuIcon size={15} />
              <span className="sr-only">Menu</span>
            </Button>
          </SheetTrigger>
          <SheetContent side={side} className="sheet-content">
            <SheetHeader className="pt-12 pb-3">
              <SheetTitle>{renderUserInfo()}</SheetTitle>
            </SheetHeader>
            {menuItems
              .filter((item) => !item.requiresAuth || isAuthenticated)
              .map((item) => (
                <SheetClose asChild key={item.path} className="group">
                  <Link to={item.path}>
                    <Button
                      className="w-full justify-start gap-2 p-2 blurable"
                      variant={"ghost"}
                    >
                      <item.icon className="" size={20} />
                      <span className="font-normal">{item.label}</span>
                    </Button>
                  </Link>
                </SheetClose>
              ))}
            <SheetFooter>
              {isAuthenticated && (
                <SheetClose asChild className="w-full mt-10 ">
                  <Link to={"/settings"}>
                    <Button className="w-full font-medium flex gap-2 text-gray-950 ">
                      <Settings02Icon className="text-gray-950" />
                      <span>Settings</span>
                    </Button>
                  </Link>
                </SheetClose>
              )}
            </SheetFooter>
          </SheetContent>
        </Sheet>
      ))}
    </div>
  );
};

export default LeftSidebar;
