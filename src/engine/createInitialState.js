
import { GAME_CONFIG } from "../data/itemCatalog"

export function createInitialState() {
  return {
    status: "START",

    playerName: "WizardRunner",

    player: {
      laneIndex: 0,
      targetLane: 0,
      positionX: 0,
      y: 0,
      velocityY: 0,
      isGrounded: true,
      width: 1,
      height: 2,
      depth: 1
    },

    world: {
      speed: 14,
      baseSpeed: 14,
      maxSpeed: 50,
      gravity: -25,
      lanePositions: [-3, 0, 3],
      distanceTraveled: 0
    },

    // New V2 collectible objects
    items: [],

    // Existing obstacles retained temporarily
    obstacles: [],

    score: {
      value: 0,
      multiplier: 1,
      healthyCollected: 0,
      unhealthyHits: 0,
      currentStreak: 0,
      bestStreak: 0
    },

    game: {
      lives: GAME_CONFIG.startingLives,
      startingLives: GAME_CONFIG.startingLives,
      healthyTarget: GAME_CONFIG.healthyTarget
    },

    meta: {
      timeElapsed: 0,
      lastObstacleSpawn: 0,
      lastItemSpawn: 0,
      lastItemLane: null
    }
  }
}
