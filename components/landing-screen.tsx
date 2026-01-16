"use client"

import { useState, useEffect } from "react"

interface LandingScreenProps {
  onStart: () => void
}

export default function LandingScreen({ onStart }: LandingScreenProps) {
  const [isVisible, setIsVisible] = useState(false)
  const [isExiting, setIsExiting] = useState(false)

  useEffect(() => {
    setTimeout(() => setIsVisible(true), 100)
  }, [])

  const handleClick = () => {
    setIsExiting(true)
    setTimeout(onStart, 800)
  }

  return (
    <div
      className={`fixed inset-0 z-50 flex flex-col items-center justify-center bg-gradient-to-b from-romantic-dark via-romantic-deep to-romantic-dark transition-all duration-700 ${
        isExiting ? "opacity-0 scale-110" : "opacity-100"
      }`}
    >
      {/* Ambient glow */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute left-1/2 top-1/2 h-[600px] w-[600px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-romantic-glow opacity-20 blur-[100px]" />
        <div className="absolute left-1/4 top-1/3 h-[300px] w-[300px] rounded-full bg-romantic-pink opacity-10 blur-[80px]" />
        <div className="absolute right-1/4 bottom-1/3 h-[250px] w-[250px] rounded-full bg-rose-gold opacity-15 blur-[60px]" />
      </div>

      {/* Content */}
      <div
        className={`relative z-10 flex flex-col items-center transition-all duration-1000 ${
          isVisible ? "translate-y-0 opacity-100" : "translate-y-10 opacity-0"
        }`}
      >
        {/* Animated rose */}
        <div className="mb-8 animate-float">
          <svg width="80" height="80" viewBox="0 0 64 64" className="drop-shadow-[0_0_20px_rgba(196,69,105,0.6)]">
            <g fill="#c44569">
              <ellipse cx="32" cy="18" rx="10" ry="14" className="animate-pulse" />
              <ellipse cx="22" cy="28" rx="9" ry="12" transform="rotate(-30 22 28)" />
              <ellipse cx="42" cy="28" rx="9" ry="12" transform="rotate(30 42 28)" />
              <ellipse cx="26" cy="38" rx="8" ry="11" transform="rotate(-15 26 38)" />
              <ellipse cx="38" cy="38" rx="8" ry="11" transform="rotate(15 38 38)" />
              <ellipse cx="32" cy="44" rx="12" ry="10" />
            </g>
            <path d="M32 52 L32 62" stroke="#2d5016" strokeWidth="3" strokeLinecap="round" />
            <path d="M26 58 Q32 54 38 58" stroke="#2d5016" strokeWidth="2" fill="none" />
          </svg>
        </div>

        {/* Title */}
        <h1 className="mb-4 text-center font-serif text-2xl text-romantic-cream opacity-80 md:text-3xl">
          A little something special...
        </h1>
        <p className="mb-12 text-center text-sm text-romantic-muted md:text-base">...just for you</p>

        {/* Start Button */}
        <button
          onClick={handleClick}
          className="group relative overflow-hidden rounded-full bg-gradient-to-r from-romantic-primary to-romantic-pink px-10 py-4 text-lg font-medium text-romantic-cream shadow-[0_0_30px_rgba(196,69,105,0.4)] transition-all duration-300 hover:scale-105 hover:shadow-[0_0_50px_rgba(196,69,105,0.6)] md:px-12 md:py-5 md:text-xl"
        >
          <span className="relative z-10 flex items-center gap-3">
            Tap here
            <svg width="20" height="20" viewBox="0 0 24 24" className="animate-bounce">
              <path
                d="M20 4H4v16h16V4zM4 2h16a2 2 0 012 2v16a2 2 0 01-2 2H4a2 2 0 01-2-2V4a2 2 0 012-2z"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
              />
              <path d="M12 8v8M8 12h8" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
            </svg>
          </span>

          {/* Heartbeat pulse effect */}
          <span className="absolute inset-0 animate-heartbeat rounded-full bg-romantic-cream opacity-0" />
        </button>

        {/* Decorative hearts */}
        <div className="absolute -left-20 top-0 animate-float-slow opacity-30">
          <svg width="40" height="40" viewBox="0 0 24 24">
            <path
              d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"
              fill="#ff6b81"
            />
          </svg>
        </div>
        <div className="absolute -right-16 bottom-10 animate-float opacity-25">
          <svg width="30" height="30" viewBox="0 0 24 24">
            <path
              d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"
              fill="#c44569"
            />
          </svg>
        </div>
      </div>
    </div>
  )
}
