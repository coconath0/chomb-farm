import styles from './App.module.css'
import FarmGrid from './components/FarmGrid'
import ChombRoster from './components/ChombRoster'
import ChombShop from './components/ChombShop'
import HUD from './components/HUD'

function App() {
  return (
    <main className={styles.app}>
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
