import { colors } from '../theme/mobile-theme'
import type { MobileTerminalTheme } from './terminal-webview-contract'

// Every ANSI colour is dark enough to stay readable on a white monochrome panel; hues differ by
// luminance only. The desktop's own terminal theme is dark, so it is replaced rather than tinted.
const EINK_TERMINAL_COLORS: MobileTerminalTheme['theme'] = {
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

export function resolveEinkTerminalTheme(
  hostTheme: MobileTerminalTheme | undefined,
  einkActive: boolean
): MobileTerminalTheme | undefined {
  if (!einkActive) {
    return hostTheme
  }
  return { ...hostTheme, mode: 'light', theme: { ...EINK_TERMINAL_COLORS, background: colors.terminalBg } }
}
