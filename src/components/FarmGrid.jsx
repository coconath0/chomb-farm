import { useFarm } from "../FarmContext";
import PlotTile from "./PlotTile";
import styles from "./FarmGrid.module.css";

export default function FarmGrid() {
    const { state, dispatch } = useFarm();
    const { chombRoster } = state;

    return (
        <div className={styles.grid}>
            {state.plots.map((plot) => (
                <PlotTile
                    key={plot.id}
                    plot={plot}
                    chombRoster={chombRoster}
                    dispatch={dispatch}
                />
            ))}
        </div>
    );
}
