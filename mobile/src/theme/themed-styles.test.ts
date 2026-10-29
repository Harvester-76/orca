import { afterEach, expect, it, vi } from 'vitest'
import { applyMobileColorScheme, colors, einkPalette, paletteForScheme } from './mobile-theme'
import { themedStyles } from './themed-styles'

vi.mock('react-native', () => ({ StyleSheet: { create: <T>(styles: T): T => styles } }))

afterEach(() => {
  applyMobileColorScheme('dark')
})

it('serves each scheme its own stylesheet, including ones built before the switch', () => {
  const styles = themedStyles(() => ({ row: { backgroundColor: colors.bgBase } }))
  const merged = themedStyles(() => ({ ...styles }))
  expect(merged.row.backgroundColor).toBe(paletteForScheme('dark').bgBase)

  applyMobileColorScheme('light')
  expect(styles.row.backgroundColor).toBe(paletteForScheme('light').bgBase)
  expect(merged.row.backgroundColor).toBe(paletteForScheme('light').bgBase)

  applyMobileColorScheme('dark')
  expect(merged.row.backgroundColor).toBe(paletteForScheme('dark').bgBase)
})

it('rebuilds styles when e-ink switches on over the light scheme', () => {
  applyMobileColorScheme('light')
  const styles = themedStyles(() => ({ row: { backgroundColor: colors.bgRaised } }))
  expect(styles.row.backgroundColor).toBe(paletteForScheme('light').bgRaised)

  applyMobileColorScheme('light', true)
  expect(styles.row.backgroundColor).toBe(einkPalette.bgRaised)

  applyMobileColorScheme('light')
  expect(styles.row.backgroundColor).toBe(paletteForScheme('light').bgRaised)
})
