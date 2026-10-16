// Orca mobile palettes. `dark` is the original graphite palette; `light` mirrors the desktop
// light theme; `eink` is a pure black-on-white palette for e-ink panels.

const darkPalette = {
  bgBase: '#111111',
  bgPanel: '#1a1a1a',
  bgRaised: '#242424',
  borderSubtle: '#2a2a2a',
  editorSurface: '#1e1e1e',

  textPrimary: '#e0e0e0',
  textSecondary: '#a1a1a1',
  textMuted: '#8c8c8c',

  // Crisp near-white surface for the single primary action on a screen (the
  // worktree FAB). Brighter than textPrimary so it reads as a solid button, not
  // disabled chrome, while staying monochrome (STYLEGUIDE: color is for state).
  surfaceBright: '#f5f5f5',

  accentBlue: '#3b82f6',
  // Text/icon color on a filled accent (accentBlue) button, where the muted
  // textPrimary would lack contrast against the saturated fill.
  onAccent: '#ffffff',

  statusGreen: '#22c55e',
  statusAmber: '#f59e0b',
  statusRed: '#ef4444',
  // Merge CTA fill + its on-fill text, mirroring the desktop ChecksPanel's
  // bg-green-600 "Squash and merge" button (green-600 / white).
  mergeGreen: '#16a34a',
  onMergeGreen: '#ffffff',
  // Merged-PR purple, mirroring the desktop ReviewIcon's purple-400/70 tone.
  statusPurple: '#a78bfa',
  gitDecorationAdded: '#81b88b',
  gitDecorationDeleted: '#c74e39',
  diffAddedBg: 'rgba(129, 184, 139, 0.1)',
  diffDeletedBg: 'rgba(199, 78, 57, 0.11)',

  syntaxComment: '#6a9955',
  syntaxKeyword: '#569cd6',
  syntaxString: '#ce9178',
  syntaxNumber: '#b5cea8',
  syntaxType: '#4ec9b0',
  syntaxFunction: '#dcdcaa',
  syntaxVariable: '#9cdcfe',
  syntaxMeta: '#c586c0',

  // Terminal WebView background (Tokyonight) — separate from app chrome
  terminalBg: '#1a1b26'
}

export type MobileThemePalette = { [K in keyof typeof darkPalette]: string }

const lightPalette: MobileThemePalette = {
  bgBase: '#ffffff',
  bgPanel: '#fafafa',
  bgRaised: '#f4f4f5',
  borderSubtle: '#e4e4e7',
  editorSurface: '#ffffff',

  textPrimary: '#0a0a0a',
  textSecondary: '#525252',
  textMuted: '#737373',

  surfaceBright: '#171717',

  accentBlue: '#2563eb',
  onAccent: '#ffffff',

  statusGreen: '#16a34a',
  statusAmber: '#d97706',
  statusRed: '#dc2626',
  mergeGreen: '#16a34a',
  onMergeGreen: '#ffffff',
  statusPurple: '#7c3aed',
  gitDecorationAdded: '#2e7d32',
  gitDecorationDeleted: '#c62828',
  diffAddedBg: 'rgba(46, 125, 50, 0.12)',
  diffDeletedBg: 'rgba(198, 40, 40, 0.12)',

  syntaxComment: '#008000',
  syntaxKeyword: '#0000ff',
  syntaxString: '#a31515',
  syntaxNumber: '#098658',
  syntaxType: '#267f99',
  syntaxFunction: '#795e26',
  syntaxVariable: '#001080',
  syntaxMeta: '#af00db',

  terminalBg: '#ffffff'
}

// E-ink: no tints and no alpha. Every pairing is black on white or white on black, and syntax
// roles differ by luminance so they stay distinguishable on a monochrome panel.
const einkPalette: MobileThemePalette = {
  bgBase: '#ffffff',
  bgPanel: '#ffffff',
  bgRaised: '#eeeeee',
  borderSubtle: '#000000',
  editorSurface: '#ffffff',

  textPrimary: '#000000',
  textSecondary: '#222222',
  textMuted: '#444444',

  surfaceBright: '#000000',

  accentBlue: '#000000',
  onAccent: '#ffffff',

  statusGreen: '#000000',
  statusAmber: '#000000',
  statusRed: '#000000',
  mergeGreen: '#000000',
  onMergeGreen: '#ffffff',
  statusPurple: '#000000',
  gitDecorationAdded: '#000000',
  gitDecorationDeleted: '#000000',
  diffAddedBg: '#e0e0e0',
  diffDeletedBg: '#f5f5f5',

  syntaxComment: '#555555',
  syntaxKeyword: '#000000',
  syntaxString: '#333333',
  syntaxNumber: '#222222',
  syntaxType: '#111111',
  syntaxFunction: '#000000',
  syntaxVariable: '#222222',
  syntaxMeta: '#444444',

  terminalBg: '#ffffff'
}

export const MOBILE_THEME_IDS = ['dark', 'light', 'eink'] as const
export type MobileThemeId = (typeof MOBILE_THEME_IDS)[number]

export const DEFAULT_MOBILE_THEME_ID: MobileThemeId = 'dark'

export const MOBILE_THEME_PALETTES: Record<MobileThemeId, MobileThemePalette> = {
  dark: darkPalette,
  light: lightPalette,
  eink: einkPalette
}

export function isMobileThemeId(value: unknown): value is MobileThemeId {
  return MOBILE_THEME_IDS.some((id) => id === value)
}
