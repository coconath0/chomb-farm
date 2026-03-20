// ---------------------------------------------------------------------------
// Shape
//   state: { seeds: number, plots: Plot[], chombRoster: Chomb[] }
//
//   Plot  : { id: number, cropType: string|null, chombId: number|null,
//             timerSeconds: number|null, wilted: boolean }
//   Chomb : { id: number, name: string, level: number, busy: boolean }
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
        { id: 1, name: "Biscuit", level: 1, busy: false },
        { id: 2, name: "Mochi", level: 1, busy: false },
        { id: 3, name: "Sprout", level: 1, busy: false },
    ],
};

// Action types 

export const ASSIGN_CHOMB = "ASSIGN_CHOMB"; // { plotId, chombId }
export const HARVEST_PLOT = "HARVEST_PLOT"; // { plotId, seedReward }
export const WILT_PLOT = "WILT_PLOT";    // { plotId }
export const EARN_SEEDS = "EARN_SEEDS";   // { amount }
export const ADD_CROP = "ADD_CROP";     // { plotId, cropType, timerSeconds }

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
            const { plotId, chombId } = action.payload;
            const plot = state.plots.find((p) => p.id === plotId);
            if (!plot || plot.wilted || plot.cropType === null) return state;

            const chomb = state.chombRoster.find((c) => c.id === chombId);
            if (!chomb || chomb.busy) return state;

            return {
                ...state,
                plots: updatePlot(state.plots, plotId, { chombId }),
                chombRoster: updateChomb(state.chombRoster, chombId, { busy: true }),
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

        // Add seeds to the player's total (e.g. from selling, quests)
        case EARN_SEEDS: {
            const { amount } = action.payload;
            if (typeof amount !== "number" || amount < 0) return state;
            return { ...state, seeds: state.seeds + amount };
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

        default:
            return state;
    }
}
