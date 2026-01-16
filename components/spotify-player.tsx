"use client"

import { useState, useEffect } from "react"

// Replace this with your Spotify playlist/song embed URL
// You can get this from Spotify: Share > Embed > Copy
const SPOTIFY_EMBED_URL = "https://open.spotify.com/embed/track/3hEfpBHxgieRLz4t3kLNEg?utm_source=generator"

export default function SpotifyPlayer() {
  const [isMinimized, setIsMinimized] = useState(false)
  const [isVisible, setIsVisible] = useState(false)
  const [showHint, setShowHint] = useState(true)

  useEffect(() => {
    setTimeout(() => setIsVisible(true), 2000)
    // Hide hint after 5 seconds
    setTimeout(() => setShowHint(false), 7000)
  }, [])

  return (
    <div
      className={`fixed z-[100] transition-all duration-500 ${
        isMinimized ? "bottom-4 right-4" : "bottom-4 right-4 md:bottom-6 md:right-6"
      } ${isVisible ? "translate-y-0 opacity-100" : "translate-y-20 opacity-0"}`}
    >
      {/* Cute hint bubble */}
      {showHint && !isMinimized && (
        <div className="absolute -top-16 left-1/2 -translate-x-1/2 whitespace-nowrap rounded-full bg-romantic-cream px-4 py-2 text-sm text-romantic-primary shadow-lg animate-bounce">
          <span>Tap to play our song! 🎵</span>
          <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 border-8 border-transparent border-t-romantic-cream" />
        </div>
      )}

      {/* Minimize/Maximize button */}
      <button
        onClick={() => setIsMinimized(!isMinimized)}
        className="absolute -top-3 -right-2 z-10 flex h-8 w-8 items-center justify-center rounded-full bg-romantic-pink text-white shadow-lg transition-transform hover:scale-110 active:scale-95"
      >
        {isMinimized ? (
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M8 3v3a2 2 0 01-2 2H3m18 0h-3a2 2 0 01-2-2V3m0 18v-3a2 2 0 012-2h3M3 16h3a2 2 0 012 2v3" />
          </svg>
        ) : (
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M4 14h6m0 0v6m0-6L3 21M20 10h-6m0 0V4m0 6l7-7" />
          </svg>
        )}
      </button>

      {/* Player container */}
      <div
        className={`overflow-hidden rounded-2xl shadow-[0_10px_40px_rgba(0,0,0,0.3),0_0_20px_rgba(196,69,105,0.3)] transition-all duration-500 ${
          isMinimized ? "h-20 w-20" : "h-[152px] w-[300px] md:h-[152px] md:w-[350px]"
        }`}
      >
        {isMinimized ? (
          // Minimized view - cute music icon
          <button
            onClick={() => setIsMinimized(false)}
            className="flex h-full w-full items-center justify-center bg-gradient-to-br from-romantic-primary to-romantic-pink"
          >
            <div className="relative">
              <svg width="32" height="32" viewBox="0 0 24 24" fill="white" className="animate-pulse">
                <path d="M12 3v10.55c-.59-.34-1.27-.55-2-.55-2.21 0-4 1.79-4 4s1.79 4 4 4 4-1.79 4-4V7h4V3h-6z" />
              </svg>
              {/* Animated sound waves */}
              <div className="absolute -right-2 top-1/2 flex -translate-y-1/2 gap-0.5">
                <div className="h-3 w-0.5 animate-sound-wave-1 rounded-full bg-white" />
                <div className="h-4 w-0.5 animate-sound-wave-2 rounded-full bg-white" />
                <div className="h-2 w-0.5 animate-sound-wave-3 rounded-full bg-white" />
              </div>
            </div>
          </button>
        ) : (
          // Full Spotify embed
          <iframe
            src={SPOTIFY_EMBED_URL}
            width="100%"
            height="152"
            frameBorder="0"
            allowFullScreen
            allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"
            loading="lazy"
            className="rounded-xl"
          />
        )}
      </div>
    </div>
  )
}
