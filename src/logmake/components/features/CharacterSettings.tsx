import { useMemo, type ReactNode } from 'react'

import { ColorPickerInput } from '@/logmake/components/ColorPickerInput'
import { sortCharacterConfigs } from '@/logmake/lib/sortCharacters'
import formStyles from '@/logmake/styles/forms.module.css'
import type { CharacterConfig, CharacterStyle } from '@/logmake/types'

interface CharacterSettingsProps {
  characters: Record<string, CharacterConfig>
  onStyleChange: (name: string, style: CharacterStyle) => void
  onColorChange: (name: string, color: string) => void
  sampleButton?: ReactNode
}

export function CharacterSettings({
  characters,
  onStyleChange,
  onColorChange,
  sampleButton,
}: CharacterSettingsProps) {
  const sortedCharacters = useMemo(
    () => sortCharacterConfigs(characters),
    [characters]
  )

  return (
    <div className={formStyles.settingsSection} style={{ maxWidth: 'min(100%, 560px)' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
        <div className={formStyles.sectionTitle}>＜キャラクタ設定＞</div>
        {sampleButton}
      </div>
      {sortedCharacters.length === 0 ? (
        <p className={formStyles.emptyState}>
          ログを読み込むとキャラクタ設定が表示されます。
        </p>
      ) : (
        <div className={formStyles.settingsGrid}>
          <div className={`${formStyles.settingsGridHeader} ${formStyles.settingsGridChar}`}>
            <span className={formStyles.colCharName}>キャラクタ名</span>
            <span className={formStyles.colColor}>色</span>
            <span className={formStyles.colStyle}>種別</span>
          </div>
          {sortedCharacters.map((character) => (
            <div key={character.name} className={`${formStyles.settingsGridRow} ${formStyles.settingsGridChar}`}>
              <span
                className={formStyles.colCharName}
                title={character.name}
              >
                {character.name}
              </span>
              <span className={formStyles.colColor}>
                <ColorPickerInput
                  ariaLabel={`${character.name} color`}
                  value={character.color}
                  onChange={(v) => onColorChange(character.name, v)}
                />
              </span>
              <span className={formStyles.colStyle}>
                <span className={formStyles.sampleOptions}>
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
                </span>
              </span>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
