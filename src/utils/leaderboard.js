const KEY = "wizard_runner_scores"

export function saveScore(name, score) {
  if (!score || score <= 0) return

  const existing = JSON.parse(localStorage.getItem(KEY)) || []

  existing.push({
    id: Date.now(),
    name: name || "WizardRunner",
    score: Math.floor(score)
  })

  existing.sort((a, b) => b.score - a.score)

  const top10 = existing.slice(0, 10)

  localStorage.setItem(KEY, JSON.stringify(top10))
}

export function getScores() {
  return JSON.parse(localStorage.getItem(KEY)) || []
}