import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import ReactDOM from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom';
import App from './App.jsx'
// Expose backfill utility in dev for console use
if (import.meta && import.meta.env && import.meta.env.DEV) {
  import('./utils/backfillProducts.js').then(mod => {
    // attach helper for manual execution from browser console
    window.runBackfill = async () => {
      try {
        await mod.backfillProductsForCurrentStore();
        console.log('Backfill complete');
      } catch (e) {
        console.error('Backfill failed:', e);
      }
    };
    console.log('Backfill helper available: run window.runBackfill()');
  }).catch(() => {});
}
createRoot(document.getElementById('root')).render(
    <BrowserRouter>
    <App/>
  </BrowserRouter>,
);
