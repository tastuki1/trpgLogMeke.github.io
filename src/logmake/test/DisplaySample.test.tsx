import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'

import { DisplaySample } from '@/logmake/components/features/DisplaySample'

describe('DisplaySample', () => {
  it('renders the legacy display style sample', () => {
    render(<DisplaySample />)

    expect(screen.getByText('表示形式サンプル')).toBeInTheDocument()
    expect(
      screen.getAllByText('情報を選ぶとこんな感じで表示されます')
    ).toHaveLength(2)
    expect(
      screen.getByText('場面を選ぶとこんな感じで表示されます')
    ).toBeInTheDocument()
  })
})
