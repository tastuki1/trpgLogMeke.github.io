import { describe, expect, it } from 'vitest'

import { parseCoc7DiceToken } from '@/logmake/systems/coc/coc7DiceExtractor'

describe('parseCoc7DiceToken', () => {
  it('returns undefined for non-dice fragments', () => {
    expect(parseCoc7DiceToken('ただの会話テキスト')).toBeUndefined()
    expect(parseCoc7DiceToken('')).toBeUndefined()
    expect(parseCoc7DiceToken('CC&lt;=50 【目星】')).toBeUndefined()
  })

  it('parses a D100 success result', () => {
    const result = parseCoc7DiceToken(
      'CC&lt;=20 【聞き耳】 (1D100&lt;=20) ボーナス・ペナルティダイス[0] ＞ 17, 17 ＞ 17 ＞ 成功'
    )
    expect(result).toBeDefined()
    expect(result?.primaryRoll).toBe(17)
    expect(result?.outcomeText).toBe('成功')
    expect(result?.highlight).toBe('success')
    expect(result?.targets).toHaveLength(1)
    expect(result?.targets[0].name).toBe('聞き耳')
  })

  it('parses a D100 hard success result', () => {
    const result = parseCoc7DiceToken(
      'CC&lt;=50h 【目星】 (1D100&lt;=50) ボーナス・ペナルティダイス[0] ＞ 25, 10 ＞ 10 ＞ ハード成功'
    )
    expect(result?.outcomeText).toBe('ハード成功')
    expect(result?.highlight).toBe('success')
    expect(result?.meta).toEqual({ cocOption: 'h' })
  })

  it('parses CoC7 bonus dice shorthand without parentheses', () => {
    const result = parseCoc7DiceToken(
      'CC1&lt;=50 【目星】 (1D100&lt;=50) ボーナス・ペナルティダイス[1] ＞ 25, 5 ＞ 5 ＞ イクストリーム成功'
    )

    expect(result?.command).toBe('CC1&lt;=50')
    expect(result?.targets[0]?.name).toBe('目星')
    expect(result?.primaryRoll).toBe(5)
    expect(result?.outcomeText).toBe('イクストリーム成功')
  })

  it('parses a D100 extreme success result', () => {
    const result = parseCoc7DiceToken(
      'CC&lt;=50e 【目星】 (1D100&lt;=50) ボーナス・ペナルティダイス[0] ＞ 24, 5 ＞ 5 ＞ イクストリーム成功'
    )
    expect(result?.outcomeText).toBe('イクストリーム成功')
    expect(result?.meta).toEqual({ cocOption: 'e' })
  })

  it('parses a critical success', () => {
    const result = parseCoc7DiceToken(
      'CC&lt;=50c 【目星】 (1D100&lt;=50) ボーナス・ペナルティダイス[0] ＞ 1, 1 ＞ 1 ＞ クリティカル'
    )
    expect(result?.outcomeText).toBe('クリティカル')
    expect(result?.highlight).toBe('success')
  })

  it('parses a fumble result', () => {
    const result = parseCoc7DiceToken(
      'CC&lt;=50 【目星】 (1D100&lt;=50) ボーナス・ペナルティダイス[0] ＞ 100, 100 ＞ 100 ＞ ファンブル'
    )
    expect(result?.outcomeText).toBe('ファンブル')
    expect(result?.highlight).toBe('failure')
    expect(result?.primaryRoll).toBe(100)
  })

  it('parses a failure result', () => {
    const result = parseCoc7DiceToken(
      'CC&lt;=20 【聞き耳】 (1D100&lt;=20) ボーナス・ペナルティダイス[0] ＞ 55, 55 ＞ 55 ＞ 失敗'
    )
    expect(result?.outcomeText).toBe('失敗')
    expect(result?.highlight).toBe('failure')
  })

  it('parses a CBR combination roll', () => {
    const result = parseCoc7DiceToken(
      'CBR(50,20) ＞ 100[失敗,失敗] ＞ ファンブル'
    )
    expect(result).toBeDefined()
    expect(result?.primaryRoll).toBe(100)
    expect(result?.outcomeText).toBe('ファンブル')
  })

  it('does not apply skill aliases (CoC7 has no aliases)', () => {
    const result = parseCoc7DiceToken(
      'CC&lt;=50 ma (1D100&lt;=50) ボーナス・ペナルティダイス[0] ＞ 30, 30 ＞ 30 ＞ 成功'
    )
    expect(result?.targets[0]?.name).toBe('ma')
  })

  it('trims bracket-only skill names', () => {
    const result = parseCoc7DiceToken(
      'CC&lt;=60 【目星】 (1D100&lt;=60) ボーナス・ペナルティダイス[0] ＞ 20, 20 ＞ 20 ＞ 成功'
    )
    expect(result?.targets[0]?.name).toBe('目星')
  })

  it('does not match CoC6-only commands like CCB or RESB', () => {
    expect(
      parseCoc7DiceToken(
        'CCB&lt;=50 【目星】 (1D100&lt;=50) ボーナス・ペナルティダイス[0] ＞ 20, 20 ＞ 20 ＞ 成功'
      )
    ).toBeUndefined()
    expect(parseCoc7DiceToken('RESB&lt;=50 体力 ＞ 30 ＞ 成功')).toBeUndefined()
  })
})
