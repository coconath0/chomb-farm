import { useEffect, useRef, useState } from "react";
import { useFarm } from "../FarmContext";
import { ASSIGN_CHOMB, HARVEST_PLOT, REASSIGN_CHOMB, REPLANT_PLOT, TICK_PLOT, WILT_PLOT } from "../farmReducer";
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

// Seed rewards earned on a successful harvest per crop type.
const CROP_SEEDS = {
    carrot: 5,
    wheat:  8,
    corn:   12,
    tomato: 15,
};
const DEFAULT_SEEDS = 5;

export default function PlotTile({ plot }) {
    const { state, dispatch } = useFarm();
    const [isDragOver, setIsDragOver] = useState(false);

    const isValidDropTarget = !!plot.cropType && !plot.wilted;

    // Keep a ref so the interval callback always sees the latest timerSeconds
    // without needing it as an effect dependency (which would restart the
    // interval every second and defeat the reassignment-cleanup guarantee).
    const timerRef = useRef(plot.timerSeconds);
    timerRef.current = plot.timerSeconds;

    useEffect(() => {
        // Only tick when a Chomb is actively working and there is time left.
        if (!plot.chombId || plot.timerSeconds == null || plot.timerSeconds <= 0) return;

        const id = setInterval(() => {
            if (timerRef.current <= 1) {
                // Timer has expired — clear first, then wilt.
                clearInterval(id);
                dispatch({ type: WILT_PLOT, payload: { plotId: plot.id } });
            } else {
                dispatch({ type: TICK_PLOT, payload: { plotId: plot.id } });
            }
        }, 1000);

        // Cleanup fires on unmount AND whenever plot.chombId changes
        // (reassignment or unassignment), stopping the previous timer.
        return () => clearInterval(id);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [plot.chombId, plot.id, dispatch]);

    function handleDragOver(e) {
        if (!isValidDropTarget) return;
        e.preventDefault();
        e.dataTransfer.dropEffect = "move";
        setIsDragOver(true);
    }

    function handleDragLeave() {
        setIsDragOver(false);
    }

    function handleHarvest() {
        const seedReward = CROP_SEEDS[plot.cropType?.toLowerCase()] ?? DEFAULT_SEEDS;
        dispatch({ type: HARVEST_PLOT, payload: { plotId: plot.id, seedReward } });
    }

    function handleReplant() {
        dispatch({ type: REPLANT_PLOT, payload: { plotId: plot.id } });
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
                <div className={styles.wiltedOverlay}>
                    <span className={styles.wiltedLabel}>wilted</span>
                    <button
                        className={styles.replantBtn}
                        onClick={handleReplant}
                    >
                        Replant
                    </button>
                </div>
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

                    {plot.chombId && plot.timerSeconds != null && plot.timerSeconds > 10 && (
                        <button
                            className={styles.harvestBtn}
                            onClick={handleHarvest}
                        >
                            Harvest
                        </button>
                    )}
                </div>
            )}
        </div>
    );
}
