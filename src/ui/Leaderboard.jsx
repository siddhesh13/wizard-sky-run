import { getScores } from "../utils/leaderboard"

export default function Leaderboard({ onBack }) {
  const scores = getScores()

  return (
    <div style={overlayStyle}>
      <h2>🏆 Leaderboard</h2>

      <table style={tableStyle}>
        <thead>
          <tr>
            <th>#</th>
            <th>Name</th>
            <th>Score</th>
          </tr>
        </thead>
        <tbody>
          {scores.map((entry, index) => (
            <tr key={entry.id}>
              <td>{index + 1}</td>
              <td>{entry.name}</td>
              <td>{entry.score}</td>
            </tr>
          ))}
        </tbody>
      </table>

      <button onClick={onBack} style={buttonStyle}>
        Back
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
  minWidth: "400px",
  zIndex: 20,
  fontFamily: "sans-serif"
}

const tableStyle = {
  width: "100%",
  borderCollapse: "collapse",
  marginBottom: "20px"
}

const buttonStyle = {
  padding: "10px 20px",
  fontSize: "16px",
  borderRadius: "6px",
  border: "none",
  cursor: "pointer"
}