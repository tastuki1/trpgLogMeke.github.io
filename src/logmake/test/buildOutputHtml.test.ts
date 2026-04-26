import { readFileSync } from 'fs'
import path from 'path'

import { describe, expect, it } from 'vitest'

import { buildOutputHtml } from '@/logmake/lib/buildOutputHtml'
import { buildOutputModel } from '@/logmake/lib/buildOutputModel'
import { createDefaultSettings } from '@/logmake/lib/defaults'
import { parseLogHtml } from '@/logmake/lib/parseLogHtml'

const FIXTURE_DIR = path.resolve(__dirname, 'fixtures')

describe('buildOutputHtml', () => {
  it('renders output model content and tab toggles into a standalone html string', () => {
    const html = readFileSync(
      path.join(FIXTURE_DIR, 'coc6-sample.html'),
      'utf8'
    )
    const parsed = parseLogHtml(html, 'CoC6')
    const outputModel = buildOutputModel(parsed, {
      tabs: parsed.tabs,
      characters: parsed.characters,
    })

    const output = buildOutputHtml(outputModel, {
      ...createDefaultSettings('sample-log'),
      title: 'テストログ',
    })

    expect(output).toContain('<title>sample-log</title>')
    expect(output).toContain('テストログ')
    expect(output).toContain('探索者A')
    expect(output).toContain('雑談')
    expect(output).toContain('linear-gradient(transparent 70%, #ff7f7f 0%)')
  })
})
