import { createCocDiceExtractor } from '@/logmake/systems/coc/cocDiceExtractor'

const SKILL_ALIASES: Record<string, string> = {
  ma: 'マーシャルアーツ',
  パンチ: 'こぶし（パンチ）',
  こぶし: 'こぶし（パンチ）',
  こぶしパンチ: 'こぶし（パンチ）',
  'こぶし（パンチ）': 'こぶし（パンチ）',
  マーシャルアーツ: 'マーシャルアーツ',
}

export const parseCoc6DiceToken = createCocDiceExtractor({
  commandPrefix: '(?:CCB|CC|RESB|RES|CBRB|CBR)',
  optionRegex: /(?:CCB|CC|RESB|RES|CBRB|CBR)[-+0-9()]*&lt;=\d+([crhe])/i,
  combineCommandPattern: /^CBRB?\((\d+)\s*,\s*(\d+)\)/i,
  skillAliases: SKILL_ALIASES,
})
