import { useState, useEffect } from "react";
import { toast } from "sonner";

const NetworkStatus = () => {
  const [isOnline, setIsOnline] = useState(navigator.onLine);

  useEffect(() => {
    const handleOnline = () => {
      setIsOnline(true);
      toast.success("You are back online!");
      if (navigator.serviceWorker.controller) {
        navigator.serviceWorker.controller.postMessage({ type: "ONLINE" });
      }
    };

    const handleOffline = () => {
      setIsOnline(false);
      toast.error("You are offline. Some features may be limited.");
      if (navigator.serviceWorker.controller) {
        navigator.serviceWorker.controller.postMessage({ type: "OFFLINE" });
      }
    };

    window.addEventListener("online", handleOnline);
    window.addEventListener("offline", handleOffline);

    return () => {
      window.removeEventListener("online", handleOnline);
      window.removeEventListener("offline", handleOffline);
    };
  }, [navigator.onLine]);

  return (
    <div className={`network-status ${isOnline ? "online" : "offline"}`}></div>
  );
};

export default NetworkStatus;
