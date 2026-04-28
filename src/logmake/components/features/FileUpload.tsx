import { Fragment } from 'react'

import formStyles from '@/logmake/styles/forms.module.css'
import { selectableLogmakeSystems } from '@/logmake/systems'
import type { GameSystem } from '@/logmake/types'

interface FileUploadProps {
  system: GameSystem
  onSystemChange: (system: GameSystem) => void
  onFileSelect: (file: File) => void
  isLoading: boolean
  defaultSkillValuesLoading: boolean
  sourceFileName: string | null
}

export function FileUpload({
  system,
  onSystemChange,
  onFileSelect,
  isLoading,
  defaultSkillValuesLoading,
  sourceFileName,
}: FileUploadProps) {
  return (
    <div className={formStyles.legacyBlock}>
      整形したいログを選択してください．
      {selectableLogmakeSystems.map((logmakeSystem) => (
        <Fragment key={logmakeSystem.id}>
          <input
            aria-label={logmakeSystem.name}
            checked={system === logmakeSystem.id}
            id={logmakeSystem.id}
            name="system"
            type="radio"
            onChange={() => onSystemChange(logmakeSystem.id)}
          />
          <label htmlFor={logmakeSystem.id}>{logmakeSystem.name}</label>
        </Fragment>
      ))}
      <br />
      <br />
      <input
        aria-label="ログHTML"
        id="log-file"
        accept=".html,text/html"
        type="file"
        onChange={(event) => {
          const file = event.currentTarget.files?.[0]
          if (file) {
            onFileSelect(file)
          }
        }}
      />
      <br />
      <br />
      <p className={formStyles.metaLine}>
        {sourceFileName
          ? `読み込み対象: ${sourceFileName}`
          : 'まだファイルは選択されていません。'}
      </p>
      <p className={formStyles.metaLine}>
        {isLoading
          ? 'ファイルを読み込み中です。'
          : defaultSkillValuesLoading
            ? '初期技能データを更新中です。'
            : '準備完了。'}
      </p>
    </div>
  )
}
