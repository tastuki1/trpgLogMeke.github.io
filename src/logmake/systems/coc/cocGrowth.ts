import {
  COC_GROWTH_OUTCOME_REGEX,
  isInitialSkillSuccess,
  readCocOption,
} from '@/logmake/systems/coc/shared'
import type { GrowthCapability } from '@/logmake/systems/types'
import { normalizeDefaultSkillValues } from '@/logmake/lib/defaultSkillValues'
import type { DefaultSkillValueMap } from '@/logmake/lib/defaultSkillValues'
import type { DiceEvent, DiceEventTarget, GrowthLabel } from '@/logmake/types'

export interface CocGrowthConfig {
  labels: GrowthLabel[]
  rawDefaultSkillValues: unknown
  successRegex: RegExp
  classifyRefinedSuccess: (params: {
    outcome: string
    cocOption: string
    target: DiceEventTarget
    defaultSkillValues: DefaultSkillValueMap
  }) => GrowthLabel
}

export function createCocGrowth(config: CocGrowthConfig): GrowthCapability {
  return {
    labels: config.labels,
    async loadDefaultSkillValues() {
      return normalizeDefaultSkillValues(config.rawDefaultSkillValues)
    },
    classifyRecord({ defaultSkillValues, dice, target }) {
      const outcome = target.outcomeText ?? dice.outcomeText
      const cocOption = readCocOption(dice.meta)
      const isCritical =
        /クリティカル|決定的成功/.test(outcome) || cocOption === 'c'
      const isFumble = /ファンブル|致命的失敗/.test(outcome)
      const isSuccess = config.successRegex.test(outcome) || isCritical

      if (isCritical) {
        return 'クリティカル'
      }

      if (isFumble) {
        return 'ファンブル'
      }

      if (/故障/.test(outcome)) {
        return '故障'
      }

      if (!isSuccess) {
        return '通常失敗'
      }

      if (isInitialSkillSuccess(target, defaultSkillValues)) {
        return '初期値成功'
      }

      return config.classifyRefinedSuccess({ outcome, cocOption, target, defaultSkillValues })
    },
    isGrowthTarget(dice: DiceEvent): boolean {
      return dice.targets.length > 0 && COC_GROWTH_OUTCOME_REGEX.test(dice.outcomeText)
    },
  }
}
