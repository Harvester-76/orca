import { StyleSheet } from 'react-native'
import { getMobileThemeKey, type MobileThemeKey } from './mobile-theme'

// Module-scope styles that read `colors`: built once per theme, and every key reads the current theme's copy.
export function themedStyles<T extends Record<string, unknown>>(create: () => T): T {
  const built = new Map<MobileThemeKey, T>()
  const current = (): T => {
    const theme = getMobileThemeKey()
    let styles = built.get(theme)
    if (styles === undefined) {
      styles = create()
      built.set(theme, styles)
    }
    return styles
  }
  const live = { ...current() }
  for (const key of Object.keys(live)) {
    Object.defineProperty(live, key, { enumerable: true, get: () => current()[key] })
  }
  return live
}

// Drop-in for a module-scope `StyleSheet.create` that reads `colors`.
export function themedStyleSheet<T extends StyleSheet.NamedStyles<T>>(create: () => T): T {
  return themedStyles(() => StyleSheet.create(create()))
}
