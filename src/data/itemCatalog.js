
const healthyItems = [
  { id: "water_bottle", name: "Water Bottle", points: 10 },
  { id: "fresh_apple", name: "Fresh Apple", points: 10 },
  { id: "broccoli", name: "Broccoli", points: 10 },
  { id: "almonds", name: "Almonds", points: 10 },
  { id: "coconut_water", name: "Coconut Water", points: 10 },
  { id: "football", name: "Football", points: 10 },
  { id: "dumbbell", name: "Dumbbell", points: 10 },
  { id: "toothbrush", name: "Toothbrush", points: 10 },
  { id: "sleep_pillow", name: "Sleep Pillow", points: 10 },
  { id: "radiant_sun", name: "Radiant Sun", points: 10 },
  { id: "healthy_cell", name: "Healthy Cell", points: 10 }
]

const unhealthyItems = [
  { id: "gutka_pouch", name: "Gutka", points: 0 },
  { id: "cigarette", name: "Cigarette", points: 0 },
  { id: "alcohol_bottle", name: "Alcohol", points: 0 },
  { id: "hookah", name: "Hookah", points: 0 },
  { id: "soda_can", name: "Soda", points: 0 },
  { id: "chips_packet", name: "Chips", points: 0 },
  { id: "fast_food", name: "Fast Food", points: 0 },
  { id: "energy_drink", name: "Energy Drink", points: 0 },
  { id: "late_night_screen", name: "Late Night Screen", points: 0 },
  { id: "cancer_cell", name: "Cancer Cell", points: 0 }
]

export const ITEM_CATALOG = [
  ...healthyItems.map(item => ({
    ...item,
    category: "healthy",
    asset: `/assets/items/healthy/${item.id}.svg`
  })),

  ...unhealthyItems.map(item => ({
    ...item,
    category: "unhealthy",
    asset: `/assets/items/unhealthy/${item.id}.svg`
  }))
]

export const GAME_CONFIG = {
  startingLives: 3,
  healthyTarget: 10,
  healthyPoints: 10
}

export function getRandomItem(category) {
  const availableItems = ITEM_CATALOG.filter(
    item => item.category === category
  )

  return availableItems[
    Math.floor(Math.random() * availableItems.length)
  ]
}
