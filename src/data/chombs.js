// Central catalog of all Chomb types.
// catalogKey is the stable unique identifier used in state and the shop.
// Starters (cost: 0) are pre-unlocked in initialState; the shop hides them.
//
// role: "fertilizer" | "waterer" | "harvester"
//   fertilizer — prepares empty plots (4 s)
//   waterer    — waters planted crops (5 s)
//   harvester  — harvests ready crops (4 s)

export const CHOMB_CATALOG = [
    // Starters (already in roster)
    { catalogKey: "biscuit", name: "Biscuit", role: "fertilizer", specialty: "Fertilizing", level: 1, cost: 0  },
    { catalogKey: "mochi",   name: "Mochi",   role: "waterer",    specialty: "Watering",    level: 1, cost: 0  },
    { catalogKey: "sprout",  name: "Sprout",  role: "harvester",  specialty: "Harvesting",  level: 1, cost: 0  },

    // Purchasable
    { catalogKey: "cinder",  name: "Cinder",  role: "fertilizer", specialty: "Fertilizing", level: 2, cost: 15 },
    { catalogKey: "pebble",  name: "Pebble",  role: "harvester",  specialty: "Harvesting",  level: 2, cost: 20 },
    { catalogKey: "dewdrop", name: "Dewdrop", role: "waterer",    specialty: "Watering",    level: 2, cost: 35 },
    { catalogKey: "bramble", name: "Bramble", role: "fertilizer", specialty: "Fertilizing", level: 3, cost: 50 },
];
