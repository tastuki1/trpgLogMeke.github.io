import type { CharacterConfig, CharacterStyle } from '@/logmake/types'

const STYLE_SORT_ORDER: Record<CharacterStyle, number> = {
  character: 0,
  item: 1,
  scene: 2,
}

const CHARACTER_NAME_COLLATOR = new Intl.Collator('ja')

/**
 * キャラクター設定を表示順に並べ替える。
 * 旧版と同じく人物を先頭にし、同じ種別内ではキャラクター名で安定ソートする。
 *
 * @param characters - キャラクター設定のレコード
 * @returns ソート済みキャラクター設定の配列
 */
export function sortCharacterConfigs(
  characters: Record<string, CharacterConfig>
): CharacterConfig[] {
  return Object.values(characters).sort(compareCharacterConfigs)
}

/**
 * キャラクター設定レコードを表示順の挿入順で作り直す。
 *
 * @param characters - キャラクター設定のレコード
 * @returns ソート済み挿入順を持つキャラクター設定レコード
 */
export function sortCharacterRecord(
  characters: Record<string, CharacterConfig>
): Record<string, CharacterConfig> {
  return Object.fromEntries(
    sortCharacterConfigs(characters).map((character) => [
      character.name,
      character,
    ])
  )
}

function compareCharacterConfigs(
  a: CharacterConfig,
  b: CharacterConfig
): number {
  const styleOrder = STYLE_SORT_ORDER[a.style] - STYLE_SORT_ORDER[b.style]
  if (styleOrder !== 0) {
    return styleOrder
  }

  return CHARACTER_NAME_COLLATOR.compare(a.name, b.name)
}
