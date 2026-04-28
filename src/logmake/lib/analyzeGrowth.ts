import type { DefaultSkillValueMap } from '@/logmake/lib/defaultSkillValues'
import type { LogmakeSystem } from '@/logmake/systems'
import type { DiceRecord, GrowthAnalysis, ParsedLog } from '@/logmake/types'

/**
 * パース済みログから成長判定レコードを集約し、分析結果を返す。
 * system.growth が未定義のシステムでは空の分析結果を返す。
 *
 * @param parsedLog - parseLogHtml の戻り値
 * @param system - 使用するゲームシステム（成長判定ロジックを保持）
 * @param defaultSkillValues - 初期値成功の判定に使う技能初期値マップ
 * @returns 成長判定の集約結果
 */
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
