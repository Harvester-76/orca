import * as React from 'react'
import { type TextInput as TextInputComponent, type TextInputProps } from 'react-native'
import * as RealTextInputModule from 'react-native/Libraries/Components/TextInput/TextInput'
import { scaleTextStyle } from './eink-scaled-text'
import { isEinkTheme } from './mobile-theme'

// SAFETY: TextInput.js default-exports the component, while its .d.ts declares only the named class.
// oxlint-disable-next-line typescript/consistent-type-assertions
const RealTextInput = (RealTextInputModule as unknown as { default: typeof TextInputComponent })
  .default

// Metro resolves react-native's TextInput to this module so typed text matches the enlarged labels.
const TextInput = React.forwardRef<React.ComponentRef<typeof RealTextInput>, TextInputProps>(
  (props, ref) => {
    if (!isEinkTheme()) {
      return <RealTextInput ref={ref} {...props} />
    }
    return <RealTextInput ref={ref} {...props} style={scaleTextStyle(props.style)} />
  }
)
TextInput.displayName = 'TextInput'

export default TextInput
