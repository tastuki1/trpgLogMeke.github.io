function App() {
  return (
    <main className="toolIndex">
      <section className="hero">
        <p className="eyebrow">TRPG Log Maker</p>
        <h1>React Migration Workspace</h1>
        <p className="lead">
          `index_logmake.html` の移行先として `logmake/` ページを独立させ、
          React と TypeScript の構造を段階的に学べる形へ整理しています。
        </p>
      </section>

      <section className="linkGrid">
        <a className="toolCard primary" href="./logmake/">
          <span className="cardLabel">React</span>
          <strong>logmake/</strong>
          <p>新しい React + TypeScript 版のログ整形ツールです。</p>
        </a>

        <article className="toolCard">
          <span className="cardLabel">Legacy</span>
          <strong>index_logmake.html</strong>
          <p>比較用の旧実装は repo 内に残しています。公開導線は React 版へ寄せています。</p>
        </article>
      </section>
    </main>
  )
}

export default App
