import rawDefaultSkillValues from '@/logmake/systems/coc/data/defaultSkillValues6th.json'
import { createCocGrowth } from '@/logmake/systems/coc/cocGrowth'

/** CoC6版の成長判定機能。スペシャル・通常成功の2段階の成功分類を持つ */
export const coc6Growth = createCocGrowth({
  labels: ['クリティカル', 'スペシャル', 'ファンブル', '故障', '初期値成功', '通常成功', '通常失敗'],
  rawDefaultSkillValues,
  successRegex: /スペシャル|成功/,
  classifyRefinedSuccess({ outcome }) {
    if (/スペシャル/.test(outcome)) {
      return 'スペシャル'
    }
    return '通常成功'
  },
})
