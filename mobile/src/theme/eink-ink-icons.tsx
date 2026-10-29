import * as React from 'react'
import * as Lucide from 'lucide-react-native'
import { isEinkTheme } from './mobile-theme'

// Metro resolves lucide-react-native to this module (see metro.config.js) so default icons are heavier
// on E-ink, where a two-unit stroke at small sizes is thinner than a panel pixel pair.
const EINK_STROKE_WIDTH = 2.75

type IconProps = { strokeWidth?: number | string }

const wrapped = new Map<string, unknown>()

function isIconComponent(name: string, value: unknown): boolean {
  return (
    /^[A-Z]/.test(name) &&
    typeof value === 'object' &&
    value !== null &&
    '$$typeof' in value &&
    'render' in value
  )
}

function wrapIcon(name: string, Icon: React.ElementType): unknown {
  const cached = wrapped.get(name)
  if (cached !== undefined) {
    return cached
  }
  const Inked = React.forwardRef<unknown, IconProps>((props, ref) => (
    <Icon
      ref={ref}
      {...props}
      strokeWidth={props.strokeWidth ?? (isEinkTheme() ? EINK_STROKE_WIDTH : undefined)}
    />
  ))
  Inked.displayName = name
  wrapped.set(name, Inked)
  return Inked
}

module.exports = new Proxy(Lucide, {
  get(target, name) {
    const value = Reflect.get(target, name)
    return typeof name === 'string' && isIconComponent(name, value) ? wrapIcon(name, value) : value
  }
})
