export const TestSystem = {
  update(state, delta) {
    console.log("Status:", state.status)
    console.log("X:", state.player.positionX.toFixed(2))
    console.log("Y:", state.player.y.toFixed(2))
    console.log("Obstacles:", state.obstacles.length)
    console.log("----")
  }
}