export type DefaultSkillValueMap = Record<string, number>

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

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null && !Array.isArray(value)
}
