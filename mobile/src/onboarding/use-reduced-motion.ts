import { useEffect, useState } from 'react'
import { AccessibilityInfo } from 'react-native'
import { isEinkTheme } from '../theme/mobile-theme'

/** `null` until the OS preference has been read. */
export function useReducedMotionEnabled(): boolean | null {
  const [enabled, setEnabled] = useState<boolean | null>(null)

  useEffect(() => {
    let mounted = true
    void AccessibilityInfo.isReduceMotionEnabled()
      .then((nextEnabled) => {
        if (mounted) {
          setEnabled(nextEnabled)
        }
      })
      .catch(() => undefined)
    const subscription = AccessibilityInfo.addEventListener('reduceMotionChanged', setEnabled)
    return () => {
      mounted = false
      subscription.remove()
    }
  }, [])

  return isEinkTheme() ? true : enabled
}
