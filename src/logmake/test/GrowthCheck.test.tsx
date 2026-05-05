import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'

import { GrowthCheck } from '@/logmake/components/features/GrowthCheck'
import type { GrowthAnalysis } from '@/logmake/types'

const mockAnalysis: GrowthAnalysis = {
  labels: ['初期値成功'],
  byCharacter: {
    'テストキャラ': {
      '初期値成功': [
        { charName: 'テストキャラ', tabName: '雑談', ginou: '図書館', value: 45, status: true, label: '初期値成功' },
      ],
    },
  },
  records: [
    { charName: 'テストキャラ', tabName: '雑談', ginou: '図書館', value: 45, status: true, label: '初期値成功' },
  ],
  warnings: [],
}

describe('GrowthCheck', () => {
  it('analysis が null のとき空状態メッセージを表示する', () => {
    render(<GrowthCheck analysis={null} tabs={{}} />)

    expect(
      screen.getByText('ログを読み込むと成長判定の集計結果がここに表示されます。')
    ).toBeInTheDocument()
    expect(screen.queryByTestId('growth-summary')).not.toBeInTheDocument()
  })

  it('analysis が渡されたとき growth-summary を表示する', () => {
    render(<GrowthCheck analysis={mockAnalysis} tabs={{}} />)

    expect(screen.getByTestId('growth-summary')).toBeInTheDocument()
  })

  it('details/summary ラッパーを持たない', () => {
    const { container } = render(<GrowthCheck analysis={null} tabs={{}} />)

    expect(container.querySelector('details')).toBeNull()
    expect(container.querySelector('summary')).toBeNull()
  })
})
