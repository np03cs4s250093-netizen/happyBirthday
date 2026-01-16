import type React from "react"
import type { Metadata, Viewport } from "next"
import { Playfair_Display, Dancing_Script } from "next/font/google"
import { Analytics } from "@vercel/analytics/next"
import "./globals.css"

const playfair = Playfair_Display({
  subsets: ["latin"],
  variable: "--font-playfair",
})

const dancing = Dancing_Script({
  subsets: ["latin"],
  variable: "--font-dancing",
})

export const metadata: Metadata = {
  title: "Happy Birthday My Love 💕",
  description: "A special birthday surprise just for you",
  generator: "v0.app",
}

export const viewport: Viewport = {
  themeColor: "#1a0a10",
  width: "device-width",
  initialScale: 1,
  userScalable: false,
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body className={`${playfair.variable} ${dancing.variable} font-sans antialiased`}>
        {children}
        <Analytics />
      </body>
    </html>
  )
}
