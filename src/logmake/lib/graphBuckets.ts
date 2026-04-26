import type { DiceRecord } from '@/logmake/types'

export const GRAPH_LABELS = Array.from(
  { length: 20 },
  (_, index) => `${index * 5 + 1}-${(index + 1) * 5}`,
)

export function graphBuckets(records: DiceRecord[]): number[] {
  const buckets = Array.from({ length: 20 }, () => 0)

  for (const record of records) {
    const bucketIndex = Math.min(
      Math.max(Math.floor((record.value - 1) / 5), 0),
      buckets.length - 1,
    )
    buckets[bucketIndex] += 1
  }

  return buckets
}
