import { useFrame } from "@react-three/fiber"
import { useGLTF } from "@react-three/drei"
import { useRef } from "react"

export default function PlayerMesh({ engine }) {
  const groupRef = useRef()

  // Load model from public folder
  const { scene } = useGLTF("/models/wizard.glb")

  useFrame(() => {
    if (!engine || !groupRef.current) return

    const state = engine.getState()
    const player = state.player
    const group = groupRef.current

    // Position from engine
    group.position.x = player.positionX
    group.position.y = player.y + 1
    group.position.z = 0

    // Smooth lane tilt
    const tiltTarget = (player.targetLane - player.positionX / 3) * -0.4
group.rotation.z += (tiltTarget - group.rotation.z) * 0.1

    // Slight forward lean while jumping
    const jumpLean = player.y * 0.08
    group.rotation.x += (jumpLean - group.rotation.x) * 0.1
  })

  return (
    <group
      ref={groupRef}
      scale={0.02}                 // Adjust scale if too big/small
      rotation={[0, Math.PI*2, 0]}  // Flip if facing wrong direction
    >
      <primitive object={scene} />
    </group>
  )
}

// Preload for performance
useGLTF.preload("/models/wizard.glb")