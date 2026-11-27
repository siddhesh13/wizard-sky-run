import { useState } from "react"

export default function StartScreen({ engine }) {
  const [name, setName] = useState("WizardRunner")

  const startGame = () => {
    const state = engine.getState()
    state.playerName = name || "WizardRunner"
    state.status = "PLAYING"
  }

  return (
    <div style={overlayStyle}>
      <h1>Wizard Sky Run</h1>

      <input
        value={name}
        onChange={(e) => setName(e.target.value)}
        placeholder="Enter Name"
        style={inputStyle}
      />

      <button onClick={startGame} style={buttonStyle}>
        Start Game
      </button>
    </div>
  )
}

const overlayStyle = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  background: "rgba(0,0,0,0.9)",
  padding: "40px",
  borderRadius: "12px",
  color: "white",
  textAlign: "center",
  zIndex: 20,
  fontFamily: "sans-serif"
}

const inputStyle = {
  padding: "10px",
  marginTop: "15px",
  fontSize: "16px",
  borderRadius: "6px",
  border: "none"
}

const buttonStyle = {
  marginTop: "20px",
  padding: "10px 20px",
  fontSize: "16px",
  borderRadius: "6px",
  border: "none",
  cursor: "pointer"
}