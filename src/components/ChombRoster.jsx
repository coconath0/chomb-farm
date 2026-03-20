import { useFarm } from "../FarmContext";
import { CHOMB_CATALOG } from "../data/chombs";
import ChombSprite from "./ChombSprite";
import styles from "./ChombRoster.module.css";

const ROLE_LABEL = {
    fertilizer: { label: "Fertilizer", color: "#8b6530" },
    waterer:    { label: "Waterer",    color: "#3a7bbf" },
    harvester:  { label: "Harvester",  color: "#5a9e30" },
};

function ChombCard({ chomb }) {
    const busy = chomb.busy;
    const roleInfo = ROLE_LABEL[chomb.role] ?? { label: chomb.role, color: "#666" };

    function handleDragStart(e) {
        e.dataTransfer.setData("chombId", String(chomb.id));
        e.dataTransfer.effectAllowed = "move";
    }

    return (
        <div
            className={`${styles.card} ${busy ? styles.busy : ""}`}
            draggable={!busy}
            onDragStart={!busy ? handleDragStart : undefined}
            aria-disabled={busy}
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
}

export default function ChombRoster() {
    const { state } = useFarm();

    return (
        <aside className={styles.roster}>
            <h2 className={styles.heading}>Chombs</h2>
            <ul className={styles.list}>
                {state.chombRoster.map((chomb) => (
                    <li key={chomb.id}>
                        <ChombCard chomb={chomb} />
                    </li>
                ))}
            </ul>
        </aside>
    );
}
