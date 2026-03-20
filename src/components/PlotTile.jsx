import { useState } from "react";
import { useFarm } from "../FarmContext";
import { ASSIGN_CHOMB, REASSIGN_CHOMB } from "../farmReducer";
import styles from "./PlotTile.module.css";

// timerSeconds has no stored maximum yet; we use 60 s as a visual baseline.
const TIMER_MAX = 60;

// Default harvest windows per crop type (seconds). Extend as crops are added.
const CROP_TIMERS = {
    carrot: 30,
    corn:   60,
    wheat:  45,
    tomato: 90,
};
const DEFAULT_TIMER = 60;

export default function PlotTile({ plot }) {
    const { state, dispatch } = useFarm();
    const [isDragOver, setIsDragOver] = useState(false);

    const isValidDropTarget = !!plot.cropType && !plot.wilted;

    function handleDragOver(e) {
        if (!isValidDropTarget) return;
        e.preventDefault();
        e.dataTransfer.dropEffect = "move";
        setIsDragOver(true);
    }

    function handleDragLeave() {
        setIsDragOver(false);
    }

    function handleDrop(e) {
        e.preventDefault();
        setIsDragOver(false);
        if (!isValidDropTarget) return;

        const chombId = parseInt(e.dataTransfer.getData("chombId"), 10);
        if (!chombId) return;

        const timerSeconds =
            CROP_TIMERS[plot.cropType?.toLowerCase()] ?? DEFAULT_TIMER;

        if (plot.chombId != null) {
            // Plot already has a worker — swap atomically
            dispatch({
                type: REASSIGN_CHOMB,
                payload: { plotId: plot.id, chombId, timerSeconds },
            });
        } else {
            dispatch({
                type: ASSIGN_CHOMB,
                payload: { plotId: plot.id, chombId, timerSeconds },
            });
        }
    }

    const chomb = plot.chombId
        ? state.chombRoster.find((c) => c.id === plot.chombId)
        : null;

    const tileClass = [
        styles.tile,
        plot.wilted ? styles.wilted : "",
        plot.cropType && !plot.wilted ? styles.occupied : "",
        isDragOver && isValidDropTarget ? styles.dragOver : "",
    ]
        .filter(Boolean)
        .join(" ");

    const progress =
        plot.timerSeconds != null
            ? Math.min(plot.timerSeconds / TIMER_MAX, 1)
            : null;

    return (
        <div
            className={tileClass}
            data-plot-id={plot.id}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
        >
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
