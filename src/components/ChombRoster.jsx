import { memo, useCallback } from "react";
import { useFarm } from "../FarmContext";
import { useSelection } from "../SelectionContext";
import { CHOMB_CATALOG } from "../data/chombs";
import ChombSprite from "./ChombSprite";
import styles from "./ChombRoster.module.css";

const ROLE_LABEL = {
    fertilizer: { label: "Fertilizer", color: "#8b6530" },
    waterer:    { label: "Waterer",    color: "#3a7bbf" },
    harvester:  { label: "Harvester",  color: "#5a9e30" },
};

// ChombCard is memoized so it skips re-renders during TICK_PLOT ticks.
// TICK_PLOT never mutates chombRoster, so `chomb` prop references are stable.
// ChombRoster itself still re-renders on ticks (calls useFarm), but its
// children are effectively skipped by memo.
const ChombCard = memo(function ChombCard({ chomb }) {
    const busy = chomb.busy;
    const roleInfo = ROLE_LABEL[chomb.role] ?? { label: chomb.role, color: "#666" };
    const { selectedChombId, setSelectedChombId } = useSelection();
    const isSelected = selectedChombId === chomb.id;

    const handleDragStart = useCallback((e) => {
        e.dataTransfer.setData("chombId", String(chomb.id));
        e.dataTransfer.effectAllowed = "move";
        setSelectedChombId(chomb.id);
    }, [chomb.id, setSelectedChombId]);

    const handleClick = useCallback(() => {
        if (busy) return;
        setSelectedChombId(isSelected ? null : chomb.id);
    }, [busy, isSelected, chomb.id, setSelectedChombId]);

    return (
        <div
            className={`${styles.card} ${busy ? styles.busy : ""} ${isSelected ? styles.selected : ""}`}
            draggable={!busy}
            onDragStart={!busy ? handleDragStart : undefined}
            onClick={handleClick}
            aria-disabled={busy}
            aria-pressed={isSelected}
        >
            {/* Animated sprite */}
            <div className={styles.spriteSlot}>
                <ChombSprite catalogKey={chomb.catalogKey} busy={busy} size={48} />
            </div>

            <div className={styles.info}>
                <span className={styles.name}>{chomb.name}</span>
                <span
                    className={styles.roleBadge}
                    style={{ backgroundColor: roleInfo.color }}
                >
                    {roleInfo.label}
                </span>
                {busy && <span className={styles.busyBadge}>working…</span>}
            </div>
        </div>
    );
});

export default function ChombRoster({ horizontal = false }) {
    const { state } = useFarm();

    return (
        <aside className={`${styles.roster} ${horizontal ? styles.rosterHorizontal : ""}`}>
            <h2 className={styles.heading}>Chombs</h2>
            <ul className={`${styles.list} ${horizontal ? styles.listHorizontal : ""}`}>
                {state.chombRoster.map((chomb) => (
                    <li key={chomb.id}>
                        <ChombCard chomb={chomb} />
                    </li>
                ))}
            </ul>
        </aside>
    );
}
