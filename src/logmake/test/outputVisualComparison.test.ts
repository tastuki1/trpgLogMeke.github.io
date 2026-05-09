import { readFileSync } from 'fs'
import path from 'path'

import { describe, expect, it } from 'vitest'

import { createDefaultSettings } from '@/logmake/lib/defaults'
import { parseLogHtml } from '@/logmake/lib/parseLogHtml'
import { getLogmakeSystem } from '@/logmake/systems'
import {
  buildCandidateCombinedComparisonHtml,
  buildLegacyComparisonHtml,
  buildSpeakerAfterLineComparisonHtml,
  buildSpeakerBodyGuideComparisonHtml,
  buildVisualComparisonOutputModel,
} from '@/logmake/test/outputVisualComparison'

const FIXTURE_DIR = path.resolve(__dirname, 'fixtures')
const COC6_SYSTEM = getLogmakeSystem('CoC6')

describe('output visual comparison helpers', () => {
  it('uses a fixture with multiple speakers, primary tabs, an auxiliary tab, and dice highlights', () => {
    const html = readComparisonFixture()
    const parsed = parseLogHtml(html, COC6_SYSTEM)

    expect(Object.keys(parsed.tabs)).toEqual(['メイン', '情報', '雑談'])
    expect(Object.keys(parsed.characters)).toEqual([
      '探索者A',
      '探索者B',
      'KP',
      'GM',
      '話者なし',
      '場面：地下室前',
      '淡色の探索者',
      '鮮烈な探索者',
      '古い日記',
      '雑談メモ',
      '手がかりメモ',
    ])
    expect(parsed.entries.some((entry) => entry.charName === 'GM')).toBe(true)
    expect(parsed.entries.some((entry) => entry.charName === '話者なし')).toBe(
      true,
    )
    expect(
      parsed.entries.some((entry) => entry.charName === '場面：地下室前'),
    ).toBe(true)
    expect(parsed.entries.some((entry) => entry.tabName === '雑談')).toBe(true)
    expect(
      parsed.entries.some(
        (entry) => entry.tabName === '雑談' && entry.charName === '探索者B',
      ),
    ).toBe(true)
    expect(
      parsed.entries.some((entry) =>
        entry.paragraphs.some((paragraph) =>
          paragraph.tokens.some((token) => token.highlight === 'failure'),
        ),
      ),
    ).toBe(true)
    expect(
      parsed.entries.some((entry) =>
        entry.paragraphs.some((paragraph) =>
          paragraph.tokens.some((token) => token.highlight === 'success'),
        ),
      ),
    ).toBe(true)
  })

  it('applies comparison-only style overrides for the fixture model', () => {
    const outputModel = buildComparisonModel()
    const entries = outputModel.sections.flatMap((section) => section.entries)

    expect(entries.find((entry) => entry.charName === '淡色の探索者')?.style).toBe(
      'character',
    )
    expect(
      entries.find((entry) => entry.charName === '鮮烈な探索者')?.style,
    ).toBe('character')
    expect(
      entries.find((entry) => entry.charName === '場面：地下室前')?.style,
    ).toBe('scene')
  })

  it('renders the trimmed comparison variants from the same model', () => {
    const outputModel = buildComparisonModel()
    const settings = createDefaultSettings('comparison')
    const legacy = buildLegacyComparisonHtml(outputModel, {
      ...settings,
      title: '旧表示',
    })
    const afterLine = buildSpeakerAfterLineComparisonHtml(outputModel, {
      ...settings,
      title: '名前後ろライン',
    })
    const bodyGuide = buildSpeakerBodyGuideComparisonHtml(outputModel, {
      ...settings,
      title: '本文ガイド',
    })
    const candidate = buildCandidateCombinedComparisonHtml(outputModel, {
      ...settings,
      title: '統合候補',
    })

    expect(legacy).toContain('<div class="box5">')
    expect(legacy).toContain('<div class="char" style="color: #228b22;">')
    expect(legacy).toContain('<div class="tab log-tab-0"')
    expect(legacy).toContain('padding: .5rem .75rem;')
    expect(legacy).not.toContain('padding: .5rem 1.5rem .5rem 1rem;')
    expect(afterLine).toContain('speaker name after-line marker')
    expect(afterLine).toContain(
      'keep speaker names colored, but read body text in the base color',
    )
    expect(afterLine).toContain('display: inline-flex;')
    expect(afterLine).toContain('flex: 0 0 clamp(2rem, 8vw, 4.5rem);')
    expect(afterLine).toContain(
      'border-block-start: 2px solid var(--log-speaker-color);',
    )
    expect(bodyGuide).toContain('speaker body guide marker')
    expect(bodyGuide).toContain('margin-inline-start: .5rem;')
    expect(bodyGuide).toContain('padding-inline-start: .75rem;')
    expect(bodyGuide).toContain(
      'border-inline-start: 2px solid color-mix(in srgb, var(--log-speaker-color) 38%, transparent);',
    )
    expect(bodyGuide).not.toContain('text-decoration-line: underline;')
    expect(candidate).toContain('speaker name underline marker')
    expect(candidate).not.toContain('speaker name after-line marker')
    expect(candidate).toContain(
      'narration is quiet text without an extra line marker',
    )
    expect(candidate).toContain('margin: .85rem 1rem .85rem .5rem;')
    expect(candidate).toContain('padding-inline: 0 .5rem;')
    expect(candidate).toContain('border-inline-start: 0;')
    expect(candidate).toContain('color: #555555;')
    expect(candidate).toContain('<h3 class="log-scene">場面：地下室前</h3>')
    expect(candidate).toContain('compact and slightly stronger info blocks')
  })

  it('keeps the combined candidate readable in dark mode', () => {
    const candidate = buildCandidateCombinedComparisonHtml(
      buildComparisonModel(),
      {
        ...createDefaultSettings('comparison'),
        darkMode: true,
      },
    )

    expect(candidate).toContain('color: #d0d0d0;')
    expect(candidate).toContain('color: #b8b8b8;')
    expect(candidate).toContain('border-inline-start: 0;')
    expect(candidate).toContain(
      'linear-gradient(transparent 70%, rgba(127, 191, 255, 0.72) 0%)',
    )
    expect(candidate).toContain(
      'linear-gradient(transparent 70%, rgba(255, 127, 127, 0.74) 0%)',
    )
  })
})

function readComparisonFixture(): string {
  return readFileSync(
    path.join(FIXTURE_DIR, 'coc6-output-visual-comparison.html'),
    'utf8',
  )
}

function buildComparisonModel() {
  const parsed = parseLogHtml(readComparisonFixture(), COC6_SYSTEM)
  return buildVisualComparisonOutputModel(parsed)
}
