"use client"

import { useState, useEffect, useRef, useCallback } from "react"
import { saveWish } from "@/app/actions/save-wish"
import TouchGuide from "@/components/touch-guide"

const memoryPhotos = [
  "/img3.jpg",
  "/img1.jpg",
  "/img2.jpg",
  "/img1.JPG",
  "/img4.jpg",
  "/img5.jpg",
  "/img6.jpg",
  "/img7.jpg",
]

export default function BirthdayFinale() {
  const [isVisible, setIsVisible] = useState(false)
  const [stage, setStage] = useState<"cake" | "wish" | "blowing" | "celebration">("cake")
  const [wish, setWish] = useState("")
  const [candlesLit, setCandlesLit] = useState([true, true, true, true, true]) // 5 candles
  const [blowProgress, setBlowProgress] = useState(0)
  const [showWishInput, setShowWishInput] = useState(false)
  const [wishSaved, setWishSaved] = useState(false)
  const [confetti, setConfetti] = useState<
    Array<{ id: number; x: number; delay: number; color: string; size: number }>
  >([])
  const [sparkles, setSparkles] = useState<Array<{ id: number; x: number; y: number }>>([])
  const [showBlowGuide, setShowBlowGuide] = useState(false)
  const [isSavingWish, setIsSavingWish] = useState(false)
  const audioContextRef = useRef<AudioContext | null>(null)
  const analyserRef = useRef<AnalyserNode | null>(null)
  const micStreamRef = useRef<MediaStream | null>(null)
  const blowDetectionRef = useRef<number | null>(null)
  const inputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    setTimeout(() => setIsVisible(true), 100)

    // Generate initial confetti
    const newConfetti = Array.from({ length: 80 }, (_, i) => ({
      id: i,
      x: Math.random() * 100,
      delay: Math.random() * 5,
      color: ["#ff6b81", "#c44569", "#ffd700", "#ffb6c1", "#d4af37", "#fff"][Math.floor(Math.random() * 6)],
      size: 8 + Math.random() * 8,
    }))
    setConfetti(newConfetti)

    return () => {
      if (blowDetectionRef.current) {
        cancelAnimationFrame(blowDetectionRef.current)
      }
      if (micStreamRef.current) {
        micStreamRef.current.getTracks().forEach((track) => track.stop())
      }
    }
  }, [])

  // Blow detection using microphone
  const startBlowDetection = useCallback(async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true })
      micStreamRef.current = stream

      audioContextRef.current = new AudioContext()
      analyserRef.current = audioContextRef.current.createAnalyser()
      const source = audioContextRef.current.createMediaStreamSource(stream)
      source.connect(analyserRef.current)
      analyserRef.current.fftSize = 256

      const bufferLength = analyserRef.current.frequencyBinCount
      const dataArray = new Uint8Array(bufferLength)

      let consecutiveBlows = 0

      const detectBlow = () => {
        if (!analyserRef.current) return

        analyserRef.current.getByteFrequencyData(dataArray)

        // Check for low frequency high amplitude (blow sound)
        const lowFreqAvg = dataArray.slice(0, 10).reduce((a, b) => a + b, 0) / 10

        if (lowFreqAvg > 100) {
          consecutiveBlows++
          setBlowProgress((prev) => Math.min(prev + 2, 100))

          // Blow out candles progressively
          if (consecutiveBlows > 10) {
            setCandlesLit((prev) => {
              const newCandles = [...prev]
              const litIndex = newCandles.findIndex((c) => c)
              if (litIndex !== -1) {
                newCandles[litIndex] = false
                // Add sparkle effect
                setSparkles((s) => [...s, { id: Date.now(), x: 20 + litIndex * 15, y: 20 }])
              }
              return newCandles
            })
            consecutiveBlows = 0
          }
        } else {
          consecutiveBlows = Math.max(0, consecutiveBlows - 1)
          setBlowProgress((prev) => Math.max(prev - 1, 0))
        }

        blowDetectionRef.current = requestAnimationFrame(detectBlow)
      }

      detectBlow()
    } catch {
      // Fallback to click-based blowing if mic not available
      console.log("Microphone not available, using click fallback")
    }
  }, [])

  // Handle clicking/tapping to blow candles
  const handleBlowClick = () => {
    setCandlesLit((prev) => {
      const newCandles = [...prev]
      const litIndex = newCandles.findIndex((c) => c)
      if (litIndex !== -1) {
        newCandles[litIndex] = false
        setSparkles((s) => [...s, { id: Date.now(), x: 25 + litIndex * 12.5, y: 15 }])
      }
      return newCandles
    })
  }

  // Check if all candles are blown
  useEffect(() => {
    if (stage === "blowing" && candlesLit.every((c) => !c)) {
      // Stop mic detection
      if (blowDetectionRef.current) {
        cancelAnimationFrame(blowDetectionRef.current)
      }
      if (micStreamRef.current) {
        micStreamRef.current.getTracks().forEach((track) => track.stop())
      }

      // Transition to celebration
      setTimeout(() => {
        setStage("celebration")
      }, 1500)
    }
  }, [candlesLit, stage])

  const handleMakeWish = () => {
    setStage("wish")
    setShowWishInput(true)
    setTimeout(() => inputRef.current?.focus(), 500)
  }

  const handleWishSubmit = async () => {
    if (wish.trim()) {
      setIsSavingWish(true)

      // Save wish to file
      const result = await saveWish(wish)

      if (result.success) {
        setWishSaved(true)
        setTimeout(() => {
          setShowWishInput(false)
          setStage("blowing")
          setShowBlowGuide(true)
          startBlowDetection()
        }, 2500)
      } else {
        // Even if save fails, continue the experience
        setWishSaved(true)
        setTimeout(() => {
          setShowWishInput(false)
          setStage("blowing")
          setShowBlowGuide(true)
          startBlowDetection()
        }, 2500)
      }

      setIsSavingWish(false)
    }
  }

  // Sparkle cleanup
  useEffect(() => {
    const timer = setInterval(() => {
      setSparkles((prev) => prev.filter((s) => Date.now() - s.id < 1000))
    }, 100)
    return () => clearInterval(timer)
  }, [])

  return (
    <div className="fixed inset-0 z-40 flex flex-col items-center justify-center overflow-hidden bg-gradient-to-br from-romantic-dark via-romantic-deep to-romantic-dark">
      <TouchGuide
        type="blow"
        message="Blow into the mic or tap each candle to blow them out, Sapana!"
        show={showBlowGuide}
        onDismiss={() => setShowBlowGuide(false)}
      />

      {stage === "celebration" && (
        <div className="absolute inset-0 z-0">
          {memoryPhotos.map((photo, index) => {
            // Random positions around the edges
            const positions = [
              { top: "0%", left: "0%", w: "25%", h: "33%" },
              { top: "0%", left: "25%", w: "25%", h: "25%" },
              { top: "0%", right: "25%", w: "25%", h: "30%" },
              { top: "0%", right: "0%", w: "25%", h: "35%" },
              { bottom: "0%", left: "0%", w: "30%", h: "35%" },
              { bottom: "0%", left: "30%", w: "20%", h: "30%" },
              { bottom: "0%", right: "20%", w: "30%", h: "32%" },
              { bottom: "0%", right: "0%", w: "20%", h: "38%" },
            ]
            const pos = positions[index % positions.length]
            return (
              <div
                key={index}
                className="absolute animate-in fade-in duration-1000"
                style={{
                  top: pos.top,
                  left: pos.left,
                  right: pos.right,
                  bottom: pos.bottom,
                  width: pos.w,
                  height: pos.h,
                  animationDelay: `${index * 200}ms`,
                }}
              >
                <img
                  src={photo || "/placeholder.svg"}
                  alt="Our memory"
                  className="h-full w-full object-cover opacity-30"
                />
                {/* Gradient overlay to blend with background */}
                <div className="absolute inset-0 bg-gradient-to-t from-romantic-dark via-romantic-dark/60 to-transparent" />
              </div>
            )
          })}
          {/* Center dark vignette for text readability */}
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(26,10,16,0.9)_20%,rgba(26,10,16,0.4)_70%,transparent_100%)]" />
        </div>
      )}

      {/* Ambient background glow */}
      <div className="pointer-events-none absolute inset-0 z-[1]">
        <div className="absolute left-1/2 top-1/3 h-[600px] w-[600px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-romantic-pink opacity-10 blur-[150px]" />
        <div className="absolute bottom-0 left-1/2 h-[400px] w-[800px] -translate-x-1/2 rounded-full bg-rose-gold opacity-10 blur-[120px]" />
      </div>

      {/* Confetti - only in celebration */}
      {stage === "celebration" &&
        confetti.map((item) => (
          <div
            key={item.id}
            className="pointer-events-none absolute z-20 animate-confetti-fall"
            style={{
              left: `${item.x}%`,
              top: "-20px",
              animationDelay: `${item.delay}s`,
            }}
          >
            <div
              className="rounded-sm"
              style={{
                backgroundColor: item.color,
                width: item.size,
                height: item.size,
                transform: `rotate(${Math.random() * 360}deg)`,
              }}
            />
          </div>
        ))}

      {/* Floating hearts background */}
      <div className="pointer-events-none absolute inset-0 z-[2] overflow-hidden">
        {Array.from({ length: 15 }).map((_, i) => (
          <div
            key={i}
            className="absolute animate-float-up"
            style={{
              left: `${Math.random() * 100}%`,
              bottom: "-50px",
              animationDelay: `${Math.random() * 8}s`,
              animationDuration: `${10 + Math.random() * 5}s`,
            }}
          >
            <svg
              width={12 + Math.random() * 12}
              height={12 + Math.random() * 12}
              viewBox="0 0 24 24"
              className="opacity-40"
            >
              <path
                d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"
                fill="#ff6b81"
              />
            </svg>
          </div>
        ))}
      </div>

      {/* Sparkle effects */}
      {sparkles.map((sparkle) => (
        <div
          key={sparkle.id}
          className="pointer-events-none absolute z-50 animate-sparkle-burst"
          style={{ left: `${sparkle.x}%`, top: `${sparkle.y}%` }}
        >
          {[...Array(8)].map((_, i) => (
            <div
              key={i}
              className="absolute h-2 w-2 rounded-full bg-amber-300"
              style={{
                transform: `rotate(${i * 45}deg) translateY(-20px)`,
                animation: `sparkle-out 0.6s ease-out forwards`,
                animationDelay: `${i * 0.05}s`,
              }}
            />
          ))}
        </div>
      ))}

      {/* Main content based on stage */}
      {(stage === "cake" || stage === "wish" || stage === "blowing") && (
        <div
          className={`relative z-10 flex flex-col items-center transition-all duration-1000 ${
            isVisible ? "scale-100 opacity-100" : "scale-90 opacity-0"
          }`}
        >
          {/* Title */}
          <h1 className="mb-2 text-center font-serif text-3xl text-romantic-cream drop-shadow-[0_0_30px_rgba(255,107,129,0.5)] md:text-5xl">
            Happy 21st Birthday
          </h1>
          <p className="mb-6 text-center font-serif text-2xl text-romantic-pink md:text-3xl">Sapana</p>

          {/* Instructions based on stage */}
          {stage === "blowing" && (
            <p className="mb-4 animate-pulse text-center text-romantic-cream/80">
              Blow or tap the candles to blow them out!
            </p>
          )}

          <div
            className={`relative mb-6 ${stage === "blowing" ? "cursor-pointer active:scale-95" : ""}`}
            onClick={stage === "blowing" ? handleBlowClick : undefined}
          >
            {/* Cake glow effect */}
            <div className="absolute -inset-10 rounded-full bg-romantic-pink/20 blur-[60px]" />

            {/* Main cake SVG - enhanced with more details */}
            <svg
              width="320"
              height="300"
              viewBox="0 0 320 300"
              className="relative drop-shadow-[0_15px_40px_rgba(0,0,0,0.4)]"
            >
              {/* Plate/Stand with more detail */}
              <ellipse cx="160" cy="290" rx="150" ry="14" fill="#d4af37" opacity="0.5" />
              <ellipse cx="160" cy="285" rx="140" ry="12" fill="#b8960c" opacity="0.4" />
              <ellipse cx="160" cy="282" rx="130" ry="8" fill="#ffd700" opacity="0.3" />

              {/* Cake stand pedestal */}
              <rect x="130" y="260" width="60" height="25" fill="url(#pedestalGradient)" />
              <ellipse cx="160" cy="260" rx="30" ry="6" fill="#d4af37" />

              {/* Bottom layer - largest with pattern */}
              <rect x="35" y="200" width="250" height="65" rx="10" fill="url(#cakeGradient1)" />
              <rect x="35" y="200" width="250" height="18" rx="6" fill="#ffb6c1" opacity="0.5" />
              {/* Decorative band with dots */}
              <rect x="35" y="235" width="250" height="8" fill="#ffd700" opacity="0.7" />
              {/* Pearl decorations */}
              {[45, 75, 105, 135, 165, 195, 225, 255, 275].map((x, i) => (
                <circle key={i} cx={x} cy="239" r="3" fill="#fff" opacity="0.9" />
              ))}
              {/* Frosting drips - more detailed */}
              <path
                d="M55 200 Q48 225 58 245"
                stroke="#fff"
                strokeWidth="8"
                fill="none"
                opacity="0.8"
                strokeLinecap="round"
              />
              <path
                d="M95 200 Q90 218 95 230"
                stroke="#fff"
                strokeWidth="6"
                fill="none"
                opacity="0.7"
                strokeLinecap="round"
              />
              <path
                d="M145 200 Q140 220 150 235"
                stroke="#fff"
                strokeWidth="7"
                fill="none"
                opacity="0.8"
                strokeLinecap="round"
              />
              <path
                d="M195 200 Q200 222 190 240"
                stroke="#fff"
                strokeWidth="8"
                fill="none"
                opacity="0.8"
                strokeLinecap="round"
              />
              <path
                d="M235 200 Q230 215 235 228"
                stroke="#fff"
                strokeWidth="6"
                fill="none"
                opacity="0.7"
                strokeLinecap="round"
              />
              <path
                d="M270 200 Q275 225 265 242"
                stroke="#fff"
                strokeWidth="7"
                fill="none"
                opacity="0.8"
                strokeLinecap="round"
              />

              {/* Middle layer */}
              <rect x="65" y="135" width="190" height="70" rx="10" fill="url(#cakeGradient2)" />
              <rect x="65" y="135" width="190" height="14" rx="6" fill="#ff6b81" opacity="0.4" />
              {/* Decorative ribbon */}
              <rect x="65" y="168" width="190" height="10" fill="url(#ribbonGradient)" />
              <path d="M155 168 v10 M165 168 v10" stroke="#c44569" strokeWidth="2" opacity="0.5" />
              {/* Frosting drips */}
              <path
                d="M80 135 Q73 158 85 175"
                stroke="#ffb6c1"
                strokeWidth="6"
                fill="none"
                opacity="0.9"
                strokeLinecap="round"
              />
              <path
                d="M130 135 Q125 152 135 165"
                stroke="#ffb6c1"
                strokeWidth="5"
                fill="none"
                opacity="0.8"
                strokeLinecap="round"
              />
              <path
                d="M190 135 Q185 155 195 170"
                stroke="#ffb6c1"
                strokeWidth="6"
                fill="none"
                opacity="0.9"
                strokeLinecap="round"
              />
              <path
                d="M240 135 Q245 155 235 170"
                stroke="#ffb6c1"
                strokeWidth="5"
                fill="none"
                opacity="0.8"
                strokeLinecap="round"
              />

              {/* Top layer */}
              <rect x="95" y="75" width="130" height="65" rx="10" fill="url(#cakeGradient3)" />
              <rect x="95" y="75" width="130" height="12" rx="6" fill="#fff" opacity="0.5" />
              {/* Swirl decorations on top */}
              <path
                d="M115 100 Q120 90 130 95 Q140 100 135 110"
                stroke="#c44569"
                strokeWidth="3"
                fill="none"
                opacity="0.6"
              />
              <path
                d="M185 100 Q190 90 200 95 Q210 100 205 110"
                stroke="#c44569"
                strokeWidth="3"
                fill="none"
                opacity="0.6"
              />

              {/* Photo frame on cake - heart shaped frame */}
              <defs>
                <clipPath id="heartClip">
                  <path d="M160 135 C160 135 145 115 130 115 C110 115 105 135 120 150 L160 175 L200 150 C215 135 210 115 190 115 C175 115 160 135 160 135" />
                </clipPath>
              </defs>
              {/* Heart frame background */}
              <path
                d="M160 135 C160 135 145 115 130 115 C110 115 105 135 120 150 L160 175 L200 150 C215 135 210 115 190 115 C175 115 160 135 160 135"
                fill="#fff"
                stroke="#d4af37"
                strokeWidth="3"
                transform="translate(0, -42) scale(0.65)"
                style={{ transformOrigin: "160px 145px" }}
              />
              <image
                href="/child_sapana1.jpg"
                x="125"
                y="85"
                width="70"
                height="50"
                preserveAspectRatio="xMidYMid slice"
                clipPath="url(#photoClip)"
              />
              <defs>
                <clipPath id="photoClip">
                  <ellipse cx="160" cy="110" rx="32" ry="22" />
                </clipPath>
              </defs>
              {/* Golden heart frame */}
              <ellipse cx="160" cy="110" rx="34" ry="24" fill="none" stroke="#d4af37" strokeWidth="3" />
              <ellipse cx="160" cy="110" rx="36" ry="26" fill="none" stroke="#ffd700" strokeWidth="1" opacity="0.5" />

              {/* "21" decoration with sparkle */}
              <text
                x="160"
                y="165"
                textAnchor="middle"
                fill="url(#goldGradient)"
                fontSize="22"
                fontWeight="bold"
                fontFamily="serif"
              >
                21
              </text>
              <text
                x="160"
                y="165"
                textAnchor="middle"
                fill="none"
                stroke="#fff"
                strokeWidth="0.5"
                fontSize="22"
                fontWeight="bold"
                fontFamily="serif"
                opacity="0.5"
              >
                21
              </text>

              {/* Rose decorations - more detailed */}
              {/* Left rose */}
              <g transform="translate(100, 75)">
                <circle r="10" fill="#c44569" />
                <circle r="7" fill="#ff6b81" />
                <circle r="4" fill="#ffb6c1" />
                <path d="M-5 10 Q-8 15 -3 18" stroke="#2d5a27" strokeWidth="2" fill="none" />
                <ellipse cx="-6" cy="16" rx="4" ry="2" fill="#3d7a37" transform="rotate(-30, -6, 16)" />
              </g>
              {/* Right rose */}
              <g transform="translate(220, 75)">
                <circle r="10" fill="#c44569" />
                <circle r="7" fill="#ff6b81" />
                <circle r="4" fill="#ffb6c1" />
                <path d="M5 10 Q8 15 3 18" stroke="#2d5a27" strokeWidth="2" fill="none" />
                <ellipse cx="6" cy="16" rx="4" ry="2" fill="#3d7a37" transform="rotate(30, 6, 16)" />
              </g>

              {/* Small flower decorations */}
              <g transform="translate(70, 225)">
                <circle r="4" fill="#ffb6c1" />
                <circle r="2" fill="#fff" />
              </g>
              <g transform="translate(250, 225)">
                <circle r="4" fill="#ffb6c1" />
                <circle r="2" fill="#fff" />
              </g>

              {/* Sapana text on cake */}
              <text
                x="160"
                y="190"
                textAnchor="middle"
                fill="#c44569"
                fontSize="14"
                fontFamily="serif"
                fontStyle="italic"
              >
                Sapana
              </text>

              {/* Snake/wavy candles */}
              {candlesLit.map((lit, i) => {
                const xPos = 110 + i * 25
                return (
                  <g key={i} transform={`translate(${xPos}, 40)`}>
                    {/* Wavy candle body - snake shape */}
                    <path
                      d={`M0 35 Q-3 28 0 22 Q3 16 0 10 Q-2 5 0 0`}
                      stroke={`url(#candleGradient${i % 3})`}
                      strokeWidth="4"
                      fill="none"
                      strokeLinecap="round"
                    />
                    {/* Candle stripes */}
                    <path
                      d={`M0 35 Q-3 28 0 22 Q3 16 0 10 Q-2 5 0 0`}
                      stroke="#fff"
                      strokeWidth="1"
                      fill="none"
                      strokeLinecap="round"
                      opacity="0.3"
                      strokeDasharray="3 5"
                    />
                    {/* Wick */}
                    <line x1="0" y1="0" x2="0" y2="-5" stroke="#333" strokeWidth="1" />
                    {/* Flame - animated */}
                    {lit && (
                      <g className="animate-flicker">
                        <ellipse cx="0" cy="-12" rx="4" ry="8" fill="url(#flameGradient)" />
                        <ellipse cx="0" cy="-10" rx="2" ry="5" fill="#fff" opacity="0.8" />
                        {/* Flame glow */}
                        <ellipse cx="0" cy="-12" rx="8" ry="12" fill="#ff9500" opacity="0.3" className="blur-[4px]" />
                      </g>
                    )}
                    {/* Smoke when blown out */}
                    {!lit && (
                      <g className="animate-smoke">
                        <path
                          d="M0 -5 Q2 -15 -1 -25 Q3 -30 0 -40"
                          stroke="#888"
                          strokeWidth="2"
                          fill="none"
                          opacity="0.4"
                          strokeLinecap="round"
                        />
                      </g>
                    )}
                  </g>
                )
              })}

              {/* Gradient definitions */}
              <defs>
                <linearGradient id="cakeGradient1" x1="0%" y1="0%" x2="0%" y2="100%">
                  <stop offset="0%" stopColor="#ff8fab" />
                  <stop offset="100%" stopColor="#ff6b81" />
                </linearGradient>
                <linearGradient id="cakeGradient2" x1="0%" y1="0%" x2="0%" y2="100%">
                  <stop offset="0%" stopColor="#ffb6c1" />
                  <stop offset="100%" stopColor="#ff8fab" />
                </linearGradient>
                <linearGradient id="cakeGradient3" x1="0%" y1="0%" x2="0%" y2="100%">
                  <stop offset="0%" stopColor="#ffc8dd" />
                  <stop offset="100%" stopColor="#ffb6c1" />
                </linearGradient>
                <linearGradient id="pedestalGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                  <stop offset="0%" stopColor="#b8960c" />
                  <stop offset="50%" stopColor="#ffd700" />
                  <stop offset="100%" stopColor="#b8960c" />
                </linearGradient>
                <linearGradient id="ribbonGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                  <stop offset="0%" stopColor="#d4af37" />
                  <stop offset="50%" stopColor="#ffd700" />
                  <stop offset="100%" stopColor="#d4af37" />
                </linearGradient>
                <linearGradient id="goldGradient" x1="0%" y1="0%" x2="0%" y2="100%">
                  <stop offset="0%" stopColor="#ffd700" />
                  <stop offset="100%" stopColor="#d4af37" />
                </linearGradient>
                <linearGradient id="flameGradient" x1="0%" y1="100%" x2="0%" y2="0%">
                  <stop offset="0%" stopColor="#ff9500" />
                  <stop offset="50%" stopColor="#ffcc00" />
                  <stop offset="100%" stopColor="#fff7cc" />
                </linearGradient>
                {/* Different candle colors */}
                <linearGradient id="candleGradient0" x1="0%" y1="0%" x2="0%" y2="100%">
                  <stop offset="0%" stopColor="#ff6b81" />
                  <stop offset="100%" stopColor="#c44569" />
                </linearGradient>
                <linearGradient id="candleGradient1" x1="0%" y1="0%" x2="0%" y2="100%">
                  <stop offset="0%" stopColor="#ffd700" />
                  <stop offset="100%" stopColor="#d4af37" />
                </linearGradient>
                <linearGradient id="candleGradient2" x1="0%" y1="0%" x2="0%" y2="100%">
                  <stop offset="0%" stopColor="#ffb6c1" />
                  <stop offset="100%" stopColor="#ff8fab" />
                </linearGradient>
              </defs>
            </svg>

            {/* Touch hint on cake during blowing */}
            {stage === "blowing" && (
              <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 flex items-center gap-2 text-romantic-cream/70 text-sm">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor" className="animate-bounce">
                  <path d="M9 11.5A2.5 2.5 0 0111.5 9h.5a2.5 2.5 0 012.5 2.5v.5a2.5 2.5 0 01-2.5 2.5h-.5A2.5 2.5 0 019 12v-.5z" />
                </svg>
                <span>Tap me!</span>
              </div>
            )}
          </div>

          {/* Make a Wish Button - only show during cake stage */}
          {stage === "cake" && (
            <button
              onClick={handleMakeWish}
              className="group relative mt-4 overflow-hidden rounded-full bg-gradient-to-r from-romantic-primary to-romantic-pink px-10 py-4 text-lg font-medium text-romantic-cream shadow-[0_0_30px_rgba(196,69,105,0.4)] transition-all duration-300 hover:scale-105 hover:shadow-[0_0_50px_rgba(196,69,105,0.6)] active:scale-95"
            >
              <span className="relative z-10 flex items-center gap-2">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M12 2l2.4 7.4H22l-6 4.6 2.3 7L12 16.5 5.7 21l2.3-7-6-4.6h7.6z" />
                </svg>
                Make a Wish
              </span>
            </button>
          )}
        </div>
      )}

      {/* Wish Input Modal */}
      {showWishInput && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-romantic-dark/90 backdrop-blur-md animate-in fade-in duration-500">
          <div className="mx-4 w-full max-w-md animate-in zoom-in-95 slide-in-from-bottom-4 duration-500">
            <div className="rounded-3xl bg-gradient-to-br from-romantic-cream/10 to-romantic-cream/5 p-8 shadow-[0_0_60px_rgba(196,69,105,0.3)] backdrop-blur-sm border border-romantic-cream/10">
              {!wishSaved ? (
                <>
                  <div className="mb-6 text-center">
                    <div className="mb-4 text-4xl">✨</div>
                    <h3 className="font-serif text-2xl text-romantic-cream">Close your eyes, Sapana...</h3>
                    <p className="mt-2 text-romantic-muted">Make a wish from your heart</p>
                  </div>

                  <div className="relative mb-6">
                    <div className="absolute -inset-1 rounded-2xl bg-gradient-to-r from-romantic-pink via-rose-gold to-romantic-pink opacity-50 blur-sm animate-pulse" />
                    <input
                      ref={inputRef}
                      type="text"
                      value={wish}
                      onChange={(e) => setWish(e.target.value)}
                      onKeyDown={(e) => e.key === "Enter" && handleWishSubmit()}
                      placeholder="Type your wish here..."
                      className="relative w-full rounded-xl bg-romantic-dark/80 px-6 py-4 text-center font-serif text-lg text-romantic-cream placeholder-romantic-muted/50 outline-none transition-all focus:bg-romantic-dark"
                    />
                  </div>

                  <button
                    onClick={handleWishSubmit}
                    disabled={!wish.trim() || isSavingWish}
                    className="w-full rounded-xl bg-gradient-to-r from-romantic-primary to-romantic-pink py-4 font-medium text-romantic-cream shadow-lg transition-all hover:scale-[1.02] hover:shadow-[0_0_30px_rgba(196,69,105,0.5)] active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
                  >
                    {isSavingWish ? (
                      <span className="flex items-center justify-center gap-2">
                        <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                          <circle
                            cx="12"
                            cy="12"
                            r="10"
                            stroke="currentColor"
                            strokeWidth="4"
                            fill="none"
                            opacity="0.3"
                          />
                          <path fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                        </svg>
                        Sending to the stars...
                      </span>
                    ) : (
                      "Send my wish to the stars ✨"
                    )}
                  </button>
                </>
              ) : (
                <div className="text-center animate-in fade-in zoom-in duration-500">
                  <div className="mb-4 text-5xl animate-bounce">🌟</div>
                  <h3 className="font-serif text-2xl text-romantic-cream">Your wish is flying to the stars...</h3>
                  <p className="mt-2 text-romantic-muted">Now blow out the candles!</p>
                  <div className="mt-4 flex justify-center gap-1">
                    {[0, 1, 2].map((i) => (
                      <div
                        key={i}
                        className="h-2 w-2 rounded-full bg-romantic-pink animate-bounce"
                        style={{ animationDelay: `${i * 0.2}s` }}
                      />
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Celebration message */}
      {stage === "celebration" && (
        <div className="relative z-10 mx-4 max-w-lg text-center animate-in fade-in zoom-in-95 duration-1000">
          <div className="rounded-3xl bg-romantic-dark/80 backdrop-blur-md p-8 shadow-[0_0_60px_rgba(196,69,105,0.3)] border border-romantic-cream/10">
            <div className="mb-6 text-5xl animate-bounce">🎉</div>
            <h2 className="mb-4 font-serif text-3xl text-romantic-cream drop-shadow-[0_0_20px_rgba(255,107,129,0.5)] md:text-4xl">
              Happy Birthday, Sapana!
            </h2>
            <p className="mb-4 font-serif text-lg text-romantic-cream/80 leading-relaxed">
              Hope your 21st birthday is filled with the love, New opportunities, and unforgettable moments you deserve.
            </p>
            <p className="font-serif text-xl text-romantic-pink"> I love you so much! and can't wait to create more beautiful memories together❤️.</p>
            <div className="mt-6 flex justify-center">
              <svg width="60" height="60" viewBox="0 0 24 24" className="animate-pulse text-romantic-pink">
                <path
                  d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"
                  fill="currentColor"
                />
              </svg>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
