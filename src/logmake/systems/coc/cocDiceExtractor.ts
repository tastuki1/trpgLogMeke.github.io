import {
  canonicalizeTargetName,
  classifyCocHighlight,
  cleanSkillTail,
  createDiceEventTarget,
} from '@/logmake/systems/coc/shared'
import type { DiceEvent, DiceEventTarget } from '@/logmake/types'

export interface CocDiceExtractorConfig {
  commandPrefix: string
  optionRegex: RegExp
  combineCommandPattern: RegExp
  skillAliases: Record<string, string>
}

interface ParsedCocDiceResult {
  command: string
  outcomeText: string
  partOutcomes: string[]
  roll: number
  tail: string
}

const SKILL_SEPARATOR_REGEX = /[,，、]/
const BRACKET_ONLY_SKILL_REGEX = /^【([^】]+)】$/
const STATUS_REGEX =
  /SAN値チェック|正気度ロール|STR|CON|POW|DEX|APP|SIZ|INT|EDU|アイデア|幸運|ショックロール|知識/

export function createCocDiceExtractor(
  config: CocDiceExtractorConfig,
): (fragment: string) => DiceEvent | undefined {
  const d100ResultRegex = createD100ResultRegex(config.commandPrefix)
  const commandResultRegex = createCommandResultRegex(config.commandPrefix)

  return function parseCocDiceToken(fragment: string): DiceEvent | undefined {
    const result = parseDiceResult(fragment, d100ResultRegex, commandResultRegex)
    if (!result) {
      return undefined
    }

    const cocOption = fragment.match(config.optionRegex)?.[1] ?? ''

    return {
      rawText: fragment,
      command: result.command,
      outcomeText: result.outcomeText,
      primaryRoll: result.roll,
      rolls: [result.roll],
      targets: parseDiceTargets(
        result.command,
        result.tail,
        result.partOutcomes,
        config,
      ),
      status: STATUS_REGEX.test(fragment),
      highlight: classifyCocHighlight(result.outcomeText),
      meta: cocOption ? { cocOption } : undefined,
    }
  }
}

function parseDiceResult(
  fragment: string,
  d100ResultRegex: RegExp,
  commandResultRegex: RegExp,
): ParsedCocDiceResult | undefined {
  const d100Match = fragment.match(d100ResultRegex)
  if (d100Match?.groups) {
    const { roll, outcome, command, tail } = d100Match.groups
    if (roll === undefined || outcome === undefined || command === undefined || tail === undefined) {
      return undefined
    }
    return {
      roll: Number(roll),
      outcomeText: outcome,
      command,
      tail,
      partOutcomes: [],
    }
  }

  const commandMatch = fragment.match(commandResultRegex)
  if (commandMatch?.groups) {
    const { roll, outcome, command, tail } = commandMatch.groups
    if (roll === undefined || outcome === undefined || command === undefined || tail === undefined) {
      return undefined
    }
    return {
      roll: Number(roll),
      outcomeText: outcome,
      command,
      tail,
      partOutcomes: parsePartOutcomes(commandMatch.groups.parts),
    }
  }

  return undefined
}

function parseDiceTargets(
  command: string,
  rawTail: string,
  partOutcomes: string[],
  config: CocDiceExtractorConfig,
): DiceEventTarget[] {
  const tail = cleanSkillTail(rawTail)
  if (!tail) {
    return []
  }

  const commandTargets = parseCommandTargets(command, config.combineCommandPattern)
  const bracketOnlyMatch = tail.match(BRACKET_ONLY_SKILL_REGEX)

  if (bracketOnlyMatch) {
    const name = canonicalizeTargetName(bracketOnlyMatch[1], config.skillAliases)
    return [createDiceEventTarget(name, commandTargets[0])]
  }

  if (commandTargets.length > 1) {
    const parts = tail
      .split(SKILL_SEPARATOR_REGEX)
      .map((part) => normalizeSkillPart(part, config.skillAliases))
      .filter(Boolean)

    if (parts.length === commandTargets.length) {
      return parts.map((name, index) =>
        createDiceEventTarget(name, commandTargets[index], partOutcomes[index]),
      )
    }

    return [{ name: tail, judge: null }]
  }

  if (/^【[^】]+】/.test(tail)) {
    return [{ name: tail, judge: null }]
  }

  return [createDiceEventTarget(canonicalizeTargetName(tail, config.skillAliases), commandTargets[0])]
}

function parseCommandTargets(command: string, combinePattern: RegExp): number[] {
  const combineMatch = command.match(combinePattern)
  if (combineMatch) {
    return [Number(combineMatch[1]), Number(combineMatch[2])]
  }

  const targetMatch = command.match(/&lt;=(\d+)/i)
  return targetMatch ? [Number(targetMatch[1])] : []
}

function normalizeSkillPart(part: string, aliases: Record<string, string>): string {
  const trimmed = part.trim()
  const bracketOnlyMatch = trimmed.match(BRACKET_ONLY_SKILL_REGEX)
  return canonicalizeTargetName(bracketOnlyMatch?.[1] ?? trimmed, aliases)
}

function createD100ResultRegex(commandPrefix: string): RegExp {
  return new RegExp(
    [
      '^\\s*',
      `(?<command>${commandPrefix}[^\\s＞]*)`,
      '\\s*(?<tail>.*?)\\s*',
      '\\(1D100&lt;=\\d+\\)',
      '(?: ボーナス・ペナルティダイス\\[-?\\d+\\] ＞ [\\d,\\s]+)?',
      ' ＞ (?<roll>\\d+) ＞ (?<outcome>.*)$',
    ].join(''),
    'i',
  )
}

function createCommandResultRegex(commandPrefix: string): RegExp {
  return new RegExp(
    [
      '^\\s*',
      `(?<command>${commandPrefix}[^\\s＞]*)`,
      '\\s*(?<tail>.*?)\\s*',
      '＞\\s*(?<roll>\\d+)',
      '(?:\\[(?<parts>[^\\]]+)\\])?',
      '\\s*＞\\s*(?<outcome>.*)$',
    ].join(''),
    'i',
  )
}

function parsePartOutcomes(rawParts: string | undefined): string[] {
  return rawParts
    ? rawParts
        .split(SKILL_SEPARATOR_REGEX)
        .map((part) => part.trim())
        .filter(Boolean)
    : []
}
