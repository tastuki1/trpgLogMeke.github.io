/** 技能名をキー、初期値（数値）を値とするマップ */
export type DefaultSkillValueMap = Record<string, number>

/**
 * JSON などから読み込んだ生の値を DefaultSkillValueMap に正規化する。
 * オブジェクトでない値や非有限数のエントリは無視する。
 *
 * @param rawValue - 正規化前の未知の値（JSON.parse 結果など）
 * @returns 有効な技能名・初期値のみを含むマップ
 */
export function normalizeDefaultSkillValues(
  rawValue: unknown,
): DefaultSkillValueMap {
  if (!isRecord(rawValue)) {
    return {}
  }

  return Object.entries(rawValue).reduce<DefaultSkillValueMap>(
    (result, [skillName, initialValue]) => {
      if (typeof initialValue === 'number' && Number.isFinite(initialValue)) {
        result[skillName] = initialValue
      }

      return result
    },
    {}
  )
}

/**
 * 値がプレーンオブジェクト（配列・null を除くオブジェクト）かを判定する型ガード。
 *
 * @param value - チェック対象の値
 * @returns プレーンオブジェクトなら true
 */
function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null && !Array.isArray(value)
}
