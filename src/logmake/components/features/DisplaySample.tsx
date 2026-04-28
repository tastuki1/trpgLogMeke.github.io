import formStyles from '@/logmake/styles/forms.module.css'

/** character / item / scene の表示スタイルサンプルを表示するコンポーネント */
export function DisplaySample() {
  return (
    <details className={formStyles.detailsBlock}>
      <summary>表示形式サンプル</summary>
      <div className={formStyles.growthBox} data-testid="display-sample">
        <div
          className={formStyles.charBlock}
          style={{ color: 'rgb(30, 144, 255)' }}
        >
          <b className={formStyles.charName}>キャラクタ名</b>
          <p className={formStyles.paragraph}>
            <span>情報を選ぶとこんな感じで表示されます</span>
            <br />
          </p>
        </div>

        <div className={formStyles.itemBlock}>
          <span className={formStyles.itemTitle}>アイテム名</span>
          <p className={formStyles.itemParagraph}>
            <span>情報を選ぶとこんな感じで表示されます</span>
            <br />
          </p>
        </div>

        <h3 className={formStyles.sceneHeading}>シーン名</h3>
        <p
          className={formStyles.sceneParagraph}
          style={{ color: 'rgb(112, 112, 112)' }}
        >
          <span>場面を選ぶとこんな感じで表示されます</span>
          <br />
        </p>

        <div
          className={formStyles.sampleTab}
          style={{ borderLeft: '3px solid rgb(211, 13, 13)' }}
        >
          <div
            className={formStyles.charBlock}
            style={{ color: 'rgb(50, 150, 50)' }}
          >
            <b className={formStyles.charName}>キャラクタ名</b>
            <p className={formStyles.paragraph}>
              <span>
                メインと情報以外のタブはこんな感じ(左側のラインの色が選択できます)
              </span>
            </p>
          </div>
        </div>
      </div>
    </details>
  )
}
