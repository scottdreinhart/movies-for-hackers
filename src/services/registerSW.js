/**
 * Register the service worker for PWA offline support.
 * Extracted from main.jsx for testability and clean entry point.
 */
export function registerServiceWorker() {
  if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
      navigator.serviceWorker.register('/sw.js').catch(() => {});
    });
  }
}
