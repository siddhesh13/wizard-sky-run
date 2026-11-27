import { useThree, useFrame } from "@react-three/fiber"

export default function CameraRig({ engine }) {
  const { camera } = useThree()

  useFrame(() => {
    const state = engine.getState()
    const player = state.player

    // Smooth vertical follow
    const targetY = player.y + 4
    camera.position.y += (targetY - camera.position.y) * 0.08

    // Fixed forward position (runner style)
    camera.position.x = 0
    camera.position.z = 8

    // Look slightly ahead into depth
   camera.lookAt(0, player.y + 1, -40)
  })

  return null
}