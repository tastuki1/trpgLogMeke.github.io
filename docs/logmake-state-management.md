# Logmake State Management

## 結論

現在の logmake ページでは Zustand はまだ不要。`useLogmakePageState()` と props 受け渡しで、状態の流れを十分に追える。

## 状態の分類

React の state は、すべてを同じ場所に置くと読みにくくなる。logmake では次の 3 種類に分ける。

| 種類                | 例                                                   | 置き場所                |
| ------------------- | ---------------------------------------------------- | ----------------------- |
| 共有入力 state      | `system`, `source`, `settings`, `tabs`, `characters` | `useLogmakePageState()` |
| 派生値              | `parsedLog`, `analysis`, `outputModel`, `warnings`   | `useMemo` で計算        |
| feature-local state | 成長判定の表示フィルタ、コピー状態                   | 各 feature component 内 |

## 共有入力 state

共有入力 state は、ユーザー操作や外部入力で決まる一次情報。

- `system`
  CoC 6版 / 7版の選択。ログ解析と初期技能定義に必要。
- `source`
  読み込んだ raw HTML とファイル名。再解析の起点。
- `settings`
  出力ファイル名、タイトル、タイトル色、外枠色、背景色。
- `tabs`
  出力 HTML に含めるタブとタブ色。
- `characters`
  キャラクターごとの表示形式と色。
- `statusMessage`
  ページ全体に出す一時メッセージ。

これらは複数 feature が読むため、ページ制御層である `useLogmakePageState()` が owner になる。

## 派生値

派生値は、元になる state から必ず計算できる値。

```txt
source.rawHtml + system -> parsedLog
parsedLog + system + defaultDice -> analysis
parsedLog + tabs + characters -> outputModel
errors + parse warnings + analysis warnings -> warnings
```

派生値を `useState` で保存すると、元データが変わった時に同期更新が必要になる。更新漏れを避けるため、`useMemo` で計算する。

## feature-local state

その feature の中だけで使う state は親へ上げない。

`GrowthCheck` の表示フィルタは、成長判定欄の見た目だけに効く。出力 HTML、グラフ、タブ設定には直接関係しない。そのため `GrowthCheck` 内に置く。

## Zustand をまだ入れない理由

- feature component は `App` の直下にあり、props の受け渡しが 1 段で済んでいる。
- 複数ページで state を共有していない。
- 設定の localStorage 永続化がまだない。
- 学習段階では、まず `useState`, `useMemo`, custom hook で state owner を理解した方がよい。

## Zustand を検討する条件

次のどれかが起きたら再検討する。

- props の受け渡しが 3 段以上になり、読むのが辛くなった。
- 離れた component が同じ state を頻繁に更新するようになった。
- logmake 以外のページでも同じ設定を共有したくなった。
- localStorage 永続化や DevTools での追跡が必要になった。
- `useLogmakePageState()` が大きくなりすぎ、関心ごとを分けたくなった。

## 現時点の判断

- `tabs` と `characters` は `TabSettings` / `CharacterSettings` だけで編集されるが、`OutputModel` と `buildOutputHtml()` でも使うため page-level state に残す。
- `visibleTabs` は成長判定欄専用なので `GrowthCheck` 内に残す。
- `parsedLog` を App へ公開する必要はまだない。デバッグ表示や件数表示が必要になった時点で公開する。
