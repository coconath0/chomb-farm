import { useEffect, useRef, useState } from "react";
import data from "../../public/sprites/chom-bomb/chomb_animations.json";

// ---------------------------------------------------------------------------
// Pre-process the JSON once at module load time.
//
// Aseprite "Array" export actually writes frames as an *object* keyed by
// "chomb_animations N.aseprite". Sort numerically so frame N maps to index N.
// ---------------------------------------------------------------------------
const _sortedKeys = Object.keys(data.frames).sort((a, b) => {
    const num = (s) => parseInt(s.match(/(\d+)/)?.[1] ?? "0", 10);
    return num(a) - num(b);
});

/** Flat array of every frame rect { x, y, w, h } ordered by global frame index. */
const ALL_FRAMES = _sortedKeys.map((k) => data.frames[k].frame);

/** Public URL of the spritesheet — import alongside the hook when needed. */
export const SPRITE_SHEET = "public/sprites/chom-bomb/chomb-all/Chomb1.png";

// ---------------------------------------------------------------------------
// useChombAnimation(animation, fps?)
//
// animation — frameTag name (e.g. "Idle", "walk", "hurt", "Explode")
// fps       — playback speed; defaults to 8
//
// Returns the current frame's { x, y, w, h } rect into the spritesheet.
// ---------------------------------------------------------------------------
export default function useChombAnimation(animation, fps = 8) {
    const tag   = data.meta.frameTags.find((t) => t.name === animation);
    const from  = tag?.from ?? 0;
    const to    = tag?.to   ?? 0;
    const count = to - from + 1;

    const [tick, setTick] = useState(0);
    const tickRef = useRef(0);

    // Reset to frame 0 whenever the animation name changes.
    useEffect(() => {
        tickRef.current = 0;
        setTick(0);
    }, [animation]);

    useEffect(() => {
        // A single-frame "animation" needs no interval.
        if (count <= 1) return;

        const ms = Math.round(1000 / fps);
        const id = setInterval(() => {
            tickRef.current = (tickRef.current + 1) % count;
            setTick(tickRef.current);
        }, ms);

        return () => clearInterval(id);
    }, [animation, fps, count]);

    return ALL_FRAMES[from + tick] ?? ALL_FRAMES[0];
}
