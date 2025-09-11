/// <reference types="vite/client" />

declare global {
  interface Window {
    i18next?: {
      isInitialized: boolean;
      on: (event: string, callback: () => void) => void;
    };
  }
}
