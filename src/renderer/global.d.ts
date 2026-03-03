import type { SecretDeskApi } from '../preload/preload';

declare global {
  interface Window {
    secretDesk: SecretDeskApi;
  }
}
