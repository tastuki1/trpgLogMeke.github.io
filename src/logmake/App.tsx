import { DisplaySample } from '@/logmake/components/features/DisplaySample'
import { FileUpload } from '@/logmake/components/features/FileUpload'
import { Graph } from '@/logmake/components/features/Graph'
import { GrowthCheck } from '@/logmake/components/features/GrowthCheck'
import { OutputSettings } from '@/logmake/components/features/OutputSettings'
import { useLogmakePageState } from '@/logmake/hooks/useLogmakePageState'
import styles from '@/logmake/styles/page.module.css'

/** ログ整形ページのルートコンポーネント。useLogmakePageState で状態を管理し各機能コンポーネントに配布する */
function App() {
  const {
    actions,
    derived,
    loading,
    state: { characters, settings, source, statusMessage, system, tabs },
  } = useLogmakePageState()

  return (
    <main className={styles.page}>
      <header className={styles.hero}>
        <h1 className={styles.title}>ログ整形</h1>
      </header>

      <div className={styles.box5}>
        <FileUpload
          defaultSkillValuesLoading={loading.defaultSkillValues}
          isLoading={loading.file}
          sourceFileName={source.fileName}
          system={system}
          onFileSelect={actions.handleFileSelect}
          onSystemChange={actions.handleSystemChange}
        />

        <div className={styles.status}>{statusMessage}</div>

        {derived.warnings.length > 0 ? (
          <section className={styles.alert}>
            <h2>確認したい項目</h2>
            <ul>
              {derived.warnings.map((warning) => (
                <li key={warning}>{warning}</li>
              ))}
            </ul>
          </section>
        ) : null}

        <GrowthCheck analysis={derived.analysis} tabs={tabs} />

        <DisplaySample />

        <Graph analysis={derived.analysis} characters={characters} />

        <OutputSettings
          canDownload={derived.canDownload}
          characters={characters}
          settings={settings}
          tabs={tabs}
          onCharacterColorChange={actions.handleCharacterColorChange}
          onCharacterStyleChange={actions.handleCharacterStyleChange}
          onDownload={actions.handleDownload}
          onSettingChange={actions.handleSettingChange}
          onTabColorChange={actions.handleTabColorChange}
          onTabVisibilityChange={actions.handleTabVisibilityChange}
        />
      </div>
    </main>
  )
}

export default App
