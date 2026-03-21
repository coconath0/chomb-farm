import { useState } from "react";
import { useFarm } from "../FarmContext";
import styles from "./HUD.module.css";

export default function HUD() {
    const { state, resetGame } = useFarm();
    const [confirming, setConfirming] = useState(false);

    return (
        <>
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

                <button className={styles.resetBtn} onClick={() => setConfirming(true)} title="Reset game">
                    ↺
                </button>
            </header>

            {/* Custom pixel-art confirm dialog */}
            {confirming && (
                <div className={styles.overlay} onClick={() => setConfirming(false)}>
                    <div className={styles.dialog} onClick={(e) => e.stopPropagation()}>
                        <p className={styles.dialogText}>Reset the game?</p>
                        <p className={styles.dialogSub}>All progress will be lost.</p>
                        <div className={styles.dialogButtons}>
                            <button
                                className={`${styles.dialogBtn} ${styles.dialogBtnNo}`}
                                onClick={() => setConfirming(false)}
                            >
                                No
                            </button>
                            <button
                                className={`${styles.dialogBtn} ${styles.dialogBtnYes}`}
                                onClick={() => { resetGame(); setConfirming(false); }}
                            >
                                Yes
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
}
