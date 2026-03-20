import { createContext, useContext, useReducer } from "react";
import { farmReducer, initialState } from "./farmReducer";

const FarmContext = createContext(null);

export function FarmProvider({ children }) {
    const [state, dispatch] = useReducer(farmReducer, initialState);
    return (
        <FarmContext.Provider value={{ state, dispatch }}>
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
