import {
  createBaseTabs,
  createTabConfig,
  getTabDisplayName,
} from '@/logmake/lib/defaults'
import type { LogmakeSystem } from '@/logmake/systems'
import type {
  CharacterConfig,
  ContentParagraph,
  ContentToken,
  ParsedLog,
} from '@/logmake/types'

const BR_TAG_REGEX = /<br\s*\/?>/i
const COLOR_STYLE_REGEX = /(?:^|;)\s*color\s*:\s*(#[0-9a-fA-F]{6})\s*(?:;|$)/

interface RawLogEntry {
  color: string
  rawTabName: string
  charName: string
  rawContent: string
}

export function parseLogHtml(rawHtml: string, system: LogmakeSystem): ParsedLog {
  const tabs = createBaseTabs()
  const warnings: string[] = []
  const entries = []
  const characterOrder: string[] = []
  const characterSeenCount: Record<string, number> = {}
  const characterColors: Record<string, string> = {}

  for (const [index, entry] of readRawEntries(rawHtml).entries()) {
    const { color, rawTabName, charName, rawContent } = entry
    const tabName = getTabDisplayName(rawTabName.trim())
    const normalizedContent = system.log.normalizeSource(rawContent)

    if (!tabs[tabName]) {
      tabs[tabName] = createTabConfig(tabName)
    }

    if (!characterSeenCount[charName]) {
      characterOrder.push(charName)
      characterSeenCount[charName] = 0
    }

    characterSeenCount[charName] += 1
    characterColors[charName] = color

    entries.push({
      id: `${tabName}-${charName}-${index}`,
      tabName,
      charName,
      charColor: color,
      sourceHtml: normalizedContent,
      paragraphs: parseParagraphs(normalizedContent, system),
    })
  }

  if (entries.length === 0) {
    warnings.push(
      'ログ形式を解析できませんでした。CCFOLIA出力HTMLか、対象範囲の形式を確認してください。',
    )
  }

  const characters = characterOrder.reduce<Record<string, CharacterConfig>>(
    (result, charName) => {
      result[charName] = {
        name: charName,
        color: characterColors[charName],
        style: characterSeenCount[charName] > 1 ? 'character' : 'item',
      }
      return result
    },
    {},
  )

  return {
    entries,
    tabs,
    characters,
    warnings,
  }
}

function readRawEntries(rawHtml: string): RawLogEntry[] {
  const document = new DOMParser().parseFromString(rawHtml, 'text/html')
  const paragraphs = Array.from(document.querySelectorAll('p'))

  return paragraphs
    .map(readRawEntry)
    .filter((entry): entry is RawLogEntry => entry !== null)
}

function readRawEntry(paragraph: HTMLParagraphElement): RawLogEntry | null {
  const color = readSpeakerColor(paragraph)
  const spans = Array.from(paragraph.children).filter(isSpanElement)

  if (!color || spans.length < 3) {
    return null
  }

  const rawTabName = readTabName(spans[0].textContent ?? '')
  const charName = (spans[1].textContent ?? '').trim()
  const rawContent = spans[2].innerHTML.trim()

  if (!rawTabName || !charName || !rawContent) {
    return null
  }

  return {
    color,
    rawTabName,
    charName,
    rawContent,
  }
}

function isSpanElement(element: Element): element is HTMLSpanElement {
  return element.tagName.toLowerCase() === 'span'
}

function readSpeakerColor(paragraph: HTMLParagraphElement): string | null {
  return paragraph.getAttribute('style')?.match(COLOR_STYLE_REGEX)?.[1] ?? null
}

function readTabName(tabLabel: string): string {
  const trimmed = tabLabel.trim()
  return (trimmed.match(/^\[(.*)\]$/s)?.[1] ?? trimmed).trim()
}

function parseParagraphs(
  content: string,
  system: LogmakeSystem,
): ContentParagraph[] {
  const paragraphs: ContentParagraph[] = []
  let currentTokens: ContentToken[] = []

  for (const fragment of content.split(BR_TAG_REGEX)) {
    if (fragment.trim() === '') {
      if (currentTokens.length > 0) {
        paragraphs.push({ tokens: currentTokens })
      }
      currentTokens = []
      continue
    }

    const dice = system.log.parseToken(fragment)
    currentTokens.push({
      content: fragment,
      ...(dice ? { dice, highlight: dice.highlight } : {}),
    })
  }

  if (currentTokens.length > 0) {
    paragraphs.push({ tokens: currentTokens })
  }

  return paragraphs
}
