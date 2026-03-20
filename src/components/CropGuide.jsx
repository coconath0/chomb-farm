import { CROP_SEEDS, PHASE_TIMERS } from "../farmReducer";
import styles from "./CropGuide.module.css";

const CROP_INFO = [
    { key: "carrot", label: "Carrot", icon: "🥕" },
    { key: "wheat",  label: "Wheat",  icon: "🌾" },
    { key: "corn",   label: "Corn",   icon: "🌽" },
    { key: "tomato", label: "Tomato", icon: "🍅" },
];

// Total time a player actively waits: watering + growing + harvesting
const totalTime = PHASE_TIMERS.watering + PHASE_TIMERS.growing + PHASE_TIMERS.harvesting;

export default function CropGuide() {
    return (
        <div className={styles.panel}>
            <h3 className={styles.heading}>CROP GUIDE</h3>
            <table className={styles.table}>
                <thead>
                    <tr>
                        <th className={styles.th}>Crop</th>
                        <th className={styles.th} title="Watering + Growing + Harvesting">Time</th>
                        <th className={styles.th}>Seeds</th>
                    </tr>
                </thead>
                <tbody>
                    {CROP_INFO.map(({ key, label, icon }) => (
                        <tr key={key} className={styles.row}>
                            <td className={styles.name}>
                                <span className={styles.icon}>{icon}</span>
                                {label}
                            </td>
                            <td className={styles.cell}>{totalTime}s</td>
                            <td className={styles.cell}>+{CROP_SEEDS[key]}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
            <p className={styles.note}>Fertilizing costs 4 s extra (once per plot)</p>
        </div>
    );
}
