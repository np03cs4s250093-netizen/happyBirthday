"use client"

import { useEffect, useState, useRef } from "react"

interface Trail {
  x: number
  y: number
  id: number
  type: "heart" | "sparkle" | "petal"
}

export default function CustomCursor() {
  const [position, setPosition] = useState({ x: 0, y: 0 })
  const [trails, setTrails] = useState<Trail[]>([])
  const trailId = useRef(0)

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setPosition({ x: e.clientX, y: e.clientY })

      // Add trail particle
      if (Math.random() > 0.6) {
        const types: Trail["type"][] = ["heart", "sparkle", "petal"]
        const newTrail: Trail = {
          x: e.clientX + (Math.random() - 0.5) * 20,
          y: e.clientY + (Math.random() - 0.5) * 20,
          id: trailId.current++,
          type: types[Math.floor(Math.random() * types.length)],
        }
        setTrails((prev) => [...prev.slice(-15), newTrail])
      }
    }

    window.addEventListener("mousemove", handleMouseMove)
    return () => window.removeEventListener("mousemove", handleMouseMove)
  }, [])

  // Clean up old trails
  useEffect(() => {
    const interval = setInterval(() => {
      setTrails((prev) => prev.slice(-10))
    }, 100)
    return () => clearInterval(interval)
  }, [])

  return (
    <>
      {/* Main Cursor */}
      <div
        className="pointer-events-none fixed z-[9999] -translate-x-1/2 -translate-y-1/2"
        style={{ left: position.x, top: position.y }}
      >
        <svg
          width="32"
          height="32"
          viewBox="0 0 32 32"
          className="animate-pulse drop-shadow-[0_0_10px_rgba(255,107,129,0.8)]"
        >
          <path
            d="M16 28s-10-7.5-10-14c0-4 3-7 6-7 2 0 4 1.5 4 1.5s2-1.5 4-1.5c3 0 6 3 6 7 0 6.5-10 14-10 14z"
            fill="#ff6b81"
            stroke="#fff"
            strokeWidth="1"
          />
        </svg>
      </div>

      {/* Trail particles */}
      {trails.map((trail) => (
        <div
          key={trail.id}
          className="pointer-events-none fixed z-[9998] animate-trail-fade"
          style={{
            left: trail.x,
            top: trail.y,
            transform: "translate(-50%, -50%)",
          }}
        >
          {trail.type === "heart" && (
            <svg width="12" height="12" viewBox="0 0 24 24" className="opacity-70">
              <path
                d="M12 21s-8-6-8-11c0-3 2.5-5.5 5-5.5 1.5 0 3 1 3 1s1.5-1 3-1c2.5 0 5 2.5 5 5.5 0 5-8 11-8 11z"
                fill="#ff6b81"
              />
            </svg>
          )}
          {trail.type === "sparkle" && (
            <svg width="10" height="10" viewBox="0 0 24 24" className="opacity-70">
              <path d="M12 0l2.5 9.5L24 12l-9.5 2.5L12 24l-2.5-9.5L0 12l9.5-2.5z" fill="#ffd700" />
            </svg>
          )}
          {trail.type === "petal" && (
            <svg width="10" height="10" viewBox="0 0 24 24" className="opacity-70">
              <ellipse cx="12" cy="12" rx="4" ry="8" fill="#ffb6c1" />
            </svg>
          )}
        </div>
      ))}
    </>
  )
}
