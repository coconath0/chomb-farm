import styles from './App.module.css'
import FarmGrid from './components/FarmGrid'
import ChombRoster from './components/ChombRoster'
import ChombShop from './components/ChombShop'
import HUD from './components/HUD'

function App() {
  return (
    <main className={styles.app}>
      <h1 className={styles.title}>Chomb Farm</h1>
      <HUD />
      <div className={styles.layout}>
        <FarmGrid />
        <div className={styles.sidebar}>
          <ChombRoster />
          <ChombShop />
        </div>
      </div>
    </main>
  )
}

export default App
