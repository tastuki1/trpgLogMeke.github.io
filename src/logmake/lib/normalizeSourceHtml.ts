import type { GameSystem } from '@/logmake/types'

const MULTI_ROLL_REGEX: Record<GameSystem, RegExp> = {
  CoC6:
    /x\d+( |\u3000)(CCB|CC|RESB|RES)(.*) (#\d+\n(.*)\n\n)+#\d+\n(.*)(クリティカル|決定的成功|スペシャル|成功|失敗|ファンブル|致命的失敗)/g,
  CoC7:
    /x\d+( |\u3000)(CC|RES|CBR)(.*) (#\d+\n(.*)\n\n)+#\d+\n(.*)(クリティカル|決定的成功|イクストリーム成功|ハード成功|成功|失敗|ファンブル)/g,
}

const SKILL_MULTI_ROLL_REGEX: Record<GameSystem, RegExp> = {
  CoC6:
    /x\d+( |\u3000)(CCB|CC|RESB|RES)[-+0-9()]*&lt;=(\d+[crhe]*) 【(.*)】 #\d+\n/,
  CoC7:
    /x\d+( |\u3000)(CC|RES|CBR)[-+0-9()]*&lt;=(\d+[crhe]*) 【(.*)】 #\d+\n/,
}

const OMIKUJI_REGEX = /今日のあなたの運勢は……？ \n【.*】/g

export function normalizeLogSource(
  content: string,
  system: GameSystem,
): string {
  let normalized = content.replace(/\r\n/g, '\n')

  normalized = normalized.replace(MULTI_ROLL_REGEX[system], (block: string) =>
    normalizeMultiRollBlock(block, system),
  )

  return normalized.replace(OMIKUJI_REGEX, (block: string) =>
    block.replace(/\n/g, '<br>'),
  )
}

function normalizeMultiRollBlock(block: string, system: GameSystem): string {
  const lines = block
    .replace(/\r\n/g, '\n')
    .split('\n')
    .map((line: string) => line.trim())
    .filter(Boolean)

  const commandLine = lines[0]?.replace(/\s+#1$/, '') ?? ''
  const resultLines = lines.filter((line: string) => line.startsWith('(1D100'))
  const skillMatch = block.match(SKILL_MULTI_ROLL_REGEX[system])

  if (!skillMatch) {
    return [commandLine, ...resultLines].join('<br>')
  }

  const [, , command, target, skill] = skillMatch
  const repeatedCommand = `${command}&lt;=${target} 【${skill}】`

  return [
    commandLine,
    ...resultLines.map((line: string) => `${repeatedCommand} ${line}`),
  ].join('<br>')
}
