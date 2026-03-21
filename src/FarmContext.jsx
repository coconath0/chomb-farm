import { createContext, useContext, useEffect, useReducer } from "react";
import { farmReducer, initialState, RESET_STATE } from "./farmReducer";

const STORAGE_KEY = "chombFarmState";

function loadState() {
    try {
        const raw = localStorage.getItem(STORAGE_KEY);
        return raw ? JSON.parse(raw) : initialState;
    } catch {
        return initialState;
    }
}

const FarmContext = createContext(null);

export function FarmProvider({ children }) {
    const [state, dispatch] = useReducer(farmReducer, undefined, loadState);

    // Persist every state change
    useEffect(() => {
        try {
            localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
        } catch { /* quota errors — silently ignore */ }
    }, [state]);

    function resetGame() {
        localStorage.removeItem(STORAGE_KEY);
        dispatch({ type: RESET_STATE });
    }

    return (
        <FarmContext.Provider value={{ state, dispatch, resetGame }}>
            {children}
        </FarmContext.Provider>
    );
}

export function useFarm() {
    const ctx = useContext(FarmContext);
    if (ctx === null) {
        throw new Error("useFarm must be used inside a <FarmProvider>.");
    }
    return ctx;
}
