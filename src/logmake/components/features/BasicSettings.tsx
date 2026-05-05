import { ColorPickerInput } from '@/logmake/components/ColorPickerInput'
import formStyles from '@/logmake/styles/forms.module.css'
import type { LogmakeSettings } from '@/logmake/types'

interface BasicSettingsProps {
  settings: LogmakeSettings
  onChange: <Key extends keyof LogmakeSettings>(
    key: Key,
    value: LogmakeSettings[Key],
  ) => void
}

export function BasicSettings({ settings, onChange }: BasicSettingsProps) {
  return (
    <div className={formStyles.settingsSection}>
      <div className={formStyles.sectionTitle}>＜基本設定＞</div>
      <div className={formStyles.basicCard}>
        <div className={formStyles.labelInputRow}>
          <label className={formStyles.labelCell} htmlFor="file-name">ファイル名</label>
          <span style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
            <input
              id="file-name"
              className={formStyles.input}
              type="text"
              value={settings.logFileName}
              onChange={(event) => onChange('logFileName', event.currentTarget.value)}
            />
            .html
          </span>
        </div>
        <div className={formStyles.labelInputRow}>
          <label className={formStyles.labelCell} htmlFor="title">タイトル</label>
          <input
            id="title"
            className={formStyles.input}
            type="text"
            value={settings.title}
            onChange={(event) => onChange('title', event.currentTarget.value)}
          />
        </div>
        <hr className={formStyles.basicDivider} />
        <div className={formStyles.basicTwoCol}>
          <div className={formStyles.toggleRow}>
            <span className={formStyles.toggleLabel}>ライト</span>
            <label className={formStyles.toggleSwitch} data-testid="dark-mode-toggle">
              <input
                type="checkbox"
                checked={settings.darkMode}
                onChange={(event) => onChange('darkMode', event.currentTarget.checked)}
              />
              <span className={formStyles.toggleSlider} />
            </label>
            <span className={formStyles.toggleLabel}>ダーク</span>
          </div>
          <div className={formStyles.toggleRow}>
            <span className={formStyles.toggleLabel}>横書き</span>
            <label className={formStyles.toggleSwitch}>
              <input
                type="checkbox"
                checked={settings.writingMode === 'vertical'}
                onChange={(event) =>
                  onChange('writingMode', event.currentTarget.checked ? 'vertical' : 'horizontal')
                }
              />
              <span className={formStyles.toggleSlider} />
            </label>
            <span className={formStyles.toggleLabel}>縦書き</span>
          </div>
        </div>
        <div className={formStyles.basicTwoCol}>
          <div className={formStyles.basicInline}>
            <span>タイトル色</span>
            <ColorPickerInput
              ariaLabel="タイトル色"
              value={settings.nameColor}
              onChange={(v) => onChange('nameColor', v)}
            />
          </div>
          <div className={formStyles.basicInline}>
            <span>外枠色</span>
            <ColorPickerInput
              ariaLabel="外枠色"
              value={settings.frameColor}
              onChange={(v) => onChange('frameColor', v)}
            />
          </div>
        </div>
      </div>
    </div>
  )
}
