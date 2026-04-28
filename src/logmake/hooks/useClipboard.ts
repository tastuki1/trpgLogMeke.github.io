import { useState } from 'react'

/**
 * クリップボードへのテキストコピーを行うカスタムフック。
 * コピー中フラグとエラーメッセージを管理する。
 *
 * @returns copy 関数・isCopying・error を持つオブジェクト
 */
export function useClipboard() {
  const [isCopying, setIsCopying] = useState(false)
  const [error, setError] = useState<string | null>(null)

  /**
   * 指定したテキストをクリップボードにコピーする。
   *
   * @param text - コピーするテキスト
   * @returns 成功時は true、失敗時は false
   */
  async function copy(text: string) {
    setIsCopying(true)
    setError(null)

    try {
      await navigator.clipboard.writeText(text)
      return true
    } catch {
      setError('クリップボードへのコピーに失敗しました。')
      return false
    } finally {
      setIsCopying(false)
    }
  }

  return {
    copy,
    isCopying,
    error,
  }
}
