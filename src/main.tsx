import React, { useState, useEffect } from "react";
import ReactDOM from "react-dom/client";
import App from "./App.tsx";
import "./index.css";
import { QueryClientProvider } from "@tanstack/react-query";
import queryClient from "./config/queryClient.ts";
import { BrowserRouter } from "react-router-dom";
import { ThemeProvider } from "./components/theme-provider.tsx";
import { Provider } from "react-redux";
import store from "./store/store.ts";
import { Toaster } from "./components/ui/sonner.tsx";

const MainApp = () => {
  const [isOnline, setIsOnline] = useState<boolean>(navigator.onLine);

  useEffect(() => {
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);

    window.addEventListener("online", handleOnline);
    window.addEventListener("offline", handleOffline);

    return () => {
      window.removeEventListener("online", handleOnline);
      window.removeEventListener("offline", handleOffline);
    };
  }, []);

  return (
    <React.StrictMode>
      <QueryClientProvider client={queryClient}>
        <Provider store={store}>
          <BrowserRouter>
            <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
              <App />
              <Toaster position="top-right" theme="dark" />
              {!isOnline && (
                <div className="offline-message">
                  You are currently offline. Some features may be limited.
                </div>
              )}
            </ThemeProvider>
          </BrowserRouter>
        </Provider>
      </QueryClientProvider>
    </React.StrictMode>
  );
};

// Render the application using ReactDOM.createRoot (React 18+ feature)
ReactDOM.createRoot(document.getElementById("root")!).render(<MainApp />);

// Add service worker registration
if ("serviceWorker" in navigator) {
  window.addEventListener("load", () => {
    navigator.serviceWorker
      .register("/registerSW.js")
      .then((registration) => {
        console.log("Service Worker registered: ", registration);
      })
      .catch((error) => {
        console.error("Service Worker registration failed: ", error);
      });
  });
}
