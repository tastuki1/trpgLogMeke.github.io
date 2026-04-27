import {
  canonicalizeTargetName,
  classifyCocHighlight,
  cleanSkillTail,
  createDiceEventTarget,
} from '@/logmake/systems/coc/shared'
import type { DiceEvent, DiceEventTarget } from '@/logmake/types'

const COMMAND_PREFIX = '(?:CC(?!B)|CBR(?!B))'
const D100_RESULT_REGEX = createD100ResultRegex(COMMAND_PREFIX)
const COMMAND_RESULT_REGEX = createCommandResultRegex(COMMAND_PREFIX)
const OPTION_REGEX = /(?:CC(?!B)|CBR(?!B))[-+0-9()]*&lt;=\d+([rhec])/i
const SKILL_SEPARATOR_REGEX = /[,，、]/
const BRACKET_ONLY_SKILL_REGEX = /^【([^】]+)】$/
const STATUS_REGEX =
  /SAN値チェック|正気度ロール|STR|CON|POW|DEX|APP|SIZ|INT|EDU|アイデア|幸運|ショックロール|知識/

interface ParsedCocDiceResult {
  command: string
  outcomeText: string
  partOutcomes: string[]
  roll: number
  tail: string
}

export function parseCoc7DiceToken(fragment: string): DiceEvent | undefined {
  const result = parseDiceResult(fragment)
  if (!result) {
    return undefined
  }

  const cocOption = fragment.match(OPTION_REGEX)?.[1] ?? ''

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
    ),
    status: STATUS_REGEX.test(fragment),
    highlight: classifyCocHighlight(result.outcomeText),
    meta: cocOption ? { cocOption } : undefined,
  }
}

function parseDiceResult(fragment: string): ParsedCocDiceResult | undefined {
  const d100Match = fragment.match(D100_RESULT_REGEX)
  if (d100Match?.groups) {
    return {
      roll: Number(d100Match.groups.roll),
      outcomeText: d100Match.groups.outcome,
      command: d100Match.groups.command,
      tail: d100Match.groups.tail,
      partOutcomes: [],
    }
  }

  const commandMatch = fragment.match(COMMAND_RESULT_REGEX)
  if (commandMatch?.groups) {
    return {
      roll: Number(commandMatch.groups.roll),
      outcomeText: commandMatch.groups.outcome,
      command: commandMatch.groups.command,
      tail: commandMatch.groups.tail,
      partOutcomes: parsePartOutcomes(commandMatch.groups.parts),
    }
  }

  return undefined
}

function parseDiceTargets(
  command: string,
  rawTail: string,
  partOutcomes: string[],
): DiceEventTarget[] {
  const tail = cleanSkillTail(rawTail)
  if (!tail) {
    return []
  }

  const commandTargets = parseCommandTargets(command)
  const bracketOnlyMatch = tail.match(BRACKET_ONLY_SKILL_REGEX)

  if (bracketOnlyMatch) {
    return [createDiceEventTarget(canonicalizeTargetName(bracketOnlyMatch[1], {}), commandTargets[0])]
  }

  if (commandTargets.length > 1) {
    const parts = tail
      .split(SKILL_SEPARATOR_REGEX)
      .map(normalizeSkillPart)
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

  return [createDiceEventTarget(canonicalizeTargetName(tail, {}), commandTargets[0])]
}

function parseCommandTargets(command: string): number[] {
  const combineMatch = command.match(/^CBR\((\d+)\s*,\s*(\d+)\)/i)
  if (combineMatch) {
    return [Number(combineMatch[1]), Number(combineMatch[2])]
  }

  const targetMatch = command.match(/&lt;=(\d+)/i)
  return targetMatch ? [Number(targetMatch[1])] : []
}

function normalizeSkillPart(part: string): string {
  const trimmed = part.trim()
  const bracketOnlyMatch = trimmed.match(BRACKET_ONLY_SKILL_REGEX)
  return canonicalizeTargetName(bracketOnlyMatch?.[1] ?? trimmed, {})
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
