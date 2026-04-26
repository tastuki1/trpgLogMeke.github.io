import { useState } from 'react'

export function useClipboard() {
  const [isCopying, setIsCopying] = useState(false)
  const [error, setError] = useState<string | null>(null)

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
