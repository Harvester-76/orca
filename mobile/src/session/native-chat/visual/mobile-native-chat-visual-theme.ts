import type { NativeChatVisualTheme } from '../../../../../src/shared/native-chat/native-chat-visual-shell'
import { colors, getMobileColorScheme, isEinkTheme, radii } from '../../../theme/mobile-theme'

// Monochrome panels cannot tell blues apart, so e-ink charts differ by luminance.
const EINK_CHART_COLORS = ['#000000', '#333333', '#555555', '#777777', '#999999']
const CHART_COLORS = ['#8ec5ff', '#2b7fff', '#155dfc', '#1447e6', '#193cb8']

function chartColor(index: number): string {
  return (isEinkTheme() ? EINK_CHART_COLORS : CHART_COLORS)[index]!
}

// Match desktop’s chart tokens; initialize visual styles before author content runs.
// Getters so each document build reads the current scheme.
export const MOBILE_NATIVE_CHAT_VISUAL_THEME: NativeChatVisualTheme = {
  get colorScheme() {
    return getMobileColorScheme()
  },
  get tokens() {
    return {
      '--background': colors.bgBase,
      '--foreground': colors.textPrimary,
      '--card': colors.bgPanel,
      '--card-foreground': colors.textPrimary,
      '--popover': colors.bgRaised,
      '--popover-foreground': colors.textPrimary,
      '--primary': colors.surfaceBright,
      '--primary-foreground': colors.bgBase,
      '--secondary': colors.bgRaised,
      '--secondary-foreground': colors.textPrimary,
      '--muted': colors.bgRaised,
      '--muted-foreground': colors.textMuted,
      '--accent': colors.bgRaised,
      '--accent-foreground': colors.textPrimary,
      '--destructive': colors.statusRed,
      '--destructive-foreground': colors.onAccent,
      '--border': colors.borderSubtle,
      '--input': colors.borderSubtle,
      '--ring': colors.textMuted,
      '--radius': `${radii.row}px`,
      '--chart-1': chartColor(0),
      '--chart-2': chartColor(1),
      '--chart-3': chartColor(2),
      '--chart-4': chartColor(3),
      '--chart-5': chartColor(4),
      '--font-sans': '-apple-system, system-ui, Roboto, sans-serif',
      '--font-mono': 'Menlo, monospace'
    }
  }
}
