import rawDefaultSkillValues from '@/logmake/systems/coc/data/defaultSkillValues7th.json'
import { createCocGrowth } from '@/logmake/systems/coc/cocGrowth'

/** CoC7版の成長判定機能。イクストリーム・ハード・通常成功の3段階の成功分類を持つ */
export const coc7Growth = createCocGrowth({
  labels: ['クリティカル', 'イクストリーム', 'ハード', 'ファンブル', '故障', '初期値成功', '通常成功', '通常失敗'],
  rawDefaultSkillValues,
  successRegex: /イクストリーム成功|ハード成功|成功/,
  classifyRefinedSuccess({ outcome, cocOption }) {
    if (/イクストリーム成功/.test(outcome) || cocOption === 'e') {
      return 'イクストリーム'
    }
    if (/ハード成功/.test(outcome) || cocOption === 'h') {
      return 'ハード'
    }
    return '通常成功'
  },
})
