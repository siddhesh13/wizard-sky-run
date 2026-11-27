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

    obstacles: [],

    score: {
      value: 0,
      multiplier: 1
    },

    meta: {
      timeElapsed: 0,
      lastObstacleSpawn: 0
    }
  }
}