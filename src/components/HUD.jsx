import { useFarm } from "../FarmContext";
import styles from "./HUD.module.css";

export default function HUD() {
    const { state, resetGame } = useFarm();

    function handleReset() {
        if (window.confirm("Reset the game? All progress will be lost.")) {
            resetGame();
        }
    }

    return (
        <header className={styles.hud}>
            {/* Mini character portrait — shows first frame of Chomb1 */}
            <div className={styles.portrait}>
                <div className={styles.portraitSprite} />
            </div>

            <span className={styles.title}>CHOMB FARM</span>

            {/* Seed / coin counter */}
            <div className={styles.seedBox}>
                <div className={styles.coinIcon} aria-hidden="true" />
                <span className={styles.seedCount}>{state.seeds}</span>
            </div>

            <button className={styles.resetBtn} onClick={handleReset} title="Reset game">
                ↺
            </button>
        </header>
    );
}
