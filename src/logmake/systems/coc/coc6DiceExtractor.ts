import { createCocDiceExtractor } from '@/logmake/systems/coc/cocDiceExtractor'

/** CoC6版で使用する技能の表記ゆれを正規名に統一するエイリアスマップ */
const SKILL_ALIASES: Record<string, string> = {
  ma: 'マーシャルアーツ',
  パンチ: 'こぶし（パンチ）',
  こぶし: 'こぶし（パンチ）',
  こぶしパンチ: 'こぶし（パンチ）',
  'こぶし（パンチ）': 'こぶし（パンチ）',
  マーシャルアーツ: 'マーシャルアーツ',
}

/** CoC6版のログフラグメントからダイスイベントを抽出する関数 */
export const parseCoc6DiceToken = createCocDiceExtractor({
  commandPrefix: '(?:CCB|CC|RESB|RES|CBRB|CBR)',
  optionRegex: /(?:CCB|CC|RESB|RES|CBRB|CBR)[-+0-9()]*&lt;=\d+([crhe])/i,
  combineCommandPattern: /^CBRB?\((\d+)\s*,\s*(\d+)\)/i,
  skillAliases: SKILL_ALIASES,
})
