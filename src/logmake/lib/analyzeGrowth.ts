import type { DefaultSkillValueMap } from '@/logmake/lib/defaultSkillValues'
import type { LogmakeSystem } from '@/logmake/systems'
import type { DiceRecord, GrowthAnalysis, ParsedLog } from '@/logmake/types'

export function analyzeGrowth(
  parsedLog: ParsedLog,
  system: LogmakeSystem,
  defaultSkillValues: DefaultSkillValueMap,
): GrowthAnalysis {
  const growth = system.growth
  const labels = growth?.labels ?? []
  const byCharacter: GrowthAnalysis['byCharacter'] = {}
  const records: DiceRecord[] = []
  const warnings = [...parsedLog.warnings]

  if (!growth) {
    return { labels, byCharacter, records, warnings }
  }

  for (const entry of parsedLog.entries) {
    for (const paragraph of entry.paragraphs) {
      for (const token of paragraph.tokens) {
        const dice = token.dice
        if (!dice || !growth.isGrowthTarget(dice)) {
          continue
        }

        for (const target of dice.targets) {
          const label = growth.classifyRecord({
            defaultSkillValues,
            dice,
            target,
          })
          const record: DiceRecord = {
            charName: entry.charName,
            tabName: entry.tabName,
            ginou: target.name,
            value: dice.primaryRoll ?? 0,
            status: dice.status,
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
  }

  return { labels, byCharacter, records, warnings }
}
