const OMIKUJI_REGEX = /今日のあなたの運勢は……？ \n【.*】/g

export interface SourceNormalizerOptions {
  multiRollRegex: RegExp
  skillMultiRollRegex: RegExp
}

export function createLogSourceNormalizer({
  multiRollRegex,
  skillMultiRollRegex,
}: SourceNormalizerOptions): (content: string) => string {
  return (content) => {
    let normalized = content.replace(/\r\n/g, '\n')

    normalized = normalized.replace(multiRollRegex, (block: string) =>
      normalizeMultiRollBlock(block, skillMultiRollRegex),
    )

    return normalized.replace(OMIKUJI_REGEX, (block: string) =>
      block.replace(/\n/g, '<br>'),
    )
  }
}

function normalizeMultiRollBlock(
  block: string,
  skillMultiRollRegex: RegExp,
): string {
  const lines = block
    .replace(/\r\n/g, '\n')
    .split('\n')
    .map((line: string) => line.trim())
    .filter(Boolean)

  const commandLine = lines[0]?.replace(/\s+#1$/, '') ?? ''
  const resultLines = lines
    .slice(1)
    .filter((line: string) => !line.startsWith('#'))
  const skillMatch = block.match(skillMultiRollRegex)

  if (!skillMatch) {
    return [commandLine, ...resultLines].join('<br>')
  }

  const [, , command, target, skill] = skillMatch
  const repeatedCommand = `${command}&lt;=${target} 【${skill}】`

  return [
    commandLine,
    ...resultLines.map((line: string) =>
      line.startsWith('(1D100') ? `${repeatedCommand} ${line}` : line,
    ),
  ].join('<br>')
}
