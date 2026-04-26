import {
  createBaseTabs,
  createTabConfig,
  getTabDisplayName,
  STATUS_REGEX,
} from '@/logmake/lib/defaults'
import { normalizeLogSource } from '@/logmake/lib/normalizeSourceHtml'
import type {
  CharacterConfig,
  ContentParagraph,
  ContentToken,
  GameSystem,
  ParsedDiceOccurrence,
  ParsedLog,
} from '@/logmake/types'

const ENTRY_REGEX =
  /<p style="color:(#[0-9a-fA-F]{6});">\s*<span>\s*\[(.+?)\]<\/span>\s*<span>(.*?)<\/span>\s*:\s*<span>\s*([\s\S]*?)\s*<\/span>\s*<\/p>/g

const DICE_REGEX =
  /\(1D100&lt;=\d+\)(?: ボーナス・ペナルティダイス\[-?\d+\] ＞ [\d,\s]+)? ＞ (\d+) ＞ (.*)/

const OPTION_REGEX =
  /(?:CCB|CC|RESB|RES|CBR)[-+0-9()]*&lt;=\d+([crhe])/i

const JUDGE_REGEX = /&lt;=\d+[crhe]* 【[^】]+】/
const SKILL_REGEX = /【([^】]+)】/

export function parseLogHtml(rawHtml: string, system: GameSystem): ParsedLog {
  const tabs = createBaseTabs()
  const warnings: string[] = []
  const entries = []
  const characterOrder: string[] = []
  const characterSeenCount: Record<string, number> = {}
  const characterColors: Record<string, string> = {}

  const matches = rawHtml.matchAll(ENTRY_REGEX)

  for (const [index, match] of Array.from(matches).entries()) {
    const [, color, rawTabName, rawCharName, rawContent] = match
    const tabName = getTabDisplayName(rawTabName.trim())
    const charName = rawCharName.trim()
    const normalizedContent = normalizeLogSource(rawContent, system)

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
      paragraphs: parseParagraphs(normalizedContent, tabName, charName, system),
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

function parseParagraphs(
  content: string,
  tabName: string,
  charName: string,
  system: GameSystem,
): ContentParagraph[] {
  const paragraphs: ContentParagraph[] = []
  let currentTokens: ContentToken[] = []

  for (const fragment of content.split('<br>')) {
    if (fragment.trim() === '') {
      if (currentTokens.length > 0) {
        paragraphs.push({ tokens: currentTokens })
      }
      currentTokens = []
      continue
    }

    currentTokens.push({
      content: fragment,
      ...(parseDiceOccurrence(fragment, tabName, charName, system) ?? {}),
    })
  }

  if (currentTokens.length > 0) {
    paragraphs.push({ tokens: currentTokens })
  }

  return paragraphs
}

function parseDiceOccurrence(
  fragment: string,
  _tabName: string,
  _charName: string,
  _system: GameSystem,
): Pick<ContentToken, 'dice' | 'highlight'> | undefined {
  const match = fragment.match(DICE_REGEX)
  if (!match) {
    return undefined
  }

  const dice: ParsedDiceOccurrence = {
    rawText: fragment,
    roll: Number(match[1]),
    skill: fragment.match(SKILL_REGEX)?.[1] ?? '',
    judge: normalizeJudge(fragment.match(JUDGE_REGEX)?.[0] ?? null),
    option: fragment.match(OPTION_REGEX)?.[1] ?? '',
    outcomeText: match[2],
    status: STATUS_REGEX.test(fragment),
    highlight: classifyHighlight(match[2]),
  }

  return {
    dice: {
      ...dice,
      rawText: fragment,
      skill: dice.skill,
      status: dice.status,
    },
    highlight: dice.highlight,
  }
}

function classifyHighlight(outcomeText: string) {
  if (
    /クリティカル|決定的成功|スペシャル|イクストリーム成功|ハード成功|成功/.test(
      outcomeText,
    )
  ) {
    return 'success' as const
  }

  if (/失敗|ファンブル|致命的失敗/.test(outcomeText)) {
    return 'failure' as const
  }

  return undefined
}

function normalizeJudge(judge: string | null): string | null {
  if (!judge) {
    return null
  }

  return judge.replace(/&lt;=(\d+)[crhe](?= 【)/i, '&lt;=$1')
}
