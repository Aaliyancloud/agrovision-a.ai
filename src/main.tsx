import { createRoot } from 'react-dom/client';
import { registerSW } from 'virtual:pwa-register';
import App from './App.tsx';
import './index.css';
import { TOMATO_DISEASES, STEAM_EXHIBITION_SAMPLES } from './data/tomatoDiseases';

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

  // Purge legacy v1 image cache so updated assets always appear on returning laptops
  if ('caches' in window) {
    window.caches.delete('agrovision-specimen-images').catch(() => {});
  }

  // Register Service Worker for offline field usage in areas with poor or zero connectivity
  try {
    const updateSW = registerSW({
      immediate: true,
      onNeedRefresh() {
        void updateSW(true);
      },
      onOfflineReady() {
        console.info('AgroVision AI offline field cache ready.');
      },
      onRegisterError(error) {
        console.warn('Service worker registration skipped:', error);
      }
    });
  } catch {
    // Ignore registration issues in restricted preview frames
  }

  // Persist essential diagnostic pathology catalog locally for zero-connectivity fallback
  try {
    localStorage.setItem(
      'agrovision_offline_diagnostic_catalog_v1',
      JSON.stringify({
        cachedAt: new Date().toISOString(),
        diseaseCount: TOMATO_DISEASES.length,
        sampleCount: STEAM_EXHIBITION_SAMPLES.length,
        diseases: TOMATO_DISEASES
      })
    );
  } catch {
    // Ignore storage quota restrictions
  }
}

createRoot(document.getElementById('root')!).render(<App />);
