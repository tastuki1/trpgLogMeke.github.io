import { fileURLToPath } from 'url'

import { expect, test } from '@playwright/test'

const COC6_FIXTURE = fileURLToPath(
  new URL('../src/logmake/test/fixtures/coc6-sample.html', import.meta.url)
)

const COC7_FIXTURE = fileURLToPath(
  new URL('../src/logmake/test/fixtures/coc7-sample.html', import.meta.url)
)

test('loads a CoC6 log and allows sample display/download', async ({
  page,
}) => {
  await page.goto('/logmake/')
  await page.getByLabel('ログHTML').setInputFiles(COC6_FIXTURE)

  await expect(page.getByTestId('display-sample')).toContainText(
    '情報を選ぶとこんな感じで表示されます'
  )
  await expect(page.getByTestId('growth-summary')).toContainText('初期値成功')
  await expect(page.getByTestId('graph-root').locator('canvas')).toBeVisible()

  const downloadPromise = page.waitForEvent('download')
  await page.getByRole('button', { name: 'HTML をダウンロード' }).click()
  const download = await downloadPromise

  expect(download.suggestedFilename()).toBe('coc6-sample.html')
})

test('toggles growth dice labels without crashing the page', async ({
  page,
}) => {
  await page.goto('/logmake/')
  await page.getByLabel('ログHTML').setInputFiles(COC6_FIXTURE)

  await expect(page.getByTestId('growth-summary')).toContainText('初期値成功')

  await page.getByText('成長技能チェック').click()
  await page.getByLabel('初期値成功').uncheck()
  await expect(page.getByTestId('growth-summary')).not.toContainText(
    '初期値成功'
  )

  await page.getByLabel('初期値成功').check()
  await expect(page.getByTestId('growth-summary')).toContainText('初期値成功')
})

test('switches to CoC7 and shows hard/extreme classifications', async ({
  page,
}) => {
  await page.goto('/logmake/')
  await page.getByLabel('CoC 7版').check()
  await page.getByLabel('ログHTML').setInputFiles(COC7_FIXTURE)

  await expect(page.getByTestId('growth-summary')).toContainText('◯ハード')
  await expect(page.getByTestId('growth-summary')).toContainText(
    '◯イクストリーム'
  )
})
