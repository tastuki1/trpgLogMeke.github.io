import { Fragment } from 'react'

import formStyles from '@/logmake/styles/forms.module.css'
import { selectableLogmakeSystems } from '@/logmake/systems'
import type { GameSystem } from '@/logmake/types'

interface FileUploadProps {
  system: GameSystem
  sourceFileName: string | null
  onSystemChange: (system: GameSystem) => void
  onFileSelect: (file: File) => void
}

/**
 * ゲームシステム選択とログファイルアップロードのコンポーネント。
 *
 * @param props.system - 現在選択中のゲームシステム
 * @param props.sourceFileName - 選択中のログファイル名
 * @param props.onSystemChange - システム変更ハンドラ
 * @param props.onFileSelect - ファイル選択ハンドラ
 */
export function FileUpload({
  system,
  sourceFileName,
  onSystemChange,
  onFileSelect,
}: FileUploadProps) {
  return (
    <div className={formStyles.basicCard}>
      <div className={formStyles.labelInputRow}>
        <span className={formStyles.labelCell}>システム</span>
        <span className={formStyles.inlineOptions}>
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
        </span>
      </div>
      <div className={formStyles.labelInputRow}>
        <span className={formStyles.labelCell}>ログファイル</span>
        <span className={formStyles.fileControl}>
          <input
            aria-label="ログHTML"
            className={formStyles.fileInput}
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
          <span
            aria-label="選択中のログ"
            className={formStyles.logFileDisplay}
            title={sourceFileName ?? undefined}
          >
            {sourceFileName ?? 'ログ未選択'}
          </span>
        </span>
      </div>
    </div>
  )
}
