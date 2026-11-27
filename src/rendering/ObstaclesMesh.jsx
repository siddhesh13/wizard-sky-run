import { useFrame } from "@react-three/fiber"
import { useRef } from "react"

export default function ObstaclesMesh({ engine }) {
  const state = engine.getState()
  const world = state.world

  return (
    <>
      {state.obstacles.map(obstacle => (
        <RingObstacle
          key={obstacle.id}
          obstacle={obstacle}
          world={world}
        />
      ))}
    </>
  )
}

function RingObstacle({ obstacle, world }) {
  const ref = useRef()

  useFrame(() => {
    if (!ref.current) return
    ref.current.rotation.y += 0.05
  })

  return (
    <group
      ref={ref}
      position={[
        world.lanePositions[obstacle.laneIndex + 1],
        2,
        obstacle.z
      ]}
    >
      {/* Main ring */}
      <mesh>
        <torusGeometry args={[1, 0.25, 16, 32]} />
        <meshStandardMaterial
          color="#ffd54f"
          emissive="#ffb300"
          emissiveIntensity={2}
        />
      </mesh>

      {/* Soft glow layer */}
      <mesh scale={1.3}>
        <torusGeometry args={[1, 0.25, 16, 32]} />
        <meshStandardMaterial
          color="#fff176"
          transparent
          opacity={0.3}
        />
      </mesh>
    </group>
  )
}