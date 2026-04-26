import formStyles from '@/logmake/styles/forms.module.css'

interface DownloadActionsProps {
  canDownload: boolean
  outputFileName: string
  onDownload: () => void
}

export function DownloadActions({
  canDownload,
  outputFileName,
  onDownload,
}: DownloadActionsProps) {
  return (
      <div className={formStyles.downloadBlock}>
        <p className={formStyles.metaLine}>
          出力名: {outputFileName || 'log'}.html
        </p>
        <div className={formStyles.buttonRow}>
          <button
            className={formStyles.primaryButton}
            disabled={!canDownload}
            type="button"
            onClick={onDownload}
          >
            HTML をダウンロード
          </button>
        </div>
      </div>
  )
}
