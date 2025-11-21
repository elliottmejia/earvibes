declare namespace NodeJS {
  interface ProcessEnv {
    API_KEY?: string;
    [key: string]: string | undefined;
  }
}

// Extend Window interface for legacy audio context support
interface Window {
  webkitAudioContext: typeof AudioContext;
}