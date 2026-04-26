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
    <table className={formStyles.settingsTable}>
      <tbody>
        <tr>
          <th align="left" colSpan={2}>
            ＜基本の設定＞
          </th>
        </tr>
        <tr>
          <td>ファイル名</td>
          <td>
          <input
            id="file-name"
            className={formStyles.input}
            type="text"
            value={settings.logFileName}
            onChange={(event) => onChange('logFileName', event.currentTarget.value)}
          />
            .html
          </td>
        </tr>
        <tr>
          <td>タイトル</td>
          <td>
          <input
            id="title"
            className={formStyles.input}
            type="text"
            value={settings.title}
            onChange={(event) => onChange('title', event.currentTarget.value)}
          />
          </td>
        </tr>
        <tr>
          <td>タイトル色</td>
          <td>
          <input
            id="name-color"
            className={formStyles.colorInput}
            type="color"
            value={settings.nameColor}
            onChange={(event) => onChange('nameColor', event.currentTarget.value)}
          />
          </td>
        </tr>
        <tr>
          <td>外枠色</td>
          <td>
          <input
            id="frame-color"
            className={formStyles.colorInput}
            type="color"
            value={settings.frameColor}
            onChange={(event) => onChange('frameColor', event.currentTarget.value)}
          />
          </td>
        </tr>
        <tr>
          <td>背景色</td>
          <td>
          <input
            id="back-color"
            className={formStyles.colorInput}
            type="color"
            value={settings.backColor}
            onChange={(event) => onChange('backColor', event.currentTarget.value)}
          />
          </td>
        </tr>
      </tbody>
    </table>
  )
}
