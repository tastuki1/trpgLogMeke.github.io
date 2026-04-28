import { readFileSync } from 'fs'
import path from 'path'

import { describe, expect, it } from 'vitest'

import { analyzeGrowth } from '@/logmake/lib/analyzeGrowth'
import { parseLogHtml } from '@/logmake/lib/parseLogHtml'
import { graphBuckets } from '@/logmake/lib/graphBuckets'
import { getLogmakeSystem } from '@/logmake/systems'
import type { LogmakeSystem } from '@/logmake/systems'

const FIXTURE_DIR = path.resolve(__dirname, 'fixtures')
const COC6_SYSTEM = getLogmakeSystem('CoC6')
const COC7_SYSTEM = getLogmakeSystem('CoC7')

describe('analyzeGrowth', () => {
  it('classifies initial success, critical, and fumble in CoC6', () => {
    const html = readFileSync(path.join(FIXTURE_DIR, 'coc6-sample.html'), 'utf8')
    const parsed = parseLogHtml(html, COC6_SYSTEM)
    const analysis = analyzeGrowth(parsed, COC6_SYSTEM, { 目星: 25 })

    expect(analysis.byCharacter['探索者A']?.['初期値成功']).toHaveLength(2)
    expect(analysis.byCharacter['探索者A']?.['クリティカル']).toHaveLength(1)
    expect(analysis.byCharacter['探索者A']?.['ファンブル']).toHaveLength(1)
    expect(graphBuckets(analysis.records)[19]).toBe(1)
  })

  it('classifies hard, extreme, and initial success in CoC7', () => {
    const html = readFileSync(path.join(FIXTURE_DIR, 'coc7-sample.html'), 'utf8')
    const parsed = parseLogHtml(html, COC7_SYSTEM)
    const analysis = analyzeGrowth(parsed, COC7_SYSTEM, { 聞き耳: 20 })

    expect(analysis.byCharacter['探索者B']?.['ハード']).toHaveLength(1)
    expect(analysis.byCharacter['探索者B']?.['イクストリーム']).toHaveLength(1)
    expect(analysis.byCharacter['探索者B']?.['初期値成功']).toHaveLength(1)
  })

  it('uses CoC7 difficulty suffixes even when BCDice output says success', () => {
    const html = readFileSync(
      path.join(FIXTURE_DIR, 'coc7-repeat-and-cbr.html'),
      'utf8'
    )
    const parsed = parseLogHtml(html, COC7_SYSTEM)
    const analysis = analyzeGrowth(parsed, COC7_SYSTEM, {})

    expect(analysis.byCharacter['探索者B']?.['イクストリーム']).toHaveLength(2)
    expect(analysis.byCharacter['探索者B']?.['ハード']).toHaveLength(2)
    expect(analysis.byCharacter['探索者B']?.['通常失敗']).toHaveLength(3)
  })

  it('includes combination rolls and malfunction checks in growth records', () => {
    const html = readFileSync(
      path.join(FIXTURE_DIR, 'coc6-growth-and-bcdice.html'),
      'utf8'
    )
    const parsed = parseLogHtml(html, COC6_SYSTEM)
    const analysis = analyzeGrowth(parsed, COC6_SYSTEM, {
      目星: 25,
      'こぶし（パンチ）': 50,
      組み付き: 25,
    })

    expect(analysis.byCharacter['探索者A']?.['初期値成功']).toHaveLength(4)
    expect(analysis.byCharacter['探索者A']?.['クリティカル']).toHaveLength(1)
    expect(analysis.byCharacter['探索者A']?.['ファンブル']).toHaveLength(2)
    expect(analysis.byCharacter['探索者A']?.['通常成功']).toHaveLength(3)
    expect(analysis.byCharacter['探索者A']?.['通常失敗']).toHaveLength(1)
    expect(analysis.byCharacter['探索者A']?.['故障']).toHaveLength(1)
    expect(analysis.records).toHaveLength(12)
    expect(analysis.records.every((record) => record.ginou !== '')).toBe(true)
    expect(analysis.records.map((record) => record.ginou)).toEqual(
      expect.arrayContaining([
        'こぶし（パンチ）',
        'マーシャルアーツ',
        '組み付き',
        '【攻撃】対象：XX',
        '拳銃',
      ])
    )
  })

  it('returns empty growth analysis for systems without growth capability', () => {
    const html = readFileSync(path.join(FIXTURE_DIR, 'coc6-sample.html'), 'utf8')
    const systemWithoutGrowth: LogmakeSystem = {
      ...COC6_SYSTEM,
      growth: undefined,
    }
    const parsed = parseLogHtml(html, systemWithoutGrowth)
    const analysis = analyzeGrowth(parsed, systemWithoutGrowth, {})

    expect(analysis.labels).toEqual([])
    expect(analysis.records).toEqual([])
    expect(analysis.byCharacter).toEqual({})
  })
})
