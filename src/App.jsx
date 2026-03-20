import styles from './App.module.css'
import FarmGrid from './components/FarmGrid'
import ChombRoster from './components/ChombRoster'
import ChombShop from './components/ChombShop'
import HUD from './components/HUD'
import CropGuide from './components/CropGuide'

function App() {
  return (
    <main className={styles.app}>
      <HUD />
      <div className={styles.layout}>
        <div className={styles.leftSidebar}>
          <CropGuide />
        </div>
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
