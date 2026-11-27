export const ObstacleSystem = {
  update(state, delta) {
    const { world, obstacles, meta } = state

    // ---- Spawn Logic ----
    const spawnInterval = Math.max(
  0.7,
  2 - world.speed * 0.04
)

    if (meta.timeElapsed - meta.lastObstacleSpawn > spawnInterval) {
      meta.lastObstacleSpawn = meta.timeElapsed

      const randomLaneIndex = Math.floor(Math.random() * 3) - 1 // -1,0,1

      obstacles.push({
        id: Date.now(),
        laneIndex: randomLaneIndex,
        z: -120,
        width: 1,
        height: 2,
        depth: 1,
        active: true
      })
    }

    // ---- Move Obstacles ----
    for (let obstacle of obstacles) {
      obstacle.z += world.speed * delta
    }

    // ---- Cleanup Passed Obstacles ----
    state.obstacles = obstacles.filter(ob => ob.z < 20)
  }
}