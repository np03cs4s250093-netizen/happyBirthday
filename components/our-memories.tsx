"use client"

import { useState, useEffect } from "react"

interface OurMemoriesProps {
  onDone: () => void
}

const memories = [
  { id: 1, image: "/usStarting.jpg" },
  { id: 2, image: "/img7.jpg" },
  { id: 3, image: "/img6.jpg" },
  { id: 4, image: "/img5.jpg" },
  { id: 5, image: "/img4.jpg" },
  { id: 6, image: "/img3.jpg" },
  { id: 7, image: "/img2.jpg" },
  { id: 8, image: "/img1.jpg" },
  { id: 9, image: "/img.JPG" },
  { id: 10, image: "/walking_street.jpg" },
  { id: 11, image: "/walking_streets.jpg" },
  { id: 12, image: "/pakh_sapana.png" },
]

const photoPositions = [
  { top: "2%", left: "3%", rotate: -22, width: "180px", height: "220px" },
  { top: "5%", left: "30%", rotate: 15, width: "160px", height: "200px" },
  { top: "0%", right: "25%", rotate: -8, width: "200px", height: "240px" },
  { top: "8%", right: "2%", rotate: 18, width: "170px", height: "210px" },
  { top: "35%", left: "0%", rotate: -12, width: "190px", height: "230px" },
  { top: "40%", right: "0%", rotate: 25, width: "175px", height: "215px" },
  { bottom: "30%", left: "5%", rotate: 10, width: "165px", height: "205px" },
  { bottom: "35%", right: "8%", rotate: -18, width: "185px", height: "225px" },
  { bottom: "5%", left: "2%", rotate: 20, width: "195px", height: "235px" },
  { bottom: "8%", left: "35%", rotate: -25, width: "155px", height: "195px" },
  { bottom: "2%", right: "30%", rotate: 12, width: "175px", height: "215px" },
  { bottom: "10%", right: "3%", rotate: -15, width: "180px", height: "220px" },
]

const AUTO_DISMISS_DELAY = 9000

export default function OurMemories({ onDone }: OurMemoriesProps) {
  const [isVisible, setIsVisible] = useState(false)
  const [showPhotos, setShowPhotos] = useState(false)
  const [isExiting, setIsExiting] = useState(false)
  const [progress, setProgress] = useState(100)

  useEffect(() => {
    setTimeout(() => setIsVisible(true), 100)
    setTimeout(() => setShowPhotos(true), 300)

    const startTime = Date.now()
    const progressInterval = setInterval(() => {
      const elapsed = Date.now() - startTime
      const remaining = Math.max(0, 100 - (elapsed / AUTO_DISMISS_DELAY) * 100)
      setProgress(remaining)
    }, 50)

    const exitTimer = setTimeout(() => {
      setIsExiting(true)
      setTimeout(() => {
        onDone()
      }, 700)
    }, AUTO_DISMISS_DELAY)

    return () => {
      clearTimeout(exitTimer)
      clearInterval(progressInterval)
    }
  }, [onDone])

  return (
    <div
      className={`fixed inset-0 z-40 flex items-center justify-center overflow-hidden bg-gradient-to-br from-romantic-dark via-romantic-deep to-romantic-dark transition-all duration-700 ${
        isExiting ? "opacity-0 scale-95" : "opacity-100 scale-100"
      }`}
    >
      {/* Progress bar */}
      <div className="absolute top-0 left-0 right-0 h-1 bg-romantic-cream/10 z-50">
        <div
          className="h-full bg-gradient-to-r from-romantic-primary to-romantic-pink transition-all duration-100"
          style={{ width: `${progress}%` }}
        />
      </div>

      {memories.map((memory, index) => {
        const position = photoPositions[index % photoPositions.length]
        return (
          <div
            key={memory.id}
            className={`absolute transition-all duration-1000 shadow-2xl ${
              showPhotos ? "opacity-90" : "opacity-0 scale-50"
            }`}
            style={{
              top: position.top,
              left: position.left,
              right: position.right,
              bottom: position.bottom,
              width: position.width,
              height: position.height,
              transform: `rotate(${position.rotate}deg)`,
              transitionDelay: `${index * 100}ms`,
              zIndex: 10 + index,
            }}
          >
            <div className="relative h-full w-full animate-float-gentle rounded-lg bg-romantic-cream p-2 shadow-[0_15px_50px_rgba(0,0,0,0.5)]">
              <img
                src={memory.image || "/placeholder.svg"}
                alt="Our memory"
                className="h-full w-full rounded-md object-cover"
              />
              {/* Polaroid-style bottom */}
              <div className="absolute inset-x-0 bottom-0 h-6 rounded-b-lg bg-romantic-cream" />
            </div>
          </div>
        )
      })}

      <div
        className={`relative z-30 text-center px-6 transition-all duration-700 ${
          isVisible ? "translate-y-0 opacity-100" : "-translate-y-10 opacity-0"
        }`}
      >
        <div className="relative">
          {/* Strong glowing background for text to stand out over photos */}
          <div className="absolute -inset-16 rounded-3xl bg-romantic-dark/90 blur-2xl" />
          <div className="absolute -inset-12 rounded-2xl bg-romantic-dark/80" />

          <h2 className="relative font-serif text-4xl md:text-6xl text-romantic-cream drop-shadow-[0_0_60px_rgba(255,107,129,0.8)]">
            Moments that live
          </h2>
          <h2 className="relative font-serif text-4xl md:text-6xl text-romantic-pink mt-3 drop-shadow-[0_0_60px_rgba(255,107,129,0.8)]">
            forever in my heart
          </h2>

          {/* Decorative heart */}
          <div className="mt-8 flex items-center justify-center gap-4">
            <div className="h-px w-20 bg-gradient-to-r from-transparent to-romantic-pink/60" />
            <svg
              width="36"
              height="36"
              viewBox="0 0 24 24"
              className="animate-heartbeat text-romantic-pink drop-shadow-[0_0_20px_rgba(255,107,129,0.6)]"
            >
              <path
                d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"
                fill="currentColor"
              />
            </svg>
            <div className="h-px w-20 bg-gradient-to-l from-transparent to-romantic-pink/60" />
          </div>

          <p className="relative mt-6 text-base text-romantic-muted">Continuing to celebration...</p>
        </div>
      </div>
    </div>
  )
}
