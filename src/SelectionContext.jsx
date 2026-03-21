import { createContext, useCallback, useContext, useMemo, useState } from "react";

const SelectionContext = createContext(null);

export function SelectionProvider({ children }) {
    const [selectedChombId, setSelectedChombId] = useState(null);
    // Stabilize the setter so useCallback deps in consumers don't cycle on parent renders
    const stableSetSelected = useCallback((id) => setSelectedChombId(id), []);
    // Memoize value object to avoid gratuitous context-triggered re-renders
    const value = useMemo(
        () => ({ selectedChombId, setSelectedChombId: stableSetSelected }),
        [selectedChombId, stableSetSelected]
    );
    return (
        <SelectionContext.Provider value={value}>
            {children}
        </SelectionContext.Provider>
    );
}

export function useSelection() {
    return useContext(SelectionContext);
}
