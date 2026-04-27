import rawDefaultSkillValues from '@/logmake/systems/coc/data/defaultSkillValues7th.json'
import { createCocGrowth } from '@/logmake/systems/coc/cocGrowth'

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
