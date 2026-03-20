import { useFarm } from "../FarmContext";
import styles from "./PlotTile.module.css";

// timerSeconds has no stored maximum yet; we use 60 s as a visual baseline.
const TIMER_MAX = 60;

export default function PlotTile({ plot }) {
    const { state } = useFarm();

    const chomb = plot.chombId
        ? state.chombRoster.find((c) => c.id === plot.chombId)
        : null;

    const tileClass = [
        styles.tile,
        plot.wilted ? styles.wilted : "",
        plot.cropType && !plot.wilted ? styles.occupied : "",
    ]
        .filter(Boolean)
        .join(" ");

    const progress =
        plot.timerSeconds != null
            ? Math.min(plot.timerSeconds / TIMER_MAX, 1)
            : null;

    return (
        <div className={tileClass} data-plot-id={plot.id}>
            {!plot.cropType && !plot.wilted && (
                <span className={styles.emptyLabel}>empty</span>
            )}

            {plot.wilted && (
                <span className={styles.wiltedLabel}>wilted</span>
            )}

            {plot.cropType && !plot.wilted && (
                <div className={styles.content}>
                    <span className={styles.cropName}>{plot.cropType}</span>

                    {chomb && (
                        <span className={styles.chombName}>🐾 {chomb.name}</span>
                    )}

                    {progress != null && (
                        <div className={styles.progressTrack}>
                            <div
                                className={styles.progressFill}
                                style={{ width: `${progress * 100}%` }}
                            />
                        </div>
                    )}

                    {plot.timerSeconds != null && (
                        <span className={styles.timer}>{plot.timerSeconds}s</span>
                    )}
                </div>
            )}
        </div>
    );
}
