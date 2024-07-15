// src/services/registerSw.ts

export function registerSw() {
  if ("serviceWorker" in navigator) {
    window.addEventListener("load", () => {
      navigator.serviceWorker
        .register("/sw.js")
        .then((registration) => {
          console.log("Service Worker registered from sw.ts: ", registration);

          // Check for updates
          registration.addEventListener("updatefound", () => {
            const newWorker = registration.installing;
            newWorker?.addEventListener("statechange", () => {
              if (
                newWorker.state === "installed" &&
                navigator.serviceWorker.controller
              ) {
                // New content is available, show a notification to the user
                showUpdateNotification();
              }
            });
          });

          // Set up message listeners for online/offline events
          navigator.serviceWorker.addEventListener("message", (event) => {
            if (event.data && event.data.type === "OFFLINE") {
              console.log("App is offline");
              // Implement offline-specific logic here
            } else if (event.data && event.data.type === "ONLINE") {
              console.log("App is online");
              // Implement online-specific logic here, like syncing data
            }
          });
        })
        .catch((error) => {
          console.error("Service Worker registration failed: ", error);
        });

      // Check for updates every hour
      setInterval(() => {
        navigator.serviceWorker.ready.then((registration) => {
          registration.update();
        });
      }, 3600000); // 1 hour in milliseconds

      // Listen for online/offline events
      window.addEventListener("online", () => {
        console.log("Browser is online");
        navigator.serviceWorker.ready.then((registration) => {
          registration.active?.postMessage({ type: "ONLINE" });
        });
        // You can add additional online handling here
      });

      window.addEventListener("offline", () => {
        console.log("Browser is offline");
        navigator.serviceWorker.ready.then((registration) => {
          registration.active?.postMessage({ type: "OFFLINE" });
        });
        // You can add additional offline handling here
      });
    });
  }
}

function showUpdateNotification() {
  console.log("New content is available; please refresh.");
  // You can implement a custom notification system here
  // For example, using the Notification API (if supported and permitted)
  if ("Notification" in window && Notification.permission === "granted") {
    new Notification("Update Available", {
      body: "New content is available. Please refresh to update.",
    });
  }
}

// Helper function to check if the app is online
export function isOnline(): boolean {
  return navigator.onLine;
}

// Helper function to add custom offline/online handlers
export function addConnectivityListeners(
  onOffline: () => void,
  onOnline: () => void
) {
  window.addEventListener("offline", onOffline);
  window.addEventListener("online", onOnline);

  return () => {
    window.removeEventListener("offline", onOffline);
    window.removeEventListener("online", onOnline);
  };
}
