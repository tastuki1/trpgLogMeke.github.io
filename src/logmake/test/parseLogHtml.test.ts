import { readFileSync } from 'fs'
import path from 'path'

import { describe, expect, it } from 'vitest'

import { parseLogHtml } from '@/logmake/lib/parseLogHtml'

const FIXTURE_DIR = path.resolve(__dirname, 'fixtures')

describe('parseLogHtml', () => {
  it('parses entries, tabs, characters, and expands x-roll lines', () => {
    const html = readFileSync(path.join(FIXTURE_DIR, 'coc6-sample.html'), 'utf8')
    const parsed = parseLogHtml(html, 'CoC6')

    expect(parsed.entries).toHaveLength(3)
    expect(Object.keys(parsed.tabs)).toEqual(['メイン', '情報', '雑談'])
    expect(parsed.characters['探索者A']?.style).toBe('character')
    expect(parsed.characters['古文書']?.style).toBe('item')
    expect(parsed.entries[1].paragraphs[0].tokens).toHaveLength(3)
    expect(parsed.entries[1].paragraphs[0].tokens[1].dice?.skill).toBe('目星')
    expect(parsed.warnings).toHaveLength(0)
  })
})
