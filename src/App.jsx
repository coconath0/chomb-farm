import styles from './App.module.css'
import FarmGrid from './components/FarmGrid'
import ChombRoster from './components/ChombRoster'
import ChombShop from './components/ChombShop'
import HUD from './components/HUD'
import CropGuide from './components/CropGuide'
import BottomNav from './components/BottomNav'

function App() {
  return (
    <main className={styles.app}>
      <HUD />
      {/* Mobile-only: chombs in a horizontal scroll strip above the grid */}
      <div className={styles.mobileRoster}>
        <ChombRoster horizontal />
      </div>
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
      {/* Mobile-only: fixed bottom nav with Shop + Guide tabs */}
      <div className={styles.bottomNavWrapper}>
        <BottomNav />
      </div>
    </main>
  )
}

export default App
