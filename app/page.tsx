"use client"

import { useEffect, useState } from "react"
import LandingScreen from "@/components/landing-screen"
import MessageCards from "@/components/message-cards"
import OurMemories from "@/components/our-memories"
import BirthdayFinale from "@/components/birthday-finale"
import CustomCursor from "@/components/custom-cursor"
import FloatingElements from "@/components/floating-elements"
import SpotifyPlayer from "@/components/spotify-player"
import TouchGuide from "@/components/touch-guide"

export default function Home() {
  const [currentSection, setCurrentSection] = useState<"landing" | "messages" | "gifts" | "memories" | "birthday">(
    "landing",
  )
  const [showCursor, setShowCursor] = useState(true)
  const [resumeFromCard, setResumeFromCard] = useState(0)
  const [showIntroGuide, setShowIntroGuide] = useState(false)
  const [hasSeenIntroGuide, setHasSeenIntroGuide] = useState(false)

  useEffect(() => {
    document.body.style.cursor = "none"
    if (!hasSeenIntroGuide) {
      setTimeout(() => setShowIntroGuide(true), 1000)
    }
    return () => {
      document.body.style.cursor = "auto"
    }
  }, [hasSeenIntroGuide])

  const handleStart = () => {
    setCurrentSection("messages")
  }

  const handleMemoriesSection = (nextCardIndex: number) => {
    setResumeFromCard(nextCardIndex)
    setCurrentSection("memories")
  }

  const handleBirthdaySection = () => {
    setCurrentSection("birthday")
  }

  const handleGiftsDone = () => {
    setCurrentSection("messages")
  }

  const handleMemoriesDone = () => {
    setCurrentSection("messages")
  }

  return (
    <main className="relative min-h-screen overflow-hidden bg-romantic-dark">
      {showCursor && <CustomCursor />}
      <FloatingElements />

      <SpotifyPlayer />

      <TouchGuide
        type="intro"
        message="Hey Sapana! I know you have a touch screen laptop..."
        subMessage="So this website is made just for you - swipe, tap, and feel the love with your fingertips on the code I wrote just for you!"
        show={showIntroGuide && currentSection === "landing"}
        onDismiss={() => {
          setShowIntroGuide(false)
          setHasSeenIntroGuide(true)
        }}
      />

      {currentSection === "landing" && <LandingScreen onStart={handleStart} />}

      {currentSection === "messages" && (
        <MessageCards
          onMemoriesSection={handleMemoriesSection}
          onBirthdaySection={handleBirthdaySection}
          initialCardIndex={resumeFromCard}
        />
      )}

      {currentSection === "memories" && <OurMemories onDone={handleMemoriesDone} />}

      {currentSection === "birthday" && <BirthdayFinale />}
    </main>
  )
}
