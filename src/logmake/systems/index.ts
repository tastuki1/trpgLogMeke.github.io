import { COC6_SYSTEM } from '@/logmake/systems/coc6'
import { COC7_SYSTEM } from '@/logmake/systems/coc7'
import type { LogmakeSystem } from '@/logmake/systems/types'
import type { GameSystem } from '@/logmake/types'

export const LOGMAKE_SYSTEMS = {
  CoC6: COC6_SYSTEM,
  CoC7: COC7_SYSTEM,
} satisfies Record<GameSystem, LogmakeSystem>

export const selectableLogmakeSystems: LogmakeSystem[] = [
  COC6_SYSTEM,
  COC7_SYSTEM,
]

export function getLogmakeSystem(system: GameSystem): LogmakeSystem {
  return LOGMAKE_SYSTEMS[system]
}

export type {
  GrowthCapability,
  LogmakeSystem,
} from '@/logmake/systems/types'
