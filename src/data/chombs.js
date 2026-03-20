// Central catalog of all Chomb types.
// catalogKey is the stable unique identifier used in state and the shop.
// Starters (cost: 0) are pre-unlocked in initialState; the shop hides them.

export const CHOMB_CATALOG = [
    // Starters (already in roster) 
    { catalogKey: "biscuit", name: "Biscuit", specialty: "Watering",     level: 1, cost: 0  },
    { catalogKey: "mochi",   name: "Mochi",   specialty: "Harvesting",   level: 1, cost: 0  },
    { catalogKey: "sprout",  name: "Sprout",  specialty: "Fertilizing",  level: 1, cost: 0  },

    // Purchasable 
    { catalogKey: "cinder",  name: "Cinder",  specialty: "Composting",   level: 1, cost: 15 },
    { catalogKey: "pebble",  name: "Pebble",  specialty: "Weeding",      level: 1, cost: 20 },
    { catalogKey: "dewdrop", name: "Dewdrop", specialty: "Rain-calling",  level: 2, cost: 35 },
    { catalogKey: "bramble", name: "Bramble", specialty: "Pruning",       level: 2, cost: 50 },
];
