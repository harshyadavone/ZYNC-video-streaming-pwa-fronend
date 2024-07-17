import BottomBar from "./Navigation/BottomBar";
import Sidebar from "./Navigation/SideBar";
import {
  Home01Icon,
  UserSquareIcon,
  TrendingIcon,
  LibraryIcon,
  Folder02Icon,
  Clock02Icon,
  Bookmark02Icon,
  SparklesIcon,
} from "./ui/Icons";

export const menuItems = [
  { icon: Home01Icon, label: "Home", path: "/" },
  { icon: TrendingIcon, label: "Trending", path: "/trending" },
  {
    icon: LibraryIcon,
    label: "Subscriptions",
    path: "/subscriptions",
    requiresAuth: true,
  },
  {
    icon: Folder02Icon,
    label: "PlayLists",
    path: "/playlists",
    requiresAuth: true,
  },
  { icon: Clock02Icon, label: "History", path: "/history", requiresAuth: true },
  {
    icon: Bookmark02Icon,
    label: "BookMark",
    path: "/bookmark",
    requiresAuth: true,
  },
  {
    icon: UserSquareIcon,
    label: "My Channel",
    path: "/my-channel",
    requiresAuth: true,
  },
  {
    icon: SparklesIcon,
    label: "What's new",
    path: "/whats-new",
    requiresAuth: false,
  },
];

interface NavigationProps {
  isSidebarOpen: boolean;
  onToggleSidebar: () => void;
}

const Navigation: React.FC<NavigationProps> = ({
  isSidebarOpen,
  onToggleSidebar,
}) => {
  // const [isDarkMode, setIsDarkMode] = useState(false);

  // useEffect(() => {
  //   const savedDarkMode = localStorage.getItem('darkMode');
  //   if (savedDarkMode) {
  //     setIsDarkMode(JSON.parse(savedDarkMode));
  //   }
  // }, []);

  // useEffect(() => {
  //   if (isDarkMode) {
  //     document.documentElement.classList.add('dark');
  //   } else {
  //     document.documentElement.classList.remove('dark');
  //   }
  //   localStorage.setItem('darkMode', JSON.stringify(isDarkMode));
  // }, [isDarkMode]);

  // const toggleDarkMode = () => setIsDarkMode(!isDarkMode);

  return (
    <>
      <Sidebar
        isOpen={isSidebarOpen}
        onClose={onToggleSidebar}
        // isDarkMode={isDarkMode}
        // toggleDarkMode={toggleDarkMode}
      />
      <BottomBar
        onToggleSidebar={onToggleSidebar}
        isSidebarOpen={isSidebarOpen}
      />
    </>
  );
};

export default Navigation;
