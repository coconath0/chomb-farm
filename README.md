# 🌱 Chomb Farm

![Status](https://img.shields.io/badge/status-in%20development-brightgreen?style=flat-square)

Chomb Farm is a cozy pixel-art farming game where you tend a 3×3 plot grid with the help of your Chomb crew - small, round, surprisingly hard-working little creatures. Plant crops, drag a Chomb onto a plot to set them to work, and watch the harvest timer tick down before the crop wilts. Each Chomb can only tend one plot at a time, so you'll need to manage your roster wisely as your farm grows. The goal is simple: keep the fields lush, earn seeds, and maybe figure out what Chombs are actually made of.

---

## 🛠️ Development Roadmap

### ✅ Phase 1 - Foundation
Setting up the project's data layer and context architecture.
- `farmReducer.js` with `useReducer` managing `{ seeds, plots[], chombRoster[] }`
- Actions: `ASSIGN_CHOMB`, `REASSIGN_CHOMB`, `HARVEST_PLOT`, `WILT_PLOT`, `EARN_SEEDS`, `ADD_CROP`
- `FarmContext.jsx` providing `{ state, dispatch }` via `useFarm()` hook
- `initialState`: 9 empty plots, 3 starter Chombs (Biscuit, Mochi, Sprout)

### ✅ Phase 2 - Core UI
Building the visual farm and Chomb management sidebar.
- `FarmGrid` - 3×3 CSS grid of `PlotTile` components
- `PlotTile` - renders empty, occupied, and wilted states with a crop progress bar
- `ChombRoster` - draggable Chomb cards using the HTML5 Drag & Drop API
- Drop handling on tiles: `ASSIGN_CHOMB` for empty plots, `REASSIGN_CHOMB` for occupied ones
- Drag-over highlight, busy-state dimming, and per-crop harvest window timers

### ✅ Phase 3 - Timers & Game Logic
Making the farm actually tick.
- `TICK_PLOT` action decrementing `timerSeconds` each second
- `useEffect` interval in `PlotTile` tied to `plot.chombId` - cleanup fires on reassignment, stopping the old timer cleanly
- Auto-wilt when the countdown reaches zero
- Harvest button (visible while `timerSeconds > 10`) dispatching `HARVEST_PLOT` and awarding seeds per crop type
- Replant button on wilted plots dispatching `REPLANT_PLOT` to reset them to empty
- `HUD` bar displaying the live seed count from context
- `ChombShop` sidebar with purchasable Chombs sourced from `chombs.js` catalog; `UNLOCK_CHOMB` deducts seeds and pushes into the roster; Buy button disabled when funds are insufficient

### 🔄 Phase 3.5 - Testing *(currently here)*
Making sure everything that was built actually holds up.

### 🔮 More phases coming…
Planting UI, Chomb leveling, save/load, sound, and more - still figuring it out as it grows 🌱

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
