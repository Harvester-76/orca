import { Platform, StyleSheet } from 'react-native'
import { colors, isEinkTheme, spacing } from '../theme/mobile-theme'

export const bottomDrawerStyles = StyleSheet.create({
  overlay: {
    ...StyleSheet.absoluteFillObject,
    zIndex: 1000
  },
  root: {
    flex: 1
  },
  backdrop: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0,0,0,0.5)'
  },
  backdropPressable: {
    ...StyleSheet.absoluteFillObject
  },
  anchor: {
    flex: 1,
    justifyContent: 'flex-end'
  },
  anchorWide: {
    alignItems: 'center'
  },
  drawer: {
    backgroundColor: colors.bgBase,
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
    paddingHorizontal: spacing.md,
    // E-ink has no shadow or dimmed edge to separate the sheet, so it gets a solid outline.
    ...(isEinkTheme()
      ? {
          borderTopWidth: 2,
          borderLeftWidth: 2,
          borderRightWidth: 2,
          borderColor: colors.borderSubtle
        }
      : null),
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: -2 },
        shadowOpacity: 0.2,
        shadowRadius: 10
      },
      android: { elevation: 8 }
    })
  },
  drawerFill: {
    // Why: flex children (results + dock) need a column height budget; without
    // this, fill height alone still leaves staticContent height content-sized.
    overflow: 'hidden',
    flexDirection: 'column'
  },
  handle: {
    alignSelf: 'center',
    width: 36,
    height: 4,
    borderRadius: 2,
    backgroundColor: colors.textMuted,
    opacity: 0.4
  },
  handleHitArea: {
    alignItems: 'center',
    paddingTop: spacing.sm,
    paddingBottom: spacing.md
  },
  staticContent: {
    minHeight: 0
  },
  staticContentFill: {
    flex: 1
  },
  bottomExtension: {
    position: 'absolute',
    bottom: -500,
    left: 0,
    right: 0,
    height: 500,
    backgroundColor: colors.bgBase
  }
})
