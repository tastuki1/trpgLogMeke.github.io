import formStyles from '@/logmake/styles/forms.module.css'
import type { GameSystem } from '@/logmake/types'

interface FileUploadProps {
  system: GameSystem
  onSystemChange: (system: GameSystem) => void
  onFileSelect: (file: File) => void
  isLoading: boolean
  defaultDiceLoading: boolean
  sourceFileName: string | null
}

export function FileUpload({
  system,
  onSystemChange,
  onFileSelect,
  isLoading,
  defaultDiceLoading,
  sourceFileName,
}: FileUploadProps) {
  return (
    <div className={formStyles.legacyBlock}>
      整形したいログを選択してください．
      <input
        aria-label="CoC 6版"
        checked={system === 'CoC6'}
        id="CoC6"
        name="system"
        type="radio"
        onChange={() => onSystemChange('CoC6')}
      />
      <label htmlFor="CoC6">6版</label>
      <input
        aria-label="CoC 7版"
        checked={system === 'CoC7'}
        id="CoC7"
        name="system"
        type="radio"
        onChange={() => onSystemChange('CoC7')}
      />
      <label htmlFor="CoC7">7版</label>
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
          : defaultDiceLoading
            ? '初期技能データを更新中です。'
            : '準備完了。'}
      </p>
    </div>
  )
}
