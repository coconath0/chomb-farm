import { useState } from "react";
import ChombShop from "./ChombShop";
import CropGuide from "./CropGuide";
import styles from "./BottomNav.module.css";

const TABS = [
    { key: "shop",  label: "SHOP"  },
    { key: "guide", label: "GUIDE" },
];

export default function BottomNav() {
    const [active, setActive] = useState(null);

    function toggle(key) {
        setActive((prev) => (prev === key ? null : key));
    }

    return (
        <div className={styles.root}>
            {active && (
                <div className={styles.drawer}>
                    {active === "shop"  && <ChombShop />}
                    {active === "guide" && <CropGuide />}
                </div>
            )}
            <div className={styles.bar}>
                {TABS.map(({ key, label }) => (
                    <button
                        key={key}
                        className={`${styles.tab} ${active === key ? styles.activeTab : ""}`}
                        onClick={() => toggle(key)}
                    >
                        {label}
                        <span className={styles.chevron}>{active === key ? "▼" : "▲"}</span>
                    </button>
                ))}
            </div>
        </div>
    );
}
