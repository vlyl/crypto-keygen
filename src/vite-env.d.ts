/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_APP_TITLE: string
  // more env variables...
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}

// Global types for polyfills
declare global {
  var Buffer: typeof import('buffer').Buffer
  var process: typeof import('process')
}