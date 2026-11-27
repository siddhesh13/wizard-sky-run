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
  }

 update(delta) {
  if (!this.isRunning) return
  if (this.state.status !== "PLAYING") return

  // Update timers
  this.state.meta.timeElapsed += delta
  this.state.world.distanceTraveled += this.state.world.speed * delta

  // Score increase
  this.state.score.value += delta * 10

  // -------- WIN CONDITION --------
  if (this.state.score.value >= 1000) {
    this.state.status = "WIN"
    this.isRunning = false
    return
  }

  // Increase speed over time
  const world = this.state.world
  if (world.speed < world.maxSpeed) {
    world.speed += 2 * delta
  }

  // Run systems
  for (let system of this.systems) {
    system.update(this.state, delta)
  }
}

  getState() {
    return this.state
  }
}