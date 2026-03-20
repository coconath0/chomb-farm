import styles from './App.module.css'
import FarmGrid from './components/FarmGrid'
import ChombRoster from './components/ChombRoster'

function App() {
  return (
    <main className={styles.app}>
      <h1 className={styles.title}>Chomb Farm</h1>
      <div className={styles.layout}>
        <FarmGrid />
        <ChombRoster />
      </div>
    </main>
  )
}

export default App
