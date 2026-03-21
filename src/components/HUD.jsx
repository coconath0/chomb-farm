import { useEffect, useState } from "react";
import { useFarm } from "../FarmContext";
import styles from "./HUD.module.css";

const GUIDE_KEY = "chombFarmGuideSeen";

export default function HUD() {
    const { state, resetGame } = useFarm();
    const [confirming, setConfirming] = useState(false);
    const [guideOpen, setGuideOpen] = useState(false);

    // Auto-show on first ever visit
    useEffect(() => {
        if (!localStorage.getItem(GUIDE_KEY)) {
            setGuideOpen(true);
        }
    }, []);

    function closeGuide() {
        localStorage.setItem(GUIDE_KEY, "1");
        setGuideOpen(false);
    }

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

                <button className={styles.helpBtn} onClick={() => setGuideOpen(true)} title="How to play">
                    ?
                </button>

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

            {/* Starter Guide overlay */}
            {guideOpen && (
                <div className={styles.overlay} onClick={closeGuide}>
                    <div className={styles.guide} onClick={(e) => e.stopPropagation()}>
                        <p className={styles.guideTitle}>✦ Starter Guide ✦</p>

                        <div className={styles.guideScroll}>
                            <p className={styles.guideSection}>🌾 The Farm Cycle</p>
                            <p className={styles.guideBody}>
                                Every plot follows this cycle:<br />
                                <span className={styles.guideStep}>Empty → Fertilize → Plant a Crop → Water → Grow → Harvest</span>
                            </p>

                            <p className={styles.guideSection}>🐾 Your Chombs</p>
                            <p className={styles.guideBody}>
                                <span className={styles.guideChomb}>🌿 Fertilizer</span> — assigns to empty plots to prepare the soil.<br />
                                <span className={styles.guideChomb}>💧 Waterer</span> — assigns to planted plots that need water.<br />
                                <span className={styles.guideChomb}>⚒ Harvester</span> — assigns to plots with fully grown crops.
                            </p>

                            <p className={styles.guideSection}>🌱 Planting</p>
                            <p className={styles.guideBody}>
                                After a plot is fertilized, tap it to choose a crop.<br />
                                <span className={styles.guideHint}>Carrot 20s · Wheat 25s · Corn 30s · Tomato 40s</span>
                            </p>

                            <p className={styles.guideSection}>🖥 On Desktop</p>
                            <p className={styles.guideBody}>
                                <b>Drag</b> a Chomb from the roster and <b>drop</b> it onto the matching plot.<br />
                                Or <b>click</b> a Chomb to select it, then <b>click</b> the glowing plot.
                            </p>

                            <p className={styles.guideSection}>📱 On Mobile</p>
                            <p className={styles.guideBody}>
                                <b>Tap</b> a Chomb to select it (it glows), then <b>tap</b> the plot that matches its role.
                            </p>

                            <p className={styles.guideSection}>🛒 Shop</p>
                            <p className={styles.guideBody}>
                                Earn seeds by harvesting crops. Spend them in the Shop to hire more Chombs!
                            </p>
                        </div>

                        <button className={`${styles.dialogBtn} ${styles.dialogBtnNo}`} onClick={closeGuide}>
                            OK!
                        </button>
                    </div>
                </div>
            )}
        </>
    );
}
