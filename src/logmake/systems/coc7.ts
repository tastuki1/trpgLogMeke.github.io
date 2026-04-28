import { createLogSourceNormalizer } from '@/logmake/lib/normalizeSourceHtml'
import { parseCoc7DiceToken } from '@/logmake/systems/coc/coc7DiceExtractor'
import { coc7Growth } from '@/logmake/systems/coc/coc7Growth'
import type { LogmakeSystem } from '@/logmake/systems/types'

export const COC7_SYSTEM: LogmakeSystem = {
  id: 'CoC7',
  name: 'CoC 7版',
  log: {
    normalizeSource: createLogSourceNormalizer({
      multiRollRegex:
        /(?:x|rep|repeat)\d+( |\u3000)(CC|CBR)(.*)\s+#\d+\n(.*)(\n\n+#\d+\n(.*))+(クリティカル|決定的成功|イクストリーム成功|ハード成功|成功|失敗|ファンブル)/gi,
      skillMultiRollRegex:
        /(?:x|rep|repeat)\d+( |\u3000)(CC|CBR)[-+0-9()]*&lt;=(\d+[crhe]*) 【(.*)】\s+#\d+\n/i,
    }),
    parseToken: parseCoc7DiceToken,
  },
  growth: coc7Growth,
}
