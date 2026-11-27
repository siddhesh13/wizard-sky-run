
import { GAME_CONFIG } from "../data/itemCatalog"

export const CollisionSystem = {
  update(state) {
    const player = state.player
    const world = state.world

    // --------------------------------
    // 1. Check collectible item collisions
    // --------------------------------

    const remainingItems = []

    for (const item of state.items) {
      const itemX = world.lanePositions[item.laneIndex + 1]

      if (itemX === undefined) {
        remainingItems.push(item)
        continue
      }

      // Horizontal collision
      const sameLane =
        Math.abs(player.positionX - itemX) <
        (player.width + (item.width ?? 1)) / 2

      // Depth collision
      const closeInZ =
        Math.abs(item.z) <
        (player.depth + (item.depth ?? 1)) / 2

      // Vertical collision
      const playerMinY = player.y
      const playerMaxY = player.y + player.height

      const itemY = item.y ?? 1
      const itemHeight = item.height ?? 1

      const itemMinY = itemY - itemHeight / 2
      const itemMaxY = itemY + itemHeight / 2

      const verticalOverlap =
        playerMaxY > itemMinY &&
        playerMinY < itemMaxY

      const collided =
        sameLane && closeInZ && verticalOverlap

      if (!collided) {
        remainingItems.push(item)
        continue
      }

      // --------------------------------
      // 2. Healthy item collection
      // --------------------------------

      if (item.category === "healthy") {
        const points = item.points ?? GAME_CONFIG.healthyPoints

        state.score.value += points
        state.score.healthyCollected += 1

        state.score.currentStreak += 1

        state.score.bestStreak = Math.max(
          state.score.bestStreak,
          state.score.currentStreak
        )

        console.log(
          `Collected ${item.name || item.id}: +${points}`
        )
      }

      // --------------------------------
      // 3. Unhealthy item collision
      // --------------------------------

      else if (item.category === "unhealthy") {
        state.game.lives = Math.max(0, state.game.lives - 1)

        state.score.unhealthyHits += 1
        state.score.currentStreak = 0

        console.log(
          `Hit ${item.name || item.id}: 1 life lost`
        )
      }
    }

    // Remove collected items so they cannot be processed twice
    state.items = remainingItems

    // --------------------------------
    // 4. Existing ring obstacle collision
    // Temporary: removed when M2 replaces the ring system
    // --------------------------------

    for (const obstacle of state.obstacles) {
      const obstacleX =
        world.lanePositions[obstacle.laneIndex + 1]

      const sameLane =
        Math.abs(player.positionX - obstacleX) < 1

      const closeInZ = Math.abs(obstacle.z) < 1

      const lowEnough = player.y < obstacle.height

      if (sameLane && closeInZ && lowEnough) {
        console.log("Ring collision")
        state.status = "GAME_OVER"
        break
      }
    }
  }
}
