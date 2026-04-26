import type { GrowthAnalysis, GrowthFilters } from '@/logmake/types'

export function buildGrowthSummaryText(
  analysis: GrowthAnalysis,
  filters: GrowthFilters,
  visibleTabs: Record<string, boolean>,
): string {
  const sections: string[] = []

  for (const [charName, entriesByLabel] of Object.entries(analysis.byCharacter)) {
    const lines: string[] = []

    for (const label of analysis.labels) {
      if (!filters.labels[label]) {
        continue
      }

      const records = entriesByLabel[label] ?? []
      const visibleRecords = records.filter(
        (record) =>
          visibleTabs[record.tabName] !== false &&
          (filters.visibility.status || !record.status),
      )

      if (visibleRecords.length === 0) {
        continue
      }

      lines.push(`◯${label}`)
      for (const record of visibleRecords) {
        const parts = [
          filters.visibility.tabName ? `[${record.tabName}]` : '',
          record.ginou,
          filters.visibility.value ? `＞ ${record.value}` : '',
        ].filter(Boolean)
        lines.push(parts.join(' '))
      }
      lines.push('')
    }

    if (lines.length > 0) {
      sections.push(`＜${charName}＞\n${lines.join('\n').trimEnd()}`)
    }
  }

  return sections.join('\n\n').trim()
}
