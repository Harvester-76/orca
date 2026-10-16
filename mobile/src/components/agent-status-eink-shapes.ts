import type { ViewStyle } from 'react-native'
import { colors } from '../theme/mobile-theme'

export type AgentStatusEinkShape =
  | 'filled'
  | 'square'
  | 'ring'
  | 'ring-thick'
  | 'ring-dotted'
  | 'ring-open'

// Why: on a monochrome panel green, yellow and red are the same grey, so e-ink tells states apart by shape.
export function agentStatusEinkShapeStyle(shape: AgentStatusEinkShape, size: number): ViewStyle {
  const box = { width: size, height: size }
  const ink = colors.textPrimary
  switch (shape) {
    case 'filled':
      return { ...box, borderRadius: size / 2, backgroundColor: ink }
    case 'square':
      return { ...box, backgroundColor: ink }
    case 'ring':
      return { ...box, borderRadius: size / 2, borderWidth: 1.5, borderColor: ink }
    case 'ring-thick':
      return { ...box, borderRadius: size / 2, borderWidth: 2.5, borderColor: ink }
    case 'ring-dotted':
      return {
        ...box,
        borderRadius: size / 2,
        borderWidth: 1.5,
        borderStyle: 'dotted',
        borderColor: ink
      }
    case 'ring-open':
      return {
        ...box,
        borderRadius: size / 2,
        borderWidth: 2,
        borderColor: ink,
        borderTopColor: 'transparent'
      }
  }
}
