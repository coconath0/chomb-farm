# 🌱 Chomb Farm

![Status](https://img.shields.io/badge/status-in%20development-brightgreen?style=flat-square)

Chomb Farm is a cozy pixel-art farming game where you tend a 3×3 plot grid with the help of your Chomb crew - small, round, surprisingly hard-working little creatures. Each plot follows a hands-on pipeline: fertilize the soil, plant a crop, water it, watch it grow, then send in a harvester. Every Chomb has a specific role, so you'll need to coordinate your roster wisely as your farm scales up. The goal is simple: keep the fields lush, earn seeds, and maybe figure out what Chombs are actually made of.

---

## 🛠️ Development Roadmap

### ✅ Phase 1 - Foundation
Setting up the project's data layer and context architecture.
- `farmReducer.js` with `useReducer` managing `{ seeds, plots[], chombRoster[] }`
- `FarmContext.jsx` providing `{ state, dispatch }` via `useFarm()` hook
- `initialState`: 9 empty plots, 3 starter Chombs (Biscuit, Mochi, Sprout)

### ✅ Phase 2 - Core UI
Building the visual farm and Chomb management sidebar.
- `FarmGrid` - 3×3 CSS grid of `PlotTile` components
- `PlotTile` - renders plot states with a crop progress bar
- `ChombRoster` - draggable Chomb cards using the HTML5 Drag & Drop API
- `HUD` bar displaying the live seed count
- `ChombShop` sidebar with purchasable Chombs; `UNLOCK_CHOMB` deducts seeds

### ✅ Phase 3 - Timers & Game Logic
Making the farm actually tick.
- `TICK_PLOT` action + `useEffect` interval in `PlotTile`
- Harvest, wilt, and replant mechanics with seed rewards per crop type
- `ChombShop` with purchasable Chombs sourced from `chombs.js` catalog

### ✅ Phase 3.5 - Game Fixes
Reworked core mechanic so each Chomb has a distinct role.
- New plot phase pipeline: `empty → fertilizing → fertilized → needs_water → watering → growing → ready → harvesting`
- Chomb roles: **Fertilizer** 🌿 (4 s) · **Waterer** 💧 (5 s) · **Harvester** ⚒ (4 s)
- Growing phase auto-ticks 30 s with no Chomb assignment needed
- Drop validation is role-gated - wrong Chomb type on a phase does nothing
- Crop picker appears after successful fertilization
- Role badges (color-coded) on every Chomb card and shop entry

### 🔄 Phase 4 - UI Polish *(currently here)*
Making the game feel alive and polished.
- [ ] Visual tile upgrades per phase (soil texture, water shimmer, grow pulse)
- [ ] Chomb drag-preview and hover feedback improvements
- [ ] Animated progress bars and phase transition effects
- [ ] Responsive layout pass - sidebar stacking on narrow viewports
- [ ] Accessible color contrast + focus-visible states
- [ ] General spacing, typography, and palette refinement

### 🔮 More phases coming…
Chomb leveling, save/load, sound, and more - still figuring it out as it grows 🌱

---

## 🛠️ Tech Stack

| Tool | Purpose |
|---|---|
| [Vite](https://vitejs.dev/) | Dev server & bundler |
| [React 19](https://react.dev/) | UI & state management (`useReducer`) |
| [CSS Modules](https://github.com/css-modules/css-modules) | Scoped component styles |
| [HTML5 Drag & Drop API](https://developer.mozilla.org/en-US/docs/Web/API/HTML_Drag_and_Drop_API) | Drag Chombs onto farm plots |

---

## 🚀 Getting Started

```bash
npm install
npm run dev
```

Then open [http://localhost:5173](http://localhost:5173) in your browser.

---

## 🎨 Assets

Art in this project comes from two wonderfully talented creators - please show them some love!

### 🐾 Chom Bombs Asset Pack
**Artist:** [chiecola](https://chiecola.itch.io/chom-bombs) - the adorable Chomb sprites that make the whole farm come alive.
**License (Full version, $2.50+):**
- ✅ Commercial and non-commercial use allowed
- ✅ Editing and modifying assets is allowed
- ❌ Do not resell or redistribute (modified or as-is)
- ❌ Do not use in crypto, blockchain, or NFT projects
- 💛 Credits not required but greatly appreciated - thanks, chiecola!

### 🌿 Sprout Lands UI Pack
**Artist:** [Cup Nooble](https://cupnooble.itch.io/sprout-lands-ui-pack) - the warm, earthy UI tiles and farm aesthetics.
**License (Premium, $3.99+):**
- ✅ Commercial and non-commercial use allowed
- ✅ Modifying assets is allowed
- ❌ Do not resell or redistribute (modified or as-is)
- 💛 Credit to the artist is greatly appreciated ^^

---
<div align="center">
  <sub>Made with ☕, code & way too many tabs open 🌸</sub>
</div>
