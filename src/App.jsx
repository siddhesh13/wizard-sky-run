import { useEffect, useRef, useState } from "react"
import { GameEngine } from "./engine/GameEngine"
import { MovementSystem } from "./engine/MovementSystem"
//import { ObstacleSystem } from "./engine/ObstacleSystem"
import { CollisionSystem } from "./engine/CollisionSystem"
import GameScene from "./rendering/GameScene"
import { InputSystem } from "./engine/InputSystem"
import { ItemSystem } from "./engine/ItemSystem"

function App() {
  const engineRef = useRef(null)
  const [ready, setReady] = useState(false)

  useEffect(() => {
    const engine = new GameEngine()
    engineRef.current = engine
    InputSystem.init(engine)

    engine.addSystem(InputSystem)
engine.addSystem(MovementSystem)
engine.addSystem(ItemSystem)
engine.addSystem(CollisionSystem)
    
    engine.getState().status = "MENU"
    
    let lastTime = performance.now()

    function gameLoop(currentTime) {
      const delta = (currentTime - lastTime) / 1000
      lastTime = currentTime

      engine.update(delta)
      requestAnimationFrame(gameLoop)
    }

    requestAnimationFrame(gameLoop)

    setReady(true)
  }, [])

  if (!ready) return null

  return <GameScene engine={engineRef.current} />
}

export default App