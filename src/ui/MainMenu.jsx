
import { useState } from "react"
import { connectArduino } from "../utils/arduino"

export default function MainMenu({ engine, onShowLeaderboard }) {
  const [name, setName] = useState("WizardRunner")

  const startGame = () => {
    // Reset all previous gameplay data
    engine.reset()

    const state = engine.getState()

    state.playerName = name.trim() || "WizardRunner"

    // Start the engine loop
    engine.start()
  }

  return (
    <div style={overlayStyle}>
      <h1 style={{ fontSize: "36px", marginBottom: "8px" }}>
        Wizard Sky Run
      </h1>

      <p style={{ color: "#b9c2d8" }}>
        Collect healthy items. Avoid unhealthy choices!
      </p>

      <input
        value={name}
        onChange={(e) => setName(e.target.value)}
        placeholder="Enter Player Name"
        maxLength={20}
        style={inputStyle}
      />

      <div style={buttonContainerStyle}>
        <button onClick={startGame} style={playButtonStyle}>
          Play
        </button>

        <button
          onClick={onShowLeaderboard}
          style={buttonStyle}
        >
          Leaderboard
        </button>

        <button
          onClick={connectArduino}
          style={buttonStyle}
        >
          Connect Arduino
        </button>
      </div>
    </div>
  )
}

const overlayStyle = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: "min(85%, 400px)",
  boxSizing: "border-box",
  background: "rgba(15, 22, 45, 0.96)",
  padding: "35px",
  borderRadius: "18px",
  border: "1px solid rgba(255,255,255,0.18)",
  color: "white",
  textAlign: "center",
  zIndex: 20,
  fontFamily: "Arial, sans-serif"
}

const inputStyle = {
  width: "100%",
  boxSizing: "border-box",
  padding: "12px",
  marginTop: "20px",
  fontSize: "16px",
  borderRadius: "8px",
  border: "1px solid #424b64",
  background: "#202943",
  color: "white",
  outline: "none"
}

const buttonContainerStyle = {
  display: "flex",
  flexDirection: "column",
  gap: "10px",
  marginTop: "22px"
}

const playButtonStyle = {
  padding: "13px 20px",
  fontSize: "16px",
  fontWeight: "bold",
  borderRadius: "8px",
  border: "none",
  cursor: "pointer",
  background: "#43c979",
  color: "#082416"
}

const buttonStyle = {
  padding: "11px 20px",
  fontSize: "14px",
  borderRadius: "8px",
  border: "1px solid rgba(255,255,255,0.2)",
  cursor: "pointer",
  background: "rgba(255,255,255,0.1)",
  color: "white"
}
