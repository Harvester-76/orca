import type { NativeChatVisualTheme } from '../../../src/shared/native-chat-visual-shell'
import { colors, getActiveMobileThemeId, radii } from '../theme/mobile-theme'

const themeId = getActiveMobileThemeId()
// Dark ramps run light to deep; light themes need the deep end first for contrast on white.
const CHART_COLORS =
  themeId === 'dark'
    ? ['#8ec5ff', '#2b7fff', '#155dfc', '#1447e6', '#193cb8']
    : themeId === 'light'
      ? ['#155dfc', '#2b7fff', '#1447e6', '#193cb8', '#162456']
      : ['#000000', '#333333', '#555555', '#777777', '#999999']

/**
 * The active theme, as the variables a visual styles against. The theme is fixed at startup, so a
 * visual receives this before its content runs and never needs a live update.
 * Dark chart colors are desktop's dark `--chart-1..5` (the blue 300-800 ramp), as hex.
 */
export const MOBILE_NATIVE_CHAT_VISUAL_THEME: NativeChatVisualTheme = {
  colorScheme: themeId === 'dark' ? 'dark' : 'light',
  tokens: {
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
    '--chart-1': CHART_COLORS[0]!,
    '--chart-2': CHART_COLORS[1]!,
    '--chart-3': CHART_COLORS[2]!,
    '--chart-4': CHART_COLORS[3]!,
    '--chart-5': CHART_COLORS[4]!,
    '--font-sans': '-apple-system, system-ui, Roboto, sans-serif',
    '--font-mono': 'Menlo, monospace'
  }
}
