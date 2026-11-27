
import { Canvas } from "@react-three/fiber"
import { Suspense, useEffect, useState, useRef, useMemo } from "react"

import PlayerMesh from "./PlayerMesh"
import ItemsMesh from "./ItemsMesh"
import CameraRig from "./CameraRig"

import MainMenu from "../ui/MainMenu"
import Leaderboard from "../ui/Leaderboard"
import GameHUD from "../ui/GameHUD"

import VisionInput from "../input/VisionInput"

import { saveScore } from "../utils/leaderboard"
import { sendArduinoCommand } from "../utils/arduino"

const overlayStyle = {
  position: "absolute",
  inset: 0,
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  zIndex: 30,
  background: "rgba(5, 10, 25, 0.58)",
  fontFamily: "Arial, sans-serif"
}

const panelStyle = {
  width: "min(90%, 420px)",
  padding: "32px",
  borderRadius: "22px",
  textAlign: "center",
  color: "white",
  background: "rgba(15, 22, 45, 0.96)",
  border: "1px solid rgba(255,255,255,0.18)",
  boxShadow: "0 20px 60px rgba(0,0,0,0.4)"
}

const primaryButtonStyle = {
  padding: "12px 24px",
  border: "none",
  borderRadius: "9px",
  background: "#43c979",
  color: "#082416",
  fontSize: "15px",
  fontWeight: "bold",
  cursor: "pointer"
}

const secondaryButtonStyle = {
  ...primaryButtonStyle,
  background: "rgba(255,255,255,0.12)",
  color: "white",
  border: "1px solid rgba(255,255,255,0.2)"
}

export default function GameScene({ engine }) {
  const [state, setState] = useState(engine.getState())
  const [showLeaderboard, setShowLeaderboard] = useState(false)

  const hasSavedRef = useRef(false)

  // --------------------------------
  // Environment
  // --------------------------------

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

  // --------------------------------
  // Engine state polling and end handling
  // --------------------------------

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
          Math.floor(currentState.score.value)
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

  // --------------------------------
  // Game navigation
  // --------------------------------

  const returnToMenu = () => {
    engine.reset()
    engine.getState().status = "MENU"

    setShowLeaderboard(false)
    hasSavedRef.current = false
    setState({ ...engine.getState() })
  }

  const playAgain = () => {
    const playerName = engine.getState().playerName

    engine.reset()
    engine.getState().playerName = playerName
    engine.start()

    setShowLeaderboard(false)
    hasSavedRef.current = false
    setState({ ...engine.getState() })
  }

  // --------------------------------
  // Keyboard controls for end screens
  // --------------------------------

  useEffect(() => {
    const handleKey = (event) => {
      if (
        state.status !== "GAME_OVER" &&
        state.status !== "WIN"
      ) {
        return
      }

      if (event.key === "Enter") {
        playAgain()
      }

      if (
        event.key === "Escape" ||
        event.key.toLowerCase() === "r"
      ) {
        returnToMenu()
      }
    }

    window.addEventListener("keydown", handleKey)

    return () => {
      window.removeEventListener("keydown", handleKey)
    }
  }, [state.status])

  return (
    <>
      {/* --------------------------------
          MAIN MENU
      -------------------------------- */}

      {state.status === "MENU" && !showLeaderboard && (
        <MainMenu
          engine={engine}
          onShowLeaderboard={() => setShowLeaderboard(true)}
        />
      )}

      {/* --------------------------------
          LEADERBOARD
      -------------------------------- */}

      {state.status === "MENU" && showLeaderboard && (
        <Leaderboard
          onBack={() => setShowLeaderboard(false)}
        />
      )}

      {/* --------------------------------
          GAME HUD
      -------------------------------- */}

      {state.status === "PLAYING" && (
        <GameHUD state={state} />
      )}

      {/* --------------------------------
          GAME OVER SCREEN
      -------------------------------- */}

      {state.status === "GAME_OVER" && (
        <div style={overlayStyle}>
          <div style={panelStyle}>
            <div style={{ fontSize: "48px" }}>💔</div>

            <h1 style={{ margin: "10px 0", color: "#ff7373" }}>
              GAME OVER
            </h1>

            <p style={{ color: "#b9c2d8" }}>
              You ran out of lives. Keep making healthy choices!
            </p>

            <div style={statsGridStyle}>
              <Stat label="FINAL SCORE" value={Math.floor(state.score.value)} />
              <Stat label="HEALTHY ITEMS" value={state.score.healthyCollected} />
              <Stat label="UNHEALTHY HITS" value={state.score.unhealthyHits} />
              <Stat label="BEST STREAK" value={state.score.bestStreak} />
            </div>

            <div style={buttonGroupStyle}>
              <button
                style={primaryButtonStyle}
                onClick={playAgain}
              >
                Play Again
              </button>

              <button
                style={secondaryButtonStyle}
                onClick={returnToMenu}
              >
                Main Menu
              </button>
            </div>

            <p style={hintStyle}>
              Enter: Play Again &nbsp; | &nbsp; R / Esc: Main Menu
            </p>
          </div>
        </div>
      )}

      {/* --------------------------------
          WIN SCREEN
      -------------------------------- */}

      {state.status === "WIN" && (
        <div style={overlayStyle}>
          <div style={panelStyle}>
            <div style={{ fontSize: "48px" }}>🏆</div>

            <h1 style={{ margin: "10px 0", color: "#8effb0" }}>
              YOU DID IT!
            </h1>

            <p style={{ color: "#b9c2d8" }}>
              Great job! You collected enough healthy items.
            </p>

            <div style={statsGridStyle}>
              <Stat label="FINAL SCORE" value={Math.floor(state.score.value)} />
              <Stat label="HEALTHY ITEMS" value={state.score.healthyCollected} />
              <Stat label="UNHEALTHY HITS" value={state.score.unhealthyHits} />
              <Stat label="BEST STREAK" value={state.score.bestStreak} />
            </div>

            <div style={buttonGroupStyle}>
              <button
                style={primaryButtonStyle}
                onClick={playAgain}
              >
                Play Again
              </button>

              <button
                style={secondaryButtonStyle}
                onClick={returnToMenu}
              >
                Main Menu
              </button>
            </div>

            <p style={hintStyle}>
              Enter: Play Again &nbsp; | &nbsp; R / Esc: Main Menu
            </p>
          </div>
        </div>
      )}

      {/* --------------------------------
          COMPUTER VISION
      -------------------------------- */}

      <VisionInput engine={engine} />

      {/* --------------------------------
          3D WORLD
      -------------------------------- */}

      <Canvas
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          width: "100%",
          height: "100%"
        }}
        camera={{
          position: [0, 5, 14],
          fov: 70
        }}
      >
        <color attach="background" args={["#0b1026"]} />

        <fog
          attach="fog"
          args={["#0b1026", 30, 200]}
        />

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

        <CameraRig engine={engine} />

        <PlayerMesh engine={engine} />

        <Suspense fallback={null}>
          <ItemsMesh engine={engine} />
        </Suspense>

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

function Stat({ label, value }) {
  return (
    <div style={statCardStyle}>
      <div style={statLabelStyle}>{label}</div>
      <div style={statValueStyle}>{value}</div>
    </div>
  )
}

const statsGridStyle = {
  display: "grid",
  gridTemplateColumns: "1fr 1fr",
  gap: "10px",
  margin: "24px 0"
}

const statCardStyle = {
  padding: "14px 8px",
  borderRadius: "10px",
  background: "rgba(255,255,255,0.07)"
}

const statLabelStyle = {
  fontSize: "10px",
  letterSpacing: "1px",
  color: "#aeb9d0",
  marginBottom: "7px"
}

const statValueStyle = {
  fontSize: "25px",
  fontWeight: "bold",
  color: "white"
}

const buttonGroupStyle = {
  display: "flex",
  justifyContent: "center",
  flexWrap: "wrap",
  gap: "12px"
}

const hintStyle = {
  marginTop: "22px",
  marginBottom: 0,
  color: "#8994ad",
  fontSize: "11px"
}
