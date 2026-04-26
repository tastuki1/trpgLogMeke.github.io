import { getLabelsForSystem } from '@/logmake/lib/defaults'
import type {
  DiceRecord,
  GameSystem,
  GrowthAnalysis,
  GrowthLabel,
  ParsedDiceOccurrence,
  ParsedLog,
} from '@/logmake/types'

export function analyzeDice(
  parsedLog: ParsedLog,
  system: GameSystem,
  defaultDice: string[],
): GrowthAnalysis {
  const labels = getLabelsForSystem(system)
  const byCharacter: GrowthAnalysis['byCharacter'] = {}
  const records: DiceRecord[] = []
  const warnings = [...parsedLog.warnings]
  const defaultJudgeSet = new Set(defaultDice)

  for (const entry of parsedLog.entries) {
    for (const paragraph of entry.paragraphs) {
      for (const token of paragraph.tokens) {
        if (!token.dice) {
          continue
        }

        const label = classifyDice(token.dice, system, defaultJudgeSet)
        const record: DiceRecord = {
          charName: entry.charName,
          tabName: entry.tabName,
          ginou: token.dice.skill,
          value: token.dice.roll,
          status: token.dice.status,
          label,
        }

        if (!byCharacter[record.charName]) {
          byCharacter[record.charName] = {}
        }

        if (!byCharacter[record.charName][label]) {
          byCharacter[record.charName][label] = []
        }

        byCharacter[record.charName][label]?.push(record)
        records.push(record)
      }
    }
  }

  return { labels, byCharacter, records, warnings }
}

function classifyDice(
  dice: ParsedDiceOccurrence,
  system: GameSystem,
  defaultJudgeSet: Set<string>,
): GrowthLabel {
  const outcome = dice.outcomeText
  const isCritical =
    /クリティカル|決定的成功/.test(outcome) || dice.option === 'c'
  const isFumble = /ファンブル|致命的失敗/.test(outcome)
  const isSuccess =
    /スペシャル|イクストリーム成功|ハード成功|成功/.test(outcome) ||
    isCritical

  if (isCritical) {
    return 'クリティカル'
  }

  if (isFumble) {
    return 'ファンブル'
  }

  if (!isSuccess) {
    return '通常失敗'
  }

  if (dice.judge && defaultJudgeSet.has(dice.judge)) {
    return '初期値成功'
  }

  if (system === 'CoC7') {
    if (/イクストリーム成功/.test(outcome) || dice.option === 'e') {
      return 'イクストリーム'
    }

    if (/ハード成功/.test(outcome) || dice.option === 'h') {
      return 'ハード'
    }
  }

  if (system === 'CoC6' && /スペシャル/.test(outcome)) {
    return 'スペシャル'
  }

  return '通常成功'
}
