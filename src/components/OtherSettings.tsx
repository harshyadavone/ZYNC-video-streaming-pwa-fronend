import { Link } from "react-router-dom";
import { User, Bell, Lock, Palette, Shield } from "lucide-react";
import { Button } from "./ui/button";

const SettingItems = [
  {
    label: "Account",
    path: "/settings/account",
    icon: User,
    badge: "coming soon",
  },
  {
    label: "Notifications",
    path: "/settings/notifications",
    icon: Bell,
    badge: "coming soon",
  },
  { label: "Security", path: "/security", icon: Lock, badge: "coming soon" },
  {
    label: "Appearance",
    path: "/appearance",
    icon: Palette,
    badge: "coming soon",
  },
  { label: "Sessions", path: "/settings/sessions", icon: Shield, badge: "" },
];

const OtherSettings = () => {
  return (
    <div className="flex justify-center">
      <div className="w-full max-w-md">
        <div className="sheet-content bg-card p-2 md:p-6">
          <h2 className="text-2xl font-normal mb-6 text-foreground">
            Settings
          </h2>
          <div className="space-y-4">
            {SettingItems.map((item) => (
              <div key={item.path} className="group relative">
                <Link to={item.path}>
                  <Button
                  disabled={item.badge==="coming soon"}
                    className="w-full justify-start gap-2 p-3 hover:bg-muted transition duration-200"
                    variant={"ghost"}
                  >
                    <item.icon
                      className="text-muted-foreground group-hover:text-primary transition duration-200"
                      size={20}
                    />
                    <span className="font-medium text-foreground group-hover:text-primary transition duration-200">
                      {item.label}
                    </span>
                    {item.badge && (
                      <span className="absolute right-3 top-1/2 transform -translate-y-1/2 bg-primary/10 text-primary font-normal text-xs px-2 py-1 rounded-full">
                        {item.badge}
                      </span>
                    )}
                  </Button>
                </Link>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default OtherSettings;