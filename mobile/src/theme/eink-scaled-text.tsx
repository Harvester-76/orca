import * as React from 'react'
import { StyleSheet, type Text as TextComponent, type TextProps } from 'react-native'
import * as RealTextModule from 'react-native/Libraries/Text/Text'
import { isEinkTheme } from './mobile-theme'

// SAFETY: Text.js default-exports the component, while its .d.ts declares only the named class.
// oxlint-disable-next-line typescript/consistent-type-assertions
const RealText = (RealTextModule as unknown as { default: typeof TextComponent }).default

// Metro resolves react-native's Text to this module (see metro.config.js) so every label grows on E-ink.
const EINK_TEXT_SCALE = 1.15

export function scaleTextStyle(style: TextProps['style']): TextProps['style'] {
  const flat = StyleSheet.flatten(style)
  if (flat === undefined || typeof flat.fontSize !== 'number') {
    return style
  }
  return {
    ...flat,
    fontSize: flat.fontSize * EINK_TEXT_SCALE,
    ...(typeof flat.lineHeight === 'number' ? { lineHeight: flat.lineHeight * EINK_TEXT_SCALE } : {})
  }
}

const Text = React.forwardRef<React.ComponentRef<typeof RealText>, TextProps>((props, ref) => {
  if (!isEinkTheme()) {
    return <RealText ref={ref} {...props} />
  }
  return <RealText ref={ref} {...props} style={scaleTextStyle(props.style)} />
})
Text.displayName = 'Text'

export default Text
