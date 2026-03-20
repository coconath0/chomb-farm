import { useFarm } from "../FarmContext";
import { UNLOCK_CHOMB } from "../farmReducer";
import { CHOMB_CATALOG } from "../data/chombs";
import styles from "./ChombShop.module.css";

const ROLE_LABEL = {
    fertilizer: { label: "Fertilizer", color: "#8b6530" },
    waterer:    { label: "Waterer",    color: "#3a7bbf" },
    harvester:  { label: "Harvester",  color: "#5a9e30" },
};

export default function ChombShop() {
    const { state, dispatch } = useFarm();

    const unlockedKeys = new Set(state.chombRoster.map((c) => c.catalogKey));

    // Only show Chombs that aren't already owned and have a cost > 0
    const shopEntries = CHOMB_CATALOG.filter(
        (entry) => entry.cost > 0 && !unlockedKeys.has(entry.catalogKey)
    );

    function handleBuy(catalogKey) {
        dispatch({ type: UNLOCK_CHOMB, payload: { catalogKey } });
    }

    return (
        <aside className={styles.shop}>
            <h2 className={styles.heading}>Chomb Shop</h2>

            {shopEntries.length === 0 ? (
                <p className={styles.empty}>All Chombs unlocked! 🎉</p>
            ) : (
                <ul className={styles.list}>
                    {shopEntries.map((entry) => {
                        const canAfford = state.seeds >= entry.cost;
                        return (
                            <li key={entry.catalogKey} className={styles.entry}>
                                <div className={styles.sprite} data-state="shop">
                                    <span className={styles.spriteEmoji}>{entry.emoji}</span>
                                </div>
                                <div className={styles.info}>
                                    <span className={styles.name}>{entry.name}</span>
                                    <span
                                        className={styles.roleBadge}
                                        style={{ backgroundColor: (ROLE_LABEL[entry.role] ?? {}).color ?? "#666" }}
                                    >
                                        {(ROLE_LABEL[entry.role] ?? { label: entry.role }).label}
                                    </span>
                                    <span className={styles.level}>Lv. {entry.level}</span>
                                </div>
                                <button
                                    className={`${styles.buyBtn} ${!canAfford ? styles.disabled : ""}`}
                                    onClick={() => handleBuy(entry.catalogKey)}
                                    disabled={!canAfford}
                                    aria-label={`Buy ${entry.name} for ${entry.cost} seeds`}
                                >
                                    🌱 {entry.cost}
                                </button>
                            </li>
                        );
                    })}
                </ul>
            )}
        </aside>
    );
}
