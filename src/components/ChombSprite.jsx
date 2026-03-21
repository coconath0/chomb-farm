import { useEffect, useRef, useState } from "react";
import styles from "./ChombSprite.module.css";

// Per-animation PNG sheets (frames are 32×32) 
// chomb_walk.png  → 192×96  = 6 cols × 3 rows = 18 frames  (walk)
// chomp_idle.png  → 128×96  = 4 cols × 3 rows = 12 frames  (idle)
const ANIM_SHEETS = {
    idle: {
        src:    "/sprites/chom-bomb/chomb-individual/chomp_idle.png",
        frames: 12,
        cols:   4,
        rows:   3,
        fps:    6,
    },
    walk: {
        src:    "/sprites/chom-bomb/chomb-individual/chomb_walk.png",
        frames: 18,
        cols:   6,
        rows:   3,
        fps:    10,
    },
};

// Per-chomb hue-rotate colour variants 
const CHOMB_FILTER = {
    biscuit: "hue-rotate(0deg)",
    mochi:   "hue-rotate(100deg) saturate(1.5)",
    sprout:  "hue-rotate(200deg) saturate(1.4)",
    cinder:  "sepia(0.6) hue-rotate(340deg) saturate(3) brightness(1.2)",
    pebble:  "brightness(0.55) saturate(0.25)",
    dewdrop: "hue-rotate(160deg) saturate(2)",
    bramble: "hue-rotate(30deg) saturate(0.7) brightness(0.85)",
};

/**
 * Animated Chomb sprite using the individual per-animation PNG sheets.
 * @param {string}  catalogKey  – chomb type (biscuit / mochi / …)
 * @param {boolean} busy        – true → walk, false → idle
 * @param {number}  [size=48]   – rendered pixel size (square)
 */
export default function ChombSprite({ catalogKey, busy, size = 48 }) {
    const anim  = ANIM_SHEETS[busy ? "walk" : "idle"];
    const scale = size / 32;

    const [frame, setFrame] = useState(0);
    const frameRef = useRef(0);

    // Reset to frame 0 when animation mode changes
    useEffect(() => {
        frameRef.current = 0;
        setFrame(0);
    }, [busy]);

    // Interval ticker
    useEffect(() => {
        if (anim.frames <= 1) return;
        const ms = Math.round(1000 / anim.fps);
        const id = setInterval(() => {
            frameRef.current = (frameRef.current + 1) % anim.frames;
            setFrame(frameRef.current);
        }, ms);
        return () => clearInterval(id);
    }, [busy, anim.frames, anim.fps]);

    // 2D grid position: frame N → col + row inside the sheet
    const col = frame % anim.cols;
    const row = Math.floor(frame / anim.cols);

    const bgStyle = {
        backgroundImage:    `url("${anim.src}")`,
        // Scale the entire sheet to match the rendered size
        backgroundSize:     `${Math.round(anim.cols * 32 * scale)}px ${Math.round(anim.rows * 32 * scale)}px`,
        backgroundPosition: `-${Math.round(col * 32 * scale)}px -${Math.round(row * 32 * scale)}px`,
        backgroundRepeat:   "no-repeat",
        width:              `${size}px`,
        height:             `${size}px`,
    };

    return (
        <div
            className={styles.wrapper}
            style={{
                filter: CHOMB_FILTER[catalogKey] ?? "none",
                width:  `${size}px`,
                height: `${size}px`,
            }}
        >
            <div className={styles.sprite} style={bgStyle} />
        </div>
    );
}

