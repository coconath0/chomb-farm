import { useFarm } from "../FarmContext";
import { UNLOCK_CHOMB } from "../farmReducer";
import { CHOMB_CATALOG } from "../data/chombs";
import styles from "./ChombShop.module.css";

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
                                <div className={styles.info}>
                                    <span className={styles.name}>{entry.name}</span>
                                    <span className={styles.specialty}>{entry.specialty}</span>
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
