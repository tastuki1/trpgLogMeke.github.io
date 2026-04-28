import { BasicSettings } from '@/logmake/components/features/BasicSettings'
import { CharacterSettings } from '@/logmake/components/features/CharacterSettings'
import { DownloadActions } from '@/logmake/components/features/DownloadActions'
import { TabSettings } from '@/logmake/components/features/TabSettings'
import type {
  CharacterConfig,
  CharacterStyle,
  LogmakeSettings,
  TabConfig,
} from '@/logmake/types'

interface OutputSettingsProps {
  canDownload: boolean
  characters: Record<string, CharacterConfig>
  settings: LogmakeSettings
  tabs: Record<string, TabConfig>
  onCharacterColorChange: (name: string, color: string) => void
  onCharacterStyleChange: (name: string, style: CharacterStyle) => void
  onDownload: () => void
  onSettingChange: <Key extends keyof LogmakeSettings>(
    key: Key,
    value: LogmakeSettings[Key],
  ) => void
  onTabColorChange: (name: string, color: string) => void
  onTabVisibilityChange: (name: string, visible: boolean) => void
}

/**
 * 基本設定・タブ設定・キャラクター設定・ダウンロードを束ねるコンポーネント。
 *
 * @param props.canDownload - ダウンロード可能状態か否か
 * @param props.characters - キャラクター設定のレコード
 * @param props.settings - 現在の整形設定
 * @param props.tabs - タブ設定のレコード
 * @param props.onCharacterColorChange - キャラクターカラー変更ハンドラ
 * @param props.onCharacterStyleChange - キャラクタースタイル変更ハンドラ
 * @param props.onDownload - ダウンロードハンドラ
 * @param props.onSettingChange - 基本設定変更ハンドラ
 * @param props.onTabColorChange - タブカラー変更ハンドラ
 * @param props.onTabVisibilityChange - タブ表示切り替えハンドラ
 */
export function OutputSettings({
  canDownload,
  characters,
  settings,
  tabs,
  onCharacterColorChange,
  onCharacterStyleChange,
  onDownload,
  onSettingChange,
  onTabColorChange,
  onTabVisibilityChange,
}: OutputSettingsProps) {
  return (
    <>
      <BasicSettings settings={settings} onChange={onSettingChange} />
      <TabSettings
        tabs={tabs}
        onColorChange={onTabColorChange}
        onVisibilityChange={onTabVisibilityChange}
      />
      <CharacterSettings
        characters={characters}
        onColorChange={onCharacterColorChange}
        onStyleChange={onCharacterStyleChange}
      />
      <DownloadActions
        canDownload={canDownload}
        outputFileName={settings.logFileName}
        onDownload={onDownload}
      />
    </>
  )
}
