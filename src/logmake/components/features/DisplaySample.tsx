import { useRef } from 'react'

import formStyles from '@/logmake/styles/forms.module.css'

export function DisplaySample({ compact = false }: { compact?: boolean }) {
  const dialogRef = useRef<HTMLDialogElement>(null)

  return (
    <>
      <button
        className={compact ? formStyles.sampleCompactButton : formStyles.secondaryButton}
        type="button"
        onClick={() => dialogRef.current?.showModal()}
      >
        {compact ? '?' : '表示形式サンプル'}
      </button>

      <dialog ref={dialogRef} className={formStyles.sampleDialog}>
        <div className={formStyles.sampleDialogHeader}>
          <span>表示形式サンプル</span>
          <button
            className={formStyles.dialogCloseButton}
            type="button"
            onClick={() => dialogRef.current?.close()}
          >
            ✕
          </button>
        </div>
        <div className={formStyles.growthBox} data-testid="display-sample">
          <div
            className={formStyles.charBlock}
            style={{ color: 'rgb(30, 144, 255)' }}
          >
            <b className={formStyles.charName}>キャラクタ名</b>
            <p className={formStyles.paragraph}>
              <span>人物を選ぶとこんな感じで表示されます</span>
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

          <p className={formStyles.sceneName} style={{ color: 'rgb(112, 112, 112)' }}>
            場面名（KPなど）
          </p>
          <p className={formStyles.paragraph}>
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
                  メインと情報以外のタブはこんな感じ（左側のラインの色が選択できます）
                </span>
              </p>
            </div>
          </div>
        </div>
      </dialog>
    </>
  )
}
