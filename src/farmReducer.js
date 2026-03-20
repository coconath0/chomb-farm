import { CHOMB_CATALOG } from "./data/chombs";

// ---------------------------------------------------------------------------
// Shape
//   state: { seeds: number, plots: Plot[], chombRoster: Chomb[] }
//
//   Plot  : { id: number, cropType: string|null, chombId: number|null,
//             timerSeconds: number|null, wilted: boolean }
//   Chomb : { id: number, catalogKey: string, name: string, specialty: string, level: number, busy: boolean }
// ---------------------------------------------------------------------------

// Initial state 

const makePlot = (id) => ({
    id,
    cropType: null,
    chombId: null,
    timerSeconds: null,
    wilted: false,
});

export const initialState = {
    seeds: 10,
    plots: Array.from({ length: 9 }, (_, i) => makePlot(i + 1)),
    chombRoster: [
        { id: 1, catalogKey: "biscuit", name: "Biscuit", specialty: "Watering",    level: 1, busy: false },
        { id: 2, catalogKey: "mochi",   name: "Mochi",   specialty: "Harvesting",  level: 1, busy: false },
        { id: 3, catalogKey: "sprout",  name: "Sprout",  specialty: "Fertilizing", level: 1, busy: false },
    ],
};

// Action types 

export const ASSIGN_CHOMB   = "ASSIGN_CHOMB";   // { plotId, chombId, timerSeconds? }
export const REASSIGN_CHOMB = "REASSIGN_CHOMB"; // { plotId, chombId, timerSeconds? }
export const HARVEST_PLOT   = "HARVEST_PLOT";   // { plotId, seedReward }
export const WILT_PLOT      = "WILT_PLOT";      // { plotId }
export const TICK_PLOT      = "TICK_PLOT";      // { plotId }
export const REPLANT_PLOT   = "REPLANT_PLOT";   // { plotId }
export const UNLOCK_CHOMB   = "UNLOCK_CHOMB";   // { catalogKey }
export const EARN_SEEDS     = "EARN_SEEDS";     // { amount }
export const ADD_CROP       = "ADD_CROP";       // { plotId, cropType, timerSeconds }

// Helpers 

const updatePlot = (plots, plotId, patch) =>
    plots.map((p) => (p.id === plotId ? { ...p, ...patch } : p));

const updateChomb = (roster, chombId, patch) =>
    roster.map((c) => (c.id === chombId ? { ...c, ...patch } : c));

// Reducer 

export function farmReducer(state, action) {
    switch (action.type) {
        // Assign a Chomb to a plot (marks the Chomb as busy)
        case ASSIGN_CHOMB: {
            const { plotId, chombId, timerSeconds } = action.payload;
            const plot = state.plots.find((p) => p.id === plotId);
            if (!plot || plot.wilted || plot.cropType === null) return state;

            const chomb = state.chombRoster.find((c) => c.id === chombId);
            if (!chomb || chomb.busy) return state;

            return {
                ...state,
                plots: updatePlot(state.plots, plotId, {
                    chombId,
                    ...(timerSeconds != null && { timerSeconds }),
                }),
                chombRoster: updateChomb(state.chombRoster, chombId, { busy: true }),
            };
        }

        // Swap the Chomb on an already-occupied plot atomically
        case REASSIGN_CHOMB: {
            const { plotId, chombId, timerSeconds } = action.payload;
            const plot = state.plots.find((p) => p.id === plotId);
            if (!plot || plot.wilted || plot.cropType === null) return state;

            const newChomb = state.chombRoster.find((c) => c.id === chombId);
            if (!newChomb || newChomb.busy) return state;

            const prevChombId = plot.chombId;

            let roster = updateChomb(state.chombRoster, chombId, { busy: true });
            if (prevChombId != null) {
                roster = updateChomb(roster, prevChombId, { busy: false });
            }

            return {
                ...state,
                plots: updatePlot(state.plots, plotId, {
                    chombId,
                    ...(timerSeconds != null && { timerSeconds }),
                }),
                chombRoster: roster,
            };
        }

        // Harvest a ready plot: free the Chomb, clear the plot, grant seeds
        case HARVEST_PLOT: {
            const { plotId, seedReward = 0 } = action.payload;
            const plot = state.plots.find((p) => p.id === plotId);
            if (!plot) return state;

            const freedChombId = plot.chombId;

            return {
                ...state,
                seeds: state.seeds + seedReward,
                plots: updatePlot(state.plots, plotId, {
                    cropType: null,
                    chombId: null,
                    timerSeconds: null,
                    wilted: false,
                }),
                chombRoster: freedChombId
                    ? updateChomb(state.chombRoster, freedChombId, { busy: false })
                    : state.chombRoster,
            };
        }

        // Mark a plot as wilted (crop died); also frees the assigned Chomb
        case WILT_PLOT: {
            const { plotId } = action.payload;
            const plot = state.plots.find((p) => p.id === plotId);
            if (!plot) return state;

            const freedChombId = plot.chombId;

            return {
                ...state,
                plots: updatePlot(state.plots, plotId, {
                    wilted: true,
                    chombId: null,
                    timerSeconds: null,
                }),
                chombRoster: freedChombId
                    ? updateChomb(state.chombRoster, freedChombId, { busy: false })
                    : state.chombRoster,
            };
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

        // Add seeds to the player's total (e.g. from selling, quests)
        case EARN_SEEDS: {
            const { amount } = action.payload;
            if (typeof amount !== "number" || amount < 0) return state;
            return { ...state, seeds: state.seeds + amount };
        }

        // Clear a wilted plot so a new crop can be planted; frees Chomb if still linked
        case REPLANT_PLOT: {
            const { plotId } = action.payload;
            const plot = state.plots.find((p) => p.id === plotId);
            if (!plot) return state;

            const freedChombId = plot.chombId;

            return {
                ...state,
                plots: updatePlot(state.plots, plotId, {
                    cropType: null,
                    chombId: null,
                    timerSeconds: null,
                    wilted: false,
                }),
                chombRoster: freedChombId
                    ? updateChomb(state.chombRoster, freedChombId, { busy: false })
                    : state.chombRoster,
            };
        }

        // Plant a crop on an empty, non-wilted plot
        case ADD_CROP: {
            const { plotId, cropType, timerSeconds = null } = action.payload;
            const plot = state.plots.find((p) => p.id === plotId);
            if (!plot || plot.cropType !== null || plot.wilted) return state;

            return {
                ...state,
                plots: updatePlot(state.plots, plotId, {
                    cropType,
                    timerSeconds,
                    wilted: false,
                }),
            };
        }

        // Buy a new Chomb from the catalog; deducts seeds
        case UNLOCK_CHOMB: {
            const { catalogKey } = action.payload;
            const entry = CHOMB_CATALOG.find((c) => c.catalogKey === catalogKey);
            if (!entry) return state;

            // Already owned guard
            if (state.chombRoster.some((c) => c.catalogKey === catalogKey)) return state;

            // Insufficient seeds guard
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
