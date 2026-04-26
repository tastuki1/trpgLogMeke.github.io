import { isPrimaryTab } from '@/logmake/lib/defaults'
import type {
  BuildOutputOptions,
  OutputModel,
  OutputSection,
  ParsedLog,
} from '@/logmake/types'

export function buildOutputModel(
  parsedLog: ParsedLog,
  options: BuildOutputOptions
): OutputModel {
  const sections: OutputSection[] = []
  const toggles = Object.values(options.tabs)
    .filter((tab) => !isPrimaryTab(tab.name) && tab.visible)
    .map((tab) => ({ name: tab.name, color: tab.color }))

  for (const entry of parsedLog.entries) {
    const tab = options.tabs[entry.tabName]
    if (!tab?.visible) {
      continue
    }

    const character = options.characters[entry.charName] ?? {
      name: entry.charName,
      color: entry.charColor,
      style: 'item' as const,
    }

    let currentSection = sections[sections.length - 1]
    if (!currentSection || currentSection.tabName !== entry.tabName) {
      currentSection = {
        tabName: entry.tabName,
        tabColor: tab.color,
        tabVisibilityClass: `${entry.tabName} tab`,
        entries: [],
      }
      sections.push(currentSection)
    }

    let currentSpeaker =
      currentSection.entries[currentSection.entries.length - 1]
    if (!currentSpeaker || currentSpeaker.charName !== entry.charName) {
      currentSpeaker = {
        charName: entry.charName,
        color: character.color,
        style: character.style,
        paragraphs: [],
      }
      currentSection.entries.push(currentSpeaker)
    }

    currentSpeaker.paragraphs.push(...entry.paragraphs)
  }

  return { sections, toggles }
}
