// Orca mobile design tokens. Palettes live in mobile-theme-palettes.ts.
// All screen files should import from here instead of using inline hex values.
import {
  DEFAULT_MOBILE_THEME_ID,
  MOBILE_THEME_PALETTES,
  type MobileThemeId,
  type MobileThemePalette
} from './mobile-theme-palettes'

// Why mutable: ~160 modules build StyleSheets from `colors` at import time, so the stored theme
// is applied once at startup, before the app modules load (see index.js), and a change needs a restart.
export const colors: MobileThemePalette = { ...MOBILE_THEME_PALETTES[DEFAULT_MOBILE_THEME_ID] }

let activeThemeId: MobileThemeId = DEFAULT_MOBILE_THEME_ID

export function applyMobileTheme(id: MobileThemeId): void {
  activeThemeId = id
  Object.assign(colors, MOBILE_THEME_PALETTES[id])
}

export function getActiveMobileThemeId(): MobileThemeId {
  return activeThemeId
}

// Why: every animation frame is a full-panel refresh on e-ink; a looping one freezes the display.
export function isEinkTheme(): boolean {
  return activeThemeId === 'eink'
}

export const spacing = {
  xs: 4,
  sm: 8,
  md: 12,
  lg: 16,
  xl: 24
} as const

export const radii = {
  row: 6,
  card: 14,
  button: 6,
  input: 6,
  camera: 8
} as const

export const typography = {
  titleSize: 18,
  bodySize: 14,
  metaSize: 12,
  monoFamily: 'monospace' as const
} as const
