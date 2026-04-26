import { useEffect, useState } from 'react'

import type { GameSystem } from '@/logmake/types'

export function useDefaultDice(system: GameSystem) {
  const [data, setData] = useState<string[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    let isActive = true

    async function load() {
      setIsLoading(true)
      setError(null)

      try {
        const path =
          system === 'CoC6' ? '../defaultDice6th.json' : '../defaultDice7th.json'
        const response = await fetch(new URL(path, window.location.href))
        if (!response.ok) {
          throw new Error('Failed to load default dice.')
        }

        const nextData = (await response.json()) as string[]
        if (isActive) {
          setData(nextData)
        }
      } catch {
        if (isActive) {
          setError('初期技能データの読み込みに失敗しました。')
        }
      } finally {
        if (isActive) {
          setIsLoading(false)
        }
      }
    }

    void load()

    return () => {
      isActive = false
    }
  }, [system])

  return {
    data,
    isLoading,
    error,
  }
}
