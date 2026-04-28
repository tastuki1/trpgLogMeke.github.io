import type { DefaultSkillValueMap } from '@/logmake/lib/defaultSkillValues'
import type {
  DiceEvent,
  DiceEventTarget,
  GameSystem,
  GrowthLabel,
} from '@/logmake/types'

export interface ClassifyGrowthOptions {
  defaultSkillValues: DefaultSkillValueMap
  dice: DiceEvent
  target: DiceEventTarget
}

export interface GrowthCapability {
  labels: GrowthLabel[]
  loadDefaultSkillValues(): Promise<DefaultSkillValueMap>
  classifyRecord(options: ClassifyGrowthOptions): GrowthLabel
  isGrowthTarget(dice: DiceEvent): boolean
}

export interface LogmakeSystem {
  id: GameSystem
  name: string
  log: {
    normalizeSource(content: string): string
    parseToken(fragment: string): DiceEvent | undefined
  }
  growth?: GrowthCapability
}
