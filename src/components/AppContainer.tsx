// AppContainer.tsx
import React, { useState } from 'react';
import { Navigate, Outlet } from "react-router-dom";
import useAuth from "../hooks/useAuth";
import Navigation from "./Navigation";
import TopBar from './Topbar';
import { Loader2 } from 'lucide-react';
import ZyncLogo from './ZyncLogo';

const AppContainer: React.FC = () => {
  const { user, isLoading } = useAuth();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const handleToggleSidebar = () => setIsSidebarOpen(!isSidebarOpen);


  if (isLoading) {
    return (
      <div className="flex flex-col w-screen h-screen items-center justify-center text-primary">
          <Loader2 className="mr-2 mb-4 h-8 w-8 animate-spin " />
          Loading... <ZyncLogo/>
      </div>
    );
  }
  


  if (!user) {
    return (
      <Navigate
        to="/login"
        replace
        state={{
          redirectUrl: window.location.pathname,
        }}
      />
    );
  }

  return (
    <div className="min-h-screen flex flex-col ">
      <TopBar onToggleSidebar={handleToggleSidebar} />
      <div className="flex flex-1">
        <Navigation 
          isSidebarOpen={isSidebarOpen}
          onToggleSidebar={handleToggleSidebar}
        />
        <main className="flex-1 pb-12 md:pb-0 overflow-x-hidden">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default AppContainer;