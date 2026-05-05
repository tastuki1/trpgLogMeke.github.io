import {
  BarElement,
  CategoryScale,
  Chart as ChartJS,
  Legend,
  LinearScale,
  Tooltip,
} from 'chart.js'
import { useRef, useState } from 'react'
import { Bar } from 'react-chartjs-2'

import { GRAPH_LABELS, graphBuckets } from '@/logmake/lib/graphBuckets'
import formStyles from '@/logmake/styles/forms.module.css'
import type { CharacterConfig, GrowthAnalysis } from '@/logmake/types'

ChartJS.register(CategoryScale, LinearScale, BarElement, Tooltip, Legend)

type GraphType = 'grouped' | 'stacked'

interface GraphProps {
  analysis: GrowthAnalysis | null
  characters: Record<string, CharacterConfig>
}

export function Graph({ analysis, characters }: GraphProps) {
  const [graphType, setGraphType] = useState<GraphType>('grouped')
  const chartRef = useRef<ChartJS<'bar'>>(null)

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

  const isStacked = graphType === 'stacked'

  function handleDownload() {
    const canvas = chartRef.current?.canvas
    if (!canvas) return
    const link = document.createElement('a')
    link.download = 'graph.png'
    link.href = canvas.toDataURL('image/png')
    link.click()
  }

  return (
    <div className={formStyles.graphBlock} data-testid="graph-root">
      <div className={formStyles.graphControls}>
        <label className={formStyles.radioLabel}>
          <input
            type="radio"
            name="graph-type"
            checked={graphType === 'grouped'}
            onChange={() => setGraphType('grouped')}
          />
          グループ棒グラフ
        </label>
        <label className={formStyles.radioLabel}>
          <input
            type="radio"
            name="graph-type"
            checked={graphType === 'stacked'}
            onChange={() => setGraphType('stacked')}
          />
          積み上げ棒グラフ
        </label>
        <button
          className={formStyles.secondaryButton}
          type="button"
          onClick={handleDownload}
        >
          PNG ダウンロード
        </button>
      </div>
      <Bar
        ref={chartRef}
        data={{
          labels: GRAPH_LABELS,
          datasets,
        }}
        options={{
          responsive: true,
          scales: {
            x: {
              stacked: isStacked,
              title: { display: true, text: '出目' },
            },
            y: {
              stacked: isStacked,
              beginAtZero: true,
              ticks: { stepSize: 1 },
              title: { display: true, text: '回数' },
            },
          },
        }}
      />
    </div>
  )
}
