import { CHOMB_CATALOG } from "./data/chombs";

// ---------------------------------------------------------------------------
// Shape
//   state: { seeds: number, plots: Plot[], chombRoster: Chomb[] }
//
//   Plot  : { id: number, phase: PlotPhase, cropType: string|null,
//             chombId: number|null, timerSeconds: number|null }
//   Chomb : { id: number, catalogKey: string, name: string, role: string,
//             specialty: string, level: number, busy: boolean }
//
//   PlotPhase:
//     "empty"       → drop a fertilizer Chomb
//     "fertilizing" → Chomb working 4 s
//     "fertilized"  → pick a crop
//     "needs_water" → drop a waterer Chomb
//     "watering"    → Chomb working 5 s
//     "growing"     → auto-timer 30 s (no Chomb)
//     "ready"       → drop a harvester Chomb
//     "harvesting"  → Chomb working 4 s → done, seeds earned
// ---------------------------------------------------------------------------

// Duration (seconds) for each timed phase
export const PHASE_TIMERS = {
    fertilizing: 4,
    watering:    5,
    growing:     30,
    harvesting:  4,
};

// Growing time (seconds) per crop — replaces the shared PHASE_TIMERS.growing
export const CROP_GROWING_TIMES = {
    carrot: 20,
    wheat:  25,
    corn:   30,
    tomato: 40,
};

// Seed yield per crop on a successful harvest
export const CROP_SEEDS = {
    carrot: 5,
    wheat:  8,
    corn:   12,
    tomato: 15,
};

const makePlot = (id) => ({
    id,
    phase: "empty",
    cropType: null,
    chombId: null,
    timerSeconds: null,
});

export const initialState = {
    seeds: 10,
    plots: Array.from({ length: 9 }, (_, i) => makePlot(i + 1)),
    chombRoster: [
        { id: 1, catalogKey: "biscuit", name: "Biscuit", role: "fertilizer", specialty: "Fertilizing", level: 1, busy: false },
        { id: 2, catalogKey: "mochi",   name: "Mochi",   role: "waterer",    specialty: "Watering",    level: 1, busy: false },
        { id: 3, catalogKey: "sprout",  name: "Sprout",  role: "harvester",  specialty: "Harvesting",  level: 1, busy: false },
    ],
};

// Action types

export const TICK_PLOT       = "TICK_PLOT";       // { plotId }
export const COMPLETE_PHASE  = "COMPLETE_PHASE";  // { plotId }
export const START_FERTILIZE = "START_FERTILIZE"; // { plotId, chombId }
export const PLANT           = "PLANT";           // { plotId, cropType }
export const START_WATER     = "START_WATER";     // { plotId, chombId }
export const START_HARVEST   = "START_HARVEST";   // { plotId, chombId }
export const UNLOCK_CHOMB    = "UNLOCK_CHOMB";    // { catalogKey }
export const EARN_SEEDS      = "EARN_SEEDS";      // { amount }

// Helpers

const updatePlot = (plots, plotId, patch) =>
    plots.map((p) => (p.id === plotId ? { ...p, ...patch } : p));

const updateChomb = (roster, chombId, patch) =>
    roster.map((c) => (c.id === chombId ? { ...c, ...patch } : c));

// Reducer

export function farmReducer(state, action) {
    switch (action.type) {

        // 1. Player drops a fertilizer Chomb on an empty plot
        case START_FERTILIZE: {
            const { plotId, chombId } = action.payload;
            const plot  = state.plots.find((p) => p.id === plotId);
            const chomb = state.chombRoster.find((c) => c.id === chombId);
            if (!plot || plot.phase !== "empty") return state;
            if (!chomb || chomb.busy || chomb.role !== "fertilizer") return state;

            return {
                ...state,
                plots: updatePlot(state.plots, plotId, {
                    phase: "fertilizing",
                    chombId,
                    timerSeconds: PHASE_TIMERS.fertilizing,
                }),
                chombRoster: updateChomb(state.chombRoster, chombId, { busy: true }),
            };
        }

        // 2. Player selects a crop after plot is fertilized
        case PLANT: {
            const { plotId, cropType } = action.payload;
            const plot = state.plots.find((p) => p.id === plotId);
            if (!plot || plot.phase !== "fertilized") return state;

            return {
                ...state,
                plots: updatePlot(state.plots, plotId, {
                    phase: "needs_water",
                    cropType,
                }),
            };
        }

        // 3. Player drops a waterer Chomb on a planted plot
        case START_WATER: {
            const { plotId, chombId } = action.payload;
            const plot  = state.plots.find((p) => p.id === plotId);
            const chomb = state.chombRoster.find((c) => c.id === chombId);
            if (!plot || plot.phase !== "needs_water") return state;
            if (!chomb || chomb.busy || chomb.role !== "waterer") return state;

            return {
                ...state,
                plots: updatePlot(state.plots, plotId, {
                    phase: "watering",
                    chombId,
                    timerSeconds: PHASE_TIMERS.watering,
                }),
                chombRoster: updateChomb(state.chombRoster, chombId, { busy: true }),
            };
        }

        // 4. Player drops a harvester Chomb on a ready plot
        case START_HARVEST: {
            const { plotId, chombId } = action.payload;
            const plot  = state.plots.find((p) => p.id === plotId);
            const chomb = state.chombRoster.find((c) => c.id === chombId);
            if (!plot || plot.phase !== "ready") return state;
            if (!chomb || chomb.busy || chomb.role !== "harvester") return state;

            return {
                ...state,
                plots: updatePlot(state.plots, plotId, {
                    phase: "harvesting",
                    chombId,
                    timerSeconds: PHASE_TIMERS.harvesting,
                }),
                chombRoster: updateChomb(state.chombRoster, chombId, { busy: true }),
            };
        }

        // Auto-advance: called by PlotTile's interval when a timed phase ends
        case COMPLETE_PHASE: {
            const { plotId } = action.payload;
            const plot = state.plots.find((p) => p.id === plotId);
            if (!plot) return state;

            switch (plot.phase) {
                case "fertilizing": {
                    const freed = plot.chombId;
                    return {
                        ...state,
                        plots: updatePlot(state.plots, plotId, {
                            phase: "fertilized",
                            chombId: null,
                            timerSeconds: null,
                        }),
                        chombRoster: freed
                            ? updateChomb(state.chombRoster, freed, { busy: false })
                            : state.chombRoster,
                    };
                }
                case "watering": {
                    const freed = plot.chombId;
                    const growTime = CROP_GROWING_TIMES[plot.cropType?.toLowerCase()] ?? PHASE_TIMERS.growing;
                    return {
                        ...state,
                        plots: updatePlot(state.plots, plotId, {
                            phase: "growing",
                            chombId: null,
                            timerSeconds: growTime,
                        }),
                        chombRoster: freed
                            ? updateChomb(state.chombRoster, freed, { busy: false })
                            : state.chombRoster,
                    };
                }
                case "growing": {
                    return {
                        ...state,
                        plots: updatePlot(state.plots, plotId, {
                            phase: "ready",
                            timerSeconds: null,
                        }),
                    };
                }
                case "harvesting": {
                    const freed      = plot.chombId;
                    const seedReward = CROP_SEEDS[plot.cropType?.toLowerCase()] ?? 5;
                    return {
                        ...state,
                        seeds: state.seeds + seedReward,
                        plots: updatePlot(state.plots, plotId, {
                            phase: "empty",
                            cropType: null,
                            chombId: null,
                            timerSeconds: null,
                        }),
                        chombRoster: freed
                            ? updateChomb(state.chombRoster, freed, { busy: false })
                            : state.chombRoster,
                    };
                }
                default:
                    return state;
            }
        }

        // Decrement a plot's timerSeconds by 1 tick
        case TICK_PLOT: {
            const { plotId } = action.payload;
            const plot = state.plots.find((p) => p.id === plotId);
            if (!plot || plot.timerSeconds == null) return state;
            return {
                ...state,
                plots: updatePlot(state.plots, plotId, {
                    timerSeconds: Math.max(0, plot.timerSeconds - 1),
                }),
            };
        }

        case EARN_SEEDS: {
            const { amount } = action.payload;
            if (typeof amount !== "number" || amount < 0) return state;
            return { ...state, seeds: state.seeds + amount };
        }

        case UNLOCK_CHOMB: {
            const { catalogKey } = action.payload;
            const entry = CHOMB_CATALOG.find((c) => c.catalogKey === catalogKey);
            if (!entry) return state;
            if (state.chombRoster.some((c) => c.catalogKey === catalogKey)) return state;
            if (state.seeds < entry.cost) return state;

            const nextId =
                state.chombRoster.reduce((max, c) => Math.max(max, c.id), 0) + 1;

            return {
                ...state,
                seeds: state.seeds - entry.cost,
                chombRoster: [
                    ...state.chombRoster,
                    {
                        id: nextId,
                        catalogKey: entry.catalogKey,
                        name: entry.name,
                        role: entry.role,
                        specialty: entry.specialty,
                        level: entry.level,
                        busy: false,
                    },
                ],
            };
        }

        default:
            return state;
    }
}

