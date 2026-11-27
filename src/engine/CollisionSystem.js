export const CollisionSystem = {
  update(state) {
    const player = state.player
    const obstacles = state.obstacles
    const world = state.world

    const playerZ = 0
    const collisionDistance = 1

    for (let obstacle of obstacles) {
      const obstacleX =
        world.lanePositions[obstacle.laneIndex + 1]

      const sameLane =
        Math.abs(player.positionX - obstacleX) < 1

      const closeInZ =
        Math.abs(obstacle.z - playerZ) < collisionDistance

      const lowEnough = player.y < obstacle.height

      if (closeInZ) {
        console.log("Near Z")
      }

      if (sameLane) {
        console.log("Same lane")
      }

      if (sameLane && closeInZ && lowEnough) {
        console.log("GAME OVER")
        state.status = "GAME_OVER"
      }
    }
  }
}