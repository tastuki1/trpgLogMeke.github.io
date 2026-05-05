import { render, screen } from '@testing-library/react'
import { describe, expect, it, vi } from 'vitest'

import { CharacterSettings } from '@/logmake/components/features/CharacterSettings'
import type { CharacterConfig } from '@/logmake/types'

const characters: Record<string, CharacterConfig> = {
  '雑談メモ': {
    name: '雑談メモ',
    color: '#333333',
    style: 'item',
  },
  '探索者B': {
    name: '探索者B',
    color: '#222222',
    style: 'character',
  },
  '場面A': {
    name: '場面A',
    color: '#444444',
    style: 'scene',
  },
  '探索者A': {
    name: '探索者A',
    color: '#111111',
    style: 'character',
  },
}

describe('CharacterSettings', () => {
  it('人物を先頭にし、同じ種別内ではキャラクタ名で表示順を固定する', () => {
    render(
      <CharacterSettings
        characters={characters}
        onColorChange={vi.fn()}
        onStyleChange={vi.fn()}
      />
    )

    const explorerA = screen.getByText('探索者A')
    const explorerB = screen.getByText('探索者B')
    const memo = screen.getByText('雑談メモ')
    const scene = screen.getByText('場面A')

    expect(isBefore(explorerA, explorerB)).toBe(true)
    expect(isBefore(explorerB, memo)).toBe(true)
    expect(isBefore(memo, scene)).toBe(true)
  })
})

function isBefore(a: Element, b: Element): boolean {
  return Boolean(a.compareDocumentPosition(b) & Node.DOCUMENT_POSITION_FOLLOWING)
}
