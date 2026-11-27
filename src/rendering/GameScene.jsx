import { Canvas } from "@react-three/fiber"
import { useEffect, useState, useRef, useMemo } from "react"
import PlayerMesh from "./PlayerMesh"
import ObstaclesMesh from "./ObstaclesMesh"
import CameraRig from "./CameraRig"
import MainMenu from "../ui/MainMenu"
import Leaderboard from "../ui/Leaderboard"
import { saveScore } from "../utils/leaderboard"
import VisionInput from "../input/VisionInput"
import { connectArduino, sendArduinoCommand } from "../utils/arduino"

export default function GameScene({ engine }) {
  const [state, setState] = useState(engine.getState())
  const [showLeaderboard, setShowLeaderboard] = useState(false)
  const hasSavedRef = useRef(false)

  // ---------- Generate environment once ----------
  const stars = useMemo(() => {
    return Array.from({ length: 200 }).map(() => ({
      position: [
        (Math.random() - 0.5) * 200,
        Math.random() * 80,
        -Math.random() * 300
      ]
    }))
  }, [])

  const clouds = useMemo(() => {
    return Array.from({ length: 20 }).map(() => ({
      position: [
        (Math.random() - 0.5) * 50,
        8 + Math.random() * 10,
        -Math.random() * 200
      ]
    }))
  }, [])

  const towers = useMemo(() => {
    return Array.from({ length: 10 }).map(() => ({
      position: [
        (Math.random() - 0.5) * 80,
        5,
        -100 - Math.random() * 200
      ]
    }))
  }, [])

  // ---------- UI update loop ----------
  useEffect(() => {
    const interval = setInterval(() => {
      const currentState = engine.getState()
      setState({ ...currentState })

     

     if (
  (currentState.status === "GAME_OVER" ||
   currentState.status === "WIN") &&
  !hasSavedRef.current
) {
  saveScore(
    currentState.playerName,
    currentState.score.value
  )

  sendArduinoCommand(currentState.status)

  hasSavedRef.current = true
}

      if (currentState.status === "PLAYING") {
        hasSavedRef.current = false
      }
    }, 100)

    return () => clearInterval(interval)
  }, [engine])

  // ---------- Press R to return to MENU ----------
  useEffect(() => {
    const handleKey = (e) => {
      if (e.key.toLowerCase() === "r" && state.status === "GAME_OVER") {
        engine.reset()
        engine.getState().status = "MENU"
        setShowLeaderboard(false)
        hasSavedRef.current = false
      }
    }

    window.addEventListener("keydown", handleKey)
    return () => window.removeEventListener("keydown", handleKey)
  }, [state.status, engine])

  return (
    <>
      {/* MENU */}
      {state.status === "MENU" && !showLeaderboard && (
        <MainMenu
          engine={engine}
          onShowLeaderboard={() => setShowLeaderboard(true)}
        />
      )}

      {state.status === "MENU" && showLeaderboard && (
        <Leaderboard
          onBack={() => setShowLeaderboard(false)}
        />
      )}

      {/* SCORE */}
      {state.status === "PLAYING" && (
        <div
          style={{
            position: "absolute",
            top: 20,
            left: 20,
            fontSize: "24px",
            fontWeight: "bold",
            color: "white",
            zIndex: 10,
            fontFamily: "sans-serif"
          }}
        >
          Score: {state.score.value.toFixed(0)}
        </div>
      )}

      {/* GAME OVER */}
      {state.status === "GAME_OVER" && (
        <div
          style={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            textAlign: "center",
            color: "white",
            zIndex: 20,
            fontFamily: "sans-serif"
          }}
        >
          <h2>GAME OVER</h2>
          <p>Press R to return to Menu</p>
        </div>
      )}
      {state.status === "WIN" && (
  <div
    style={{
      position: "absolute",
      top: "50%",
      left: "50%",
      transform: "translate(-50%, -50%)",
      textAlign: "center",
      color: "white",
      zIndex: 20,
      fontFamily: "sans-serif"
    }}
  >
    <h1>YOU WIN 🧙‍♂️</h1>
    <p>Score: {state.score.value.toFixed(0)}</p>
    <p>Press R to return to Menu</p>
  </div>
)}

      {/* Computer Vision */}
      <VisionInput engine={engine} />

      {/* 3D WORLD */}
      <Canvas
        style={{
          position: "absolute",
          top: 0,
          left: 0
        }}
        camera={{ position: [0, 5, 14], fov: 70 }}
      >
        {/* Sky */}
        <color attach="background" args={["#0b1026"]} />
        <fog attach="fog" args={["#0b1026", 30, 200]} />

        {/* Lights */}
        <ambientLight intensity={0.4} />
        <directionalLight
          position={[5, 15, 5]}
          intensity={1}
          color="#ffcc80"
        />

        {/* Moon */}
        <mesh position={[20, 25, -80]}>
          <sphereGeometry args={[5, 32, 32]} />
          <meshStandardMaterial
            color="#ddddff"
            emissive="#8888ff"
            emissiveIntensity={1.5}
          />
        </mesh>

        {/* Stars */}
        {stars.map((star, i) => (
          <mesh key={i} position={star.position}>
            <sphereGeometry args={[0.2, 8, 8]} />
            <meshBasicMaterial color="white" />
          </mesh>
        ))}

        {/* Clouds */}
        {clouds.map((cloud, i) => (
          <mesh key={i} position={cloud.position}>
            <sphereGeometry args={[3, 16, 16]} />
            <meshStandardMaterial
              color="#ccccff"
              transparent
              opacity={0.3}
            />
          </mesh>
        ))}

        {/* Distant Towers */}
        {towers.map((tower, i) => (
          <mesh key={i} position={tower.position}>
            <cylinderGeometry args={[2, 3, 15, 8]} />
            <meshStandardMaterial color="#1a1a2e" />
          </mesh>
        ))}

        {/* Camera */}
        <CameraRig engine={engine} />

        {/* Player */}
        <PlayerMesh engine={engine} />

        {/* Obstacles */}
        <ObstaclesMesh engine={engine} />

        {/* Cloud Ground */}
        <mesh
          rotation={[-Math.PI / 2, 0, 0]}
          position={[0, -0.01, -150]}
        >
          <planeGeometry args={[50, 1000]} />
          <meshStandardMaterial
            color="#d0d8ff"
            transparent
            opacity={0.6}
          />
        </mesh>

        {/* Fog Layer */}
        <mesh position={[0, 2, -100]}>
          <planeGeometry args={[200, 400]} />
          <meshStandardMaterial
            color="#8899ff"
            transparent
            opacity={0.15}
          />
        </mesh>
      </Canvas>
    </>
  )
}