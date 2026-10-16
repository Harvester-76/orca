// The stored theme must be applied before any module builds its styles from `colors`. React Native
// runs the "main" component as soon as the bundle loads, so it is registered synchronously and
// loads the router app only once the theme is applied.
import '@expo/metro-runtime'
import { createElement, useEffect, useState } from 'react'
import { registerRootComponent } from 'expo'
import * as SplashScreen from 'expo-splash-screen'
// Headless notification launches do not mount the router layout.
import './src/notifications/push-background-dismissal'

SplashScreen.preventAutoHideAsync()

function ThemeGate() {
  const [App, setApp] = useState(null)
  useEffect(() => {
    const { applyMobileTheme } = require('./src/theme/mobile-theme')
    const { loadMobileThemeId } = require('./src/theme/mobile-theme-preference')
    loadMobileThemeId()
      .then(applyMobileTheme)
      .finally(() => {
        const { App: RouterApp } = require('expo-router/build/qualified-entry')
        setApp(() => RouterApp)
      })
  }, [])
  return App ? createElement(App) : null
}

registerRootComponent(ThemeGate)
