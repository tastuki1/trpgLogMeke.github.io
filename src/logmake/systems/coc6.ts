import { createLogSourceNormalizer } from '@/logmake/lib/normalizeSourceHtml'
import { parseCoc6DiceToken } from '@/logmake/systems/coc/coc6DiceExtractor'
import { coc6Growth } from '@/logmake/systems/coc/coc6Growth'
import type { LogmakeSystem } from '@/logmake/systems/types'

export const COC6_SYSTEM: LogmakeSystem = {
  id: 'CoC6',
  name: 'CoC 6版',
  log: {
    normalizeSource: createLogSourceNormalizer({
      multiRollRegex:
        /(?:x|rep|repeat)\d+( |\u3000)(CCB|CC|RESB|RES|CBRB|CBR)(.*)\s+#\d+\n(.*)(\n\n+#\d+\n(.*))+(クリティカル|決定的成功|スペシャル|成功|失敗|ファンブル|致命的失敗)/gi,
      skillMultiRollRegex:
        /(?:x|rep|repeat)\d+( |\u3000)(CCB|CC|RESB|RES|CBRB|CBR)[-+0-9()]*&lt;=(\d+[crhe]*) 【(.*)】\s+#\d+\n/i,
    }),
    parseToken: parseCoc6DiceToken,
  },
  growth: coc6Growth,
}
