import { render, screen } from '@testing-library/react'
import { describe, expect, it, vi } from 'vitest'

import { FileUpload } from '@/logmake/components/features/FileUpload'

describe('FileUpload', () => {
  it('選択中のログ表示エリアに未選択状態を表示する', () => {
    render(
      <FileUpload
        sourceFileName={null}
        system="CoC6"
        onFileSelect={vi.fn()}
        onSystemChange={vi.fn()}
      />
    )

    expect(screen.getByLabelText('選択中のログ')).toHaveTextContent(
      'ログ未選択'
    )
  })

  it('選択中のログ表示エリアにファイル名を表示する', () => {
    render(
      <FileUpload
        sourceFileName="session-log.html"
        system="CoC6"
        onFileSelect={vi.fn()}
        onSystemChange={vi.fn()}
      />
    )

    expect(screen.getByLabelText('選択中のログ')).toHaveTextContent(
      'session-log.html'
    )
  })
})
