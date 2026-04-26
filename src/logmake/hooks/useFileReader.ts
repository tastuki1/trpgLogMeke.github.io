import { useState } from 'react'

export function useFileReader() {
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

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
