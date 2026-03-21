import { memo, useCallback, useEffect, useRef, useState } from "react";
import { useSelection } from "../SelectionContext";
import {
    COMPLETE_PHASE,
    PHASE_TIMERS,
    PLANT,
    START_FERTILIZE,
    START_HARVEST,
    START_WATER,
    TICK_PLOT,
} from "../farmReducer";
import ChombSprite from "./ChombSprite";
import styles from "./PlotTile.module.css";

const PLANTABLE_CROPS = ["carrot", "corn", "wheat", "tomato"];

// Visual emoji per phase
const PHASE_EMOJI = {
    empty:       "🪹",
    fertilizing: "🔄",
    fertilized:  " ",
    needs_water: "💧",
    watering:    "👩🏻‍🌾",
    growing:     "🌱",
    ready:       "🌾",
    harvesting:  "🌾",
};

// Which Chomb role a player must drop on each phase
const PHASE_REQUIRED_ROLE = {
    empty:       "fertilizer",
    needs_water: "waterer",
    ready:       "harvester",
};

// Hint text shown inside each tile
const PHASE_HINT = {
    empty:       "Drop a 🌿 Fertilizer Chomb",
    fertilizing: "Fertilizing…",
    fertilized:  "Choose a crop to plant",
    needs_water: "Drop a 💧 Waterer Chomb",
    watering:    "Watering…",
    growing:     "Growing…",
    ready:       "Drop a ⚒ Harvester Chomb",
    harvesting:  "Harvesting…",
};

// PlotTile is memoized so it only re-renders when its own `plot` prop changes.
// useFarm() was intentionally removed — chombRoster and dispatch are passed as
// props from FarmGrid. TICK_PLOT never mutates chombRoster, so the reference
// is stable between ticks and React.memo can skip the 8 idle tiles.
const PlotTile = memo(function PlotTile({ plot, chombRoster, dispatch }) {
    const { selectedChombId, setSelectedChombId } = useSelection();
    const [isDragOver, setIsDragOver] = useState(false);

    // Ref so the interval callback always reads the latest timerSeconds
    const timerRef = useRef(plot.timerSeconds);
    timerRef.current = plot.timerSeconds;

    // Single effect covers all timed phases.
    // Chomb-driven phases (fertilizing, watering, harvesting) also require chombId.
    // Growing is fully automatic — no Chomb needed.
    useEffect(() => {
        const chombDriven = ["fertilizing", "watering", "harvesting"].includes(plot.phase);
        const autoPhase   = plot.phase === "growing";

        if (!plot.timerSeconds || plot.timerSeconds <= 0) return;
        if (chombDriven && !plot.chombId) return;
        if (!chombDriven && !autoPhase) return;

        const id = setInterval(() => {
            if (timerRef.current <= 1) {
                clearInterval(id);
                dispatch({ type: COMPLETE_PHASE, payload: { plotId: plot.id } });
            } else {
                dispatch({ type: TICK_PLOT, payload: { plotId: plot.id } });
            }
        }, 1000);

        return () => clearInterval(id);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [plot.phase, plot.chombId, plot.id, dispatch]);

    const assignChomb = useCallback((chombId) => {
        const requiredRole = PHASE_REQUIRED_ROLE[plot.phase];
        if (!requiredRole) return;
        const chomb = chombRoster.find((c) => c.id === chombId);
        if (!chomb || chomb.busy || chomb.role !== requiredRole) return;

        setSelectedChombId(null);

        if (plot.phase === "empty") {
            dispatch({ type: START_FERTILIZE, payload: { plotId: plot.id, chombId } });
        } else if (plot.phase === "needs_water") {
            dispatch({ type: START_WATER, payload: { plotId: plot.id, chombId } });
        } else if (plot.phase === "ready") {
            dispatch({ type: START_HARVEST, payload: { plotId: plot.id, chombId } });
        }
    }, [plot.phase, plot.id, chombRoster, dispatch, setSelectedChombId]);

    const handleDragOver = useCallback((e) => {
        if (!PHASE_REQUIRED_ROLE[plot.phase]) return;
        e.preventDefault();
        e.dataTransfer.dropEffect = "move";
        setIsDragOver(true);
    }, [plot.phase]);

    const handleDragLeave = useCallback(() => {
        setIsDragOver(false);
    }, []);

    const handleDrop = useCallback((e) => {
        e.preventDefault();
        setIsDragOver(false);
        const requiredRole = PHASE_REQUIRED_ROLE[plot.phase];
        if (!requiredRole) return;
        const chombId = parseInt(e.dataTransfer.getData("chombId"), 10);
        if (!chombId) return;
        assignChomb(chombId);
    }, [plot.phase, assignChomb]);

    const handleClick = useCallback(() => {
        if (!selectedChombId) return;
        const requiredRole = PHASE_REQUIRED_ROLE[plot.phase];
        if (!requiredRole) return;
        assignChomb(selectedChombId);
    }, [selectedChombId, plot.phase, assignChomb]);

    const handlePlant = useCallback((e) => {
        dispatch({ type: PLANT, payload: { plotId: plot.id, cropType: e.currentTarget.dataset.crop } });
    }, [dispatch, plot.id]);

    const activeChomb = plot.chombId ? chombRoster.find((c) => c.id === plot.chombId) : null;

    const timerMax  = PHASE_TIMERS[plot.phase] ?? null;
    const progress  = plot.timerSeconds != null && timerMax
        ? Math.min(plot.timerSeconds / timerMax, 1)
        : null;

    // Tile background class
    let phaseClass = "";
    if (["fertilizing", "fertilized"].includes(plot.phase))              phaseClass = styles.fertile;
    else if (["needs_water", "watering", "growing"].includes(plot.phase)) phaseClass = styles.planted;
    else if (["ready", "harvesting"].includes(plot.phase))                phaseClass = styles.readyPhase;

    const canAcceptSelected = selectedChombId
        ? (() => {
            const requiredRole = PHASE_REQUIRED_ROLE[plot.phase];
            if (!requiredRole) return false;
            const sc = chombRoster.find((c) => c.id === selectedChombId);
            return sc && !sc.busy && sc.role === requiredRole;
          })()
        : false;

    const tileClass = [
        styles.tile,
        phaseClass,
        isDragOver && PHASE_REQUIRED_ROLE[plot.phase] ? styles.dragOver : "",
        canAcceptSelected ? styles.tapTarget : "",
    ].filter(Boolean).join(" ");

    return (
        <div
            className={tileClass}
            data-plot-id={plot.id}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
            onClick={handleClick}
        >
            <div className={styles.content}>
                {/* Sprites — show ChombSprite when working, emoji otherwise */}
                <div className={styles.spriteRow}>
                    {activeChomb ? (
                        <ChombSprite
                            catalogKey={activeChomb.catalogKey}
                            busy={true}
                            size={48}
                        />
                    ) : (
                        <div className={styles.sprite} data-state={plot.phase}>
                            <span className={styles.spriteEmoji}>{PHASE_EMOJI[plot.phase]}</span>
                        </div>
                    )}
                </div>

                {/* Crop name */}
                {plot.cropType && (
                    <span className={styles.cropName}>{plot.cropType}</span>
                )}

                {/* Crop picker — only when fertilized */}
                {plot.phase === "fertilized" && (
                    <div className={styles.cropPicker}>
                        {PLANTABLE_CROPS.map((crop) => (
                            <button
                                key={crop}
                                data-crop={crop}
                                className={styles.cropOption}
                                onClick={handlePlant}
                            >
                                {crop}
                            </button>
                        ))}
                    </div>
                )}

                {/* Progress bar */}
                {progress != null && (
                    <div className={styles.progressTrack}>
                        <div
                            className={styles.progressFill}
                            style={{ width: `${progress * 100}%` }}
                        />
                    </div>
                )}

                {/* Countdown */}
                {plot.timerSeconds != null && (
                    <span className={styles.timer}>{plot.timerSeconds}s</span>
                )}

                {/* Hint */}
                <span className={styles.hint}>{PHASE_HINT[plot.phase]}</span>
            </div>
        </div>
    );
});

export default PlotTile;
