# Orca Mobile — E-ink theme (fork)

An unofficial fork of [stablyai/orca](https://github.com/stablyai/orca) that adds an **E-ink display theme** to the Orca Mobile Android app. It was built and tested on an Onyx Boox Tab Ultra (1404×1872, Android 11) and should suit any black-and-white or grayscale e-paper tablet.

This fork changes **only the mobile app** (`mobile/`). The desktop app, CLI and runtime are untouched, and nothing here is sent upstream. For the original project README see [`README.upstream.md`](README.upstream.md).

## Why

E-ink panels refresh slowly, show few gray levels and dither anything that is not pure black or white. The stock dark and light themes suffer from this:

- thin 1px borders disappear;
- gray text is dithered into noisy, "torn" glyphs;
- colored status dots and charts lose their meaning in grayscale;
- shadows, gradients and endless spinner animations cause ghosting.

The E-ink theme targets these problems with a black-on-white palette, thick outlines, shape-coded statuses and no continuous animation.

## Branches

Both branches deliver the same E-ink look. They differ in how the host screen (the session list and the chat) is rendered, so pick the one that fits your setup.

| Branch | Base | Host screen | Pick it if |
| --- | --- | --- | --- |
| [`mobile-eink-theme`](https://github.com/Harvester-76/orca/tree/mobile-eink-theme) | recent upstream `main` | Web page served by the desktop Orca, shown in a WebView; E-ink styling is injected into it | You want to follow upstream and keep getting its new features |
| [`mobile-eink-native`](https://github.com/Harvester-76/orca/tree/mobile-eink-native) | older upstream commit, before native screens were removed | Fully native React Native screens | The web page loads slowly or the connection is unstable, and you want a fast native UI |

Upstream removed the native host screens (every build became the OTA web shell), and that removal cannot be reverted cleanly, so the native variant is frozen on an older base. It still pairs with current desktop Orca releases (verified with 1.4.244).

`main` of this fork mirrors upstream `main` and carries no changes.

## Common to both branches

- **E-ink palette**: pure white background, black text at every level (gray text dithers), light-gray `#eeeeee` raised surfaces, black borders.
- **Thick borders**: every border and hairline is at least 2px (`einkBorderWidth`), including sheets and dialogs.
- **Heavier icons and larger text**: `lucide-react-native` icons default to a 2.75 stroke; text is scaled by 1.15 (via Metro resolver wrappers, only while the theme is active).
- **Shape-coded agent status** instead of color: filled dot, square, ring, thick ring, dotted ring, open ring.
- **White terminal**, black-and-white chart tones, black search clear-button chip.
- **No infinite animations** on E-ink (spinners and rotating rings are static).
- **Side-by-side install**: set `ORCA_ANDROID_PACKAGE=com.stably.orca.mobile.light` to build an app that coexists with the original `com.stably.orca.mobile`.

## Building

Requirements: Node.js, pnpm, JDK 17, Android SDK with NDK `27.1.12297006`.

```bash
cd mobile
pnpm install
ORCA_ANDROID_PACKAGE=com.stably.orca.mobile.light npx expo prebuild --platform android --no-install
cd android
ORCA_ANDROID_PACKAGE=com.stably.orca.mobile.light CI=1 NODE_ENV=production \
  ./gradlew assembleRelease -PreactNativeArchitectures=arm64-v8a
adb install -r app/build/outputs/apk/release/app-release.apk
```

The package id override is optional; omit it to build with the default id. Push notifications need your own `mobile/google-services.json` (Firebase) matching the package id.

## This branch: `mobile-eink-theme` (web host screen)

Based on recent upstream `main`, which ships an official light/dark theme and a web-based host screen.

### How the theme is selected

**Settings → Appearance** gets a third option, **E-ink**, next to Light and Dark. Internally the color scheme stays `light`; E-ink is an extra flag (`einkActive`) plus `einkPalette`, and `getMobileThemeKey()` (`light` / `dark` / `eink`) keys the themed-styles cache. The desktop's own theme choice does not affect the tablet: the page always receives `light` while E-ink is on.

### Styling the web host page

The host screen is a react-native-web page that the desktop Orca serves. The `orca-mobile-web-shell` native module gained a `documentScript` prop that runs JavaScript at document start (`WebViewCompat.addDocumentStartJavaScript`). The script (`mobile/src/mobile-web-shell/eink-page-script.ts`) injects CSS and a small `MutationObserver` pass that:

- removes shadows and gradients, forces strokes and fills to `currentColor`, makes images grayscale;
- turns thin lines and borders into black 2px lines, colored fills into black, red dots into squares, gray dots into rings;
- gives sheets a 3px frame, replaces the scrim with `rgba(255,255,255,.92)`, outlines switch tracks;
- enlarges text (about ×1.2 on the left half, ×1.15 on the right) and widens pill buttons.

Glyph anti-aliasing is deliberately kept: an earlier `contrast(100)` approach produced pure 1-bit text that looked jagged on Boox.

### Native parts

The native screens that remain in the app (home list, settings, drawers, agent status, terminal colors) use the same E-ink helpers: `isEinkTheme()`, `einkSafeColor()`, `einkBorderWidth()`.

### Compatibility

Needs a desktop Orca that serves the mobile web bundle (1.4.243+ recommended, since it includes a light page theme).

## Disclaimer

Not affiliated with or endorsed by the Orca authors. Orca is MIT-licensed; this fork keeps the original [LICENSE](LICENSE). Use at your own risk.
