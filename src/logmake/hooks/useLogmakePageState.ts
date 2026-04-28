import { startTransition, useEffect, useMemo, useState } from 'react'

import { useDefaultSkillValues } from '@/logmake/hooks/useDefaultSkillValues'
import { useFileReader } from '@/logmake/hooks/useFileReader'
import { analyzeGrowth } from '@/logmake/lib/analyzeGrowth'
import { buildOutputHtml } from '@/logmake/lib/buildOutputHtml'
import { buildOutputModel } from '@/logmake/lib/buildOutputModel'
import {
  createBaseTabs,
  createDefaultSettings,
  sanitizeUploadFileName,
} from '@/logmake/lib/defaults'
import { parseLogHtml } from '@/logmake/lib/parseLogHtml'
import { downloadFile } from '@/logmake/lib/utils/downloadFile'
import { getLogmakeSystem } from '@/logmake/systems'
import type {
  CharacterConfig,
  CharacterStyle,
  GameSystem,
  LogmakeSettings,
  OutputModel,
  TabConfig,
} from '@/logmake/types'

const EMPTY_OUTPUT: OutputModel = {
  sections: [],
  toggles: [],
}

interface SourceState {
  rawHtml: string
  fileName: string | null
}

export function useLogmakePageState() {
  const [system, setSystem] = useState<GameSystem>('CoC6')
  const [source, setSource] = useState<SourceState>({
    rawHtml: '',
    fileName: null,
  })
  const [settings, setSettings] = useState<LogmakeSettings>(
    createDefaultSettings()
  )
  const [tabs, setTabs] = useState<Record<string, TabConfig>>(createBaseTabs())
  const [characters, setCharacters] = useState<Record<string, CharacterConfig>>(
    {}
  )
  const [statusMessage, setStatusMessage] =
    useState('整形したいログを選択してください。')

  const fileReader = useFileReader()
  const selectedSystem = useMemo(() => getLogmakeSystem(system), [system])
  const defaultSkillValues = useDefaultSkillValues(selectedSystem)

  const parsedLog = useMemo(() => {
    if (!source.rawHtml) {
      return null
    }

    return parseLogHtml(source.rawHtml, selectedSystem)
  }, [selectedSystem, source.rawHtml])

  const analysis = useMemo(() => {
    if (!parsedLog) {
      return null
    }

    return analyzeGrowth(parsedLog, selectedSystem, defaultSkillValues.data)
  }, [defaultSkillValues.data, parsedLog, selectedSystem])

  const outputModel = useMemo(() => {
    if (!parsedLog) {
      return EMPTY_OUTPUT
    }

    return buildOutputModel(parsedLog, {
      tabs,
      characters,
    })
  }, [characters, parsedLog, tabs])

  const warnings = useMemo(
    () =>
      [
        fileReader.error,
        defaultSkillValues.error,
        ...new Set([
          ...(parsedLog?.warnings ?? []),
          ...(analysis?.warnings ?? []),
        ]),
      ].filter(Boolean) as string[],
    [
      analysis?.warnings,
      defaultSkillValues.error,
      fileReader.error,
      parsedLog?.warnings,
    ]
  )

  useEffect(() => {
    if (!parsedLog) {
      if (!source.rawHtml) {
        setTabs(createBaseTabs())
        setCharacters({})
      }
      return
    }

    setTabs(parsedLog.tabs)
    setCharacters(parsedLog.characters)
    setStatusMessage(
      `${Object.keys(parsedLog.characters).length} 件のキャラクタと ${Object.keys(parsedLog.tabs).length} 件のタブを読み込みました。`
    )
  }, [parsedLog, source.rawHtml])

  async function handleFileSelect(file: File) {
    try {
      const text = await fileReader.readText(file)
      startTransition(() => {
        setSource({
          rawHtml: text,
          fileName: file.name,
        })

        const baseName = sanitizeUploadFileName(file.name)
        setSettings((current) => ({
          ...createDefaultSettings(baseName),
          nameColor: current.nameColor,
          frameColor: current.frameColor,
          backColor: current.backColor,
        }))
      })
    } catch {
      setStatusMessage('ファイルの読み込みに失敗しました。')
    }
  }

  function handleSystemChange(nextSystem: GameSystem) {
    const nextProfile = getLogmakeSystem(nextSystem)
    setSystem(nextSystem)
    setStatusMessage(
      source.rawHtml
        ? `${nextProfile.name} 向けに再解析しています。`
        : `${nextProfile.name} 向けの正規表現と初期技能定義へ切り替えました。`
    )
  }

  function handleSettingChange<Key extends keyof LogmakeSettings>(
    key: Key,
    value: LogmakeSettings[Key]
  ) {
    setSettings((current) => ({
      ...current,
      [key]: value,
    }))
  }

  function handleTabVisibilityChange(name: string, visible: boolean) {
    setTabs((current) => {
      const tab = current[name]
      if (!tab) {
        return current
      }

      return {
        ...current,
        [name]: {
          ...tab,
          visible,
        },
      }
    })
  }

  function handleTabColorChange(name: string, color: string) {
    setTabs((current) => {
      const tab = current[name]
      if (!tab) {
        return current
      }

      return {
        ...current,
        [name]: {
          ...tab,
          color,
        },
      }
    })
  }

  function handleCharacterStyleChange(name: string, style: CharacterStyle) {
    setCharacters((current) => {
      const character = current[name]
      if (!character) {
        return current
      }

      return {
        ...current,
        [name]: {
          ...character,
          style,
        },
      }
    })
  }

  function handleCharacterColorChange(name: string, color: string) {
    setCharacters((current) => {
      const character = current[name]
      if (!character) {
        return current
      }

      return {
        ...current,
        [name]: {
          ...character,
          color,
        },
      }
    })
  }

  function handleDownload() {
    if (outputModel.sections.length === 0) {
      setStatusMessage('ダウンロードできる内容がまだありません。')
      return
    }

    const html = buildOutputHtml(outputModel, settings)
    const blob = new Blob([html], { type: 'text/html' })
    downloadFile(blob, `${settings.logFileName || 'log'}.html`)

    setStatusMessage('HTML を生成してダウンロードしました。')
  }

  return {
    state: {
      system,
      source,
      settings,
      tabs,
      characters,
      statusMessage,
    },
    derived: {
      analysis,
      warnings,
      canDownload: outputModel.sections.length > 0,
    },
    loading: {
      file: fileReader.isLoading,
      defaultSkillValues: defaultSkillValues.isLoading,
    },
    actions: {
      handleFileSelect,
      handleSystemChange,
      handleSettingChange,
      handleTabVisibilityChange,
      handleTabColorChange,
      handleCharacterStyleChange,
      handleCharacterColorChange,
      handleDownload,
    },
  }
}
