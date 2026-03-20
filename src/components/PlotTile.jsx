import { useEffect, useRef, useState } from "react";
import { useFarm } from "../FarmContext";
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
import { CHOMB_CATALOG } from "../data/chombs";
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

export default function PlotTile({ plot }) {
    const { state, dispatch } = useFarm();
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

    function handleDragOver(e) {
        if (!PHASE_REQUIRED_ROLE[plot.phase]) return;
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

        const requiredRole = PHASE_REQUIRED_ROLE[plot.phase];
        if (!requiredRole) return;

        const chombId = parseInt(e.dataTransfer.getData("chombId"), 10);
        if (!chombId) return;
        assignChomb(chombId);
    }

    // Tap-to-place: assign the currently selected chomb when the tile is tapped
    function handleClick() {
        if (!selectedChombId) return;
        const requiredRole = PHASE_REQUIRED_ROLE[plot.phase];
        if (!requiredRole) return;
        assignChomb(selectedChombId);
    }

    function assignChomb(chombId) {
        const requiredRole = PHASE_REQUIRED_ROLE[plot.phase];
        if (!requiredRole) return;
        const chomb = state.chombRoster.find((c) => c.id === chombId);
        if (!chomb || chomb.busy || chomb.role !== requiredRole) return;

        setSelectedChombId(null);

        if (plot.phase === "empty") {
            dispatch({ type: START_FERTILIZE, payload: { plotId: plot.id, chombId } });
        } else if (plot.phase === "needs_water") {
            dispatch({ type: START_WATER, payload: { plotId: plot.id, chombId } });
        } else if (plot.phase === "ready") {
            dispatch({ type: START_HARVEST, payload: { plotId: plot.id, chombId } });
        }
    }

    const activeChomb   = plot.chombId ? state.chombRoster.find((c) => c.id === plot.chombId) : null;
    const activeCatalog = activeChomb   ? CHOMB_CATALOG.find((c) => c.catalogKey === activeChomb.catalogKey) : null;

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
            const sc = state.chombRoster.find((c) => c.id === selectedChombId);
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
                                className={styles.cropOption}
                                onClick={() =>
                                    dispatch({
                                        type: PLANT,
                                        payload: { plotId: plot.id, cropType: crop },
                                    })
                                }
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
}

