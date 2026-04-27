import type {
  GrowthFilters,
  GrowthLabel,
  LogmakeSettings,
  TabConfig,
} from '@/logmake/types'

export const DEFAULT_NAME_COLOR = '#ffffff'
export const DEFAULT_FRAME_COLOR = '#6b8e23'
export const DEFAULT_BACK_COLOR = '#ffffff'

export const SUCCESS_HIGHLIGHT =
  'linear-gradient(transparent 70%, #7fbfff 0%)'
export const FAILURE_HIGHLIGHT =
  'linear-gradient(transparent 70%, #ff7f7f 0%)'

const TAB_COLOR_PALETTE = [
  '#8e5c5c',
  '#597da7',
  '#6e8e3d',
  '#9c6a2e',
  '#7164a9',
  '#567f83',
  '#ab5a7b',
  '#8c7a45',
]

export function createBaseTabs(): Record<string, TabConfig> {
  return {
    メイン: {
      name: 'メイン',
      color: 'rgba(255,255,255,0)',
      visible: true,
    },
    情報: {
      name: '情報',
      color: 'rgba(255,255,255,0)',
      visible: true,
    },
  }
}

export function createDefaultSettings(baseName = 'log'): LogmakeSettings {
  return {
    logFileName: baseName,
    title: baseName,
    nameColor: DEFAULT_NAME_COLOR,
    frameColor: DEFAULT_FRAME_COLOR,
    backColor: DEFAULT_BACK_COLOR,
  }
}

export function createGrowthFilters(
  labels: GrowthLabel[],
  previous?: GrowthFilters,
): GrowthFilters {
  const labelVisibility = Object.fromEntries(
    labels.map((label) => [
      label,
      previous?.labels[label] ??
        !['通常成功', '通常失敗'].includes(label),
    ]),
  ) as GrowthFilters['labels']

  return {
    labels: labelVisibility,
    visibility: {
      tabName: previous?.visibility.tabName ?? true,
      value: previous?.visibility.value ?? true,
      status: previous?.visibility.status ?? true,
    },
  }
}

export function sanitizeUploadFileName(name: string): string {
  return name.replace(/\[.+\](.*)/, '$1').replace(/\.html?$/i, '') || 'log'
}

export function getTabDisplayName(rawTabName: string): string {
  switch (rawTabName) {
    case 'main':
      return 'メイン'
    case 'info':
      return '情報'
    case 'other':
      return '雑談'
    default:
      return rawTabName
  }
}

export function createTabConfig(name: string): TabConfig {
  return {
    name,
    color: isPrimaryTab(name) ? 'rgba(255,255,255,0)' : getStableTabColor(name),
    visible: true,
  }
}

export function isPrimaryTab(tabName: string): boolean {
  return tabName === 'メイン' || tabName === '情報'
}

function getStableTabColor(seed: string): string {
  let hash = 0
  for (const char of seed) {
    hash = (hash * 31 + char.charCodeAt(0)) % TAB_COLOR_PALETTE.length
  }
  return TAB_COLOR_PALETTE[Math.abs(hash) % TAB_COLOR_PALETTE.length]
}
