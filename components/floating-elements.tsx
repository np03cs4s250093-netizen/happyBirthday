"use client"

import { useEffect, useState } from "react"

interface FloatingItem {
  id: number
  type: "rose" | "heart" | "petal" | "star" | "sparkle"
  x: number
  y: number
  size: number
  duration: number
  delay: number
  rotation: number
}

export default function FloatingElements() {
  const [items, setItems] = useState<FloatingItem[]>([])

  useEffect(() => {
    const types: FloatingItem["type"][] = ["rose", "heart", "petal", "star", "sparkle"]
    const newItems: FloatingItem[] = []

    for (let i = 0; i < 25; i++) {
      newItems.push({
        id: i,
        type: types[Math.floor(Math.random() * types.length)],
        x: Math.random() * 100,
        y: Math.random() * 100,
        size: 12 + Math.random() * 24,
        duration: 15 + Math.random() * 20,
        delay: Math.random() * 10,
        rotation: Math.random() * 360,
      })
    }

    setItems(newItems)
  }, [])

  const renderSvg = (type: FloatingItem["type"], size: number) => {
    switch (type) {
      case "rose":
        return (
          <svg width={size} height={size} viewBox="0 0 64 64" className="opacity-40">
            <g fill="#c44569">
              <ellipse cx="32" cy="20" rx="8" ry="12" />
              <ellipse cx="24" cy="28" rx="8" ry="10" transform="rotate(-30 24 28)" />
              <ellipse cx="40" cy="28" rx="8" ry="10" transform="rotate(30 40 28)" />
              <ellipse cx="28" cy="36" rx="7" ry="9" transform="rotate(-15 28 36)" />
              <ellipse cx="36" cy="36" rx="7" ry="9" transform="rotate(15 36 36)" />
              <ellipse cx="32" cy="42" rx="10" ry="8" />
            </g>
            <path d="M32 50 L32 62 M28 56 Q32 52 36 56" stroke="#2d5016" strokeWidth="2" fill="none" />
          </svg>
        )
      case "heart":
        return (
          <svg width={size} height={size} viewBox="0 0 24 24" className="opacity-50">
            <path
              d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"
              fill="#ff6b81"
            />
          </svg>
        )
      case "petal":
        return (
          <svg width={size} height={size} viewBox="0 0 24 24" className="opacity-40">
            <ellipse cx="12" cy="12" rx="5" ry="10" fill="#ffb6c1" transform="rotate(45 12 12)" />
          </svg>
        )
      case "star":
        return (
          <svg width={size} height={size} viewBox="0 0 24 24" className="opacity-50">
            <path d="M12 2l2.4 7.4h7.6l-6 4.6 2.3 7-6.3-4.6-6.3 4.6 2.3-7-6-4.6h7.6z" fill="#ffd700" />
          </svg>
        )
      case "sparkle":
        return (
          <svg width={size} height={size} viewBox="0 0 24 24" className="opacity-60">
            <path d="M12 0l1.5 10.5L24 12l-10.5 1.5L12 24l-1.5-10.5L0 12l10.5-1.5z" fill="#fffacd" />
          </svg>
        )
    }
  }

  return (
    <div className="pointer-events-none fixed inset-0 z-10 overflow-hidden">
      {items.map((item) => (
        <div
          key={item.id}
          className="absolute animate-float-gentle"
          style={{
            left: `${item.x}%`,
            top: `${item.y}%`,
            animationDuration: `${item.duration}s`,
            animationDelay: `${item.delay}s`,
            transform: `rotate(${item.rotation}deg)`,
          }}
        >
          {renderSvg(item.type, item.size)}
        </div>
      ))}
    </div>
  )
}
