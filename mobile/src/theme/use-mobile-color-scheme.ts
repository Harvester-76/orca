import { useSyncExternalStore } from 'react'
import { getMobileUiRevision, subscribeMobileUiLanguage } from '../i18n/mobile-i18n'
import {
  getMobileColorScheme,
  getMobileThemeKey,
  subscribeMobileColorScheme,
  type MobileColorScheme
} from './mobile-theme'

// Call in every component that reads `colors` or themed styles while rendering, so a scheme change repaints it.
// A language switch repaints the same components, so labels built by helpers during render follow it too.
export function useMobileColorScheme(): MobileColorScheme {
  useSyncExternalStore(subscribeMobileUiLanguage, getMobileUiRevision)
  // E-ink keeps the light scheme, so the snapshot is the theme key to repaint on a switch to it.
  useSyncExternalStore(subscribeMobileColorScheme, getMobileThemeKey)
  return getMobileColorScheme()
}
