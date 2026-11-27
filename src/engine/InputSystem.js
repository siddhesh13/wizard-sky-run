export const InputSystem = {
  init(engine) {
    window.addEventListener("keydown", (e) => {
      const state = engine.getState()
      const player = state.player

      // Restart
      if (e.code === "KeyR" && state.status === "GAME_OVER") {
        engine.reset()
        engine.start()
        return
      }

      if (state.status !== "PLAYING") return

      if (e.code === "ArrowLeft") {
        player.targetLane = Math.max(player.targetLane - 1, -1)
      }

      if (e.code === "ArrowRight") {
        player.targetLane = Math.min(player.targetLane + 1, 1)
      }

      if (e.code === "Space" && player.isGrounded) {
        player.velocityY = 15
      }
    })
  },

  update() {}
}