import { createRoot } from 'react-dom/client';
import App from './App.tsx';
import './index.css';

// Safely handle benign sandbox environment rejections (such as WebSocket closures or aborted media in iframes)
if (typeof window !== 'undefined') {
  window.addEventListener('unhandledrejection', (event) => {
    const reason = event.reason?.message || String(event.reason || '');
    if (
      reason.includes('WebSocket') ||
      reason.includes('play()') ||
      reason.includes('AbortError') ||
      reason.includes('ResizeObserver') ||
      reason.includes('closed without opening')
    ) {
      event.preventDefault();
      console.warn('Suppressed benign environment rejection:', reason);
    }
  });

  // Automatically remove any legacy installed PWA service workers & cached offline assets
  if ('serviceWorker' in navigator) {
    navigator.serviceWorker
      .getRegistrations()
      .then((registrations) => Promise.all(registrations.map((reg) => reg.unregister())))
      .catch(() => {});
  }
  if ('caches' in window) {
    window.caches
      .keys()
      .then((keys) => Promise.all(keys.map((key) => window.caches.delete(key))))
      .catch(() => {});
  }
  try {
    localStorage.removeItem('agrovision_offline_diagnostic_catalog_v1');
    localStorage.removeItem('agrovision_scan_history_v1');
    const currentUrl = new URL(window.location.href);
    if (
      currentUrl.pathname === '/app' ||
      currentUrl.searchParams.has('mode') ||
      currentUrl.searchParams.has('tab')
    ) {
      currentUrl.pathname = '/';
      currentUrl.searchParams.delete('mode');
      currentUrl.searchParams.delete('tab');
      currentUrl.searchParams.delete('action');
      window.history.replaceState({}, '', currentUrl.pathname + currentUrl.search);
    }
  } catch {
    // Ignore storage/history errors
  }
}

createRoot(document.getElementById('root')!).render(<App />);
