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
  // eslint-disable-next-line no-var
  var Buffer: {
    from: (input: string | number[] | Uint8Array, encoding?: string) => Uint8Array
    alloc: (size: number, fill?: number, encoding?: string) => Uint8Array
    isBuffer: (obj: unknown) => boolean
  }
  // eslint-disable-next-line no-var  
  var process: {
    browser: boolean
    env: Record<string, string | undefined>
    version: string
    versions: Record<string, string>
    nextTick: (callback: () => void) => void
  }
}