
import { useEffect, useRef } from "react"
import { useFrame, useLoader } from "@react-three/fiber"
import {
  TextureLoader,
  DoubleSide,
  SRGBColorSpace
} from "three"

export default function ItemMesh({ item, world }) {
  const groupRef = useRef()

  const texture = useLoader(TextureLoader, item.asset)

  useEffect(() => {
    texture.colorSpace = SRGBColorSpace
    texture.needsUpdate = true
  }, [texture])

  const isHealthy = item.category === "healthy"

  const glowColor = isHealthy ? "#55ff88" : "#ff4444"

  const animationOffset = useRef(Math.random() * Math.PI * 2)

  useFrame(({ clock }) => {
    if (!groupRef.current) return

    const time = clock.elapsedTime + animationOffset.current

    // Position follows the game engine
    const laneX = world.lanePositions[item.laneIndex + 1]

    groupRef.current.position.x = laneX ?? 0
    groupRef.current.position.z = item.z

    // Floating animation
    groupRef.current.position.y =
      item.y + Math.sin(time * 2) * 0.15

    // Gentle rotation
    groupRef.current.rotation.y =
      Math.sin(time * 1.5) * 0.15

    groupRef.current.rotation.z =
      Math.sin(time) * 0.04
  })

  return (
    <group ref={groupRef} position={[0, item.y, item.z]}>

      {/* Glowing background disc */}
      <mesh position={[0, 0, -0.06]}>
        <circleGeometry args={[0.95, 32]} />

        <meshBasicMaterial
          color={glowColor}
          transparent
          opacity={0.16}
          side={DoubleSide}
          depthWrite={false}
        />
      </mesh>

      {/* Outer ring */}
      <mesh position={[0, 0, -0.035]}>
        <torusGeometry args={[0.83, 0.045, 8, 48]} />

        <meshBasicMaterial
          color={glowColor}
          transparent
          opacity={0.8}
        />
      </mesh>

      {/* Original SVG illustration */}
      <mesh>
        <planeGeometry args={[1.5, 1.5]} />

        <meshBasicMaterial
          map={texture}
          transparent
          alphaTest={0.02}
          side={DoubleSide}
          toneMapped={false}
        />
      </mesh>

    </group>
  )
}
