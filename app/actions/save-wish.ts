"use server"

import { appendFile } from "fs/promises"
import { join } from "path"

export async function saveWish(wish: string) {
  try {
    const filePath = join(process.cwd(), "sapana-wishes.txt")
    const timestamp = new Date().toLocaleString("en-US", {
      dateStyle: "full",
      timeStyle: "medium",
    })

    const wishEntry = `
═══════════════════════════════════════════════════
✨ Sapana's Birthday Wish ✨
Date: ${timestamp}
═══════════════════════════════════════════════════

"${wish}"

💕 Made with love on her 21st birthday 💕
═══════════════════════════════════════════════════

`

    await appendFile(filePath, wishEntry, "utf-8")
    return { success: true }
  } catch (error) {
    console.error("Error saving wish:", error)
    return { success: false, error: "Failed to save wish" }
  }
}
