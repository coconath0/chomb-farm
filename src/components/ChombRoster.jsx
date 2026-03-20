import { useFarm } from "../FarmContext";
import styles from "./ChombRoster.module.css";

function ChombCard({ chomb }) {
    const busy = chomb.busy;

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
            <span className={styles.name}>{chomb.name}</span>
            <span className={styles.specialty}>{chomb.specialty}</span>
            {busy && <span className={styles.busyBadge}>working…</span>}
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
