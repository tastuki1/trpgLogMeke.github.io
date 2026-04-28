import { useState } from 'react'

/**
 * ファイルをテキストとして非同期読み込みするカスタムフック。
 * 読み込み中フラグとエラーメッセージを管理する。
 *
 * @returns readText 関数・isLoading・error を持つオブジェクト
 */
export function useFileReader() {
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  /**
   * 指定したファイルをテキスト文字列として読み込む。
   *
   * @param file - 読み込む File オブジェクト
   * @returns ファイルの内容文字列
   * @throws 読み込み失敗時に Error をスロー（error ステートにもセットされる）
   */
  async function readText(file: File): Promise<string> {
    setIsLoading(true)
    setError(null)

    try {
      const text = await file.text()
      return text
    } catch {
      setError('ファイルの読み込みに失敗しました。')
      throw new Error('Failed to read file.')
    } finally {
      setIsLoading(false)
    }
  }

  return {
    isLoading,
    error,
    readText,
  }
}
