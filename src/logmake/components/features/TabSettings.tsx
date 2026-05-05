import { ColorPickerInput } from '@/logmake/components/ColorPickerInput'
import { isPrimaryTab } from '@/logmake/lib/defaults'
import formStyles from '@/logmake/styles/forms.module.css'
import type { TabConfig } from '@/logmake/types'

interface TabSettingsProps {
  tabs: Record<string, TabConfig>
  onVisibilityChange: (name: string, visible: boolean) => void
  onColorChange: (name: string, color: string) => void
}

export function TabSettings({
  tabs,
  onVisibilityChange,
  onColorChange,
}: TabSettingsProps) {
  return (
    <div className={formStyles.settingsSection} style={{ maxWidth: 'min(100%, 460px)' }}>
      <div className={formStyles.sectionTitle}>＜タブ設定＞ ※チェックありを出力</div>
      {Object.keys(tabs).length === 0 ? (
        <p className={formStyles.emptyState}>ログを読み込むとタブ設定が表示されます。</p>
      ) : (
        <div className={formStyles.settingsGrid}>
          <div className={`${formStyles.settingsGridHeader} ${formStyles.settingsGridTab}`}>
            <span className={formStyles.colToggle}>出力</span>
            <span className={formStyles.colName}>タブ名</span>
            <span className={formStyles.colColor}>色</span>
          </div>
          {Object.values(tabs).map((tab) => (
            <div key={tab.name} className={`${formStyles.settingsGridRow} ${formStyles.settingsGridTab}`}>
              <span className={formStyles.colToggle}>
                <input
                  checked={tab.visible}
                  type="checkbox"
                  onChange={(event) =>
                    onVisibilityChange(tab.name, event.currentTarget.checked)
                  }
                />
              </span>
              <span className={formStyles.colName} title={tab.name}>
                {tab.name}
              </span>
              <span className={formStyles.colColor}>
                {isPrimaryTab(tab.name) ? null : (
                  <ColorPickerInput
                    ariaLabel={`${tab.name} color`}
                    value={tab.color}
                    onChange={(v) => onColorChange(tab.name, v)}
                  />
                )}
              </span>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
