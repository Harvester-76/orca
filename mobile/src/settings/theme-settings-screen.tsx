import { useState } from 'react'
import { View, Text, StyleSheet, Pressable, ScrollView } from 'react-native'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import { useRouter } from 'expo-router'
import { Check, ChevronLeft } from 'lucide-react-native'
import { colors, getActiveMobileThemeId, radii, spacing, typography } from '../theme/mobile-theme'
import { saveMobileThemeId } from '../theme/mobile-theme-preference'
import type { MobileThemeId } from '../theme/mobile-theme-palettes'

const THEME_OPTIONS: { id: MobileThemeId; label: string; description: string }[] = [
  { id: 'dark', label: 'Dark', description: 'Graphite background, the default.' },
  {
    id: 'light',
    label: 'Light',
    description: 'White background, matches the desktop light theme.'
  },
  {
    id: 'eink',
    label: 'E-ink',
    description: 'Pure black on white with solid borders, for e-ink screens.'
  }
]

export default function ThemeSettingsScreen({ onBack }: { onBack?: () => void }) {
  const router = useRouter()
  const insets = useSafeAreaInsets()
  const appliedId = getActiveMobileThemeId()
  const [selectedId, setSelectedId] = useState<MobileThemeId>(appliedId)

  const select = (id: MobileThemeId) => {
    setSelectedId(id)
    void saveMobileThemeId(id)
  }

  return (
    <View style={[styles.container, { paddingTop: insets.top + spacing.sm }]}>
      <View style={styles.topRow}>
        <Pressable
          accessibilityRole="button"
          accessibilityLabel="Back"
          style={styles.backButton}
          onPress={onBack ?? (() => router.back())}
        >
          <ChevronLeft size={22} color={colors.textSecondary} />
        </Pressable>
        <Text style={styles.heading}>Theme</Text>
      </View>

      <ScrollView
        contentContainerStyle={{ paddingBottom: insets.bottom + spacing.lg }}
        showsVerticalScrollIndicator={false}
      >
        <Text style={styles.groupHeading}>APPEARANCE</Text>
        <View style={styles.section}>
          {THEME_OPTIONS.map((option, index) => (
            <Pressable
              key={option.id}
              accessibilityRole="radio"
              accessibilityState={{ selected: option.id === selectedId }}
              style={[styles.row, index > 0 && styles.rowDivider]}
              onPress={() => select(option.id)}
            >
              <View style={styles.rowContent}>
                <Text style={styles.rowLabel}>{option.label}</Text>
                <Text style={styles.rowSublabel}>{option.description}</Text>
              </View>
              {option.id === selectedId ? <Check size={18} color={colors.textPrimary} /> : null}
            </Pressable>
          ))}
        </View>
        {selectedId !== appliedId ? (
          <Text style={styles.restartNote}>Close and reopen the app to apply the new theme.</Text>
        ) : null}
      </ScrollView>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.bgBase,
    paddingHorizontal: spacing.lg
  },
  topRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: spacing.sm,
    marginBottom: spacing.lg
  },
  backButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: spacing.sm
  },
  heading: {
    fontSize: 20,
    fontWeight: '700',
    color: colors.textPrimary
  },
  groupHeading: {
    fontSize: 11,
    fontWeight: '600',
    color: colors.textMuted,
    letterSpacing: 0.5,
    marginBottom: spacing.xs,
    paddingHorizontal: spacing.xs
  },
  section: {
    backgroundColor: colors.bgPanel,
    borderRadius: radii.card,
    overflow: 'hidden'
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm + 2,
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.md + 2
  },
  rowDivider: {
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: colors.borderSubtle
  },
  rowContent: {
    flex: 1
  },
  rowLabel: {
    fontSize: typography.bodySize,
    fontWeight: '500',
    color: colors.textPrimary
  },
  rowSublabel: {
    fontSize: typography.bodySize - 2,
    color: colors.textSecondary,
    marginTop: 2
  },
  restartNote: {
    fontSize: typography.bodySize - 1,
    color: colors.textSecondary,
    marginTop: spacing.md,
    paddingHorizontal: spacing.xs
  }
})
