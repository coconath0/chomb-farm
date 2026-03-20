import { createContext, useContext, useState } from "react";

const SelectionContext = createContext(null);

export function SelectionProvider({ children }) {
    const [selectedChombId, setSelectedChombId] = useState(null);
    return (
        <SelectionContext.Provider value={{ selectedChombId, setSelectedChombId }}>
            {children}
        </SelectionContext.Provider>
    );
}

export function useSelection() {
    return useContext(SelectionContext);
}
