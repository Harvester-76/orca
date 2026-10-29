const path = require('node:path')
const { getDefaultConfig } = require('expo/metro-config')

const projectRoot = __dirname
const sharedRoot = path.resolve(projectRoot, '..', 'src', 'shared')

const config = getDefaultConfig(projectRoot)

// Watch repo root: mobile source-control uses desktop’s pure prompt builders, outside Metro’s default mobile-only scope.
config.watchFolders = Array.from(new Set([...(config.watchFolders ?? []), sharedRoot]))

// E-ink restyling that react-native and lucide offer no hook for: enlarged labels and heavier icon strokes.
const einkModules = new Map([
  ['Libraries/Text/Text.js', 'src/theme/eink-scaled-text.tsx'],
  ['Libraries/Components/TextInput/TextInput.js', 'src/theme/eink-scaled-text-input.tsx']
])
const einkWrapperPaths = new Set(
  [...einkModules.values(), 'src/theme/eink-ink-icons.tsx'].map((file) => path.join(projectRoot, file))
)
const lucideEntry = path.join(projectRoot, 'src/theme/eink-ink-icons.tsx')

config.resolver.resolveRequest = (context, moduleName, platform) => {
  if (einkWrapperPaths.has(context.originModulePath)) {
    return context.resolveRequest(context, moduleName, platform)
  }
  if (moduleName === 'lucide-react-native' && platform !== 'web') {
    return { type: 'sourceFile', filePath: lucideEntry }
  }
  const resolution = context.resolveRequest(context, moduleName, platform)
  if (resolution.type === 'sourceFile') {
    for (const [suffix, wrapper] of einkModules) {
      if (resolution.filePath.endsWith(path.join('react-native', ...suffix.split('/')))) {
        return { type: 'sourceFile', filePath: path.join(projectRoot, wrapper) }
      }
    }
  }
  return resolution
}

module.exports = config
