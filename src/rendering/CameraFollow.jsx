import { useThree, useFrame } from "@react-three/fiber"

export default function CameraFollow({ engine }) {
  const { camera } = useThree()

  useFrame(() => {
    const state = engine.getState()
    const player = state.player

    // Smooth follow Y
    camera.position.y += (player.y + 6 - camera.position.y) * 0.1

    // Look at player
    camera.lookAt(player.positionX, player.y, 0)
  })

  return null
}