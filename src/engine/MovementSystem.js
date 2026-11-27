export const MovementSystem = {
  update(state, delta) {
    const player = state.player
    const world = state.world

// ---- Lane interpolation (smooth glide) ----
const lanePositions = world.lanePositions

// Hard clamp targetLane
if (player.targetLane < -1) player.targetLane = -1
if (player.targetLane > 1) player.targetLane = 1

const targetX = lanePositions[player.targetLane + 1]

if (targetX !== undefined) {
  const glideSpeed = 8  // adjust for feel (6–12 range)

  const smoothFactor = 1 - Math.exp(-glideSpeed * delta)

  player.positionX += (targetX - player.positionX) * smoothFactor
}

    // ---- Gravity ----
    player.velocityY += world.gravity * delta
    player.y += player.velocityY * delta

    // ---- Ground detection ----
    if (player.y <= 0) {
      player.y = 0
      player.velocityY = 0
      player.isGrounded = true
    } else {
      player.isGrounded = false
    }
  }
}