import { useEffect, useRef, useState } from "react"
import {
  FilesetResolver,
  PoseLandmarker
} from "@mediapipe/tasks-vision"

export default function VisionInput({ engine }) {
  const videoRef = useRef(null)
  const canvasRef = useRef(null)
  const poseRef = useRef(null)
  const animationRef = useRef(null)

  const stableLaneRef = useRef(0)
  const stableFramesRef = useRef(0)
  const [showPreview, setShowPreview] = useState(true)
  useEffect(() => {
    let isMounted = true

    async function init() {
      const vision = await FilesetResolver.forVisionTasks(
        "https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision/wasm"
      )

      const poseLandmarker = await PoseLandmarker.createFromOptions(
        vision,
        {
          baseOptions: {
            modelAssetPath: "/models/pose_landmarker_lite.task"
          },
          runningMode: "VIDEO",
          numPoses: 1
        }
      )

      poseRef.current = poseLandmarker

      const stream = await navigator.mediaDevices.getUserMedia({
        video: true
      })

      if (!isMounted) return

      videoRef.current.srcObject = stream
      await videoRef.current.play()

      detectLoop()
    }

    function detectLoop() {
      if (!videoRef.current || !poseRef.current) return

      if (videoRef.current.readyState >= 2) {
        const results = poseRef.current.detectForVideo(
          videoRef.current,
          performance.now()
        )

        if (results.landmarks.length > 0) {
          const landmarks = results.landmarks[0]
          handlePose(landmarks)
          drawOverlay(landmarks)
        }
      }

      animationRef.current = requestAnimationFrame(detectLoop)
    }

    function clampLane(lane) {
      if (lane < -1) return -1
      if (lane > 1) return 1
      return lane
    }

    function handlePose(landmarks) {
      const state = engine.getState()
      if (state.status !== "PLAYING") return

      const nose = landmarks[0]

      const headX = 1-nose.x
      const headY = nose.y

      let newLane = 0

      // ---- Lane Zones ----
      if (headX < 0.33) {
        newLane = -1
      } else if (headX > 0.66) {
        newLane = 1
      } else {
        newLane = 0
      }

      // Stability filter
      if (newLane === stableLaneRef.current) {
        stableFramesRef.current++
      } else {
        stableFramesRef.current = 0
      }

      if (stableFramesRef.current > 4) {
        state.player.targetLane = clampLane(newLane)
      }

      stableLaneRef.current = newLane

      // ---- Jump: Head above top grid line ----
      if (headY < 0.20 && state.player.isGrounded) {
        state.player.velocityY = 15
      }
    }

    function drawOverlay(landmarks) {
      const canvas = canvasRef.current
      if (!canvas) return

      const ctx = canvas.getContext("2d")
      const w = canvas.width
      const h = canvas.height

      ctx.clearRect(0, 0, w, h)

      // ---- Grid Lines ----
      ctx.strokeStyle = "rgba(255,255,255,0.4)"
      ctx.lineWidth = 1

      // Vertical thirds
      ctx.beginPath()
      ctx.moveTo(w / 3, 0)
      ctx.lineTo(w / 3, h)
      ctx.stroke()

      ctx.beginPath()
      ctx.moveTo((2 * w) / 3, 0)
      ctx.lineTo((2 * w) / 3, h)
      ctx.stroke()

      // Jump line
      ctx.beginPath()
      ctx.moveTo(0, h * 0.2)
      ctx.lineTo(w, h * 0.2)
      ctx.stroke()

      // ---- Nose Indicator ----
      const nose = landmarks[0]
      const x = nose.x * w
      const y = nose.y * h

      ctx.fillStyle = "red"
      ctx.beginPath()
      ctx.arc(x, y, 6, 0, 2 * Math.PI)
      ctx.fill()
    }

    init()

    return () => {
      isMounted = false

      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current)
      }

      if (videoRef.current?.srcObject) {
        videoRef.current.srcObject
          .getTracks()
          .forEach(track => track.stop())
      }
    }
  }, [engine])

 return (
  <>
    {/* Toggle Button (Icon Style) */}
    <button
      onClick={() => setShowPreview(prev => !prev)}
      style={{
        position: "absolute",
        bottom: 230,
        right: 20,
        zIndex: 1000,
        width: 32,
        height: 32,
        borderRadius: "50%",
        border: "none",
        cursor: "pointer",
        background: "rgba(0,0,0,0.7)",
        color: "white",
        fontSize: "18px",
        display: "flex",
        alignItems: "center",
        justifyContent: "center"
      }}
    >
      {showPreview ? "×" : "▢"}
    </button>

    {/* Preview Container (Always Mounted) */}
    <div
      style={{
        position: "absolute",
        bottom: 20,
        right: 20,
        width: 260,
        height: showPreview ? 200 : 0,
        opacity: showPreview ? 1 : 0,
        transition: "all 0.3s ease",
        zIndex: 999,
        transform: "scaleX(-1)",
        borderRadius: "12px",
        overflow: "hidden",
        boxShadow: showPreview
          ? "0 0 10px rgba(0,0,0,0.5)"
          : "none"
      }}
    >
      <video
        ref={videoRef}
        muted
        playsInline
        style={{
          width: "100%",
          height: "100%",
          position: "absolute",
          objectFit: "cover"
        }}
      />
      <canvas
        ref={canvasRef}
        width={260}
        height={200}
        style={{
          position: "absolute",
          top: 0,
          left: 0
        }}
      />
    </div>
  </>
)
}