export type GameSystem = 'CoC6' | 'CoC7'

export type CharacterStyle = 'character' | 'item' | 'scene'

export type GrowthLabel =
  | 'クリティカル'
  | 'スペシャル'
  | 'イクストリーム'
  | 'ハード'
  | 'ファンブル'
  | '故障'
  | '初期値成功'
  | '通常成功'
  | '通常失敗'

export type DiceHighlight = 'success' | 'failure'

export interface LogmakeSettings {
  logFileName: string
  title: string
  nameColor: string
  frameColor: string
  backColor: string
}

export interface TabConfig {
  name: string
  color: string
  visible: boolean
}

export interface CharacterConfig {
  name: string
  color: string
  style: CharacterStyle
}

export interface DiceEventTarget {
  name: string
  judge: string | null
  outcomeText?: string
  target?: number
}

export interface DiceEvent {
  rawText: string
  command: string
  outcomeText: string
  primaryRoll: number | null
  rolls: number[]
  targets: DiceEventTarget[]
  status: boolean
  highlight?: DiceHighlight
  meta?: Record<string, unknown>
}

export interface ContentToken {
  content: string
  highlight?: DiceHighlight
  dice?: DiceEvent
}

export interface ContentParagraph {
  tokens: ContentToken[]
}

export interface ParsedLogEntry {
  id: string
  tabName: string
  charName: string
  charColor: string
  sourceHtml: string
  paragraphs: ContentParagraph[]
}

export interface ParsedLog {
  entries: ParsedLogEntry[]
  tabs: Record<string, TabConfig>
  characters: Record<string, CharacterConfig>
  warnings: string[]
}

export interface DiceRecord {
  charName: string
  tabName: string
  ginou: string
  value: number
  status: boolean
  label: GrowthLabel
}

export interface GrowthAnalysis {
  labels: GrowthLabel[]
  byCharacter: Record<string, Partial<Record<GrowthLabel, DiceRecord[]>>>
  records: DiceRecord[]
  warnings: string[]
}

export interface ToggleVisibility {
  tabName: boolean
  value: boolean
  status: boolean
}

export interface GrowthFilters {
  labels: Record<GrowthLabel, boolean>
  visibility: ToggleVisibility
}

export interface OutputSpeakerEntry {
  charName: string
  color: string
  style: CharacterStyle
  paragraphs: ContentParagraph[]
}

export interface OutputSection {
  tabName: string
  tabColor: string
  tabVisibilityClass: string
  entries: OutputSpeakerEntry[]
}

export interface OutputToggle {
  name: string
  color: string
}

export interface OutputModel {
  sections: OutputSection[]
  toggles: OutputToggle[]
}

export interface BuildOutputOptions {
  tabs: Record<string, TabConfig>
  characters: Record<string, CharacterConfig>
}
