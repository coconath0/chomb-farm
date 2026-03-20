import { useFarm } from "../FarmContext";
import PlotTile from "./PlotTile";
import styles from "./FarmGrid.module.css";

export default function FarmGrid() {
    const { state } = useFarm();

    return (
        <div className={styles.grid}>
            {state.plots.map((plot) => (
                <PlotTile key={plot.id} plot={plot} />
            ))}
        </div>
    );
}
