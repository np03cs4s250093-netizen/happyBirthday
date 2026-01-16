"use client"

import { useState, useEffect } from "react"

interface TouchGuideProps {
  type: "intro" | "blow"
  message: string
  subMessage?: string
  show: boolean
  position?: "center" | "bottom"
  onDismiss?: () => void
}

export default function TouchGuide({
  type,
  message,
  subMessage,
  show,
  position = "center",
  onDismiss,
}: TouchGuideProps) {
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    if (show) {
      setTimeout(() => setIsVisible(true), 300)
      // Auto dismiss after 6 seconds for intro
      const timer = setTimeout(
        () => {
          setIsVisible(false)
          setTimeout(() => onDismiss?.(), 300)
        },
        type === "intro" ? 6000 : 5000,
      )
      return () => clearTimeout(timer)
    } else {
      setIsVisible(false)
    }
  }, [show, onDismiss, type])

  if (!show) return null

  const icons = {
    intro: (
      <div className="relative flex flex-col items-center gap-6">
        {/* Animated hand with swipe gesture */}
        <div className="relative">
          <svg width="80" height="80" viewBox="0 0 64 64" className="text-romantic-cream">
            {/* Hand */}
            <path
              d="M32 12c-2 0-3.5 1.5-3.5 3.5v20l-4-4c-1.5-1.5-4-1.5-5.5 0s-1.5 4 0 5.5l12 12c1 1 2.5 1.5 4 1.5h10c3.5 0 6.5-3 6.5-6.5v-12c0-2-1.5-3.5-3.5-3.5s-3.5 1.5-3.5 3.5v-2c0-2-1.5-3.5-3.5-3.5s-3.5 1.5-3.5 3.5v-2c0-2-1.5-3.5-3.5-3.5s-3.5 1.5-3.5 3.5V15.5c0-2-1.5-3.5-3.5-3.5z"
              fill="currentColor"
              className="animate-swipe-hand"
            />
          </svg>
          {/* Swipe trail */}
          <div className="absolute top-1/2 -left-8 flex gap-1">
            {[0, 1, 2].map((i) => (
              <div
                key={i}
                className="h-1 w-4 rounded-full bg-romantic-pink/60 animate-swipe-trail"
                style={{ animationDelay: `${i * 0.15}s` }}
              />
            ))}
          </div>
          <div className="absolute top-1/2 -right-8 flex gap-1">
            {[0, 1, 2].map((i) => (
              <div
                key={i}
                className="h-1 w-4 rounded-full bg-romantic-pink/60 animate-swipe-trail-reverse"
                style={{ animationDelay: `${i * 0.15}s` }}
              />
            ))}
          </div>
        </div>
        {/* Touch screen laptop icon */}
        <div className="flex items-center gap-2 text-romantic-cream/60">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
            <path d="M20 18c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2H4c-1.1 0-2 .9-2 2v10c0 1.1.9 2 2 2H0v2h24v-2h-4zM4 6h16v10H4V6z" />
          </svg>
          <span className="text-sm">Touch Screen Ready</span>
        </div>
      </div>
    ),
    blow: (
      <div className="relative flex items-center gap-3">
        <svg width="50" height="50" viewBox="0 0 24 24" className="text-romantic-cream">
          <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2" fill="none" />
          <path d="M8 14s1.5 2 4 2 4-2 4-2" stroke="currentColor" strokeWidth="2" strokeLinecap="round" fill="none" />
          <circle cx="9" cy="10" r="1" fill="currentColor" />
          <circle cx="15" cy="10" r="1" fill="currentColor" />
        </svg>
        <div className="flex gap-1">
          {[0, 1, 2].map((i) => (
            <div
              key={i}
              className="h-2 w-6 animate-blow-guide rounded-full bg-romantic-cream/60"
              style={{ animationDelay: `${i * 0.2}s` }}
            />
          ))}
        </div>
      </div>
    ),
  }

  return (
    <div
      className={`fixed inset-0 z-[90] flex items-center justify-center bg-romantic-dark/90 backdrop-blur-md transition-all duration-500 ${
        isVisible ? "opacity-100" : "opacity-0"
      } ${position === "bottom" ? "items-end pb-32" : ""}`}
      onClick={() => {
        setIsVisible(false)
        setTimeout(() => onDismiss?.(), 300)
      }}
    >
      <div
        className={`flex flex-col items-center gap-5 max-w-sm mx-4 transition-all duration-500 ${
          isVisible ? "translate-y-0 scale-100" : "translate-y-4 scale-95"
        }`}
      >
        {icons[type]}
        <p className="text-center font-serif text-xl md:text-2xl text-romantic-cream leading-relaxed">{message}</p>
        {subMessage && <p className="text-center text-base text-romantic-pink/90">{subMessage}</p>}
        <span className="text-sm text-romantic-muted mt-2 animate-pulse">Tap anywhere to start</span>
      </div>
    </div>
  )
}
