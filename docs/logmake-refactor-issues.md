# Logmake Refactor Roadmap

作成日: 2026-04-26  
対象ブランチ: `feature/react-migration`

## 目的

React 移行版の完了済み項目、判断保留項目、今後の改善候補を 1 か所にまとめる。

## 完了済み

| 項目                  | 内容                                                                                                    |
| --------------------- | ------------------------------------------------------------------------------------------------------- |
| React 専用入口        | `logmake/index.html` と `src/logmake/main.tsx` を追加し、logmake ページを独立させた。                   |
| Pure Function 化      | `parseLogHtml`, `analyzeDice`, `buildOutputModel`, `buildOutputHtml` を `src/logmake/lib/` に分離した。 |
| UI 分割               | `FileUpload`, `GrowthCheck`, `DisplaySample`, `Graph`, `OutputSettings` などへ分けた。                  |
| OutputModel 化        | プレビュー用ではなく、出力 HTML 生成用の中間モデルとして整理した。                                      |
| 表示形式サンプル      | 整形結果プレビューを廃止し、旧画面どおりの静的サンプルへ戻した。                                        |
| box5 幅修正           | `.page` の最大幅制限を外し、旧実装の余白感に寄せた。                                                    |
| 成長ダイス切替バグ    | event の値を state updater 外で退避し、表示切替時のクラッシュを防いだ。                                 |
| downloadFile 切り出し | Blob ダウンロードの DOM 操作を `lib/utils/downloadFile.ts` に分離した。                                 |
| テスト追加            | unit test と Playwright E2E で解析、出力、表示切替、ダウンロードを確認するようにした。                  |

## 保留した判断

### Zustand 導入

現時点では不要。

理由:

- `App` から各 feature component への props 受け渡しが 1 段で済んでいる。
- state を複数ページで共有していない。
- localStorage 永続化がまだない。
- 学習目的として、まず React 標準の state owner を理解した方がよい。

導入するなら、設定永続化や複数ページ共有が必要になった時点で再検討する。

### visibleTabs のリフトアップ

現時点では不要。

理由:

- 成長判定欄の表示フィルタは `GrowthCheck` だけで使う。
- 出力 HTML のタブ表示設定とは責務が違う。
- localStorage 永続化が必要になるまでは、feature-local state のままが読みやすい。

## 次に優先したい改善

### 1. DOMParser 化

`parseLogHtml()` は現在、正規表現で HTML を読んでいる。CCFOLIA の出力形式が少し変わると壊れやすい。

次にやるなら、まず fixture を増やしてから `DOMParser` ベースへ移行する。

必要な fixture:

- 通常ログ
- 空行を含むログ
- `<span>` 内に改行が多いログ
- `x2` など複数回ダイス
- おみくじなど特殊コマンド
- CoC 6版 / 7版それぞれの代表ログ

### 2. ID ベース構造

現在は tab 名や character 名を `Record` の key にしている。

同名キャラクター、表示名変更、順序管理を安全に扱うなら、将来的に次の形へ寄せる。

```ts
tabsById + tabOrder
charactersById + characterOrder
entries は tabId / characterId を参照
```

ただし今は名前ベースの方が読みやすく、実害も出ていないため低優先度。

### 3. 設定の保存

色や表示形式を毎回設定し直すのが負担になったら、localStorage 保存を検討する。

この段階で Zustand の `persist` を使うか、単純な custom hook にするかを比較する。

## 直近の確認コマンド

```bash
pnpm lint
pnpm test:unit
pnpm test:e2e
pnpm build
```

## main への PR 前チェック

- `feature/react-migration` 上で unit / e2e / build が通る。
- 旧 `index_logmake.html` と見た目や操作順の差分を確認する。
- GitHub Pages の公開元が `main` であることを再確認する。
- `main` への PR は、動作確認が終わるまで作らない。
