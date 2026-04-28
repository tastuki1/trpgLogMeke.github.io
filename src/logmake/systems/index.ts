import { COC6_SYSTEM } from '@/logmake/systems/coc6'
import { COC7_SYSTEM } from '@/logmake/systems/coc7'
import type { LogmakeSystem } from '@/logmake/systems/types'
import type { GameSystem } from '@/logmake/types'

/** 全ゲームシステムを GameSystem キーで引けるレコード */
export const LOGMAKE_SYSTEMS = {
  CoC6: COC6_SYSTEM,
  CoC7: COC7_SYSTEM,
} satisfies Record<GameSystem, LogmakeSystem>

/** システム選択 UI に表示する順序付きシステムリスト */
export const selectableLogmakeSystems: LogmakeSystem[] = [
  COC6_SYSTEM,
  COC7_SYSTEM,
]

/**
 * GameSystem ID からシステムオブジェクトを取得する。
 *
 * @param system - ゲームシステム識別子
 * @returns 対応する LogmakeSystem
 */
export function getLogmakeSystem(system: GameSystem): LogmakeSystem {
  return LOGMAKE_SYSTEMS[system]
}

export type {
  GrowthCapability,
  LogmakeSystem,
} from '@/logmake/systems/types'
