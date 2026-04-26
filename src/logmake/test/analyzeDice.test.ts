import { readFileSync } from 'fs'
import path from 'path'

import { describe, expect, it } from 'vitest'

import { analyzeDice } from '@/logmake/lib/analyzeDice'
import { parseLogHtml } from '@/logmake/lib/parseLogHtml'
import { graphBuckets } from '@/logmake/lib/graphBuckets'

const FIXTURE_DIR = path.resolve(__dirname, 'fixtures')

describe('analyzeDice', () => {
  it('classifies initial success, critical, and fumble in CoC6', () => {
    const html = readFileSync(path.join(FIXTURE_DIR, 'coc6-sample.html'), 'utf8')
    const parsed = parseLogHtml(html, 'CoC6')
    const analysis = analyzeDice(parsed, 'CoC6', ['&lt;=25 【目星】'])

    expect(analysis.byCharacter['探索者A']?.['初期値成功']).toHaveLength(2)
    expect(analysis.byCharacter['探索者A']?.['クリティカル']).toHaveLength(1)
    expect(analysis.byCharacter['探索者A']?.['ファンブル']).toHaveLength(1)
    expect(graphBuckets(analysis.records)[19]).toBe(1)
  })

  it('classifies hard, extreme, and initial success in CoC7', () => {
    const html = readFileSync(path.join(FIXTURE_DIR, 'coc7-sample.html'), 'utf8')
    const parsed = parseLogHtml(html, 'CoC7')
    const analysis = analyzeDice(parsed, 'CoC7', ['&lt;=20 【聞き耳】'])

    expect(analysis.byCharacter['探索者B']?.['ハード']).toHaveLength(1)
    expect(analysis.byCharacter['探索者B']?.['イクストリーム']).toHaveLength(1)
    expect(analysis.byCharacter['探索者B']?.['初期値成功']).toHaveLength(1)
  })
})
