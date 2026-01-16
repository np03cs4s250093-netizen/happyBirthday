"use client"

import type React from "react"

import { useState, useEffect, useRef } from "react"

interface MessageCardsProps {
  onMemoriesSection: (nextCardIndex: number) => void
  onBirthdaySection: () => void
  initialCardIndex?: number
}

const messages = [
  {
    id: 1,
    title: "It's a special day.",
    content:
      " Aja in this special day of you , mailea alikati try garexu mero sano effort to make you feel special . I hope you like it .",
  },
  {
    id: 2,
    title: "😶‍🌫️ .",
    content:
      "I was planning to make a huge collection vako with each photo ma hamro memories ko details halera banauxu vanne soch xeu. Tara tyo din timilae hamro photo delete garnu vaneu chiya o clock ma. Tyo bela mero mind ma mero plan haru sabai begreko jasto lagyo literally mo resako vane maile timro lag kasto plan gareko thiye timi afaile kati difficult gareko mailea timro ramro soche ne timi lae kena mero plans ma difficult gareko jastai ne lago. ",
  },
  {
    id: 3,
    title: "🙄❤️.",
    content:
      "And I dont wanna delete any photos of us again . I want to keep all our memories safe with me forever. Even we not end up together I want to keep all our memories safe with me forever You are special to me and our memories are special to me Forever IN My Life .",
  },
  {
    id: 4,
    title: "😭",
    content:
      "I could have bought so many things for your birthday tara k garam I have no money sorry I couldn't buy you any fancy gift for you aailea.",
  },
  {
    id: 5,
    title: "Remember that day?💖",
    content:
      "Remember that day hamro pythyon ko viva ko din, you waited for me ani hami sab ko agadi sangai gayem ghar bas chadna, aadi bato ma pani parera we were standing tyo road xeu ma ani we crossed that zebra-crosing pani pari rakhera kudera. Tespaxi hami tyo civil mall ma sangai basera kati kura gareko them. That was one of the best days of my life . I still fell tyo din was a scence from a romantic movie everything was like so perfect and felt so romantic .",
  },
  
  {
    id: 6,
    title: "I love to be close to you 🤍",
    content:
      "I know I can be a little too touchy sometimes, and I understand why that might feel overwhelming to you. I just want you to know it never came from disrespect or intention to cross a line. For me, being close, holding you, touching you gently… that’s how my heart shows love. It’s how I feel connected and safe with someone I care about deeply.🤍",
  },
]

const TRIGGER_GIFTS_AFTER = 1
const TRIGGER_MEMORIES_AFTER = 3

export default function MessageCards({
  onMemoriesSection,
  onBirthdaySection,
  initialCardIndex = 0,
}: MessageCardsProps) {
  const [currentIndex, setCurrentIndex] = useState(initialCardIndex)
  const [isAnimating, setIsAnimating] = useState(false)
  const [direction, setDirection] = useState<"left" | "right">("right")
  const [isVisible, setIsVisible] = useState(false)
  const [dragOffset, setDragOffset] = useState(0)
  const [isDragging, setIsDragging] = useState(false)
  const touchStartX = useRef(0)
  const touchEndX = useRef(0)
  const containerRef = useRef<HTMLDivElement>(null)
  const hasShownGifts = useRef(initialCardIndex > TRIGGER_GIFTS_AFTER)
  const hasShownMemories = useRef(initialCardIndex > TRIGGER_MEMORIES_AFTER)

  useEffect(() => {
    setTimeout(() => setIsVisible(true), 100)
  }, [])

  const handleNext = () => {
    if (isAnimating) return

    if (currentIndex === TRIGGER_MEMORIES_AFTER && !hasShownMemories.current) {
      hasShownMemories.current = true
      setIsAnimating(true)
      setTimeout(() => {
        onMemoriesSection(currentIndex + 1)
      }, 300)
      return
    }

    if (currentIndex >= messages.length - 1) {
      setIsAnimating(true)
      setTimeout(() => {
        onBirthdaySection()
      }, 300)
      return
    }

    setDirection("right")
    setIsAnimating(true)
    setTimeout(() => {
      setCurrentIndex((prev) => prev + 1)
      setIsAnimating(false)
    }, 400)
  }

  const handlePrev = () => {
    if (isAnimating || currentIndex === 0) return
    setDirection("left")
    setIsAnimating(true)
    setTimeout(() => {
      setCurrentIndex((prev) => prev - 1)
      setIsAnimating(false)
    }, 400)
  }

  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.touches[0].clientX
    setIsDragging(true)
  }

  const handleTouchMove = (e: React.TouchEvent) => {
    touchEndX.current = e.touches[0].clientX
    const diff = touchEndX.current - touchStartX.current
    setDragOffset(diff * 0.5)
  }

  const handleTouchEnd = () => {
    setIsDragging(false)
    const diff = touchStartX.current - touchEndX.current
    if (Math.abs(diff) > 50) {
      if (diff > 0) {
        handleNext()
      } else {
        handlePrev()
      }
    }
    setDragOffset(0)
  }

  const handleMouseDown = (e: React.MouseEvent) => {
    touchStartX.current = e.clientX
    setIsDragging(true)
  }

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging) return
    touchEndX.current = e.clientX
    const diff = touchEndX.current - touchStartX.current
    setDragOffset(diff * 0.5)
  }

  const handleMouseUp = () => {
    if (!isDragging) return
    setIsDragging(false)
    const diff = touchStartX.current - touchEndX.current
    if (Math.abs(diff) > 50) {
      if (diff > 0) {
        handleNext()
      } else {
        handlePrev()
      }
    }
    setDragOffset(0)
  }

  return (
    <div className="fixed inset-0 z-40 flex items-center justify-center bg-gradient-to-br from-romantic-dark via-romantic-deep to-romantic-dark">
      {/* Background decoration */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute left-1/2 top-1/2 h-[500px] w-[500px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-romantic-glow opacity-10 blur-[120px]" />
      </div>

      {/* Header */}
      <div
        className={`absolute left-1/2 top-8 -translate-x-1/2 text-center transition-all duration-700 md:top-12 ${
          isVisible ? "translate-y-0 opacity-100" : "-translate-y-5 opacity-0"
        }`}
      >
        <h2 className="font-serif text-xl text-romantic-cream md:text-2xl">For the Birthday girl Sapana</h2>
        <div className="mt-2 flex items-center justify-center gap-2 text-sm text-romantic-muted">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" className="animate-pulse">
            <path
              d="M7 11L12 6L17 11M7 13L12 18L17 13"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              transform="rotate(90 12 12)"
            />
          </svg>
          <span>Swipe or drag to read</span>
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" className="animate-pulse">
            <path
              d="M7 11L12 6L17 11M7 13L12 18L17 13"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              transform="rotate(-90 12 12)"
            />
          </svg>
        </div>
      </div>

      {/* Cards Container - Added mouse drag support */}
      <div
        ref={containerRef}
        className={`relative flex h-[60vh] w-[85vw] max-w-md items-center justify-center transition-all duration-700 md:h-[50vh] ${
          isVisible ? "scale-100 opacity-100" : "scale-90 opacity-0"
        } ${isDragging ? "cursor-grabbing" : "cursor-grab"}`}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseUp}
      >
        {/* Stacked cards effect */}
        {messages.map((message, index) => {
          const offset = index - currentIndex
          const isActive = index === currentIndex
          const rotation = (offset * 3 + (index % 2 === 0 ? 2 : -2)) * (isActive ? 0 : 1)
          const scale = isActive ? 1 : 0.95 - Math.abs(offset) * 0.05
          const zIndex = messages.length - Math.abs(offset)
          const translateX = isAnimating
            ? direction === "right"
              ? isActive
                ? -100
                : 0
              : isActive
                ? 100
                : 0
            : offset * 8 + (isActive && isDragging ? dragOffset : 0)

          if (Math.abs(offset) > 3) return null

          return (
            <div
              key={message.id}
              className={`absolute h-full w-full transition-all ease-out ${
                isDragging && isActive ? "duration-0" : "duration-400"
              } ${isActive ? "" : "pointer-events-none"}`}
              style={{
                transform: `translateX(${translateX}px) rotate(${rotation + (isActive && isDragging ? dragOffset * 0.02 : 0)}deg) scale(${scale})`,
                zIndex,
                opacity: Math.abs(offset) > 2 ? 0 : 1 - Math.abs(offset) * 0.2,
              }}
            >
              <div className="h-full w-full rounded-2xl bg-gradient-to-br from-romantic-cream to-romantic-light p-6 shadow-[0_10px_40px_rgba(0,0,0,0.3),0_0_20px_rgba(196,69,105,0.2)] md:p-8">
                {/* Card decoration */}
                <div className="absolute right-4 top-4 opacity-20">
                  <svg width="40" height="40" viewBox="0 0 24 24">
                    <path
                      d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"
                      fill="#c44569"
                    />
                  </svg>
                </div>

                {/* Content */}
                <div className="flex h-full flex-col justify-center">
                  <h3 className="mb-4 font-serif text-2xl text-romantic-primary md:mb-6 md:text-3xl">
                    {message.title}
                  </h3>
                  <p className="font-serif text-base leading-relaxed text-romantic-text md:text-lg">
                    {message.content}
                  </p>
                </div>

                {/* Card number */}
                <div className="absolute bottom-4 left-4 text-xs text-romantic-muted">
                  {index + 1} / {messages.length}
                </div>
              </div>
            </div>
          )
        })}
      </div>

      {/* Navigation */}
      <div
        className={`absolute bottom-8 left-1/2 flex -translate-x-1/2 items-center gap-6 transition-all duration-700 md:bottom-12 ${
          isVisible ? "translate-y-0 opacity-100" : "translate-y-5 opacity-0"
        }`}
      >
        <button
          onClick={handlePrev}
          disabled={currentIndex === 0 || isAnimating}
          className="flex h-12 w-12 items-center justify-center rounded-full bg-romantic-cream/10 text-romantic-cream transition-all hover:bg-romantic-cream/20 disabled:opacity-30 disabled:hover:bg-romantic-cream/10"
        >
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M15 18l-6-6 6-6" />
          </svg>
        </button>

        {/* Progress dots */}
        <div className="flex gap-2">
          {messages.map((_, index) => (
            <div
              key={index}
              className={`h-2 w-2 rounded-full transition-all ${
                index === currentIndex
                  ? "w-6 bg-romantic-pink"
                  : index < currentIndex
                    ? "bg-romantic-pink/50"
                    : "bg-romantic-cream/30"
              }`}
            />
          ))}
        </div>

        <button
          onClick={handleNext}
          disabled={isAnimating}
          className="flex h-12 w-12 items-center justify-center rounded-full bg-romantic-pink text-romantic-cream shadow-[0_0_20px_rgba(196,69,105,0.4)] transition-all hover:scale-110 hover:shadow-[0_0_30px_rgba(196,69,105,0.6)]"
        >
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M9 18l6-6-6-6" />
          </svg>
        </button>
      </div>
    </div>
  )
}
