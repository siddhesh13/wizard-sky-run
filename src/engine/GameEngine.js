
import { createInitialState } from "./createInitialState"

export class GameEngine {
  constructor() {
    this.state = createInitialState()
    this.systems = []
    this.isRunning = false
  }

  addSystem(system) {
    this.systems.push(system)
  }

  start() {
    this.state.status = "PLAYING"
    this.isRunning = true
  }

  stop() {
    this.isRunning = false
  }

  reset() {
    this.state = createInitialState()
    this.isRunning = false
  }

  update(delta) {
    if (!this.isRunning) return

    if (this.state.status !== "PLAYING") {
      this.isRunning = false
      return
    }

    // Update game time and distance
    this.state.meta.timeElapsed += delta

    this.state.world.distanceTraveled +=
      this.state.world.speed * delta

    // Gradually increase game speed
    const world = this.state.world

    if (world.speed < world.maxSpeed) {
      world.speed = Math.min(
        world.maxSpeed,
        world.speed + 2 * delta
      )
    }

    // Update all game systems
    for (const system of this.systems) {
      system.update(this.state, delta)

      // Stop processing if a system ends the game
      if (this.state.status !== "PLAYING") {
        break
      }
    }

    // Check game-over condition
    if (this.state.game.lives <= 0) {
      this.state.status = "GAME_OVER"
      this.isRunning = false
      return
    }

    // Check win condition
    if (
      this.state.score.healthyCollected >=
      this.state.game.healthyTarget
    ) {
      this.state.status = "WIN"
      this.isRunning = false
      return
    }

    // Handle other terminal states
    if (this.state.status !== "PLAYING") {
      this.isRunning = false
    }
  }

  getState() {
    return this.state
  }
}
