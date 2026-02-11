"use client"

import { useEffect, useState, useCallback } from "react"
import { cn } from "@/lib/utils"

interface EncryptedTextProps {
  text: string
  className?: string
  revealDelayMs?: number
  flipDelayMs?: number
  charset?: string
  encryptedClassName?: string
  revealedClassName?: string
}

const DEFAULT_CHARSET = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*"

export function EncryptedText({
  text,
  className,
  revealDelayMs = 50,
  flipDelayMs = 50,
  charset = DEFAULT_CHARSET,
  encryptedClassName = "text-neutral-500",
  revealedClassName = "text-white",
}: EncryptedTextProps) {
  const [revealedCount, setRevealedCount] = useState(0)
  const [displayText, setDisplayText] = useState("")

  const getRandomChar = useCallback(() => {
    return charset[Math.floor(Math.random() * charset.length)]
  }, [charset])

  // Scramble unrevealed characters
  useEffect(() => {
    const interval = setInterval(() => {
      setDisplayText(
        text
          .split("")
          .map((char, i) => {
            if (char === " ") return " "
            if (i < revealedCount) return char
            return getRandomChar()
          })
          .join("")
      )
    }, flipDelayMs)

    return () => clearInterval(interval)
  }, [text, revealedCount, flipDelayMs, getRandomChar])

  // Progressively reveal characters
  useEffect(() => {
    if (revealedCount >= text.length) return

    const timeout = setTimeout(() => {
      setRevealedCount((prev) => prev + 1)
    }, revealDelayMs)

    return () => clearTimeout(timeout)
  }, [revealedCount, text.length, revealDelayMs])

  return (
    <span className={cn("font-mono", className)}>
      {displayText.split("").map((char, i) => (
        <span
          key={i}
          className={i < revealedCount ? revealedClassName : encryptedClassName}
        >
          {char}
        </span>
      ))}
    </span>
  )
}
