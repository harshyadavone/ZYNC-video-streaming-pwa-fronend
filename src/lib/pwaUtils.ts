import { registerSW } from 'virtual:pwa-register';

let updateSW: (() => Promise<void>) | undefined;

export function initializePWA() {
  updateSW = registerSW({
    onNeedRefresh() {
      if (confirm('New content available. Reload?')) {
        updateSW?.();
      }
    },
    onOfflineReady() {
      console.log('App ready for offline use.');
    },
  });
}

export function checkForUpdates() {
  updateSW?.();
}

export function isOnline(): boolean {
  return navigator.onLine;
}

export function addConnectivityListeners(
  onOffline: () => void,
  onOnline: () => void
) {
  window.addEventListener('offline', onOffline);
  window.addEventListener('online', onOnline);

  return () => {
    window.removeEventListener('offline', onOffline);
    window.removeEventListener('online', onOnline);
  };
}