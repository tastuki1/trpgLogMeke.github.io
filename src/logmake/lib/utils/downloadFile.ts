/**
 * Blob を一時的な ObjectURL 経由でブラウザにダウンロードさせる。
 * リンク要素を動的に生成してクリックし、完了後に URL を解放する。
 *
 * @param blob - ダウンロードするファイルの内容
 * @param filename - 保存時のデフォルトファイル名
 */
export function downloadFile(blob: Blob, filename: string): void {
  const link = document.createElement('a')
  const url = URL.createObjectURL(blob)

  link.href = url
  link.download = filename
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
  setTimeout(() => URL.revokeObjectURL(url), 0)
}
