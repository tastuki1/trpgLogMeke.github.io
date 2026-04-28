import { useEffect, useState } from 'react'

import type { DefaultSkillValueMap } from '@/logmake/lib/defaultSkillValues'
import type { LogmakeSystem } from '@/logmake/systems'

export function useDefaultSkillValues(system: LogmakeSystem) {
  const [data, setData] = useState<DefaultSkillValueMap>({})
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    let isActive = true

    async function load() {
      setIsLoading(true)
      setError(null)

      try {
        if (!system.growth) {
          if (isActive) {
            setData({})
          }
          return
        }

        const nextData = await system.growth.loadDefaultSkillValues()
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
