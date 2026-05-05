import { fileURLToPath } from 'url'

import { expect, test } from '@playwright/test'

const COC6_FIXTURE = fileURLToPath(
  new URL('../src/logmake/test/fixtures/coc6-sample.html', import.meta.url)
)

const COC7_FIXTURE = fileURLToPath(
  new URL('../src/logmake/test/fixtures/coc7-sample.html', import.meta.url)
)

test('CoC6ログ読込後、設定タブにダウンロードボタンが表示される', async ({ page }) => {
  await page.goto('/logmake/')
  await page.getByLabel('ログHTML').setInputFiles(COC6_FIXTURE)

  await expect(page.getByRole('button', { name: 'HTML をダウンロード' })).toBeVisible()
  await expect(page.getByTestId('display-sample')).toContainText('情報を選ぶとこんな感じで表示されます')
})

test('CoC6ログ読込後、HTMLをダウンロードできる', async ({ page }) => {
  await page.goto('/logmake/')
  await page.getByLabel('ログHTML').setInputFiles(COC6_FIXTURE)

  const downloadPromise = page.waitForEvent('download')
  await page.getByRole('button', { name: 'HTML をダウンロード' }).click()
  const download = await downloadPromise
  expect(download.suggestedFilename()).toBe('coc6-sample.html')
})

test('CoC6ログ読込後、成長タブでサマリーとグラフが表示される', async ({ page }) => {
  await page.goto('/logmake/')
  await page.getByLabel('ログHTML').setInputFiles(COC6_FIXTURE)

  await page.getByRole('button', { name: '成長技能チェック' }).click()
  await expect(page.getByTestId('growth-summary')).toContainText('初期値成功')

  await page.getByRole('button', { name: 'グラフ' }).click()
  await expect(page.getByTestId('graph-root').locator('canvas')).toBeVisible()
})

test('成長ダイスラベルのON/OFF切り替えができる', async ({ page }) => {
  await page.goto('/logmake/')
  await page.getByLabel('ログHTML').setInputFiles(COC6_FIXTURE)

  await page.getByRole('button', { name: '成長技能チェック' }).click()
  await expect(page.getByTestId('growth-summary')).toContainText('初期値成功')

  await page.getByLabel('初期値成功').uncheck()
  await expect(page.getByTestId('growth-summary')).not.toContainText('初期値成功')

  await page.getByLabel('初期値成功').check()
  await expect(page.getByTestId('growth-summary')).toContainText('初期値成功')
})

test('CoC7に切り替えるとハード・イクストリーム分類が表示される', async ({ page }) => {
  await page.goto('/logmake/')
  await page.getByLabel('CoC 7版').check()
  await page.getByLabel('ログHTML').setInputFiles(COC7_FIXTURE)

  await page.getByRole('button', { name: '成長技能チェック' }).click()
  await expect(page.getByTestId('growth-summary')).toContainText('◯ハード')
  await expect(page.getByTestId('growth-summary')).toContainText('◯イクストリーム')
})

test('ファイル読込前は成長・グラフタブが無効になっている', async ({ page }) => {
  await page.goto('/logmake/')

  await expect(page.getByRole('button', { name: '出力設定' })).toBeEnabled()
  await expect(page.getByRole('button', { name: '成長技能チェック' })).toBeDisabled()
  await expect(page.getByRole('button', { name: 'グラフ' })).toBeDisabled()
})

test('ファイル読込後は成長・グラフタブが有効になる', async ({ page }) => {
  await page.goto('/logmake/')

  await expect(page.getByRole('button', { name: '成長技能チェック' })).toBeDisabled()
  await page.getByLabel('ログHTML').setInputFiles(COC6_FIXTURE)
  await expect(page.getByRole('button', { name: '成長技能チェック' })).toBeEnabled()
  await expect(page.getByRole('button', { name: 'グラフ' })).toBeEnabled()
})

test('ダークモードトグルでテーマが切り替わる', async ({ page }) => {
  await page.goto('/logmake/')

  await expect(page.locator('html')).toHaveAttribute('data-theme', 'light')
  await page.getByTestId('dark-mode-toggle').click()
  await expect(page.locator('html')).toHaveAttribute('data-theme', 'dark')
  await page.getByTestId('dark-mode-toggle').click()
  await expect(page.locator('html')).toHaveAttribute('data-theme', 'light')
})
