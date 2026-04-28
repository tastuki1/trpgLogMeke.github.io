import { isPrimaryTab } from '@/logmake/lib/defaults'
import formStyles from '@/logmake/styles/forms.module.css'
import type { TabConfig } from '@/logmake/types'

interface TabSettingsProps {
  tabs: Record<string, TabConfig>
  onVisibilityChange: (name: string, visible: boolean) => void
  onColorChange: (name: string, color: string) => void
}

/**
 * タブの表示・非表示とカラーを設定するフォームコンポーネント。
 * 主要タブ（メイン・情報）はカラー変更を表示しない。
 *
 * @param props.tabs - タブ設定のレコード
 * @param props.onVisibilityChange - 表示切り替えハンドラ
 * @param props.onColorChange - カラー変更ハンドラ
 */
export function TabSettings({
  tabs,
  onVisibilityChange,
  onColorChange,
}: TabSettingsProps) {
  return (
    <table className={formStyles.settingsTable}>
      <tbody>
        <tr>
          <th align="left" colSpan={4}>
            ＜タブ設定＞ ※チェックありを出力
          </th>
        </tr>
        {Object.keys(tabs).length === 0 ? (
          <tr>
            <td>ログを読み込むとタブ設定が表示されます。</td>
          </tr>
        ) : (
          Object.values(tabs).map((tab) => (
            <tr key={tab.name}>
              <td>
                <input
                  checked={tab.visible}
                  type="checkbox"
                  onChange={(event) =>
                    onVisibilityChange(tab.name, event.currentTarget.checked)
                  }
                />
              </td>
              <td>{tab.name}</td>

              {isPrimaryTab(tab.name) ? (
                <td />
              ) : (
                <td>
                  <input
                    aria-label={`${tab.name} color`}
                    className={formStyles.colorInput}
                    type="color"
                    value={tab.color}
                    onChange={(event) =>
                      onColorChange(tab.name, event.currentTarget.value)
                    }
                  />
                </td>
              )}
            </tr>
          ))
        )}
      </tbody>
    </table>
  )
}
