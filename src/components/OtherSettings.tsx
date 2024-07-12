import { Link } from "react-router-dom";
import {
  User,
  Bell,
  Lock,
  CreditCard,
  Code,
  Palette,
  Shield,
} from "lucide-react";
import { Button } from "./ui/button";

const SettingItems = [
  { label: "Account", path: "/settings/account", icon: User },
  { label: "Notifications", path: "/settings/notificatin", icon: Bell },
  { label: "Security", path: "/security", icon: Lock },
  { label: "Billing", path: "/billing", icon: CreditCard },
  { label: "Integrations", path: "/integrations", icon: Code },
  { label: "Appearance", path: "/appearance", icon: Palette },
  { label: "Sessions", path: "/settings/session", icon: Shield },
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
              <div key={item.path} className="group">
                <Link to={item.path}>
                  <Button
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
