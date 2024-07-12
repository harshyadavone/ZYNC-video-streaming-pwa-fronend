import React, { useState } from "react";
import { Link } from "react-router-dom";
import {
  ArrowLeft,
  Smartphone,
  Laptop,
  Chrome,
  Globe,
  XCircle,
  Compass,
} from "lucide-react";
import { Button } from "../components/ui/button";
import useSessions, { SESSIONS } from "../hooks/useSessions";
// import DeleteSessionButton from "./DeleteSessionButton";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "../components/ui/dialog";
import useDeleteSession from "../hooks/useDeleteSession";
import { toast } from "sonner";
import queryClient from "../config/queryClient";

interface Session {
  id: string;
  userAgent: string;
  createdAt: string;
  isCurrent: boolean;
}

const Sessions: React.FC = () => {
  const { sessions, isPending, isSuccess, isError } = useSessions();

  const extractDeviceInfo = (userAgent: string) => {
    const isMobile =
      /Mobile|Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
        userAgent
      );
    const isWindows = /Windows/i.test(userAgent);
    const isMac = /Mac/i.test(userAgent);
    const isChrome = /Chrome/i.test(userAgent);
    const isFirefox = /Firefox/i.test(userAgent);
    const isSafari = /Safari/i.test(userAgent) && !/Chrome/i.test(userAgent);

    let deviceType = isMobile ? "mobile" : "desktop";
    let deviceName = isMobile
      ? "Mobile Device"
      : isWindows
      ? "Windows PC"
      : isMac
      ? "Mac"
      : "Desktop";
    let browserIcon = isChrome
      ? Chrome
      : isFirefox
      ? Compass
      : isSafari
      ? Compass
      : Globe;

    return { deviceType, deviceName, browserIcon };
  };

  return (
    <div className="w-full max-w-xl mx-auto">
      <div className="md:p-6 rounded-lg">
        <div className="flex items-center mb-6">
          <Link to="/settings">
            <Button variant="ghost" className="p-2 rounded-full">
              <ArrowLeft className="text-foreground" />
            </Button>
          </Link>
          <h2 className="text-2xl font-semibold ml-4">Active Sessions</h2>
        </div>
        <div className="space-y-6">
          {isPending && <div>Loading sessions...</div>}
          {isError && (
            <div className="text-red-400">Error loading sessions</div>
          )}
          {isSuccess &&
            Array.isArray(sessions) &&
            sessions.map((session: Session) => {
              const {
                deviceType,
                deviceName,
                browserIcon: BrowserIcon,
              } = extractDeviceInfo(session.userAgent);
              return (
                <div
                  key={session.id}
                  className="flex items-center justify-between p-4 bg-background rounded-lg"
                >
                  <div className="flex items-center space-x-4">
                    {deviceType === "mobile" ? (
                      <Smartphone className="text-primary" />
                    ) : (
                      <Laptop className="text-primary" />
                    )}
                    <div>
                      <p className="font-medium text-foreground">
                        {deviceName}
                      </p>
                      <p className="text-sm text-muted-foreground flex items-center">
                        <BrowserIcon className="w-4 h-4 mr-1" /> Browser
                      </p>
                      <p className="text-xs text-muted-foreground">
                        Last active:{" "}
                        {new Date(session.createdAt).toLocaleString()}
                      </p>
                    </div>
                  </div>
                  {!session.isCurrent && (
                    <DeleteSessionButton
                      sessionId={session.id}
                      onDelete={() => {
                        toast.success("Session Deleted")
                        queryClient.invalidateQueries({queryKey:[SESSIONS]})
                      }}
                    />
                  )}
                </div>
              );
            })}
          <div>

          </div>
        </div>
      </div>
    </div>
  );
};

const DeleteSessionButton: React.FC<{
  sessionId: string;
  onDelete: () => void;
}> = ({ sessionId, onDelete }) => {
  const [isOpen, setIsOpen] = useState(false);
  const { deleteSession, isPending } = useDeleteSession(sessionId);

  const handleConfirm = () => {
    deleteSession();
    setIsOpen(false);
    onDelete();
  };

  return (
    <>
      <Button
        variant="ghost"
        className="text-destructive hover:text-destructive hover:bg-destructive/10"
        onClick={() => setIsOpen(true)}
        disabled={isPending}
      >
        <XCircle className="w-5 h-5" />
      </Button>

      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent className=" ">
          <div className=" shadow-lg rounded-lg  ">
            <DialogHeader>
              <DialogTitle className="text-xl font-medium">
                End Session
              </DialogTitle>
              <DialogDescription className="mt-5 text-muted-foreground">
                Are you sure you want to end this session?
              </DialogDescription>
            </DialogHeader>
            <DialogFooter className="mt-5">
              <Button
                variant="outline"
                className=""
                onClick={() => setIsOpen(false)}
              >
                Cancel
              </Button>
              <Button
                variant="destructive"
                onClick={handleConfirm}
                disabled={isPending}
              >
                {isPending ? "Ending..." : "End Session"}
              </Button>
            </DialogFooter>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default Sessions;
