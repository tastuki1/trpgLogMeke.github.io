import formStyles from '@/logmake/styles/forms.module.css'
import type { CharacterConfig, CharacterStyle } from '@/logmake/types'

interface CharacterSettingsProps {
  characters: Record<string, CharacterConfig>
  onStyleChange: (name: string, style: CharacterStyle) => void
  onColorChange: (name: string, color: string) => void
}

export function CharacterSettings({
  characters,
  onStyleChange,
  onColorChange,
}: CharacterSettingsProps) {
  return (
    <table className={formStyles.settingsTable}>
      <tbody>
        <tr>
          <th align="left" colSpan={3}>
            ＜キャラクタ設定＞
          </th>
        </tr>
      {Object.keys(characters).length === 0 ? (
          <tr>
            <td>ログを読み込むとキャラクタ設定が表示されます。</td>
          </tr>
      ) : (
          Object.values(characters).map((character) => (
            <tr key={character.name}>
              <td>{character.name}</td>
              <td>
                <div className={formStyles.sampleOptions}>
                  <input
                    checked={character.style === 'character'}
                    id={`${character.name}-char`}
                    name={`${character.name}-style`}
                    type="radio"
                    onChange={() => onStyleChange(character.name, 'character')}
                  />
                  <label htmlFor={`${character.name}-char`}>人物</label>
                  <input
                    checked={character.style === 'item'}
                    id={`${character.name}-item`}
                    name={`${character.name}-style`}
                    type="radio"
                    onChange={() => onStyleChange(character.name, 'item')}
                  />
                  <label htmlFor={`${character.name}-item`}>情報</label>
                  <input
                    checked={character.style === 'scene'}
                    id={`${character.name}-scene`}
                    name={`${character.name}-style`}
                    type="radio"
                    onChange={() => onStyleChange(character.name, 'scene')}
                  />
                  <label htmlFor={`${character.name}-scene`}>場面</label>
              </div>
              </td>

              <td>
              <input
                aria-label={`${character.name} color`}
                className={formStyles.colorInput}
                type="color"
                value={character.color}
                onChange={(event) =>
                  onColorChange(character.name, event.currentTarget.value)
                }
              />
              </td>
            </tr>
          ))
      )}
      </tbody>
    </table>
  )
}
