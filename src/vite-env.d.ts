/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_API_URL: string
  readonly VITE_APP_TITLE?: string
  readonly VITE_TELEGRAM_BOT_TOKEN?: string
  readonly VITE_MODE: string
  readonly VITE_DEV: boolean
  readonly VITE_PROD: boolean
  readonly VITE_SSR: boolean
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}