
import { getRandomItem } from "../data/itemCatalog"

let nextItemId = 1

const SPAWN_CONFIG = {
  spawnZ: -120,
  removeZ: 12,

  baseSpawnInterval: 2.2,
  minimumSpawnInterval: 0.9,

  healthyProbability: 0.65,

  itemY: 1,
  itemWidth: 1.2,
  itemHeight: 1.2,
  itemDepth: 0.8
}

function getRandomLane(previousLane) {
  const lanes = [-1, 0, 1]

  // Avoid placing consecutive items in the same lane.
  const availableLanes =
    previousLane === null
      ? lanes
      : lanes.filter(lane => lane !== previousLane)

  return availableLanes[
    Math.floor(Math.random() * availableLanes.length)
  ]
}

function getRandomCategory() {
  return Math.random() < SPAWN_CONFIG.healthyProbability
    ? "healthy"
    : "unhealthy"
}

function createItem(state) {
  const category = getRandomCategory()
  const selectedItem = getRandomItem(category)

  const laneIndex = getRandomLane(
    state.meta.lastItemLane ?? null
  )

  state.meta.lastItemLane = laneIndex

  return {
    instanceId: nextItemId++,

    ...selectedItem,

    laneIndex,
    z: SPAWN_CONFIG.spawnZ,

    x: 0,
    y: SPAWN_CONFIG.itemY,

    width: SPAWN_CONFIG.itemWidth,
    height: SPAWN_CONFIG.itemHeight,
    depth: SPAWN_CONFIG.itemDepth,

    active: true
  }
}

function getSpawnInterval(speed, baseSpeed) {
  const speedIncrease = speed - baseSpeed

  return Math.max(
    SPAWN_CONFIG.minimumSpawnInterval,
    SPAWN_CONFIG.baseSpawnInterval - speedIncrease * 0.035
  )
}

export const ItemSystem = {
  update(state, delta) {
    const { world, meta, items } = state

    // --------------------------------
    // 1. Spawn new items
    // --------------------------------

    const spawnInterval = getSpawnInterval(
      world.speed,
      world.baseSpeed
    )

    if (meta.timeElapsed - meta.lastItemSpawn >= spawnInterval) {
      meta.lastItemSpawn = meta.timeElapsed

      const newItem = createItem(state)

      items.push(newItem)
    }

    // --------------------------------
    // 2. Move items towards the player
    // --------------------------------

    for (const item of items) {
      item.z += world.speed * delta
    }

    // --------------------------------
    // 3. Remove items that passed the player
    // --------------------------------

    state.items = items.filter(
      item => item.z < SPAWN_CONFIG.removeZ
    )
  }
}
