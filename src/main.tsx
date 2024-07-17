import React, { Suspense } from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import "./index.css";
import { QueryClientProvider } from "@tanstack/react-query";
import queryClient from "./config/queryClient";
import { BrowserRouter } from "react-router-dom";
import { ThemeProvider } from "./components/theme-provider";
import { Provider } from "react-redux";
import store from "./store/store";
import { Toaster } from "./components/ui/sonner";
import ErrorBoundary from "./components/ErrorBoundary";
import { addConnectivityListeners, initializePWA } from "./lib/pwaUtils";

const MainApp: React.FC = () => {
  React.useEffect(() => {
    initializePWA();

    const removeListeners = addConnectivityListeners(
      () => console.log("App is offline"),
      () => console.log("App is online")
    );

    return removeListeners;
  }, []);

  return (
    <React.StrictMode>
      {/* TODO: customize the fallback UI by passing a fallback prop:
<ErrorBoundary fallback={<CustomErrorComponent />}> */}
      <ErrorBoundary
        fallback={<div>Something went wrong. Please refresh the page.</div>}
      >
        {/* TODO: Update fallback loading */}
        <Suspense fallback={<div>Loading...</div>}>
          <QueryClientProvider client={queryClient}>
            <Provider store={store}>
              <BrowserRouter>
                <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
                  <App />
                  <Toaster position="top-right" theme="dark" />
                </ThemeProvider>
              </BrowserRouter>
            </Provider>
          </QueryClientProvider>
        </Suspense>
      </ErrorBoundary>
    </React.StrictMode>
  );
};

ReactDOM.createRoot(document.getElementById("root")!).render(<MainApp />);
