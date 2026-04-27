import type { DefaultSkillValueMap } from '@/logmake/lib/defaultSkillValues'
import type { DiceEventTarget, DiceHighlight } from '@/logmake/types'

const TAG_REGEX = /<[^>]+>/g

export const COC_GROWTH_OUTCOME_REGEX =
  /クリティカル|決定的成功|スペシャル|イクストリーム成功|ハード成功|成功|失敗|ファンブル|致命的失敗|故障/

export function cleanSkillTail(tail: string): string {
  return tail.replace(TAG_REGEX, '').replace(/\s+/g, ' ').trim()
}

export function createDiceEventTarget(
  name: string,
  target: number | undefined,
  outcomeText?: string,
): DiceEventTarget {
  return {
    name,
    judge: target === undefined ? null : `&lt;=${target} 【${name}】`,
    ...(outcomeText ? { outcomeText } : {}),
    ...(target === undefined ? {} : { target }),
  }
}

export function classifyCocHighlight(
  outcomeText: string,
): DiceHighlight | undefined {
  if (
    /クリティカル|決定的成功|スペシャル|イクストリーム成功|ハード成功|成功/.test(
      outcomeText,
    )
  ) {
    return 'success'
  }

  if (/失敗|ファンブル|致命的失敗/.test(outcomeText)) {
    return 'failure'
  }

  return undefined
}

export function isInitialSkillSuccess(
  target: DiceEventTarget,
  defaultSkillValues: DefaultSkillValueMap,
): boolean {
  return (
    target.target !== undefined &&
    defaultSkillValues[target.name] === target.target
  )
}

export function readCocOption(meta: Record<string, unknown> | undefined): string {
  return typeof meta?.cocOption === 'string' ? meta.cocOption : ''
}

export function canonicalizeTargetName(
  name: string,
  aliases: Record<string, string>,
): string {
  const trimmed = name.trim()
  const aliasKey = trimmed.replace(/\s+/g, '').toLowerCase()
  return aliases[aliasKey] ?? trimmed
}
