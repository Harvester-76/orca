import AsyncStorage from '@react-native-async-storage/async-storage'
import {
  DEFAULT_MOBILE_THEME_ID,
  isMobileThemeId,
  type MobileThemeId
} from './mobile-theme-palettes'

const THEME_KEY = 'orca:mobileTheme'

// Why no mirrored-storage import: this runs before app modules load and must not pull in `colors`.
export async function loadMobileThemeId(): Promise<MobileThemeId> {
  try {
    const raw = await AsyncStorage.getItem(THEME_KEY)
    return isMobileThemeId(raw) ? raw : DEFAULT_MOBILE_THEME_ID
  } catch {
    return DEFAULT_MOBILE_THEME_ID
  }
}

export async function saveMobileThemeId(id: MobileThemeId): Promise<void> {
  await AsyncStorage.setItem(THEME_KEY, id)
}
