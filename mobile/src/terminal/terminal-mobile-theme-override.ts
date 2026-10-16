import { colors, getActiveMobileThemeId } from '../theme/mobile-theme'
import type { MobileTerminalTheme } from './terminal-webview-contract'
import type { MobileThemeId } from '../theme/mobile-theme-palettes'

type TerminalColors = MobileTerminalTheme['theme']

// Why a mobile-side palette: the desktop publishes its own terminal theme, which is dark.
const LIGHT_TERMINAL_COLORS: TerminalColors = {
  background: '#ffffff',
  foreground: '#1f2328',
  cursor: '#1f2328',
  cursorAccent: '#ffffff',
  selectionBackground: '#b6d6fd',
  selectionForeground: '#1f2328',
  black: '#24292f',
  red: '#cf222e',
  green: '#116329',
  yellow: '#7d4e00',
  blue: '#0550ae',
  magenta: '#8250df',
  cyan: '#1b7c83',
  white: '#6e7781',
  brightBlack: '#57606a',
  brightRed: '#a40e26',
  brightGreen: '#1a7f37',
  brightYellow: '#633c01',
  brightBlue: '#0969da',
  brightMagenta: '#6639ba',
  brightCyan: '#3192aa',
  brightWhite: '#424a53'
}

// Every ANSI colour is dark enough to stay readable on a white monochrome panel; hues
// differ by luminance only.
const EINK_TERMINAL_COLORS: TerminalColors = {
  background: '#ffffff',
  foreground: '#000000',
  cursor: '#000000',
  cursorAccent: '#ffffff',
  selectionBackground: '#bbbbbb',
  selectionForeground: '#000000',
  black: '#000000',
  red: '#222222',
  green: '#333333',
  yellow: '#444444',
  blue: '#111111',
  magenta: '#2a2a2a',
  cyan: '#3a3a3a',
  white: '#555555',
  brightBlack: '#555555',
  brightRed: '#000000',
  brightGreen: '#1a1a1a',
  brightYellow: '#333333',
  brightBlue: '#000000',
  brightMagenta: '#1a1a1a',
  brightCyan: '#2a2a2a',
  brightWhite: '#666666'
}

const OVERRIDES: Partial<Record<MobileThemeId, TerminalColors>> = {
  light: LIGHT_TERMINAL_COLORS,
  eink: EINK_TERMINAL_COLORS
}

export function resolveMobileTerminalTheme(
  hostTheme: MobileTerminalTheme | undefined
): MobileTerminalTheme | undefined {
  const override = OVERRIDES[getActiveMobileThemeId()]
  if (!override) {
    return hostTheme
  }
  return { ...hostTheme, mode: 'light', theme: { ...override, background: colors.terminalBg } }
}
