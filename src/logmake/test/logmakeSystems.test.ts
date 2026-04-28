import { describe, expect, it } from 'vitest'

import {
  getLogmakeSystem,
  selectableLogmakeSystems,
} from '@/logmake/systems'

describe('logmake system registry', () => {
  it('keeps selectable systems in registry order', () => {
    expect(selectableLogmakeSystems.map((system) => system.id)).toEqual([
      'CoC6',
      'CoC7',
    ])
    expect(selectableLogmakeSystems.map((system) => system.name)).toEqual([
      'CoC 6版',
      'CoC 7版',
    ])
  })

  it('exposes log parsing and growth capabilities for CoC systems', async () => {
    const coc6 = getLogmakeSystem('CoC6')
    const coc7 = getLogmakeSystem('CoC7')

    expect(coc6.log.parseToken).toEqual(expect.any(Function))
    expect(coc6.log.normalizeSource).toEqual(expect.any(Function))
    expect(coc6.growth?.loadDefaultSkillValues).toEqual(expect.any(Function))
    await expect(coc6.growth?.loadDefaultSkillValues()).resolves.toMatchObject({
      目星: 25,
      'こぶし（パンチ）': 50,
    })

    expect(coc7.log.parseToken).toEqual(expect.any(Function))
    expect(coc7.log.normalizeSource).toEqual(expect.any(Function))
    expect(coc7.growth?.loadDefaultSkillValues).toEqual(expect.any(Function))
    await expect(coc7.growth?.loadDefaultSkillValues()).resolves.toMatchObject({
      目星: 25,
      聞き耳: 20,
    })
  })
})
