import { createCocDiceExtractor } from '@/logmake/systems/coc/cocDiceExtractor'

/** CoC7版のログフラグメントからダイスイベントを抽出する関数 */
export const parseCoc7DiceToken = createCocDiceExtractor({
  commandPrefix: '(?:CC(?!B)|CBR(?!B))',
  optionRegex: /(?:CC(?!B)|CBR(?!B))[-+0-9()]*&lt;=\d+([rhec])/i,
  combineCommandPattern: /^CBR\((\d+)\s*,\s*(\d+)\)/i,
  skillAliases: {},
})
