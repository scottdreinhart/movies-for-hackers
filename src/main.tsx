import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import App from './App';
import { AppProvider } from './components/providers';
import { createBrowserServiceWorkerAdapter } from './app/adapters/browserServiceWorkerAdapter';
import './styles/global.css';

/**
 * Application entry point.
 *
 * Wraps the React tree in <AppProvider> which exposes the
 * composition root (ports, adapters, repositories, event bus,
 * command dispatcher, feature flags) to all child components.
 *
 * @pattern Composition Root
 */
createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <AppProvider>
      <App />
    </AppProvider>
  </StrictMode>,
);

// Service worker registration — imperative shell, runs outside React
createBrowserServiceWorkerAdapter().register('/sw.js');
