import {
  BarElement,
  CategoryScale,
  Chart as ChartJS,
  Legend,
  LinearScale,
  Tooltip,
} from 'chart.js'
import { Bar } from 'react-chartjs-2'

import { GRAPH_LABELS, graphBuckets } from '@/logmake/lib/graphBuckets'
import formStyles from '@/logmake/styles/forms.module.css'
import type { CharacterConfig, GrowthAnalysis } from '@/logmake/types'

ChartJS.register(CategoryScale, LinearScale, BarElement, Tooltip, Legend)

interface GraphProps {
  analysis: GrowthAnalysis | null
  characters: Record<string, CharacterConfig>
}

export function Graph({ analysis, characters }: GraphProps) {
  if (!analysis || analysis.records.length === 0) {
    return null
  }

  const datasets = Object.keys(analysis.byCharacter).map((charName) => {
    const records = analysis.records.filter((record) => record.charName === charName)
    return {
      label: charName,
      data: graphBuckets(records),
      backgroundColor: characters[charName]?.color ?? '#6b8e23',
    }
  })

  return (
      <div className={formStyles.graphBlock} data-testid="graph-root">
        <Bar
          data={{
            labels: GRAPH_LABELS,
            datasets,
          }}
          options={{
            responsive: true,
            scales: {
              y: {
                beginAtZero: true,
                ticks: {
                  stepSize: 1,
                },
                title: {
                  display: true,
                  text: '回数',
                },
              },
              x: {
                title: {
                  display: true,
                  text: '出目',
                },
              },
            },
          }}
        />
      </div>
  )
}
