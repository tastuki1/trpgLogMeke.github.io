import { useState } from 'react'

function App() {
  const [count, setCount] = useState(0)

  return (
    <div style={{ padding: '2rem', textAlign: 'center' }}>
      <h1>TRPG Log Maker</h1>
      <p>Vite + React + TypeScript 環境構築完了</p>
      <button onClick={() => setCount((count) => count + 1)}>
        count is {count}
      </button>
      <p style={{ marginTop: '2rem', color: '#666' }}>
        Phase 1: 開発環境セットアップ完了<br />
        Phase 2以降で機能を実装していきます
      </p>
    </div>
  )
}

export default App
