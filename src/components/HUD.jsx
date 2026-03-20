import { useFarm } from "../FarmContext";
import styles from "./HUD.module.css";

export default function HUD() {
    const { state } = useFarm();

    return (
        <div className={styles.hud}>
            <span className={styles.seedCount}>
                🌱 <strong>{state.seeds}</strong> seeds
            </span>
        </div>
    );
}
